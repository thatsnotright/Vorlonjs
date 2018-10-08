var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VORLON;
(function (VORLON) {
    var UWPClient = (function (_super) {
        __extends(UWPClient, _super);
        function UWPClient() {
            _super.call(this, "sample"); // Name
            this.monitorInterval = null;
            this._ready = true; // No need to wait
            //this.debug = true;
        }
        //Return unique id for your plugin
        UWPClient.prototype.getID = function () {
            return "UWP";
        };
        UWPClient.prototype.refresh = function () {
            //override this method with cleanup work that needs to happen
            //as the user switches between clients on the dashboard
            //we don't really need to do anything in this sample
        };
        // This code will run on the client //////////////////////
        // Start the clientside code
        UWPClient.prototype.startClientSide = function () {
            //don't actually need to do anything at startup
        };
        // Handle messages from the dashboard, on the client
        UWPClient.prototype.onRealtimeMessageReceivedFromDashboardSide = function (receivedObject) {
        };
        UWPClient.prototype.checkMetadata = function () {
            var res = {
                metadataDate: new Date(),
                winRTAvailable: false,
                isRunning: this.monitorInterval != null
            };
            var global = window;
            if (global.Windows) {
                res.winRTAvailable = true;
                var context = new global.Windows.ApplicationModel.Resources.Core.ResourceContext();
                res.language = window.navigator.language;
                res.region = context.qualifierValues.homeRegion;
                res.deviceType = context.qualifierValues.deviceFamily;
                res.name = global.Windows.ApplicationModel.Package.current.displayName;
                res.appversion = global.Windows.ApplicationModel.Package.current.id.version;
                if (global.Windows.Security && global.Windows.Security.ExchangeActiveSyncProvisioning && global.Windows.Security.ExchangeActiveSyncProvisioning.EasClientDeviceInformation) {
                    var deviceInfo = new global.Windows.Security.ExchangeActiveSyncProvisioning.EasClientDeviceInformation();
                    res.systemManufacturer = deviceInfo.systemManufacturer;
                    res.systemProductName = deviceInfo.systemProductName;
                }
            }
            this.sendCommandToDashboard('showMetadata', res);
            return res;
        };
        UWPClient.prototype.checkStatus = function () {
            try {
                var res = {
                    statusDate: new Date(),
                    winRTAvailable: false,
                    isRunning: this.monitorInterval != null
                };
                var global = window;
                if (global.Windows) {
                    res.winRTAvailable = true;
                    this.getWinRTStatus(res);
                    if (global.Windows.Phone) {
                        this.getPhoneStatus(res);
                    }
                }
                this.sendCommandToDashboard('showStatus', res);
                return res;
            }
            catch (exception) {
                console.error(exception);
            }
        };
        UWPClient.prototype.getPhoneStatus = function (status) {
            var global = window;
            status.phone = {
                memory: {
                    commitedBytes: global.Windows.Phone.System.Memory.MemoryManager.processCommittedBytes,
                    commitedLimit: global.Windows.Phone.System.Memory.MemoryManager.processCommittedLimit,
                }
            };
        };
        UWPClient.prototype.getWinRTStatus = function (status) {
            var global = window;
            //see https://msdn.microsoft.com/fr-fr/library/windows/apps/windows.system.diagnostics.processdiagnosticinfo.aspx
            var winrtstatus = global.Windows.System.Diagnostics.ProcessDiagnosticInfo.getForCurrentProcess();
            var memory = winrtstatus.memoryUsage.getReport();
            if (memory) {
                status.memory = {
                    nonPagedPool: memory.nonPagedPoolSizeInBytes,
                    pagedPool: memory.pagedPoolSizeInBytes,
                    pageFaultCount: memory.pageFaultCount,
                    pageFile: memory.pageFileSizeInBytes,
                    peakNonPagedPool: memory.peakNonPagedPoolSizeInBytes,
                    peakPagedPool: memory.peakPagedPoolSizeInBytes,
                    peakPageFile: memory.peakPageFileSizeInBytes,
                    peakVirtualMemory: memory.peakVirtualMemorySizeInBytes,
                    peakWorkingSet: memory.peakWorkingSetSizeInBytes,
                    privatePageCount: memory.privatePageCount,
                    virtualMemory: memory.virtualMemorySizeInBytes,
                    workingSet: memory.workingSetSizeInBytes,
                };
            }
            var cpu = winrtstatus.cpuUsage.getReport();
            if (cpu) {
                status.cpu = {
                    user: cpu.userTime,
                    kernel: cpu.kernelTime
                };
            }
            var disk = winrtstatus.diskUsage.getReport();
            if (disk) {
                status.disk = {
                    bytesRead: disk.bytesReadCount,
                    bytesWritten: disk.bytesWrittenCount,
                    otherBytes: disk.otherBytesCount,
                    otherCount: disk.otherOperationCount,
                    readCount: disk.readOperationCount,
                    writeCount: disk.writeOperationCount,
                };
            }
            if (global.Windows.System.Power) {
                var powerManager = global.Windows.System.Power.PowerManager;
                if (powerManager) {
                    status.power = {
                        batteryStatus: powerManager.batteryStatus,
                        energySaverStatus: powerManager.energySaverStatus,
                        powerSupplyStatus: powerManager.powerSupplyStatus,
                        remainingChargePercent: powerManager.remainingChargePercent,
                        remainingDischargeTime: powerManager.remainingDischargeTime
                    };
                }
                var foregroundEnergyManager = global.Windows.System.Power.ForegroundEnergyManager;
                if (foregroundEnergyManager) {
                    status.energy = status.energy || {};
                    status.energy.foregroundEnergy = {
                        excessiveUsageLevel: foregroundEnergyManager.excessiveUsageLevel,
                        lowUsageLevel: foregroundEnergyManager.lowUsageLevel,
                        maxAcceptableUsageLevel: foregroundEnergyManager.maxAcceptableUsageLevel,
                        nearMaxAcceptableUsageLevel: foregroundEnergyManager.nearMaxAcceptableUsageLevel,
                        recentEnergyUsage: foregroundEnergyManager.recentEnergyUsage,
                        recentEnergyUsageLevel: foregroundEnergyManager.recentEnergyUsageLevel
                    };
                }
                var backgroundEnergyManager = global.Windows.System.Power.BackgroundEnergyManager;
                if (backgroundEnergyManager) {
                    status.energy = status.energy || {};
                    status.energy.backgroundEnergy = {
                        excessiveUsageLevel: backgroundEnergyManager.excessiveUsageLevel,
                        lowUsageLevel: backgroundEnergyManager.lowUsageLevel,
                        maxAcceptableUsageLevel: backgroundEnergyManager.maxAcceptableUsageLevel,
                        nearMaxAcceptableUsageLevel: backgroundEnergyManager.nearMaxAcceptableUsageLevel,
                        nearTerminationUsageLevel: backgroundEnergyManager.nearTerminationUsageLevel,
                        recentEnergyUsage: backgroundEnergyManager.recentEnergyUsage,
                        recentEnergyUsageLevel: backgroundEnergyManager.recentEnergyUsageLevel,
                        terminationUsageLevel: backgroundEnergyManager.terminationUsageLevel
                    };
                }
            }
            if (global.Windows.Networking && global.Windows.Networking.Connectivity && global.Windows.Networking.Connectivity.NetworkInformation) {
                //TODO improvements using https://msdn.microsoft.com/en-us/library/windows/apps/windows.networking.connectivity.connectionprofile.aspx
                var connectionProfile = global.Windows.Networking.Connectivity.NetworkInformation.getInternetConnectionProfile();
                var na = connectionProfile.networkAdapter;
                status.network = {
                    ianaInterfaceType: connectionProfile.networkAdapter.ianaInterfaceType.toString(),
                    signal: connectionProfile.getSignalBars(),
                };
            }
        };
        UWPClient.prototype.startMonitor = function (data) {
            var _this = this;
            if (this.monitorInterval) {
                clearInterval(this.monitorInterval);
            }
            this.monitorInterval = setInterval(function () {
                _this.checkStatus();
            }, data.interval);
            this.checkStatus();
        };
        UWPClient.prototype.stopMonitor = function () {
            if (this.monitorInterval) {
                clearInterval(this.monitorInterval);
                this.monitorInterval = null;
            }
            this.checkMetadata();
        };
        return UWPClient;
    }(VORLON.ClientPlugin));
    VORLON.UWPClient = UWPClient;
    UWPClient.prototype.ClientCommands = {
        startMonitor: function (data) {
            var plugin = this;
            plugin.startMonitor(data);
        },
        stopMonitor: function () {
            var plugin = this;
            plugin.stopMonitor();
        },
        getStatus: function () {
            var plugin = this;
            plugin.checkStatus();
        },
        getMetadata: function () {
            var plugin = this;
            plugin.checkMetadata();
        }
    };
    //Register the plugin with vorlon core
    VORLON.Core.RegisterClientPlugin(new UWPClient());
})(VORLON || (VORLON = {}));
