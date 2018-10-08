var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VORLON;
(function (VORLON) {
    var NetworkMonitorClient = (function (_super) {
        __extends(NetworkMonitorClient, _super);
        function NetworkMonitorClient() {
            _super.call(this, "networkMonitor");
            this.performanceItems = [];
            //this.debug = true;
            this._ready = true;
        }
        NetworkMonitorClient.prototype.getID = function () {
            return "NETWORK";
        };
        NetworkMonitorClient.prototype.sendClientData = function () {
            this.trace("network monitor sending data ");
            this.performanceItems = [];
            if (typeof window.performance.getEntries !== 'undefined' && window.performance) {
                var entries = window.performance.getEntries();
                for (var i = 0; i < entries.length; i++) {
                    this.performanceItems.push({
                        name: entries[i].name,
                        type: entries[i].initiatorType,
                        startTime: entries[i].startTime,
                        duration: entries[i].duration,
                        redirectStart: entries[i].redirectStart,
                        redirectDuration: entries[i].redirectEnd - entries[i].redirectStart,
                        dnsStart: entries[i].domainLookupStart,
                        dnsDuration: entries[i].domainLookupEnd - entries[i].domainLookupStart,
                        tcpStart: entries[i].connectStart,
                        tcpDuration: entries[i].connectEnd - entries[i].connectStart,
                        requestStart: entries[i].requestStart,
                        requestDuration: entries[i].responseStart - entries[i].requestStart,
                        responseStart: entries[i].responseStart,
                        responseDuration: (entries[i].responseStart == 0 ? 0 : entries[i].responseEnd - entries[i].responseStart)
                    });
                }
            }
            var message = {};
            message.entries = this.performanceItems;
            this.sendCommandToDashboard("performanceItems", message);
        };
        NetworkMonitorClient.prototype.refresh = function () {
            this.sendClientData();
        };
        return NetworkMonitorClient;
    }(VORLON.ClientPlugin));
    VORLON.NetworkMonitorClient = NetworkMonitorClient;
    NetworkMonitorClient.prototype.ClientCommands = {
        refresh: function (data) {
            var plugin = this;
            plugin.sendClientData();
        }
    };
    //Register the plugin with vorlon core 
    VORLON.Core.RegisterClientPlugin(new NetworkMonitorClient());
})(VORLON || (VORLON = {}));
