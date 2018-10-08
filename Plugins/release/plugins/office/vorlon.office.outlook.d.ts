declare var $: any;
declare module VORLON {
    class OfficeOutlook {
        private dashboardPlugin;
        constructor(dashboardPlugin: DashboardPlugin);
        execute(): void;
        apis: {
            (): OfficeFunction;
        }[];
    }
}
