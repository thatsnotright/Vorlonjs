declare module VORLON {
    class ModernizrReportDashboard extends DashboardPlugin {
        constructor();
        private _filterList;
        private _cssFeaturesListTable;
        private _htmlFeaturesListTable;
        private _miscFeaturesListTable;
        private _nonCoreFeaturesListTable;
        startDashboardSide(div?: HTMLDivElement): void;
        displayClientFeatures(receivedObject: any): void;
    }
}
