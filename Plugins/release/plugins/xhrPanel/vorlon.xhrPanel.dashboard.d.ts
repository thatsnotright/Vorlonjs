declare module VORLON {
    class XHRPanelDashboard extends DashboardPlugin {
        hooked: boolean;
        cache: Array<NetworkEntry>;
        _itemsContainer: HTMLElement;
        _dashboardDiv: HTMLDivElement;
        _clearButton: HTMLButtonElement;
        _startStopButton: HTMLButtonElement;
        _startStopButtonState: HTMLElement;
        _dashboardItems: any;
        constructor();
        private _mapAction(selector, onClick);
        startDashboardSide(div?: HTMLDivElement): void;
        onRealtimeMessageReceivedFromClientSide(receivedObject: any): void;
        processNetworkItem(item: NetworkEntry): void;
    }
}
