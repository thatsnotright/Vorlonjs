declare module VORLON {
    class ModernizrReportClient extends ClientPlugin {
        supportedFeatures: FeatureSupported[];
        constructor();
        startClientSide(): void;
        loadModernizrFeatures(): void;
        checkSupportedFeatures(): void;
        sendFeaturesToDashboard(): void;
        refresh(): void;
    }
}
