declare module VORLON {
    class NetworkMonitorClient extends ClientPlugin {
        performanceItems: PerformanceItem[];
        constructor();
        getID(): string;
        sendClientData(): void;
        refresh(): void;
    }
}
