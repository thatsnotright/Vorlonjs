declare module VORLON {
    class ResourcesExplorerDashboard extends DashboardPlugin {
        constructor();
        private _containerLocalStorage;
        private _containerSessionStorage;
        private _containerCookies;
        private _containerDiv;
        startDashboardSide(div?: HTMLDivElement): void;
        searchResource(): void;
        addResource(): void;
        removeResource(): void;
        updateResource(): void;
        buttonEvent(): void;
        toogleMenu(): void;
        processEntries(receivedObject: any): void;
    }
}
