/// <reference path="botbuilder.d.ts" />
declare var cytoscape: any;
declare module VORLON {
    class BotFrameworkInspectorDashboard extends DashboardPlugin {
        constructor();
        private _lastReceivedBotInfo;
        private _dialogsContainer;
        private _dialogStacksContainer;
        private _divPluginBot;
        private _datacheckbox;
        startDashboardSide(div?: HTMLDivElement): void;
        private _drawGraphNodes(nodesList, edgesList);
        private _loadScript(url, callback);
        onRealtimeMessageReceivedFromClientSide(receivedObject: any): void;
        display(): void;
    }
}
interface Window {
    flowchart: FlowChart;
}
interface FlowChart {
    parse(code: string): any;
}
