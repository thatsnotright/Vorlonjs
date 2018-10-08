/// <reference path="api/mapping-system.d.ts" />
/// <reference path="api/shared-definitions.d.ts" />
declare var $: any;
declare module VORLON {
    class DOMTimelineDashboard extends DashboardPlugin {
        constructor();
        getID(): string;
        private _messageId;
        private _messageHandlers;
        private _carbonCopyHandlers;
        startDashboardSide(div?: HTMLDivElement): void;
        logMessage(receivedObject: any): void;
        sendMessageToClient(message: string, callback?: (receivedObject: any) => void): void;
        onRealtimeMessageReceivedFromClientSide(receivedObject: any): void;
    }
    class Helpers {
        static implementDomHistoryInWindow({clientUrl, events, domData}: DomHistoryData, popup: Window): void;
    }
}
declare function initDashboard(executeScriptOnClient: (string) => void): {
    setTimeline: (timeline: DashboardDataForEntry[], message: any) => void;
};
