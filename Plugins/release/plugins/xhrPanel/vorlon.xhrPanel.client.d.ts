declare module VORLON {
    class XHRPanelClient extends ClientPlugin {
        hooked: boolean;
        cache: Array<NetworkEntry>;
        private _previousOpen;
        private _previousSetRequestHeader;
        private _xhrSource;
        private _hookAlreadyDone;
        constructor();
        refresh(): void;
        sendStateToDashboard(): void;
        sendCacheToDashboard(): void;
        clearClientCache(): void;
        startClientSide(): void;
        onRealtimeMessageReceivedFromDashboardSide(receivedObject: any): void;
        private _hookPrototype(that, xhrSource);
        setupXMLHttpRequestHook(): void;
        removeXMLHttpRequestHook(): void;
        private _render(tagname, parentNode, classname?, value?);
    }
}
