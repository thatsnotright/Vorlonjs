declare module VORLON {
    class DOMExplorerDashboard extends DashboardPlugin {
        private _lastReceivedObject;
        private _containerDiv;
        treeDiv: HTMLElement;
        styleView: HTMLElement;
        private _computedsection;
        private _dashboardDiv;
        refreshButton: Element;
        inspectButton: Element;
        clikedNodeID: any;
        _selectedNode: DomExplorerNode;
        _highlightedNode: string;
        _rootNode: DomExplorerNode;
        private _autorefresh;
        _innerHTMLView: HTMLTextAreaElement;
        private _margincontainer;
        private _bordercontainer;
        private _paddingcontainer;
        private _sizecontainer;
        _editablemode: boolean;
        private _editableElement;
        private _searchinput;
        private _searchresults;
        private _stylesEditor;
        private _lengthSearch;
        private _positionSearch;
        private _selectorSearch;
        private _clientHaveMutationObserver;
        constructor();
        startDashboardSide(div?: HTMLDivElement): void;
        private searchDOM();
        makeEditable(element: HTMLElement): void;
        undoEditable(element: HTMLElement): void;
        onRealtimeMessageReceivedFromClientSide(receivedObject: any): void;
        contentChanged(): void;
        setInnerHTMLView(data: any): void;
        setComputedStyle(data: Array<any>): void;
        setLayoutStyle(data: LayoutStyle): void;
        searchDOMByResults(data: any): void;
        mutationObeserverAvailability(data: any): void;
        initDashboard(root: PackagedNode): void;
        updateDashboard(node: PackagedNode): void;
        setAutorefresh(value: boolean): void;
        getContainerDiv(): HTMLElement;
        dirtyCheck(): void;
        hoverNode(internalId: string, unselect?: boolean): void;
        select(selected: DomExplorerNode): void;
        setNodeStyle(internalId: string, styles: any): void;
    }
    class DomExplorerNode {
        private static _spaceCheck;
        element: HTMLElement;
        header: HTMLElement;
        headerAttributes: HTMLElement;
        node: PackagedNode;
        contentContainer: HTMLElement;
        attributes: DomExplorerNodeAttribute[];
        childs: DomExplorerNode[];
        plugin: DOMExplorerDashboard;
        parent: DomExplorerNode;
        constructor(plugin: DOMExplorerDashboard, parent: DomExplorerNode, parentElt: HTMLElement, node: PackagedNode, oldNode?: DomExplorerNode);
        dispose(): void;
        update(node: PackagedNode): void;
        private insertReceivedObject(receivedObject, root);
        openNode(highlightElementID: string): void;
        selected(selected: boolean): void;
        render(parent: HTMLElement, isUpdate?: boolean): void;
        sendTextToClient(): void;
        renderCommentNode(parentElt: HTMLElement, isUpdate?: boolean): void;
        renderTextNode(parentElt: HTMLElement, isUpdate?: boolean): void;
        renderDOMNode(parentElt: HTMLElement, isUpdate?: boolean): void;
        renderDOMNodeContent(): void;
        addAttribute(name: string, value: string): void;
    }
    class DomSettings {
        private _plugin;
        private _globalload;
        private _autorefresh;
        constructor(plugin: DOMExplorerDashboard);
        private setSettings(filledDiv);
        refreshClient(): void;
        private loadSettings();
        private saveSettings();
    }
    class DomExplorerNodeAttribute {
        parent: DomExplorerNode;
        element: HTMLElement;
        name: string;
        value: string;
        constructor(parent: DomExplorerNode, name: string, value: string);
        eventNode(nodeName: any, nodeValue: any, parentElementId: string): void;
        uriCheck(triggerType: string, node: any, e: any): boolean;
        render(): void;
    }
    class DomExplorerPropertyEditor {
        styles: Array<DomExplorerPropertyEditorItem>;
        node: PackagedNode;
        plugin: DOMExplorerDashboard;
        private internalId;
        constructor(plugin: DOMExplorerDashboard);
        private _generateButton(parentNode, text, className, attribute?);
        generateStyles(node: PackagedNode, internalId: string, styles?: any): void;
    }
    class DomExplorerPropertyEditorItem {
        private parent;
        private name;
        private value;
        constructor(parent: DomExplorerPropertyEditor, name: string, value: string, internalId: string, editableLabel?: boolean, generate?: boolean);
        private _generateStyle(property, value, internalId, editableLabel?);
        private _generateClickableValue(label, value, internalId);
    }
    interface LayoutStyle {
        border: {
            rightWidth: string;
            leftWidth: string;
            topWidth: string;
            bottomWidth: string;
        };
        margin: {
            bottom: string;
            left: string;
            top: string;
            right: string;
        };
        padding: {
            bottom: string;
            left: string;
            top: string;
            right: string;
        };
        size: {
            width: string;
            height: string;
        };
    }
}
