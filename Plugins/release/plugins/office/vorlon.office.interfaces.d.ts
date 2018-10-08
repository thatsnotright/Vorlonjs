declare module VORLON {
    class OfficeFunction {
        treeCategory: string;
        functionName: string;
        elements: any[];
        callback: void;
        private dashboardPlugin;
        fullpathName: string;
        sendToClient: () => void;
        /**
         * function ecosystem
         */
        constructor(dashboardPlugin: DashboardPlugin, treeCategory: string, functionName: string);
        addTree(): void;
        getArgs(): any[];
        isAsync(): boolean;
    }
}
