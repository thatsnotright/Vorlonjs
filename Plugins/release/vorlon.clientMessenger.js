var VORLON;
(function (VORLON) {
    var ClientMessenger = (function () {
        function ClientMessenger(side, serverUrl, sessionId, clientId, listenClientId) {
            var _this = this;
            this._isConnected = false;
            this._isConnected = false;
            this._sessionId = sessionId;
            this._clientId = clientId;
            VORLON.Core._listenClientId = listenClientId;
            this._serverUrl = serverUrl;
            var options = {
                "path": serverUrl.replace(/h.*:\/\/[^\/]*/, "") + "/socket.io"
            };
            switch (side) {
                case VORLON.RuntimeSide.Client:
                    this._socket = io.connect(serverUrl + "/client", options);
                    this._isConnected = true;
                    break;
                case VORLON.RuntimeSide.Dashboard:
                    this._socket = io.connect(serverUrl + "/dashboard", options);
                    this._isConnected = true;
                    break;
            }
            if (this.isConnected) {
                var manager = io.Manager(serverUrl, options);
                manager.on('connect_error', function (err) {
                    if (_this.onError) {
                        _this.onError(err);
                    }
                });
                this._socket.on('message', function (message) {
                    var received = JSON.parse(message);
                    if (_this.onRealtimeMessageReceived) {
                        _this.onRealtimeMessageReceived(received);
                    }
                });
                this._socket.on('helo', function (message) {
                    //console.log('messenger helo', message);
                    VORLON.Core._listenClientId = message;
                    if (_this.onHeloReceived) {
                        _this.onHeloReceived(message);
                    }
                });
                this._socket.on('identify', function (message) {
                    //console.log('messenger identify', message);
                    if (_this.onIdentifyReceived) {
                        _this.onIdentifyReceived(message);
                    }
                });
                this._socket.on('stoplisten', function () {
                    if (_this.onStopListenReceived) {
                        _this.onStopListenReceived();
                    }
                });
                this._socket.on('refreshclients', function () {
                    //console.log('messenger refreshclients');
                    if (_this.onRefreshClients) {
                        _this.onRefreshClients();
                    }
                });
                this._socket.on('addclient', function (client) {
                    //console.log('messenger refreshclients');
                    if (_this.onAddClient) {
                        _this.onAddClient(client);
                    }
                });
                this._socket.on('removeclient', function (client) {
                    console.log('messenger refreshclients');
                    if (_this.onRemoveClient) {
                        _this.onRemoveClient(client);
                    }
                });
                this._socket.on('reload', function (message) {
                    //console.log('messenger reloadclient', message);
                    VORLON.Core._listenClientId = message;
                    if (_this.onReload) {
                        _this.onReload(message);
                    }
                });
            }
        }
        Object.defineProperty(ClientMessenger.prototype, "isConnected", {
            get: function () {
                return this._isConnected;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClientMessenger.prototype, "clientId", {
            set: function (value) {
                this._clientId = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClientMessenger.prototype, "socketId", {
            get: function () {
                return this._socket.id;
            },
            enumerable: true,
            configurable: true
        });
        ClientMessenger.prototype.stopListening = function () {
            if (this._socket) {
                this._socket.removeAllListeners();
            }
        };
        ClientMessenger.prototype.sendRealtimeMessage = function (pluginID, objectToSend, side, messageType, command) {
            if (messageType === void 0) { messageType = "message"; }
            var message = {
                metadata: {
                    pluginID: pluginID,
                    side: side,
                    sessionId: this._sessionId,
                    clientId: this._clientId,
                    listenClientId: VORLON.Core._listenClientId
                },
                data: objectToSend
            };
            if (command)
                message.command = command;
            if (!this.isConnected) {
                // Directly raise response locally
                if (this.onRealtimeMessageReceived) {
                    this.onRealtimeMessageReceived(message);
                }
                return;
            }
            else {
                if (VORLON.Core._listenClientId !== "" || messageType !== "message") {
                    var strmessage = JSON.stringify(message);
                    this._socket.emit(messageType, strmessage);
                }
            }
        };
        ClientMessenger.prototype.sendMonitoringMessage = function (pluginID, message) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                    }
                }
            };
            xhr.open("POST", this._serverUrl + "api/push");
            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            var data = JSON.stringify({ "_idsession": this._sessionId, "id": pluginID, "message": message });
            //xhr.setRequestHeader("Content-length", data.length.toString());
            xhr.send(data);
        };
        ClientMessenger.prototype.getMonitoringMessage = function (pluginID, onMonitoringMessage, from, to) {
            if (from === void 0) { from = "-20"; }
            if (to === void 0) { to = "-1"; }
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        if (onMonitoringMessage)
                            onMonitoringMessage(JSON.parse(xhr.responseText));
                    }
                    else {
                        if (onMonitoringMessage)
                            onMonitoringMessage(null);
                    }
                }
                else {
                    if (onMonitoringMessage)
                        onMonitoringMessage(null);
                }
            };
            xhr.open("GET", this._serverUrl + "api/range/" + this._sessionId + "/" + pluginID + "/" + from + "/" + to);
            xhr.send();
        };
        return ClientMessenger;
    }());
    VORLON.ClientMessenger = ClientMessenger;
})(VORLON || (VORLON = {}));
