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
