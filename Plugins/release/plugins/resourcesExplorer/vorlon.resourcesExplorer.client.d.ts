declare module VORLON {
    class ResourcesExplorerClient extends ClientPlugin {
        localStorageList: KeyValue[];
        sessionStorageList: KeyValue[];
        cookiesList: KeyValue[];
        constructor();
        sendClientData(): void;
        refresh(): void;
        evalOrderFromDashboard(order: string): void;
    }
}
