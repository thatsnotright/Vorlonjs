declare module VORLON {
    class ExpressClient extends ClientPlugin {
        private _previousExpress;
        private _expressSource;
        private _hookAlreadyDone;
        hooked: boolean;
        constructor();
        getID(): string;
        refresh(): void;
        startClientSide(): void;
        onRealtimeMessageReceivedFromDashboardSide(receivedObject: any): void;
    }
}
