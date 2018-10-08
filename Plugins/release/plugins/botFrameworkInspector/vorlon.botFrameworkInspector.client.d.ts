/// <reference path="../../typings/botbuilder/botbuilder.d.ts" />
declare module VORLON {
    class BotFrameworkInspectorClient extends ClientPlugin {
        private path;
        private requireHook;
        private _hooked;
        private _botInfo;
        constructor();
        startClientSide(): void;
        private clone(obj);
        private addDialogStack(session, eventType, impactedDialogId?);
        hookBotFrameworkFunctions(): void;
        getID(): string;
        refresh(): void;
    }
}
