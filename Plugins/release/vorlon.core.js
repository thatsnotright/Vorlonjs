var VORLON;
(function (VORLON) {
    var _Core = (function () {
        function _Core() {
            this._clientPlugins = new Array();
            this._dashboardPlugins = new Array();
            this._socketIOWaitCount = 0;
            this.debug = false;
            this._RetryTimeout = 1002;
            this._isHttpsEnabled = false;
        }
        Object.defineProperty(_Core.prototype, "Messenger", {
            get: function () {
                return VORLON.Core._messenger;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Core.prototype, "ClientPlugins", {
            get: function () {
                return VORLON.Core._clientPlugins;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Core.prototype, "IsHttpsEnabled", {
            get: function () {
                return VORLON.Core._isHttpsEnabled;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Core.prototype, "DashboardPlugins", {
            get: function () {
                return VORLON.Core._dashboardPlugins;
            },
            enumerable: true,
            configurable: true
        });
        _Core.prototype.RegisterClientPlugin = function (plugin) {
            VORLON.Core._clientPlugins.push(plugin);
        };
        _Core.prototype.RegisterDashboardPlugin = function (plugin) {
            VORLON.Core._dashboardPlugins.push(plugin);
        };
        _Core.prototype.StopListening = function () {
            if (VORLON.Core._messenger) {
                VORLON.Core._messenger.stopListening();
                delete VORLON.Core._messenger;
            }
        };
        _Core.prototype.StartClientSide = function (serverUrl, sessionId, listenClientId) {
            var _this = this;
            if (serverUrl === void 0) { serverUrl = "'http://localhost:1337/'"; }
            if (sessionId === void 0) { sessionId = ""; }
            if (listenClientId === void 0) { listenClientId = ""; }
            VORLON.Core._side = VORLON.RuntimeSide.Client;
            VORLON.Core._sessionID = sessionId;
            VORLON.Core._listenClientId = listenClientId;
            if (serverUrl[serverUrl.length - 1] === '/') {
                serverUrl = serverUrl.slice(0, -1);
            }
            if (serverUrl.match("^https:\/\/")) {
                VORLON.Core._isHttpsEnabled = true;
            }
            // Checking socket.io
            if (VORLON.Tools.IsWindowAvailable && window.io === undefined) {
                if (this._socketIOWaitCount < 10) {
                    this._socketIOWaitCount++;
                    // Let's wait a bit just in case socket.io was loaded asynchronously
                    setTimeout(function () {
                        console.log("Vorlon.js: waiting for socket.io to load...");
                        VORLON.Core.StartClientSide(serverUrl, sessionId, listenClientId);
                    }, 1000);
                }
                else {
                    console.log("Vorlon.js: please load socket.io before referencing vorlon.js or use includeSocketIO = true in your catalog.json file.");
                    VORLON.Core.ShowError("Vorlon.js: please load socket.io before referencing vorlon.js or use includeSocketIO = true in your catalog.json file.", 0);
                }
                return;
            }
            // Cookie
            var clientId;
            if (VORLON.Tools.IsWindowAvailable) {
                clientId = VORLON.Tools.ReadCookie("vorlonJS_clientId");
                if (!clientId) {
                    clientId = VORLON.Tools.CreateGUID();
                    VORLON.Tools.CreateCookie("vorlonJS_clientId", clientId, 1);
                }
            }
            else {
                clientId = VORLON.Tools.CreateGUID();
            }
            // Creating the messenger
            if (VORLON.Core._messenger) {
                VORLON.Core._messenger.stopListening();
                delete VORLON.Core._messenger;
            }
            VORLON.Core._messenger = new VORLON.ClientMessenger(VORLON.Core._side, serverUrl, sessionId, clientId, listenClientId);
            // Connect messenger to dispatcher
            VORLON.Core.Messenger.onRealtimeMessageReceived = VORLON.Core._Dispatch;
            VORLON.Core.Messenger.onHeloReceived = VORLON.Core._OnIdentificationReceived;
            VORLON.Core.Messenger.onIdentifyReceived = VORLON.Core._OnIdentifyReceived;
            VORLON.Core.Messenger.onStopListenReceived = VORLON.Core._OnStopListenReceived;
            VORLON.Core.Messenger.onError = VORLON.Core._OnError;
            VORLON.Core.Messenger.onReload = VORLON.Core._OnReloadClient;
            this.sendHelo();
            // Launch plugins
            for (var index = 0; index < VORLON.Core._clientPlugins.length; index++) {
                var plugin = VORLON.Core._clientPlugins[index];
                plugin.startClientSide();
            }
            // Handle client disconnect
            if (VORLON.Tools.IsWindowAvailable) {
                window.addEventListener("beforeunload", function () {
                    VORLON.Core.Messenger.sendRealtimeMessage("", { socketid: VORLON.Core.Messenger.socketId }, VORLON.Core._side, "clientclosed");
                }, false);
            }
            else {
                process.stdin.resume(); //so the program will not close instantly
                var exitMessageWritten = false;
                function exitHandler(options, err) {
                    if (!exitMessageWritten) {
                        VORLON.Core.Messenger.sendRealtimeMessage("", { socketid: VORLON.Core.Messenger.socketId }, VORLON.Core._side, "clientclosed");
                        console.log('Disconnected from Vorlon.js instance');
                        exitMessageWritten = true;
                    }
                    process.exit(0);
                }
                //do something when app is closing
                process.on('exit', exitHandler.bind(null, { cleanup: true }));
                //catches ctrl+c event
                process.on('SIGINT', exitHandler.bind(null, { exit: true }));
                //catches uncaught exceptions
                process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
            }
            // Start global dirty check, at this point document is not ready,
            // little timeout to defer starting dirtycheck
            setTimeout(function () {
                _this.startClientDirtyCheck();
            }, 500);
        };
        _Core.prototype.sendHelo = function () {
            // Say 'helo'
            var heloMessage = {};
            if (VORLON.Tools.IsWindowAvailable) {
                heloMessage = {
                    ua: navigator.userAgent,
                    identity: sessionStorage["vorlonClientIdentity"] || localStorage["vorlonClientIdentity"]
                };
            }
            else {
                heloMessage = {
                    ua: "Node.js",
                    identity: "",
                    noWindow: true
                };
            }
            VORLON.Core.Messenger.sendRealtimeMessage("", heloMessage, VORLON.Core._side, "helo");
        };
        _Core.prototype.startClientDirtyCheck = function () {
            var _this = this;
            //sometimes refresh is called before document was loaded
            if (VORLON.Tools.IsWindowAvailable && !document.body) {
                setTimeout(function () {
                    _this.startClientDirtyCheck();
                }, 200);
                return;
            }
            var mutationObserver = VORLON.Tools.IsWindowAvailable && (window.MutationObserver || window.WebKitMutationObserver);
            if (mutationObserver) {
                if (!document.body.__vorlon)
                    document.body.__vorlon = {};
                var config = { attributes: true, childList: true, subtree: true, characterData: true };
                document.body.__vorlon._observerMutationObserver = new mutationObserver(function (mutations) {
                    var sended = false;
                    var cancelSend = false;
                    var sendComandId = [];
                    mutations.forEach(function (mutation) {
                        if (cancelSend) {
                            for (var i = 0; i < sendComandId.length; i++) {
                                clearTimeout(sendComandId[i]);
                            }
                            cancelSend = false;
                        }
                        if (mutation.target && mutation.target.__vorlon && mutation.target.__vorlon.ignore) {
                            cancelSend = true;
                            return;
                        }
                        if (mutation.previousSibling && mutation.previousSibling.__vorlon && mutation.previousSibling.__vorlon.ignore) {
                            cancelSend = true;
                            return;
                        }
                        if (mutation.target && !sended && mutation.target.__vorlon && mutation.target.parentNode && mutation.target.parentNode.__vorlon && mutation.target.parentNode.__vorlon.internalId) {
                            sendComandId.push(setTimeout(function () {
                                var internalId = null;
                                if (mutation && mutation.target && mutation.target.parentNode && mutation.target.parentNode.__vorlon && mutation.target.parentNode.__vorlon.internalId)
                                    internalId = mutation.target.parentNode.__vorlon.internalId;
                                VORLON.Core.Messenger.sendRealtimeMessage('ALL_PLUGINS', {
                                    type: 'contentchanged',
                                    internalId: internalId
                                }, VORLON.Core._side, 'message');
                            }, 300));
                        }
                        sended = true;
                    });
                });
                document.body.__vorlon._observerMutationObserver.observe(document.body, config);
            }
            else if (VORLON.Tools.IsWindowAvailable) {
                console.log("dirty check using html string");
                var content;
                if (document.body)
                    content = document.body.innerHTML;
                setInterval(function () {
                    var html = document.body.innerHTML;
                    if (content != html) {
                        content = html;
                        VORLON.Core.Messenger.sendRealtimeMessage('ALL_PLUGINS', {
                            type: 'contentchanged'
                        }, VORLON.Core._side, 'message');
                    }
                }, 2000);
            }
        };
        _Core.prototype.StartDashboardSide = function (serverUrl, sessionId, listenClientId, divMapper) {
            if (serverUrl === void 0) { serverUrl = "'http://localhost:1337/'"; }
            if (sessionId === void 0) { sessionId = ""; }
            if (listenClientId === void 0) { listenClientId = ""; }
            if (divMapper === void 0) { divMapper = null; }
            VORLON.Core._side = VORLON.RuntimeSide.Dashboard;
            VORLON.Core._sessionID = sessionId;
            VORLON.Core._listenClientId = listenClientId;
            /* Notification elements */
            VORLON.Core._errorNotifier = document.createElement('x-notify');
            VORLON.Core._errorNotifier.setAttribute('type', 'error');
            VORLON.Core._errorNotifier.setAttribute('position', 'top');
            VORLON.Core._errorNotifier.setAttribute('duration', 5000);
            VORLON.Core._messageNotifier = document.createElement('x-notify');
            VORLON.Core._messageNotifier.setAttribute('position', 'top');
            VORLON.Core._messageNotifier.setAttribute('duration', 4000);
            document.body.appendChild(VORLON.Core._errorNotifier);
            document.body.appendChild(VORLON.Core._messageNotifier);
            // Checking socket.io
            if (VORLON.Tools.IsWindowAvailable && window.io === undefined) {
                if (this._socketIOWaitCount < 10) {
                    this._socketIOWaitCount++;
                    // Let's wait a bit just in case socket.io was loaded asynchronously
                    setTimeout(function () {
                        console.log("Vorlon.js: waiting for socket.io to load...");
                        VORLON.Core.StartDashboardSide(serverUrl, sessionId, listenClientId, divMapper);
                    }, 1000);
                }
                else {
                    console.log("Vorlon.js: please load socket.io before referencing vorlon.js or use includeSocketIO = true in your catalog.json file.");
                    VORLON.Core.ShowError("Vorlon.js: please load socket.io before referencing vorlon.js or use includeSocketIO = true in your catalog.json file.", 0);
                }
                return;
            }
            // Cookie
            var clientId = VORLON.Tools.ReadCookie("vorlonJS_clientId");
            if (!clientId) {
                clientId = VORLON.Tools.CreateGUID();
                VORLON.Tools.CreateCookie("vorlonJS_clientId", clientId, 1);
            }
            // Creating the messenger
            if (VORLON.Core._messenger) {
                VORLON.Core._messenger.stopListening();
                delete VORLON.Core._messenger;
            }
            VORLON.Core._messenger = new VORLON.ClientMessenger(VORLON.Core._side, serverUrl, sessionId, clientId, listenClientId);
            // Connect messenger to dispatcher
            VORLON.Core.Messenger.onRealtimeMessageReceived = VORLON.Core._Dispatch;
            VORLON.Core.Messenger.onHeloReceived = VORLON.Core._OnIdentificationReceived;
            VORLON.Core.Messenger.onIdentifyReceived = VORLON.Core._OnIdentifyReceived;
            VORLON.Core.Messenger.onStopListenReceived = VORLON.Core._OnStopListenReceived;
            VORLON.Core.Messenger.onError = VORLON.Core._OnError;
            // Say 'helo'
            var heloMessage = {
                ua: navigator.userAgent
            };
            VORLON.Core.Messenger.sendRealtimeMessage("", heloMessage, VORLON.Core._side, "helo");
            // Launch plugins
            for (var index = 0; index < VORLON.Core._dashboardPlugins.length; index++) {
                var plugin = VORLON.Core._dashboardPlugins[index];
                plugin.startDashboardSide(divMapper ? divMapper(plugin.getID()) : null);
            }
        };
        _Core.prototype.GetNumClientPluginsReady = function () {
            var ready = 0;
            VORLON.Core.ClientPlugins.forEach(function (plugin) {
                if (plugin.isReady()) {
                    ready++;
                }
            });
            return ready;
        };
        _Core.prototype.AllClientPluginsReady = function () {
            return VORLON.Core.ClientPlugins.length === VORLON.Core.GetNumClientPluginsReady();
        };
        _Core.prototype._OnStopListenReceived = function () {
            VORLON.Core._listenClientId = "";
        };
        _Core.prototype._OnIdentifyReceived = function (message) {
            //console.log('identify ' + message);
            if (VORLON.Core._side === VORLON.RuntimeSide.Dashboard) {
                VORLON.Core._messageNotifier.innerHTML = message;
                VORLON.Core._messageNotifier.show();
            }
            else if (VORLON.Tools.IsWindowAvailable) {
                var div = document.createElement("div");
                div.className = "vorlonIdentifyNumber";
                div.style.position = "absolute";
                div.style.left = "0";
                div.style.top = "50%";
                div.style.marginTop = "-150px";
                div.style.width = "100%";
                div.style.height = "300px";
                div.style.fontFamily = "Arial";
                div.style.fontSize = "300px";
                div.style.textAlign = "center";
                div.style.color = "white";
                div.style.textShadow = "2px 2px 5px black";
                div.style.zIndex = "100";
                div.innerHTML = message;
                document.body.appendChild(div);
                setTimeout(function () {
                    document.body.removeChild(div);
                }, 4000);
            }
            else {
                console.log('Vorlon client n° ' + message);
            }
        };
        _Core.prototype.ShowError = function (message, timeout) {
            if (timeout === void 0) { timeout = 5000; }
            if (VORLON.Core._side === VORLON.RuntimeSide.Dashboard) {
                VORLON.Core._errorNotifier.innerHTML = message;
                VORLON.Core._errorNotifier.setAttribute('duration', timeout);
                VORLON.Core._errorNotifier.show();
            }
            else if (VORLON.Tools.IsWindowAvailable) {
                var divError = document.createElement("div");
                divError.style.position = "absolute";
                divError.style.top = "0";
                divError.style.left = "0";
                divError.style.width = "100%";
                divError.style.height = "100px";
                divError.style.backgroundColor = "red";
                divError.style.textAlign = "center";
                divError.style.fontSize = "30px";
                divError.style.paddingTop = "20px";
                divError.style.color = "white";
                divError.style.fontFamily = "consolas";
                divError.style.zIndex = "1001";
                divError.innerHTML = message;
                document.body.appendChild(divError);
                if (timeout) {
                    setTimeout(function () {
                        document.body.removeChild(divError);
                    }, timeout);
                }
            }
        };
        _Core.prototype._OnError = function (err) {
            VORLON.Core.ShowError("Error while connecting to Vorlon server. Server may be offline.<BR>Error message: " + err.message);
        };
        _Core.prototype._OnIdentificationReceived = function (id) {
            VORLON.Core._listenClientId = id;
            if (VORLON.Core._side === VORLON.RuntimeSide.Client) {
                // Refresh plugins
                for (var index = 0; index < VORLON.Core._clientPlugins.length; index++) {
                    var plugin = VORLON.Core._clientPlugins[index];
                    plugin.refresh();
                }
            }
        };
        _Core.prototype._OnReloadClient = function (id) {
            if (VORLON.Tools.IsWindowAvailable) {
                document.location.reload();
            }
        };
        _Core.prototype._RetrySendingRealtimeMessage = function (plugin, message) {
            setTimeout(function () {
                if (plugin.isReady()) {
                    VORLON.Core._DispatchFromClientPluginMessage(plugin, message);
                    return;
                }
                VORLON.Core._RetrySendingRealtimeMessage(plugin, message);
            }, VORLON.Core._RetryTimeout);
        };
        _Core.prototype._Dispatch = function (message) {
            if (!message.metadata) {
                console.error('invalid message ' + JSON.stringify(message));
                return;
            }
            if (message.metadata.pluginID == 'ALL_PLUGINS') {
                VORLON.Core._clientPlugins.forEach(function (plugin) {
                    VORLON.Core._DispatchPluginMessage(plugin, message);
                });
                VORLON.Core._dashboardPlugins.forEach(function (plugin) {
                    VORLON.Core._DispatchPluginMessage(plugin, message);
                });
            }
            else {
                VORLON.Core._clientPlugins.forEach(function (plugin) {
                    if (plugin.getID() === message.metadata.pluginID) {
                        VORLON.Core._DispatchPluginMessage(plugin, message);
                        return;
                    }
                });
                VORLON.Core._dashboardPlugins.forEach(function (plugin) {
                    if (plugin.getID() === message.metadata.pluginID) {
                        VORLON.Core._DispatchPluginMessage(plugin, message);
                        return;
                    }
                });
            }
        };
        _Core.prototype._DispatchPluginMessage = function (plugin, message) {
            plugin.trace('received ' + JSON.stringify(message));
            if (message.metadata.side === VORLON.RuntimeSide.Client) {
                if (!plugin.isReady()) {
                    VORLON.Core._RetrySendingRealtimeMessage(plugin, message);
                }
                else {
                    VORLON.Core._DispatchFromClientPluginMessage(plugin, message);
                }
            }
            else {
                VORLON.Core._DispatchFromDashboardPluginMessage(plugin, message);
            }
        };
        _Core.prototype._DispatchFromClientPluginMessage = function (plugin, message) {
            if (message.command && plugin.DashboardCommands) {
                var command = plugin.DashboardCommands[message.command];
                if (command) {
                    command.call(plugin, message.data);
                    return;
                }
            }
            plugin.onRealtimeMessageReceivedFromClientSide(message.data);
        };
        _Core.prototype._DispatchFromDashboardPluginMessage = function (plugin, message) {
            if (message.command && plugin.ClientCommands) {
                var command = plugin.ClientCommands[message.command];
                if (command) {
                    command.call(plugin, message.data);
                    return;
                }
            }
            plugin.onRealtimeMessageReceivedFromDashboardSide(message.data);
        };
        return _Core;
    }());
    VORLON._Core = _Core;
    VORLON.Core = new _Core();
})(VORLON || (VORLON = {}));
