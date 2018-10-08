/// <reference path="vorlon.office.tools.d.ts" />
/// <reference path="vorlon.office.interfaces.d.ts" />
/// <reference path="../../vorlon.dashboardPlugin.d.ts" />
declare var $: any;
declare module VORLON {
    class OfficeDocument {
        private dashboardPlugin;
        constructor(dashboardPlugin: DashboardPlugin);
        execute(): void;
        apis: {
            (): OfficeFunction;
        }[];
    }
}
