/// <reference path="../../vorlon.clientPlugin.d.ts" />
/// <reference path="../../vorlon.tools.d.ts" />
/// <reference path="../../vorlon.core.d.ts" />
/// <reference path="../../vorlon.basePlugin.d.ts" />
/// <reference path="vorlon.objectExplorer.interfaces.d.ts" />
declare module VORLON {
    class ObjectExplorerClient extends ClientPlugin {
        private _selectedObjProperty;
        private _previousSelectedNode;
        private _currentPropertyPath;
        private _timeoutId;
        private _objPrototype;
        constructor();
        private STRIP_COMMENTS;
        private ARGUMENT_NAMES;
        private rootProperty;
        private getFunctionArgumentNames(func);
        private inspect(path, obj, context);
        private _getProperty(propertyPath);
        private _packageAndSendObjectProperty(path?);
        startClientSide(): void;
        onRealtimeMessageReceivedFromDashboardSide(receivedObject: any): void;
        query(path: string): void;
        queryContent(path: string): void;
        refresh(): void;
    }
}
