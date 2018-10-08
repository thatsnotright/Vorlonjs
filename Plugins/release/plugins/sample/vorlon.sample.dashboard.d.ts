declare module VORLON {
    class SampleDashboard extends DashboardPlugin {
        constructor();
        getID(): string;
        private _inputField;
        private _outputDiv;
        startDashboardSide(div?: HTMLDivElement): void;
        onRealtimeMessageReceivedFromClientSide(receivedObject: any): void;
    }
}
