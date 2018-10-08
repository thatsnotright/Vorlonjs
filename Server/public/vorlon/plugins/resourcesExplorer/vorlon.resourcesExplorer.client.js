var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VORLON;
(function (VORLON) {
    var ResourcesExplorerClient = (function (_super) {
        __extends(ResourcesExplorerClient, _super);
        function ResourcesExplorerClient() {
            var _this = this;
            _super.call(this, "resourcesExplorer");
            this.localStorageList = [];
            this.sessionStorageList = [];
            this.cookiesList = [];
            this._ready = true;
            this._id = "RESOURCES";
            //this.debug = true;
            window.addEventListener("load", function () {
                _this.sendClientData();
            });
        }
        ResourcesExplorerClient.prototype.sendClientData = function () {
            // LOCAL STORAGE
            this.localStorageList = [];
            for (var i = 0; i < localStorage.length; i++) {
                this.localStorageList.push({ "key": localStorage.key(i), "value": localStorage.getItem(localStorage.key(i)) });
            }
            // SESSION STORAGE
            this.sessionStorageList = [];
            for (var i = 0; i < sessionStorage.length; i++) {
                this.sessionStorageList.push({ "key": sessionStorage.key(i), "value": sessionStorage.getItem(sessionStorage.key(i)) });
            }
            // COOKIES
            this.cookiesList = [];
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var keyValue = cookies[i].split('=');
                this.cookiesList.push({ "key": keyValue[0], "value": keyValue[1] });
            }
            var message = {};
            message.localStorageList = this.localStorageList;
            message.sessionStorageList = this.sessionStorageList;
            message.cookiesList = this.cookiesList;
            this.sendCommandToDashboard("resourceitems", message);
        };
        ResourcesExplorerClient.prototype.refresh = function () {
            this.sendClientData();
        };
        ResourcesExplorerClient.prototype.evalOrderFromDashboard = function (order) {
            try {
                eval(order);
            }
            catch (e) {
                console.error("Unable to execute order: " + e.message);
            }
        };
        return ResourcesExplorerClient;
    }(VORLON.ClientPlugin));
    VORLON.ResourcesExplorerClient = ResourcesExplorerClient;
    ResourcesExplorerClient.prototype.ClientCommands = {
        refresh: function (data) {
            var plugin = this;
            plugin.refresh();
        },
        order: function (data) {
            var plugin = this;
            plugin.evalOrderFromDashboard(data.order);
        }
    };
    //Register the plugin with vorlon core 
    VORLON.Core.RegisterClientPlugin(new ResourcesExplorerClient());
})(VORLON || (VORLON = {}));
