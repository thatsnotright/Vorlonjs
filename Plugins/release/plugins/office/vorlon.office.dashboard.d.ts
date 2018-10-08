declare var $: any;
declare module VORLON {
    class OfficeDashboard extends DashboardPlugin {
        private _treeDiv;
        private _filledDiv;
        private mailFunctions;
        private pptxFunctions;
        private documentFunctions;
        refreshButton: Element;
        private treeviewwrapper;
        private officetypeapp;
        private officetype;
        private officePropertiesTitle;
        private officePropertiesSection;
        constructor();
        getID(): string;
        startDashboardSide(div?: HTMLDivElement): void;
        update(remoteOffice: any): void;
        private clearTreeview();
        constructTree(currentObj: any, parent: any): void;
        onRealtimeMessageReceivedFromClientSide(r: any): void;
    }
}
