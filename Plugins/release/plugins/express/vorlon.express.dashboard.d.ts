declare module VORLON {
    class ExpressDashboard extends DashboardPlugin {
        constructor();
        getID(): string;
        private _inputField;
        private _outputDiv;
        private _express;
        private _requests;
        startDashboardSide(div?: HTMLDivElement): void;
        setRoutes(): void;
        toogleMenu(): void;
        syntaxHighlight(json: any): any;
        onRealtimeMessageReceivedFromClientSide(receivedObject: any): void;
    }
}
