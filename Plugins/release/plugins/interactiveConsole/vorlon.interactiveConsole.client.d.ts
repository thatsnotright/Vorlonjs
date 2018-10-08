declare module VORLON {
    class InteractiveConsoleClient extends ClientPlugin {
        _cache: any[];
        _pendingEntries: ConsoleEntry[];
        private _maxBatchSize;
        private _maxBatchTimeout;
        private _pendingEntriesTimeout;
        private _objPrototype;
        private _hooks;
        constructor();
        private inspect(obj, context, deepness);
        private getMessages(messages);
        private addEntry(entry);
        private checkPendings();
        private sendPendings();
        private batchSend(items);
        startClientSide(): void;
        clearClientConsole(): void;
        evalOrderFromDashboard(order: string): void;
        refresh(): void;
    }
}
