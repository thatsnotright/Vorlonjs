declare module VORLON {
    class SampleClient extends ClientPlugin {
        constructor();
        getID(): string;
        refresh(): void;
        startClientSide(): void;
        onRealtimeMessageReceivedFromDashboardSide(receivedObject: any): void;
    }
}
