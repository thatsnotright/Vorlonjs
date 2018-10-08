var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VORLON;
(function (VORLON) {
    var UWPDashboard = (function (_super) {
        __extends(UWPDashboard, _super);
        //Do any setup you need, call super to configure
        //the plugin with html and css for the dashboard
        function UWPDashboard() {
            //     name   ,  html for dash   css for dash
            _super.call(this, "uwp", "control.html", "control.css");
            this._ready = true;
            //this.debug = true;
        }
        //Return unique id for your plugin
        UWPDashboard.prototype.getID = function () {
            return "UWP";
        };
        UWPDashboard.prototype.startDashboardSide = function (div) {
            var _this = this;
            if (div === void 0) { div = null; }
            this._insertHtmlContentAsync(div, function (filledDiv) {
                _this._startStopButton = filledDiv.querySelector('x-action[event="toggleState"]');
                _this._startStopButtonState = filledDiv.querySelector('x-action[event="toggleState"]>i');
                _this._refreshButton = filledDiv.querySelector('x-action[event="btnrefresh"]');
                _this._nowinrtpanel = filledDiv.querySelector("#nowinrt");
                _this._metadatapanel = filledDiv.querySelector("#metadata");
                _this._networkpanel = filledDiv.querySelector("#network");
                _this._memorypanel = filledDiv.querySelector("#memory");
                _this._cpupanel = filledDiv.querySelector("#cpu");
                _this._diskpanel = filledDiv.querySelector("#disk");
                _this._powerpanel = filledDiv.querySelector("#power");
                _this._energypanel = filledDiv.querySelector("#energy");
                _this._refreshButton.onclick = function (arg) {
                    _this.sendCommandToClient('getMetadata');
                    _this.sendCommandToClient('getStatus');
                };
                _this.sendCommandToClient('getMetadata');
                _this._startStopButton.addEventListener('click', function (arg) {
                    if (!_this._startStopButtonState.classList.contains('fa-spin')) {
                        _this._startStopButtonState.classList.remove('fa-play');
                        _this._startStopButtonState.classList.remove('fa-stop');
                        _this._startStopButtonState.classList.remove('no-anim');
                        _this._startStopButtonState.classList.add('fa-spin');
                        _this._startStopButtonState.classList.add('fa-spinner');
                        if (_this.running) {
                            _this.sendCommandToClient('stopMonitor');
                        }
                        else {
                            _this.sendCommandToClient('startMonitor', { interval: streamdelay });
                        }
                    }
                });
            });
        };
        // When we get a message from the client, just show it
        UWPDashboard.prototype.onRealtimeMessageReceivedFromClientSide = function (receivedObject) {
            // var message = document.createElement('p');
            // message.textContent = receivedObject.message;
            // this._outputDiv.appendChild(message);
        };
        UWPDashboard.prototype.showNoWinRT = function () {
            if (this._nowinrtpanel) {
                this._nowinrtpanel.style.display = "";
            }
        };
        UWPDashboard.prototype.hideNoWinRT = function () {
            if (this._nowinrtpanel) {
                this._nowinrtpanel.style.display = "none";
            }
        };
        UWPDashboard.prototype.checkBtnState = function (isRunning) {
            this.running = isRunning;
            if (isRunning) {
                this._startStopButtonState.classList.remove('fa-play');
                this._startStopButtonState.classList.remove('fa-spin');
                this._startStopButtonState.classList.remove('fa-spinner');
                this._startStopButtonState.classList.add('fa-stop');
                this._startStopButtonState.classList.add('no-anim');
            }
            else {
                this._startStopButtonState.classList.remove('fa-stop');
                this._startStopButtonState.classList.remove('fa-spin');
                this._startStopButtonState.classList.remove('fa-spinner');
                this._startStopButtonState.classList.add('fa-play');
                this._startStopButtonState.classList.add('no-anim');
            }
        };
        UWPDashboard.prototype.renderMetadata = function (metadata) {
            if (!metadata.winRTAvailable) {
                this.showNoWinRT();
                return;
            }
            else {
                this.hideNoWinRT();
            }
            this.checkBtnState(metadata.isRunning);
            if (!this._metadataDisplay) {
                this._metadataDisplay = new MetadataDisplayControl(this._metadatapanel);
            }
            this._metadataDisplay.setData(metadata);
        };
        UWPDashboard.prototype.initControls = function () {
            if (!this._memoryMonitor)
                this._memoryMonitor = new MemoryMonitorControl(this._memorypanel);
            if (!this._cpuMonitor)
                this._cpuMonitor = new CpuMonitorControl(this._cpupanel);
            if (!this._diskMonitor)
                this._diskMonitor = new DiskMonitorControl(this._diskpanel);
            if (!this._networkMonitor)
                this._networkMonitor = new NetworkMonitorControl(this._networkpanel);
            if (!this._powerMonitor)
                this._powerMonitor = new PowerMonitorControl(this._powerpanel);
            if (!this._energyMonitor)
                this._energyMonitor = new EnergyMonitorControl(this._energypanel);
        };
        UWPDashboard.prototype.renderStatus = function (status) {
            if (!status.winRTAvailable) {
                this.showNoWinRT();
                return;
            }
            else {
                this.hideNoWinRT();
            }
            var date = new Date(status.statusDate);
            this.checkBtnState(status.isRunning);
            this.initControls();
            this._memoryMonitor.setData(date, status.memory, status.phone ? status.phone.memory : null);
            this._cpuMonitor.setData(date, status.cpu);
            this._diskMonitor.setData(date, status.disk);
            this._networkMonitor.setData(date, status.network);
            this._powerMonitor.setData(date, status.power);
            this._energyMonitor.setData(date, status.energy);
        };
        return UWPDashboard;
    }(VORLON.DashboardPlugin));
    VORLON.UWPDashboard = UWPDashboard;
    UWPDashboard.prototype.DashboardCommands = {
        showStatus: function (data) {
            var plugin = this;
            plugin.renderStatus(data);
        },
        showMetadata: function (data) {
            var plugin = this;
            plugin.renderMetadata(data);
        }
    };
    VORLON.Core.RegisterDashboardPlugin(new UWPDashboard());
    function formatTime(time) {
        if (time < 1000)
            return (time << 0) + " ms";
        time = time / 1000;
        if (time < 60) {
            return (time << 0) + ' s';
        }
        var min = (time / 60);
        var sec = time % 60;
        if (min < 60)
            return (min << 0) + 'min';
        var hours = min / 60;
        return (hours << 0) + 'h' + (min - hours * 60) + 'min';
    }
    function formatBytes(bytes) {
        var current = bytes;
        if (current < 1024)
            return current + ' bytes';
        current = current / 1024;
        if (current < 1024)
            return (current << 0) + ' ko';
        current = current / 1024;
        if (current < 1024)
            return (current << 0) + ' Mo';
        current = current / 1024;
        return (current << 0) + ' Go';
    }
    var MetadataDisplayControl = (function () {
        function MetadataDisplayControl(element) {
            this.element = element;
            this.render();
        }
        MetadataDisplayControl.prototype.render = function () {
            var entry = function (title, identifier) {
                return "<div class=\"labelval\"><div class=\"label\">" + title + "</div><div class=\"val " + identifier + "\"></div></div>";
            };
            this.element.innerHTML =
                "<h1>Client device</h1>\n                " + entry("app. name", "name") + "\n                " + entry("app. version", "appversion") + "\n                " + entry("language", "language") + "\n                " + entry("region", "region") + "\n                " + entry("device family", "deviceType") + "\n                " + entry("manufacturer", "systemManufacturer") + "\n                " + entry("product name", "systemProductName") + "\n                ";
            this.name = this.element.querySelector(".name");
            this.language = this.element.querySelector(".language");
            this.region = this.element.querySelector(".region");
            this.deviceType = this.element.querySelector(".deviceType");
            this.appversion = this.element.querySelector(".appversion");
            this.systemManufacturer = this.element.querySelector(".systemManufacturer");
            this.systemProductName = this.element.querySelector(".systemProductName");
        };
        MetadataDisplayControl.prototype.setData = function (metadata) {
            if (!metadata) {
                this.element.style.display = "none";
                return;
            }
            else {
                this.element.style.display = "";
            }
            if (this.name) {
                this.name.textContent = metadata.name;
                this.language.textContent = metadata.language;
                this.region.textContent = metadata.region;
                this.deviceType.textContent = metadata.deviceType;
                this.appversion.textContent = metadata.appversion.major + "." + metadata.appversion.minor + "." + metadata.appversion.build + "." + metadata.appversion.revision;
                this.systemManufacturer.textContent = metadata.systemManufacturer;
                this.systemProductName.textContent = metadata.systemProductName;
            }
        };
        return MetadataDisplayControl;
    }());
    VORLON.MetadataDisplayControl = MetadataDisplayControl;
    var timescale = 200;
    var lineColor = '#00a5b3';
    var linewidth = 2;
    var streamdelay = 5000;
    var maxValueScale = 1.1;
    var MemoryMonitorControl = (function () {
        function MemoryMonitorControl(element) {
            this.element = element;
            this.render();
        }
        MemoryMonitorControl.prototype.render = function () {
            var entry = function (title, identifier) {
                return "<div class=\"labelval\"><div class=\"label\">" + title + "</div><div class=\"val " + identifier + "\"></div></div>";
            };
            this.element.innerHTML =
                "<h1>Memory</h1>\n                " + entry("working set", "workingSet") + "                \n                <canvas id=\"memoryrealtime\" width=\"360\" height=\"100\"></canvas>";
            this.workingSet = this.element.querySelector(".workingSet");
            this.canvas = this.element.querySelector("#memoryrealtime");
            this.smoothie = new SmoothieChart({ millisPerPixel: timescale, maxValueScale: maxValueScale });
            this.smoothie.streamTo(this.canvas, streamdelay);
            this.lineWorkset = new TimeSeries();
            //this.linePeakWorkset = new TimeSeries();
            this.smoothie.addTimeSeries(this.lineWorkset, { lineWidth: linewidth, strokeStyle: lineColor });
            //this.smoothie.addTimeSeries(this.linePeakWorkset, { lineWidth:linewidth, strokeStyle : lineColor });
        };
        MemoryMonitorControl.prototype.setData = function (date, memory, phone) {
            if (!memory) {
                this.element.style.display = "none";
                return;
            }
            else {
                this.element.style.display = "";
            }
            var workset = ((memory.workingSet / (1024 * 1024)) << 0);
            //var peakworkset = ((memory.peakWorkingSet / (1024 * 1024)) << 0);
            this.workingSet.textContent = formatBytes(memory.workingSet);
            this.lineWorkset.append(date, workset);
            //this.linePeakWorkset.append(date, peakworkset);
        };
        return MemoryMonitorControl;
    }());
    VORLON.MemoryMonitorControl = MemoryMonitorControl;
    var CpuMonitorControl = (function () {
        function CpuMonitorControl(element) {
            this.element = element;
            this.render();
        }
        CpuMonitorControl.prototype.render = function () {
            var entry = function (title, identifier) {
                return "<div class=\"labelval\"><div class=\"label\">" + title + "</div><div class=\"val " + identifier + "\"></div></div>";
            };
            this.element.innerHTML =
                "<h1>CPU</h1>\n                " + entry("total time", "userTime") + "   \n                " + entry("percent", "percent") + "                \n                <canvas id=\"userrealtime\" width=\"360\" height=\"100\"></canvas>";
            this.canvas = this.element.querySelector("#userrealtime");
            this.smoothie = new SmoothieChart({ millisPerPixel: timescale, maxValueScale: maxValueScale });
            this.smoothie.streamTo(this.canvas, streamdelay);
            this.lineUser = new TimeSeries();
            this.smoothie.addTimeSeries(this.lineUser, { lineWidth: linewidth, strokeStyle: lineColor });
            this.userTime = this.element.querySelector(".userTime");
            this.percent = this.element.querySelector(".percent");
        };
        CpuMonitorControl.prototype.setData = function (date, cpu) {
            if (!cpu) {
                this.element.style.display = "none";
                return;
            }
            else {
                this.element.style.display = "";
            }
            this.userTime.textContent = cpu.user + " ms";
            if (this.lastDate) {
                var difDate = date - this.lastDate;
                var difUserTime = cpu.user - this.lastUserTime;
                var percent = (100 * difUserTime / difDate);
                this.percent.textContent = percent.toFixed(1) + " %";
                this.lineUser.append(date, percent);
            }
            this.lastDate = date;
            this.lastUserTime = cpu.user;
        };
        return CpuMonitorControl;
    }());
    VORLON.CpuMonitorControl = CpuMonitorControl;
    var DiskMonitorControl = (function () {
        function DiskMonitorControl(element) {
            this.element = element;
            this.render();
        }
        DiskMonitorControl.prototype.render = function () {
            var entry = function (title, identifier) {
                return "<div class=\"labelval\"><div class=\"label\">" + title + "</div><div class=\"val " + identifier + "\"></div></div>";
            };
            this.element.innerHTML =
                "<h1>Disk</h1>\n                " + entry("read bytes", "bytesRead") + "                                 \n                <canvas id=\"readrealtime\" width=\"360\" height=\"60\"></canvas>\n                " + entry("write bytes", "bytesWritten") + "    \n                <canvas id=\"writerealtime\" width=\"360\" height=\"60\"></canvas>";
            this.canvasRead = this.element.querySelector("#readrealtime");
            this.smoothieRead = new SmoothieChart({ millisPerPixel: timescale, maxValueScale: maxValueScale });
            this.smoothieRead.streamTo(this.canvasRead, streamdelay);
            this.lineRead = new TimeSeries();
            this.smoothieRead.addTimeSeries(this.lineRead, { lineWidth: linewidth, strokeStyle: lineColor });
            this.canvasWrite = this.element.querySelector("#writerealtime");
            this.smoothieWrite = new SmoothieChart({ millisPerPixel: timescale, maxValueScale: maxValueScale });
            this.smoothieWrite.streamTo(this.canvasWrite, streamdelay);
            this.lineWrite = new TimeSeries();
            this.smoothieWrite.addTimeSeries(this.lineWrite, { lineWidth: linewidth, strokeStyle: lineColor });
            this.read = this.element.querySelector(".bytesRead");
            this.write = this.element.querySelector(".bytesWritten");
        };
        DiskMonitorControl.prototype.setData = function (date, disk) {
            if (!disk) {
                this.element.style.display = "none";
                return;
            }
            else {
                this.element.style.display = "";
            }
            this.read.textContent = formatBytes(disk.bytesRead);
            this.write.textContent = formatBytes(disk.bytesWritten);
            if (this.lastDate) {
                var datedif = date - this.lastDate;
                var readDif = disk.bytesRead - this.lastRead;
                var read = (readDif / datedif);
                var writeDif = disk.bytesWritten - this.lastWrite;
                var write = (writeDif / datedif);
                this.lineRead.append(date, read);
                this.lineWrite.append(date, write);
            }
            this.lastDate = date;
            this.lastRead = disk.bytesRead;
            this.lastWrite = disk.bytesWritten;
        };
        return DiskMonitorControl;
    }());
    VORLON.DiskMonitorControl = DiskMonitorControl;
    var NetworkMonitorControl = (function () {
        function NetworkMonitorControl(element) {
            this.element = element;
            this.render();
        }
        NetworkMonitorControl.prototype.render = function () {
            var entry = function (title, identifier) {
                return "<div class=\"labelval\"><div class=\"label\">" + title + "</div><div class=\"val " + identifier + "\"></div></div>";
            };
            this.element.innerHTML =
                entry("network type", "ianaInterfaceType") + "                          \n                " + entry("signal", "signal") + "    \n                ";
            this.ianaInterfaceType = this.element.querySelector(".ianaInterfaceType");
            this.signal = this.element.querySelector(".signal");
        };
        NetworkMonitorControl.prototype.setData = function (date, network) {
            if (!network) {
                this.element.style.display = "none";
                return;
            }
            else {
                this.element.style.display = "";
            }
            var networkType = "unknown (" + network.ianaInterfaceType + ")";
            if (network.ianaInterfaceType == 243 || network.ianaInterfaceType == 244) {
                networkType = "3G or 4G";
            }
            else if (network.ianaInterfaceType == 71) {
                networkType = "Wifi";
            }
            else if (network.ianaInterfaceType == 6) {
                networkType = "LAN";
            }
            this.ianaInterfaceType.textContent = networkType;
            this.signal.textContent = (network.signal || "") + "";
        };
        return NetworkMonitorControl;
    }());
    VORLON.NetworkMonitorControl = NetworkMonitorControl;
    var PowerMonitorControl = (function () {
        function PowerMonitorControl(element) {
            this.element = element;
            this.render();
        }
        PowerMonitorControl.prototype.render = function () {
            var entry = function (title, identifier) {
                return "<div class=\"labelval\"><div class=\"label\">" + title + "</div><div class=\"val " + identifier + "\"></div></div>";
            };
            this.element.innerHTML =
                entry("power", "power") + "    \n                ";
            this.power = this.element.querySelector(".power");
        };
        PowerMonitorControl.prototype.setData = function (date, power) {
            if (!power) {
                this.element.style.display = "none";
                return;
            }
            else {
                this.element.style.display = "";
            }
            //this.power.textContent = power.remainingChargePercent  + '% (' + formatTime(power.remainingDischargeTime) + ')';
            this.power.textContent = power.remainingChargePercent + '%';
        };
        return PowerMonitorControl;
    }());
    VORLON.PowerMonitorControl = PowerMonitorControl;
    var EnergyMonitorControl = (function () {
        function EnergyMonitorControl(element) {
            this.element = element;
            this.render();
        }
        EnergyMonitorControl.prototype.render = function () {
            var entry = function (title, identifier) {
                return "<div class=\"labelval\"><div class=\"label\">" + title + "</div><div class=\"val " + identifier + "\"></div></div>";
            };
            this.element.innerHTML =
                "<h1>Energy</h1>\n                " + entry("usage", "recentEnergyUsage") + "        \n                <canvas id=\"fgusagerealtime\" width=\"360\" height=\"100\"></canvas>";
            this.canvas = this.element.querySelector("#fgusagerealtime");
            this.smoothie = new SmoothieChart({ millisPerPixel: timescale, maxValueScale: maxValueScale });
            this.smoothie.streamTo(this.canvas, streamdelay);
            this.lineFgUsage = new TimeSeries();
            this.smoothie.addTimeSeries(this.lineFgUsage, { lineWidth: linewidth, strokeStyle: lineColor });
            this.recentEnergyUsage = this.element.querySelector(".recentEnergyUsage");
        };
        EnergyMonitorControl.prototype.setData = function (date, energy) {
            if (!energy || !energy.foregroundEnergy) {
                this.element.style.display = "none";
                return;
            }
            else {
                this.element.style.display = "";
            }
            this.recentEnergyUsage.textContent = energy.foregroundEnergy.recentEnergyUsage + " %";
            this.lineFgUsage.append(date, energy.foregroundEnergy.recentEnergyUsage);
        };
        return EnergyMonitorControl;
    }());
    VORLON.EnergyMonitorControl = EnergyMonitorControl;
})(VORLON || (VORLON = {}));
