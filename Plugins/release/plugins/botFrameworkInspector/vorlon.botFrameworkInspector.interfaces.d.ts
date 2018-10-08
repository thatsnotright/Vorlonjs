declare module VORLON {
    enum EventType {
        BeginDialog = 0,
        FinalState = 1,
        EndDialog = 2,
        EndDialogWithResult = 3,
        EndConversation = 4,
    }
    class BotInfo {
        dialogDataList: DialogData[];
        userEntries: UserEntry[];
        /**
         *
         */
        constructor();
    }
    class DialogData {
        id: string;
        dialog: any | any[];
        library: string;
    }
    class UserEntry {
        dialogStacks: BotDialogSessionInfo[];
        message: any;
        constructor();
    }
    class BotDialogSessionInfo {
        eventType: EventType;
        sessionState: any;
        dialogData: any;
        userData: any;
        conversationData: any;
        privateConversationData: any;
        impactedDialogId: any;
    }
}
