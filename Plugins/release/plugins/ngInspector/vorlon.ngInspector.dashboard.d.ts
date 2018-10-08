declare module VORLON {
    class NgInspectorDashboard extends DashboardPlugin {
        private _rootScopes;
        private _currentShownScopeId;
        private _ngInspectorScopeProperties;
        constructor();
        getID(): string;
        startDashboardSide(div?: HTMLDivElement): void;
        onRealtimeMessageReceivedFromClientSide(receivedObject: any): void;
        private _formatScopesTree(scopes);
        private _scopeNodeTemplate;
        private _formatScopeNode(scope);
        private _scopePropertyIconTemplate;
        private _formatScopePropertyIconTemplate(iconName, text?);
        private _scopePropertyTemplate;
        private _formatScopePropertyTemplate(icon, propertyName, propertyValue, subProperties, propertyTypeClass, subPropertiesLength?);
        private _renderScopeDetail(scope);
        private _renderScopeProperty(prop, key);
        private _renderScopeSubLevelDetails(prop);
        private _getScopeTreeIcon(scope);
        private _findScopeById(scopes, scopeId);
        private _getPropertyType(property);
        showScopeDetail(scopeId: number): void;
    }
}
