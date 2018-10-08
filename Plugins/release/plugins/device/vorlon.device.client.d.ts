declare module VORLON {
    class DeviceClient extends ClientPlugin {
        constructor();
        getID(): string;
        refresh(): void;
        refreshResize(): void;
        getUserAgent(): string;
        getMetaViewport(): string;
        getScreenWidths(): any;
        getResolution(): any;
        getRootFontSize(): number;
        getViewport(): any;
        getPixelRatio(): any;
        startClientSide(): void;
        onRealtimeMessageReceivedFromDashboardSide(receivedObject: any): void;
    }
}
