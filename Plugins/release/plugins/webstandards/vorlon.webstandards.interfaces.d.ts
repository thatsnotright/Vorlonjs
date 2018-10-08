declare module VORLON {
    interface IRuleCheck {
        items?: IRuleCheck[];
        title?: string;
        description?: string;
        alert?: string;
        message?: string;
        content?: string;
        type?: string;
        failed?: boolean;
        data?: any;
        skipRootLevel?: boolean;
    }
    interface IRule {
        id: string;
        title: string;
        disabled?: boolean;
        description?: string;
        prepare?: (rulecheck: IRuleCheck, analyzeSummary) => void;
        endcheck?: (rulecheck: IRuleCheck, analyzeSummary) => void;
    }
    interface IDOMRule extends IRule {
        nodeTypes: string[];
        check: (node, rulecheck: IRuleCheck, analyze, htmlcontent) => void;
        generalRule?: boolean;
    }
    interface ICSSRule extends IRule {
        check: (url: string, ast, rulecheck, analyzeSummary) => void;
    }
    interface IFileRule extends IRule {
        check: (rulecheck: any, analyzeSummary: any) => void;
    }
    interface IScriptRule extends IRule {
        check: (url: string, javascriptContent: string, rulecheck: any, analyzeSummary: any) => void;
    }
}
