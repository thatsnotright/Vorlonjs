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

///<reference path="../../typings/botbuilder/botbuilder.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VORLON;
(function (VORLON) {
    var BotFrameworkInspectorClient = (function (_super) {
        __extends(BotFrameworkInspectorClient, _super);
        function BotFrameworkInspectorClient() {
            _super.call(this, "botFrameworkInspector");
            //In case the plugin is activated but not running on node client
            if (VORLON.Tools.IsWindowAvailable)
                return;
            this.path = require("path");
            this.requireHook = require("require-hook");
            //this.debug = true;
            this._ready = true;
            this._hooked = false;
            this._botInfo = new VORLON.BotInfo();
        }
        BotFrameworkInspectorClient.prototype.startClientSide = function () {
            //In case the plugin is activated but not running on node client
            if (VORLON.Tools.IsWindowAvailable)
                return;
            this.requireHook.attach(this.path.resolve());
            this.hookBotFrameworkFunctions();
        };
        BotFrameworkInspectorClient.prototype.clone = function (obj) {
            return (JSON.parse(JSON.stringify(obj || {})));
        };
        BotFrameworkInspectorClient.prototype.addDialogStack = function (session, eventType, impactedDialogId) {
            if (impactedDialogId === void 0) { impactedDialogId = undefined; }
            var botCallStack = new VORLON.BotDialogSessionInfo();
            botCallStack.sessionState = this.clone(session.sessionState);
            botCallStack.conversationData = this.clone(session.conversationData);
            botCallStack.dialogData = this.clone(session.dialogData);
            botCallStack.privateConversationData = this.clone(session.privateConversationData);
            botCallStack.userData = this.clone(session.userData);
            botCallStack.eventType = eventType;
            botCallStack.impactedDialogId = impactedDialogId;
            var found = false;
            this._botInfo.userEntries.forEach(function (entry) {
                if (entry.message.address.id === session.message.address.id) {
                    entry.dialogStacks.push(botCallStack);
                    found = true;
                }
            });
            if (!found) {
                var newEntry = new VORLON.UserEntry();
                newEntry.message = session.message;
                newEntry.dialogStacks.push(botCallStack);
                this._botInfo.userEntries.push(newEntry);
            }
            this.refresh();
        };
        ;
        BotFrameworkInspectorClient.prototype.hookBotFrameworkFunctions = function () {
            var that = this;
            this.requireHook.setEvent(function (result, e) {
                if (!that._hooked && e.require === "botbuilder") {
                    //Hooking onSave on Session class
                    var previousSendBatchFunction = result.Session.prototype.sendBatch;
                    result.Session.prototype.sendBatch = function (callback) {
                        var returned = previousSendBatchFunction.apply(this, arguments);
                        var previousOnSaveFunction = this.options.onSave;
                        var thatSession = this;
                        this.options.onSave(function (err) {
                            var returned = previousOnSaveFunction.apply(this, arguments);
                            that.addDialogStack(thatSession, VORLON.EventType.FinalState);
                            return returned;
                        });
                        return returned;
                    };
                    //Hooking beginDialog on Session class
                    var previousBeginDialogFunction = result.Session.prototype.beginDialog;
                    result.Session.prototype.beginDialog = function (id, args) {
                        that.addDialogStack(this, VORLON.EventType.BeginDialog, id);
                        return previousBeginDialogFunction.apply(this, arguments);
                    };
                    //Hooking endDialog on Session class
                    var previousEndDialogFunction = result.Session.prototype.endDialog;
                    result.Session.prototype.endDialog = function (message) {
                        var args = [];
                        for (var _i = 1; _i < arguments.length; _i++) {
                            args[_i - 1] = arguments[_i];
                        }
                        that.addDialogStack(this, VORLON.EventType.EndDialog);
                        return previousEndDialogFunction.apply(this, arguments);
                    };
                    //Hooking endDialog on Session class
                    var previousEndDialogWithResultFunction = result.Session.prototype.endDialogWithResult;
                    result.Session.prototype.endDialogWithResult = function (message) {
                        that.addDialogStack(this, VORLON.EventType.EndDialogWithResult);
                        return previousEndDialogWithResultFunction.apply(this, arguments);
                    };
                    //Hooking endDialog on Session class
                    var previousEndConversationFunction = result.Session.prototype.endConversation;
                    result.Session.prototype.endConversation = function (message) {
                        var args = [];
                        for (var _i = 1; _i < arguments.length; _i++) {
                            args[_i - 1] = arguments[_i];
                        }
                        that.addDialogStack(this, VORLON.EventType.EndConversation);
                        return previousEndConversationFunction.apply(this, arguments);
                    };
                    //Hooking Dialog on Library class
                    var previousDialogFunction = result.Library.prototype.dialog;
                    result.Library.prototype.dialog = function (id, dialog) {
                        if (dialog) {
                            var dialogData = new VORLON.DialogData();
                            dialogData.id = id;
                            if (dialog instanceof Array) {
                                dialogData.dialog = dialog.map(function (d) { return d.toString(); });
                            }
                            else {
                                dialogData.dialog = [dialog.toString()];
                            }
                            dialogData.library = this.name;
                            that._botInfo.dialogDataList.push(dialogData);
                            that.refresh();
                        }
                        return previousDialogFunction.apply(this, arguments);
                    };
                    that._hooked = true;
                }
                return result;
            });
        };
        BotFrameworkInspectorClient.prototype.getID = function () {
            return "BOTFRAMEWORKINSPECTOR";
        };
        BotFrameworkInspectorClient.prototype.refresh = function () {
            this.sendToDashboard(this._botInfo);
        };
        return BotFrameworkInspectorClient;
    }(VORLON.ClientPlugin));
    VORLON.BotFrameworkInspectorClient = BotFrameworkInspectorClient;
    //Register the plugin with vorlon core 
    VORLON.Core.RegisterClientPlugin(new BotFrameworkInspectorClient());
})(VORLON || (VORLON = {}));
