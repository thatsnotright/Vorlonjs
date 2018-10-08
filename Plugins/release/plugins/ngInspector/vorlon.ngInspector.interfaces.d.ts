declare module VORLON {
    enum ScopeType {
        NgRepeat = 0,
        RootScope = 1,
        Controller = 2,
        Directive = 3,
    }
    enum PropertyType {
        Array = 0,
        Object = 1,
        Number = 2,
        String = 3,
        Boolean = 4,
        Null = 5,
    }
    enum MessageType {
        ReloadWithDebugInfo = 0,
    }
    interface Scope {
        $id: number;
        $parentId: number;
        $children: Scope[];
        $functions: string[];
        $type: ScopeType;
        $name: string;
    }
}
