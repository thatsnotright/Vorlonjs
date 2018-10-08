declare module VORLON {
    class NodejsClient extends ClientPlugin {
        constructor();
        getID(): string;
        refresh(): void;
        startClientSide(): void;
        simpleStringify(object: any): any;
        onRealtimeMessageReceivedFromDashboardSide(receivedObject: any): void;
    }
}
