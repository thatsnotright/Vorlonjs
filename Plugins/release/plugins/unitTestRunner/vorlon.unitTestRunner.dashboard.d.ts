declare module VORLON {
    class UnitTestRunnerDashboard extends DashboardPlugin {
        constructor();
        getID(): string;
        private _btnRunTest;
        private _inputFile;
        private _dropPanel;
        private _txtRunTest;
        private _containerList;
        private _containerSummary;
        handleFileSelect(files: FileList): void;
        startDashboardSide(div?: HTMLDivElement): void;
        onRealtimeMessageReceivedFromClientSide(receivedObject: any): void;
    }
}
