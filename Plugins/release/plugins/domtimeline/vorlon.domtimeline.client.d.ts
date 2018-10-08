/// <reference path="api/mapping-system.d.ts" />
/// <reference path="api/shared-definitions.d.ts" />
declare var domTimelineOptions: any;
interface ExtendedMutationRecord extends MutationRecord {
    claim: string;
    stack: string;
    timestamp: number;
    newValue: string;
}
declare var domHistory: {
    past: Array<ExtendedMutationRecord>;
    future: Array<ExtendedMutationRecord>;
    lostFuture: Array<ExtendedMutationRecord>;
    undo: () => boolean;
    redo: () => boolean;
    startRecording: () => boolean;
    stopRecording: () => boolean;
    isRecording: boolean;
    isRecordingStopped: boolean;
    generateDashboardData: (knownData: {
        history: number;
        lostFuture: number;
        domData: number;
    }) => any;
};
declare module VORLON {
    class DOMTimelineClient extends ClientPlugin {
        constructor();
        getID(): string;
        refresh(): void;
        startClientSide(): void;
        onRealtimeMessageReceivedFromDashboardSide(receivedObject: any): void;
    }
}
