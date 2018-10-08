declare var SmoothieChart: any;
declare var TimeSeries: any;
declare module VORLON {
    class UWPDashboard extends DashboardPlugin {
        constructor();
        getID(): string;
        _startStopButton: HTMLButtonElement;
        _startStopButtonState: HTMLElement;
        _refreshButton: HTMLButtonElement;
        _nowinrtpanel: HTMLElement;
        _metadatapanel: HTMLElement;
        _memorypanel: HTMLElement;
        _cpupanel: HTMLElement;
        _diskpanel: HTMLElement;
        _networkpanel: HTMLElement;
        _powerpanel: HTMLElement;
        _energypanel: HTMLElement;
        running: boolean;
        _metadataDisplay: MetadataDisplayControl;
        _memoryMonitor: MemoryMonitorControl;
        _cpuMonitor: CpuMonitorControl;
        _networkMonitor: NetworkMonitorControl;
        _diskMonitor: DiskMonitorControl;
        _powerMonitor: PowerMonitorControl;
        _energyMonitor: EnergyMonitorControl;
        startDashboardSide(div?: HTMLDivElement): void;
        onRealtimeMessageReceivedFromClientSide(receivedObject: any): void;
        showNoWinRT(): void;
        hideNoWinRT(): void;
        checkBtnState(isRunning: boolean): void;
        renderMetadata(metadata: IUWPMetadata): void;
        initControls(): void;
        renderStatus(status: IUWPStatus): void;
    }
    class MetadataDisplayControl {
        element: HTMLElement;
        name: HTMLElement;
        language: HTMLElement;
        region: HTMLElement;
        deviceType: HTMLElement;
        appversion: HTMLElement;
        systemManufacturer: HTMLElement;
        systemProductName: HTMLElement;
        constructor(element: HTMLElement);
        render(): void;
        setData(metadata: IUWPMetadata): void;
    }
    class MemoryMonitorControl {
        element: HTMLElement;
        workingSet: HTMLElement;
        canvas: HTMLCanvasElement;
        smoothie: any;
        lineWorkset: any;
        linePeakWorkset: any;
        constructor(element: HTMLElement);
        render(): void;
        setData(date: Date, memory: IUWPMemoryStatus, phone: IUWPPhoneMemoryStatus): void;
    }
    class CpuMonitorControl {
        lastDate: Date;
        lastUserTime: number;
        element: HTMLElement;
        userTime: HTMLElement;
        percent: HTMLElement;
        canvas: HTMLCanvasElement;
        smoothie: any;
        lineUser: any;
        constructor(element: HTMLElement);
        render(): void;
        setData(date: Date, cpu: IUWPCpuStatus): void;
    }
    class DiskMonitorControl {
        element: HTMLElement;
        read: HTMLElement;
        write: HTMLElement;
        canvasRead: HTMLCanvasElement;
        smoothieRead: any;
        lineRead: any;
        canvasWrite: HTMLCanvasElement;
        smoothieWrite: any;
        lineWrite: any;
        lastDate: Date;
        lastRead: number;
        lastWrite: number;
        constructor(element: HTMLElement);
        render(): void;
        setData(date: Date, disk: IUWPDiskStatus): void;
    }
    class NetworkMonitorControl {
        element: HTMLElement;
        ianaInterfaceType: HTMLElement;
        signal: HTMLElement;
        constructor(element: HTMLElement);
        render(): void;
        setData(date: Date, network: IUWPNetworkStatus): void;
    }
    class PowerMonitorControl {
        element: HTMLElement;
        power: HTMLElement;
        constructor(element: HTMLElement);
        render(): void;
        setData(date: Date, power: IUWPPowerStatus): void;
    }
    class EnergyMonitorControl {
        element: HTMLElement;
        recentEnergyUsage: HTMLElement;
        canvas: HTMLCanvasElement;
        smoothie: any;
        lineFgUsage: any;
        constructor(element: HTMLElement);
        render(): void;
        setData(date: Date, energy: IUWPEnergyStatus): void;
    }
}
