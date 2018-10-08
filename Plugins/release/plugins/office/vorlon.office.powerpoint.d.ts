declare var $: any;
declare module VORLON {
    class OfficePowerPoint {
        private dashboardPlugin;
        constructor(dashboardPlugin: DashboardPlugin);
        execute(): void;
        apis: {
            (): OfficeFunction;
        }[];
    }
}
