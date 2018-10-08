declare module VORLON {
    class DeviceDashboard extends DashboardPlugin {
        constructor();
        getID(): string;
        private _resolutionTable;
        private _miscTable;
        private _viewportTable;
        private _screensizeTable;
        startDashboardSide(div?: HTMLDivElement): void;
        update(data: any): void;
        updateResize(data: any): void;
        setTableValue(table: HTMLTableElement, cssClass: string, value: string): void;
        private round2decimals(value);
        onRealtimeMessageReceivedFromClientSide(receivedObject: any): void;
    }
}
