var VORLON;
(function (VORLON) {
    // export class PerformanceItem {
    //     public name: string;
    // }
    (function (EventType) {
        EventType[EventType["BeginDialog"] = 0] = "BeginDialog";
        EventType[EventType["FinalState"] = 1] = "FinalState";
        EventType[EventType["EndDialog"] = 2] = "EndDialog";
        EventType[EventType["EndDialogWithResult"] = 3] = "EndDialogWithResult";
        EventType[EventType["EndConversation"] = 4] = "EndConversation";
    })(VORLON.EventType || (VORLON.EventType = {}));
    var EventType = VORLON.EventType;
    var BotInfo = (function () {
        /**
         *
         */
        function BotInfo() {
            this.dialogDataList = [];
            this.userEntries = [];
        }
        return BotInfo;
    }());
    VORLON.BotInfo = BotInfo;
    var DialogData = (function () {
        function DialogData() {
        }
        return DialogData;
    }());
    VORLON.DialogData = DialogData;
    var UserEntry = (function () {
        function UserEntry() {
            this.dialogStacks = [];
        }
        return UserEntry;
    }());
    VORLON.UserEntry = UserEntry;
    var BotDialogSessionInfo = (function () {
        function BotDialogSessionInfo() {
        }
        return BotDialogSessionInfo;
    }());
    VORLON.BotDialogSessionInfo = BotDialogSessionInfo;
})(VORLON || (VORLON = {}));

/// <reference path="botbuilder.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VORLON;
(function (VORLON) {
    var BotFrameworkInspectorDashboard = (function (_super) {
        __extends(BotFrameworkInspectorDashboard, _super);
        function BotFrameworkInspectorDashboard() {
            _super.call(this, "botFrameworkInspector", "control.html", "control.css");
            this._ready = false;
            this._id = "BOTFRAMEWORKINSPECTOR";
        }
        BotFrameworkInspectorDashboard.prototype.startDashboardSide = function (div) {
            var _this = this;
            if (div === void 0) { div = null; }
            this._insertHtmlContentAsync(div, function (filledDiv) {
                _this._dialogsContainer = document.getElementById("dialogs");
                _this._dialogStacksContainer = document.getElementById("dialogstacks");
                var firstInitialization = function () {
                    if (!_this._ready && _this._divPluginBot.style.display === "none") {
                        window.setTimeout(firstInitialization, 500);
                    }
                    else {
                        _this._ready = true;
                        _this.display();
                    }
                };
                _this._loadScript("/vorlon/plugins/botFrameworkInspector/cytoscape.min.js", function () {
                    _this._loadScript("/vorlon/plugins/botFrameworkInspector/dagre.min.js", function () {
                        _this._loadScript("/vorlon/plugins/botFrameworkInspector/cytoscape-dagre.js", function () {
                            _this._divPluginBot = document.getElementsByClassName("plugin-botframeworkinspector")[0];
                            window.setTimeout(firstInitialization, 500);
                        });
                    });
                });
                _this._datacheckbox = document.getElementById("showdatacheckbox");
                _this._datacheckbox.addEventListener("click", function (elem) {
                    var from = 'data';
                    var to = 'data-hidden';
                    if (_this._datacheckbox.checked) {
                        from = 'data-hidden';
                        to = 'data';
                    }
                    var els = document.getElementsByClassName(from);
                    while (els.length) {
                        els[0].className = to;
                    }
                });
            });
        };
        BotFrameworkInspectorDashboard.prototype._drawGraphNodes = function (nodesList, edgesList) {
            var cy = cytoscape({
                container: document.getElementById('right'),
                boxSelectionEnabled: false,
                autounselectify: true,
                wheelSensitivity: 0.2,
                layout: {
                    name: 'dagre'
                },
                style: [
                    {
                        selector: 'node',
                        style: {
                            'content': 'data(value)',
                            'text-opacity': 0.5,
                            'text-valign': 'center',
                            'text-halign': 'right',
                            'background-color': '#11479e'
                        }
                    },
                    {
                        selector: 'edge',
                        style: {
                            'width': 2,
                            'target-arrow-shape': 'triangle',
                            'line-color': '#9dbaea',
                            'target-arrow-color': '#9dbaea',
                            'curve-style': 'bezier'
                        }
                    },
                    {
                        selector: 'node.currentState',
                        style: {
                            'background-color': '#86B342'
                        }
                    }
                ],
                elements: {
                    nodes: nodesList,
                    edges: edgesList
                },
            });
            cy.on('tap', 'node', function (event) {
                var evtTarget = event.cyTarget;
                console.log(evtTarget.id());
            });
        };
        BotFrameworkInspectorDashboard.prototype._loadScript = function (url, callback) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.onload = function () {
                callback();
            };
            script.src = vorlonBaseURL + url;
            document.getElementsByTagName("head")[0].appendChild(script);
        };
        BotFrameworkInspectorDashboard.prototype.onRealtimeMessageReceivedFromClientSide = function (receivedObject) {
            this._lastReceivedBotInfo = receivedObject;
            this.display();
            //this._drawGraphNodes();
        };
        BotFrameworkInspectorDashboard.prototype.display = function () {
            var _this = this;
            var nodesList = [];
            var edgesList = [];
            var currentTreeBranch = [];
            if (this._lastReceivedBotInfo) {
                this._dialogsContainer.innerHTML = null;
                this._lastReceivedBotInfo.dialogDataList.forEach(function (dataList) {
                    var dialog = document.createElement("div");
                    dialog.classList.add("dialog");
                    var dialogid = document.createElement("p");
                    dialogid.innerText = dataList.library + " > " + dataList.id;
                    dialogid.classList.add("dialog-id");
                    dialog.appendChild(dialogid);
                    var dialogDetail = document.createElement("div");
                    dialogDetail.classList.add("dialog-detail");
                    dialog.appendChild(dialogDetail);
                    var waterfallStepsLabel = document.createElement("p");
                    waterfallStepsLabel.innerText = "Steps ";
                    dialogDetail.appendChild(waterfallStepsLabel);
                    var waterfallSteps = document.createElement("div");
                    waterfallSteps.classList.add("waterfall-steps");
                    dialogDetail.appendChild(waterfallSteps);
                    if (dataList.dialog && dataList.dialog.length) {
                        if (dataList.dialog.length > 0) {
                            for (var i = 0; i < dataList.dialog.length; i++) {
                                var waterfallStep = document.createElement("div");
                                waterfallStep.classList.add("waterfall-step");
                                waterfallStep.innerText = (i + 1).toString();
                                waterfallStep.title = dataList.dialog[i];
                                waterfallSteps.appendChild(waterfallStep);
                            }
                        }
                        else {
                            waterfallStepsLabel.innerText += " none.";
                        }
                    }
                    else {
                        waterfallStepsLabel.innerText += " none.";
                    }
                    _this._dialogsContainer.appendChild(dialog);
                });
                if (this._lastReceivedBotInfo.userEntries && this._lastReceivedBotInfo.userEntries.length) {
                    this._dialogStacksContainer.innerHTML = null;
                    this._lastReceivedBotInfo.userEntries.forEach(function (botUserEntry) {
                        var userEntry = document.createElement("div");
                        userEntry.classList.add("user-entry");
                        var entry = document.createElement("p");
                        entry.classList.add("entry");
                        entry.innerHTML = "<strong>User entry:</strong> " + botUserEntry.message.text;
                        userEntry.appendChild(entry);
                        var stacks = document.createElement("div");
                        stacks.classList.add("stacks");
                        userEntry.appendChild(stacks);
                        //loop on each stack: one for now
                        botUserEntry.dialogStacks.forEach(function (dialogSessionInfo) {
                            var stack = document.createElement("div");
                            stack.classList.add("stack");
                            stacks.appendChild(stack);
                            var dialogsInStack = document.createElement("div");
                            dialogsInStack.classList.add("dialogs-in-stack");
                            stack.appendChild(dialogsInStack);
                            if (dialogSessionInfo.sessionState.callstack && dialogSessionInfo.sessionState.callstack.length > 0) {
                                var lineSeparator;
                                //loop on each dialog in the stack
                                dialogSessionInfo.sessionState.callstack.forEach(function (dialog) {
                                    var dialogInStack = document.createElement("div");
                                    dialogInStack.classList.add("dialog-in-stack");
                                    dialogInStack.innerText = dialog.id;
                                    if (dialog.state["BotBuilder.Data.WaterfallStep"] != undefined)
                                        dialogInStack.innerText += "(" + (dialog.state["BotBuilder.Data.WaterfallStep"] + 1) + ")";
                                    dialogsInStack.appendChild(dialogInStack);
                                    lineSeparator = document.createElement("div");
                                    lineSeparator.classList.add("line");
                                    dialogsInStack.appendChild(lineSeparator);
                                });
                            }
                            else {
                                dialogsInStack.innerText = "(No dialog in stack)";
                                lineSeparator = document.createElement("div");
                                lineSeparator.classList.add("line");
                                dialogsInStack.appendChild(lineSeparator);
                            }
                            var eventType = document.createElement("p");
                            eventType.innerText = "[" + VORLON.EventType[dialogSessionInfo.eventType];
                            if (dialogSessionInfo.impactedDialogId) {
                                eventType.innerText += "(" + dialogSessionInfo.impactedDialogId + ")]";
                                if (dialogSessionInfo.eventType === VORLON.EventType.BeginDialog) {
                                    //If begin dialog is called from an empty start
                                    if (!dialogSessionInfo.sessionState.callstack || dialogSessionInfo.sessionState.callstack.length == 0) {
                                        //Make sure we start from scratch
                                        currentTreeBranch = [];
                                    }
                                    var newNode = { data: { id: nodesList.length, value: dialogSessionInfo.impactedDialogId } };
                                    nodesList.push(newNode);
                                    currentTreeBranch.push(newNode);
                                    if (currentTreeBranch.length > 1) {
                                        var currentIndex = currentTreeBranch.length - 1;
                                        var newEdge = { data: { source: currentTreeBranch[currentIndex - 1].data.id, target: currentTreeBranch[currentIndex].data.id } };
                                        edgesList.push(newEdge);
                                    }
                                }
                            }
                            else {
                                eventType.innerText += "]";
                            }
                            if (dialogSessionInfo.eventType === VORLON.EventType.EndDialog || dialogSessionInfo.eventType === VORLON.EventType.EndDialogWithResult) {
                                if (currentTreeBranch.length > 1) {
                                    var currentIndex = currentTreeBranch.length - 1;
                                    var newEdge = { data: { source: currentTreeBranch[currentIndex].data.id, target: currentTreeBranch[currentIndex - 1].data.id } };
                                    edgesList.push(newEdge);
                                    currentTreeBranch.pop();
                                }
                            }
                            if (dialogSessionInfo.eventType === VORLON.EventType.EndConversation) {
                                if (currentTreeBranch.length > 1) {
                                    currentTreeBranch = [];
                                }
                            }
                            dialogsInStack.appendChild(eventType);
                            var userData = document.createElement("div");
                            userData.classList.add(_this._datacheckbox.checked ? "data" : "data-hidden");
                            userData.innerHTML = "<p><strong>ConversationData:</strong> " + JSON.stringify(dialogSessionInfo.conversationData) + "</p>";
                            userData.innerHTML += "<p><strong>DialogData:</strong> " + JSON.stringify(dialogSessionInfo.dialogData) + "</p>";
                            userData.innerHTML += "<p><strong>PrivateConversationData:</strong> " + JSON.stringify(dialogSessionInfo.privateConversationData) + "</p>";
                            userData.innerHTML += "<p><strong>UserData:</strong> " + JSON.stringify(dialogSessionInfo.userData) + "</p>";
                            stack.appendChild(userData);
                        });
                        _this._dialogStacksContainer.appendChild(userEntry);
                    });
                    nodesList[nodesList.length - 1].classes = 'currentState';
                    this._drawGraphNodes(nodesList, edgesList);
                }
            }
        };
        return BotFrameworkInspectorDashboard;
    }(VORLON.DashboardPlugin));
    VORLON.BotFrameworkInspectorDashboard = BotFrameworkInspectorDashboard;
    //Register the plugin with vorlon core 
    VORLON.Core.RegisterDashboardPlugin(new BotFrameworkInspectorDashboard());
})(VORLON || (VORLON = {}));
;
