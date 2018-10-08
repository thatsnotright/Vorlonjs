var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VORLON;
(function (VORLON) {
    var DeviceDashboard = (function (_super) {
        __extends(DeviceDashboard, _super);
        //Do any setup you need, call super to configure
        //the plugin with html and css for the dashboard
        function DeviceDashboard() {
            //     name   ,  html for dash   css for dash
            _super.call(this, "device", "control.html", "control.css");
            this._ready = true;
        }
        //Return unique id for your plugin
        DeviceDashboard.prototype.getID = function () {
            return "DEVICE";
        };
        DeviceDashboard.prototype.startDashboardSide = function (div) {
            var _this = this;
            if (div === void 0) { div = null; }
            this._insertHtmlContentAsync(div, function (filledDiv) {
                _this._resolutionTable = filledDiv.querySelector('#resolution');
                _this._miscTable = filledDiv.querySelector('#misc');
                _this._viewportTable = filledDiv.querySelector('#viewport');
                _this._screensizeTable = filledDiv.querySelector('#screensize');
            });
        };
        // called to update the HTML with a complete set of data
        DeviceDashboard.prototype.update = function (data) {
            // resolution
            var resolution = data.resolution;
            this.setTableValue(this._resolutionTable, 'dpi', this.round2decimals(resolution.dpi).toString());
            this.setTableValue(this._resolutionTable, 'dppx', this.round2decimals(resolution.dppx).toString());
            this.setTableValue(this._resolutionTable, 'dpcm', this.round2decimals(resolution.dpcm).toString());
            // miscellaneous
            this.setTableValue(this._miscTable, 'root-font-size', data.rootFontSize + 'px');
            this.setTableValue(this._miscTable, 'pixel-ratio', this.round2decimals(data.pixelRatio).toString());
            this.setTableValue(this._miscTable, 'user-agent', data.userAgent);
            this.updateResize(data);
        };
        // called to update the HTML with a set of data stemming from a window resize
        DeviceDashboard.prototype.updateResize = function (data) {
            // viewport
            var viewport = data.viewport;
            this.setTableValue(this._viewportTable, 'aspect-ratio', this.round2decimals(viewport.aspectRatio).toString());
            this.setTableValue(this._viewportTable, 'width', viewport.width + 'px');
            this.setTableValue(this._viewportTable, 'width-em', viewport.widthEm + 'em');
            if (data.metaViewport) {
                this.setTableValue(this._viewportTable, 'meta-viewport-tag', data.metaViewport);
            }
            // screen width
            var screenWidths = data.screenWidths;
            this.setTableValue(this._screensizeTable, 'screen-width', screenWidths.screenWidth + 'px');
            this.setTableValue(this._screensizeTable, 'screen-available-width', screenWidths.screenAvailWidth + 'px');
            this.setTableValue(this._screensizeTable, 'window-inner-width', screenWidths.windowInnerWidth + 'px');
            this.setTableValue(this._screensizeTable, 'body-client-width', screenWidths.bodyClientWidth + 'px');
        };
        DeviceDashboard.prototype.setTableValue = function (table, cssClass, value) {
            if (table)
                table.querySelector('.' + cssClass).textContent = value;
        };
        DeviceDashboard.prototype.round2decimals = function (value) {
            return (Math.round(value * 100) / 100);
        };
        // When we get a message from the client, just show it
        DeviceDashboard.prototype.onRealtimeMessageReceivedFromClientSide = function (receivedObject) {
            var data = receivedObject.data;
            var udpateType = receivedObject.type;
            switch (udpateType) {
                case 'full':
                    this.update(data);
                    break;
                case 'resize':
                    this.updateResize(data);
                    break;
            }
        };
        return DeviceDashboard;
    }(VORLON.DashboardPlugin));
    VORLON.DeviceDashboard = DeviceDashboard;
    //Register the plugin with vorlon core
    VORLON.Core.RegisterDashboardPlugin(new DeviceDashboard());
})(VORLON || (VORLON = {}));
