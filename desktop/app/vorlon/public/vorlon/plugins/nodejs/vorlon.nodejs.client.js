var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VORLON;
(function (VORLON) {
    var NodejsClient = (function (_super) {
        __extends(NodejsClient, _super);
        function NodejsClient() {
            _super.call(this, "nodejs"); // Name
            this._ready = true; // No need to wait
            console.log('Started');
        }
        //Return unique id for your plugin
        NodejsClient.prototype.getID = function () {
            return "NODEJS";
        };
        NodejsClient.prototype.refresh = function () {
            //override this method with cleanup work that needs to happen
            //as the user switches between clients on the dashboard
            //we don't really need to do anything in this sample
        };
        // This code will run on the client //////////////////////
        // Start the clientside code
        NodejsClient.prototype.startClientSide = function () {
            console.log('client');
        };
        NodejsClient.prototype.simpleStringify = function (object) {
            var simpleObject = {};
            for (var prop in object) {
                if (!object.hasOwnProperty(prop)) {
                    continue;
                }
                if (typeof (object[prop]) == 'object') {
                    continue;
                }
                if (typeof (object[prop]) == 'function') {
                    continue;
                }
                simpleObject[prop] = object[prop];
            }
            return JSON.stringify(simpleObject); // returns cleaned up JSON
        };
        ;
        // Handle messages from the dashboard, on the client
        NodejsClient.prototype.onRealtimeMessageReceivedFromDashboardSide = function (receivedObject) {
            if (!VORLON.Tools.IsWindowAvailable) {
                if (receivedObject == 'modules') {
                    this.sendToDashboard({ type: 'modules', data: Object.keys(require('module')._cache) });
                }
                else if (receivedObject == 'infos') {
                    this.sendToDashboard({ type: 'infos', data: {
                            title: process.title,
                            version: process.version,
                            platform: process.platform,
                            arch: process.arch,
                            debugPort: process['debugPort'],
                            pid: process.pid,
                            USERNAME: process.env.USERNAME,
                            USERDOMAIN_ROAMINGPROFILE: process.env.USERDOMAIN_ROAMINGPROFILE,
                            USERPROFILE: process.env.USERPROFILE,
                            WINDIR: process.env.WINDIR,
                            UATDATA: process.env.UATDATA,
                            USERDOMAIN: process.env.USERDOMAIN,
                        } });
                }
                else if (receivedObject == 'memory') {
                    var _that = this;
                    _that.sendToDashboard({ type: 'memory', data: process.memoryUsage() });
                    setInterval(function () {
                        _that.sendToDashboard({ type: 'memory', data: process.memoryUsage() });
                    }, 5000);
                }
            }
        };
        return NodejsClient;
    }(VORLON.ClientPlugin));
    VORLON.NodejsClient = NodejsClient;
    //Register the plugin with vorlon core
    VORLON.Core.RegisterClientPlugin(new NodejsClient());
})(VORLON || (VORLON = {}));
