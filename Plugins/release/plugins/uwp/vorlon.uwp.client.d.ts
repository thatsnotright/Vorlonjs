declare module VORLON {
    class UWPClient extends ClientPlugin {
        monitorInterval: any;
        constructor();
        getID(): string;
        refresh(): void;
        startClientSide(): void;
        onRealtimeMessageReceivedFromDashboardSide(receivedObject: any): void;
        checkMetadata(): IUWPMetadata;
        checkStatus(): IUWPStatus;
        getPhoneStatus(status: IUWPStatus): void;
        getWinRTStatus(status: IUWPStatus): void;
        startMonitor(data: IUWPMonitorOptions): void;
        stopMonitor(): void;
    }
}
