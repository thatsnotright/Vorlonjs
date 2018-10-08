interface Window {
    Office: any;
}
declare var $: any;
declare module VORLON {
    class OfficeClient extends ClientPlugin {
        private objectPrototype;
        constructor();
        getID(): string;
        refresh(): void;
        private STRIP_COMMENTS;
        private ARGUMENT_NAMES;
        private getFunctionArgumentNames(func);
        private inspectOfficeObject(path, obj, rootObject);
        startClientSide(): void;
        query(name: string): void;
        stringify(o: any): any;
        getAsyncResult(deferred: any): Object;
        executeFunction(receivedObject: any): any;
        getOfficeType(): any;
        getFunctionOrProperty(clsClass: string): any;
        onRealtimeMessageReceivedFromDashboardSide(receivedObject: any): void;
    }
}
