declare module VORLON {
    interface IUWPMonitorOptions {
        interval: number;
    }
    interface IUWPMetadata {
        isRunning: boolean;
        metadataDate: Date;
        winRTAvailable: boolean;
        name: string;
        language: string;
        region: string;
        deviceType: string;
        appversion: {
            major: number;
            minor: number;
            build: number;
            revision: number;
        };
        systemManufacturer: string;
        systemProductName: string;
    }
    interface IUWPMemoryStatus {
        nonPagedPool: number;
        pagedPool: number;
        pageFaultCount: number;
        pageFile: number;
        peakNonPagedPool: number;
        peakPagedPool: number;
        peakPageFile: number;
        peakVirtualMemory: number;
        peakWorkingSet: number;
        privatePageCount: number;
        virtualMemory: number;
        workingSet: number;
    }
    interface IUWPPhoneMemoryStatus {
        commitedBytes: number;
        commitedLimit: number;
    }
    interface IUWPCpuStatus {
        user: number;
        kernel: number;
    }
    interface IUWPDiskStatus {
        bytesRead: number;
        bytesWritten: number;
        otherBytes: number;
        otherCount: number;
        readCount: number;
        writeCount: number;
    }
    interface IUWPPowerStatus {
        batteryStatus: number;
        energySaverStatus: number;
        powerSupplyStatus: number;
        remainingChargePercent: number;
        remainingDischargeTime: number;
    }
    interface IUWPNetworkStatus {
        ianaInterfaceType: number;
        signal: number;
    }
    interface IUWPEnergyStatus {
        foregroundEnergy?: {
            excessiveUsageLevel: number;
            lowUsageLevel: number;
            maxAcceptableUsageLevel: number;
            nearMaxAcceptableUsageLevel: number;
            recentEnergyUsage: number;
            recentEnergyUsageLevel: number;
        };
        backgroundEnergy?: {
            excessiveUsageLevel: number;
            lowUsageLevel: number;
            maxAcceptableUsageLevel: number;
            nearMaxAcceptableUsageLevel: number;
            nearTerminationUsageLevel: number;
            recentEnergyUsage: number;
            recentEnergyUsageLevel: number;
            terminationUsageLevel: number;
        };
    }
    interface IUWPStatus {
        isRunning: boolean;
        winRTAvailable: boolean;
        statusDate: Date;
        memory?: IUWPMemoryStatus;
        cpu?: IUWPCpuStatus;
        disk?: IUWPDiskStatus;
        power?: IUWPPowerStatus;
        energy?: IUWPEnergyStatus;
        phone?: {
            memory?: IUWPPhoneMemoryStatus;
        };
        network?: IUWPNetworkStatus;
    }
}
