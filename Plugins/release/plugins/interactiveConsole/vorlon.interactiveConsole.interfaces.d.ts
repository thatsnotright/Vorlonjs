declare module VORLON {
    interface ObjectPropertyDescriptor {
        name: string;
        val: any;
    }
    interface ObjectDescriptor {
        proto?: ObjectDescriptor;
        functions: Array<string>;
        properties: Array<ObjectPropertyDescriptor>;
    }
    interface ConsoleEntry {
        type: any;
        messages: Array<any>;
    }
}
