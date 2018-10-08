declare module VORLON {
    class NgInspectorClient extends ClientPlugin {
        private _rootScopes;
        private _currentShownScopeId;
        constructor();
        getID(): string;
        refresh(): void;
        startClientSide(): void;
        onRealtimeMessageReceivedFromDashboardSide(receivedObject: any): void;
        private _timeoutId;
        private _markForRefresh();
        private _packageAndSendScopes();
        private _findRootScopes(element);
        private _findChildrenScopes(element, parentScope);
        private _listenScopeChanges(scope);
        private _scopePropertiesNamesToExclude;
        private _cleanScope(scope);
    }
}
