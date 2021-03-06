var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VORLON;
(function (VORLON) {
    var NetworkMonitorDashboard = (function (_super) {
        __extends(NetworkMonitorDashboard, _super);
        function NetworkMonitorDashboard() {
            _super.call(this, "networkMonitor", "control.html", "control.css");
            this._ready = false;
            this._id = "NETWORK";
            //this.debug = true;
        }
        NetworkMonitorDashboard.prototype.startDashboardSide = function (div) {
            var _this = this;
            if (div === void 0) { div = null; }
            this._insertHtmlContentAsync(div, function (filledDiv) {
                _this._containerDiv = VORLON.Tools.QuerySelectorById(div, "networkLogList");
                _this._ready = true;
            });
        };
        NetworkMonitorDashboard.prototype.processEntries = function (receivedObject) {
            if (!this._containerDiv) {
                console.error("NetworkMonitor dashboard receive client message but is not ready");
                return;
            }
            this._containerDiv.innerHTML = "";
            var barColors = {
                background: "rgb(211,211,211)",
                blocked: "rgb(204, 204, 204)",
                thirdParty: "rgb(0, 0, 0)",
                redirect: "rgb(255, 221, 0)",
                appCache: "rgb(161, 103, 38)",
                dns: "rgb(48, 150, 158)",
                tcp: "rgb(255, 157, 66)",
                ssl: "rgb(213,102, 223)",
                request: "rgb(64, 255, 64)",
                response: "rgb(52, 150, 255)"
            };
            var maxTime = 0;
            if (!receivedObject || !receivedObject.entries)
                return;
            for (var n = 0; n < receivedObject.entries.length; n++) {
                maxTime = Math.max(maxTime, receivedObject.entries[n].startTime + receivedObject.entries[n].duration);
            }
            var scaleFactor = maxTime / 100;
            //console.log(receivedObject.entries);
            for (var i = 0; i < receivedObject.entries.length; i++) {
                var entry = receivedObject.entries[i];
                var tr = document.createElement("tr");
                var tdResourceName = document.createElement("td");
                var tdResourceDomain = document.createElement("td");
                var tdResourceType = document.createElement("td");
                var tdResourceDuration = document.createElement("td");
                var tdResourceTimeline = document.createElement("td");
                //console.log(entry);
                var url = entry.name.substring(entry.name.lastIndexOf('/') + 1);
                if (url.length > 48) {
                    url = url.substring(0, 48) + '...';
                }
                tdResourceName.innerHTML = url;
                tdResourceName.title = entry.name;
                tdResourceDomain.innerHTML = entry.name.split("/")[2];
                tdResourceType.innerHTML = entry.type;
                tdResourceDuration.innerHTML = Math.round(entry.duration).toString();
                tdResourceDuration.className = "network-log-list-right";
                tdResourceTimeline.style.width = "400px";
                tdResourceTimeline.style.position = 'relative';
                tdResourceTimeline.appendChild(this.createBar(entry.startTime / scaleFactor, entry.duration / scaleFactor, barColors.background));
                if (entry.redirectDuration > 0) {
                    tdResourceTimeline.appendChild(this.createBar(entry.redirectStart / scaleFactor, entry.redirectDuration / scaleFactor, barColors.redirect));
                }
                if (entry.dnsDuration > 0) {
                    tdResourceTimeline.appendChild(this.createBar(entry.dnsStart / scaleFactor, entry.dnsDuration / scaleFactor, barColors.dns));
                }
                if (entry.tcpDuration > 0) {
                    tdResourceTimeline.appendChild(this.createBar(entry.tcpStart / scaleFactor, entry.tcpDuration / scaleFactor, barColors.tcp));
                }
                if (entry.requestDuration > 0) {
                    tdResourceTimeline.appendChild(this.createBar(entry.requestStart / scaleFactor, entry.requestDuration / scaleFactor, barColors.request));
                }
                if (entry.responseDuration > 0) {
                    tdResourceTimeline.appendChild(this.createBar(entry.responseStart / scaleFactor, entry.responseDuration / scaleFactor, barColors.response));
                }
                tr.appendChild(tdResourceName);
                tr.appendChild(tdResourceDomain);
                tr.appendChild(tdResourceType);
                tr.appendChild(tdResourceDuration);
                tr.appendChild(tdResourceTimeline);
                this._containerDiv.appendChild(tr);
            }
        };
        NetworkMonitorDashboard.prototype.createBar = function (x, width, color) {
            var bar = document.createElement('div');
            bar.className = 'chart-bar';
            //bar.style.position = 'absolute';
            //bar.style.height = '10px';
            bar.style.marginLeft = x + '%';
            bar.style.width = width + '%';
            bar.style.backgroundColor = color;
            return bar;
        };
        return NetworkMonitorDashboard;
    }(VORLON.DashboardPlugin));
    VORLON.NetworkMonitorDashboard = NetworkMonitorDashboard;
    NetworkMonitorDashboard.prototype.DashboardCommands = {
        performanceItems: function (data) {
            var plugin = this;
            plugin.processEntries(data);
        }
    };
    //Register the plugin with vorlon core 
    VORLON.Core.RegisterDashboardPlugin(new NetworkMonitorDashboard());
})(VORLON || (VORLON = {}));
