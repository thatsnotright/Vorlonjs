declare module VORLON {
    class NetworkMonitorDashboard extends DashboardPlugin {
        constructor();
        private _containerDiv;
        startDashboardSide(div?: HTMLDivElement): void;
        processEntries(receivedObject: any): void;
        createBar(x: any, width: any, color: any): HTMLElement;
    }
}
