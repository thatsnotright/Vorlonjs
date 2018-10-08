declare module VORLON {
    interface ObjExplorerPropertyDescriptor {
        name: string;
        type: string;
        fullpath: string;
        value?: any;
    }
    interface ObjExplorerFunctionDescriptor {
        name: string;
        args: string[];
        fullpath: string;
    }
    interface ObjExplorerObjDescriptor extends ObjExplorerPropertyDescriptor {
        proto?: ObjExplorerObjDescriptor;
        functions: Array<ObjExplorerFunctionDescriptor>;
        properties: Array<ObjExplorerPropertyDescriptor>;
        contentFetched: boolean;
    }
}
