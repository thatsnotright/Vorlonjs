declare module VORLON {
    class _Core {
        _clientPlugins: ClientPlugin[];
        _dashboardPlugins: DashboardPlugin[];
        _messenger: ClientMessenger;
        _sessionID: string;
        _listenClientId: string;
        _side: RuntimeSide;
        _errorNotifier: any;
        _messageNotifier: any;
        _socketIOWaitCount: number;
        debug: boolean;
        _RetryTimeout: number;
        _isHttpsEnabled: boolean;
        Messenger: ClientMessenger;
        ClientPlugins: Array<ClientPlugin>;
        IsHttpsEnabled: boolean;
        DashboardPlugins: Array<DashboardPlugin>;
        RegisterClientPlugin(plugin: ClientPlugin): void;
        RegisterDashboardPlugin(plugin: DashboardPlugin): void;
        StopListening(): void;
        StartClientSide(serverUrl?: string, sessionId?: string, listenClientId?: string): void;
        sendHelo(): void;
        startClientDirtyCheck(): void;
        StartDashboardSide(serverUrl?: string, sessionId?: string, listenClientId?: string, divMapper?: (string) => HTMLDivElement): void;
        GetNumClientPluginsReady(): Number;
        AllClientPluginsReady(): boolean;
        private _OnStopListenReceived();
        private _OnIdentifyReceived(message);
        private ShowError(message, timeout?);
        private _OnError(err);
        private _OnIdentificationReceived(id);
        private _OnReloadClient(id);
        private _RetrySendingRealtimeMessage(plugin, message);
        private _Dispatch(message);
        private _DispatchPluginMessage(plugin, message);
        private _DispatchFromClientPluginMessage(plugin, message);
        private _DispatchFromDashboardPluginMessage(plugin, message);
    }
    var Core: _Core;
}
