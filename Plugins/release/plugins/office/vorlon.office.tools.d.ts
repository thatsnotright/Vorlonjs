declare var $: any;
declare module VORLON {
    class OfficeTools {
        static IsOutlook(): boolean;
        static AddTreeFunction(treeCategory: string, functionName: string): FluentDOM;
        private static _ClearPropertiesAndResults();
        static GetOfficeType(sets: any): {
            officeType: string;
            version: any;
            background: string;
        };
        static ShowFunctionResult(r: any): void;
        static FormatJson(json: any): any;
        static ShowFunction(fullpathName: string, callbackClick: () => void, options?: HTMLElement[]): void;
        static ShowProperty(prop: any): void;
        static AddZone(parentTreeCategory: string, category: string): void;
        static CreateTextArea(name: string, label: string, value?: string): HTMLTextAreaElement;
        static CreateTextBlock(name: string, label: string, value?: string): HTMLInputElement;
    }
}
