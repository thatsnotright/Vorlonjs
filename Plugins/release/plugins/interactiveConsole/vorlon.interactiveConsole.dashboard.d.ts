declare module VORLON {
    class InteractiveConsoleDashboard extends DashboardPlugin {
        constructor();
        private _clearButton;
        private _containerDiv;
        _textFilter: HTMLInputElement;
        _interactiveInput: HTMLInputElement;
        private _commandIndex;
        private _commandHistory;
        private _logEntries;
        startDashboardSide(div?: HTMLDivElement): void;
        private isLoggable(input);
        addDashboardEntries(entries: ConsoleEntry[]): void;
        addDashboardEntry(entry: ConsoleEntry): void;
        clearDashboard(): void;
        applyFilter(filters: string[], text: string): void;
    }
}
