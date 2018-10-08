declare module VORLON {
    class UnitTestRunnerClient extends ClientPlugin {
        constructor();
        getID(): string;
        startClientSide(): void;
        refresh(): void;
        runTest(testContent: any): void;
        onRealtimeMessageReceivedFromDashboardSide(receivedObject: any): void;
    }
}
