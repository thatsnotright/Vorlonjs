declare module VORLON {
    class ObjectExplorerDashboard extends DashboardPlugin {
        private _containerDiv;
        private _searchBoxInput;
        private _filterInput;
        private _searchBtn;
        private _searchUpBtn;
        private _treeDiv;
        private _dashboardDiv;
        private _contentCallbacks;
        private _currentPropertyPath;
        private root;
        constructor();
        startDashboardSide(div?: HTMLDivElement): void;
        private _addLoader();
        setCurrent(path: any): void;
        private filter();
        private queryObjectContent(objectPath);
        private _sortedList(list);
        private _render(tagname, parentNode, classname?, value?);
        private _empty();
        onRealtimeMessageReceivedFromClientSide(receivedObject: any): void;
        setRoot(obj: ObjExplorerObjDescriptor): void;
        setContent(obj: ObjExplorerObjDescriptor): void;
    }
}
