declare module VORLON {
    class NodejsDashboard extends DashboardPlugin {
        constructor();
        getID(): string;
        private _inputField;
        private _outputDiv;
        private _time;
        private _chart;
        private __html;
        private __MEGA_BYTE;
        private _set_chart;
        private _chart_data;
        private _chart_container;
        startDashboardSide(div?: HTMLDivElement): void;
        chart(): void;
        jstree(): void;
        toogleMenu(): void;
        renderTree(arr: any): void;
        buildTree(parts: any, treeNode: any): void;
        onRealtimeMessageReceivedFromClientSide(receivedObject: any): void;
    }
}
