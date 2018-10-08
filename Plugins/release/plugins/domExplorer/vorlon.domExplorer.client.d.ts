declare module VORLON {
    class DOMExplorerClient extends ClientPlugin {
        private _internalId;
        private _lastElementSelectedClientSide;
        private _globalloadactive;
        private _overlay;
        private _observerMutationObserver;
        private _overlayInspect;
        constructor();
        static GetAppliedStyles(node: HTMLElement): string[];
        private _packageNode(node);
        private _packageDOM(root, packagedObject, withChildsNodes?, highlightElementID?);
        private _packageAndSendDOM(element, highlightElementID?);
        private _markForRefresh();
        startClientSide(): void;
        private _getElementByInternalId(internalId, node);
        getInnerHTML(internalId: string): void;
        getComputedStyleById(internalId: string): void;
        getStyle(internalId: string): void;
        saveInnerHTML(internalId: string, innerHTML: string): void;
        private _offsetFor(element);
        setClientHighlightedElement(elementId: string): void;
        unhighlightClientElement(internalId?: string): void;
        onRealtimeMessageReceivedFromDashboardSide(receivedObject: any): void;
        refresh(): void;
        inspect(): void;
        openElementInDashboard(element: Element): void;
        setStyle(internaID: string, property: string, newValue: string): void;
        globalload(value: boolean): void;
        getFirstParentWithInternalId(node: any): any;
        getMutationObeserverAvailability(): void;
        searchDOMBySelector(selector: string, position?: number): void;
        setAttribute(internaID: string, attributeName: string, attributeOldName: string, attributeValue: string): void;
        refreshbyId(internaID: string, internalIdToshow?: string): void;
        setElementValue(internaID: string, value: string): void;
        getNodeStyle(internalID: string): void;
    }
}
