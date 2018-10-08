declare var cssjs: any;
declare module VORLON {
    class WebStandardsClient extends ClientPlugin {
        sendedHTML: string;
        private _doctype;
        private _currentAnalyze;
        private _refreshLoop;
        constructor();
        refresh(): void;
        startClientSide(): void;
        startNewAnalyze(data: any): void;
        checkLoadingState(): void;
        initialiseRuleSummary(rule: any, analyze: any): any;
        prepareAnalyze(analyze: any): void;
        endAnalyze(analyze: any): void;
        cancelAnalyse(id: string): void;
        analyzeDOM(document: HTMLDocument, htmlContent: string, analyze: any): void;
        analyzeDOMNode(node: Node, rules: any, analyze: any, htmlContent: string): void;
        applyDOMNodeRule(node: Node, rule: IDOMRule, analyze: any, htmlContent: string): void;
        analyzeCssDocument(url: any, content: any, analyze: any): void;
        analyzeFiles(analyze: any): void;
        analyzeJsDocument(url: any, content: any, analyze: any): void;
        getDocumentContent(data: {
            analyzeid: string;
            url: string;
        }, file: {
            content: string;
            loaded: boolean;
            status?: number;
            encoding?: string;
            contentLength?: number;
            error?: any;
        }, resultcallback: (url: string, file: {
            content: string;
            loaded: boolean;
        }) => void): void;
        xhrDocumentContent(data: {
            analyzeid: string;
            url: string;
        }, resultcallback: (url: string, content: string, status: number, contentlength?: number, encoding?: string, errors?: any) => void): void;
        getAbsolutePath(url: any): string;
    }
}
