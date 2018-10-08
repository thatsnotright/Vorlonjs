declare var cssjs: any;
declare module VORLON {
    class WebStandardsDashboard extends DashboardPlugin {
        constructor();
        private _startCheckButton;
        private _cancelCheckButton;
        private _rootDiv;
        private _currentAnalyseId;
        private _analysePending;
        private _analyseResult;
        private _rulesPanel;
        private _ruleDetailPanel;
        startDashboardSide(div?: HTMLDivElement): void;
        setAnalyseResult(result: any): void;
        analyseCanceled(id: string): void;
        checkLoadingState(): void;
    }
}
