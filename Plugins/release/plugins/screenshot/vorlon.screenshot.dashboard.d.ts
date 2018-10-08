declare module VORLON {
    class ScreenShotDashboard extends DashboardPlugin {
        constructor();
        getID(): string;
        private _inputField;
        private _pageres;
        startDashboardSide(div?: HTMLDivElement): void;
        onRealtimeMessageReceivedFromClientSide(receivedObject: any): void;
    }
}
