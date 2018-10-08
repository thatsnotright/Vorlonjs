var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VORLON;
(function (VORLON) {
    var DeviceClient = (function (_super) {
        __extends(DeviceClient, _super);
        function DeviceClient() {
            _super.call(this, "device");
            this._ready = true;
        }
        //Return unique id for your plugin
        DeviceClient.prototype.getID = function () {
            return "DEVICE";
        };
        DeviceClient.prototype.refresh = function () {
            // override this method with cleanup work that needs to happen
            // as the user switches between clients on the dashboard
            var _this = this;
            if (typeof verge === 'undefined' || typeof res === 'undefined') {
                return;
            }
            //sometimes refresh is called before document was loaded
            if (!document.body) {
                setTimeout(function () {
                    _this.refresh();
                }, 200);
                return;
            }
            // user agent string
            var userAgent = this.getUserAgent();
            // console.info('User agent:', userAgent);
            // meta viewport tag
            var metaViewport = this.getMetaViewport();
            // console.info('Meta viewport:', metaViewport);
            // screen widths
            var screenWidths = this.getScreenWidths();
            // console.info('Screen widths', screenWidths);
            // screen resolution
            var resolution = this.getResolution();
            // console.info('Resolution', resolution);
            // root font size
            var rootFontSize = this.getRootFontSize();
            // console.info('Root font size:', rootFontSize);
            // viewport
            var viewport = this.getViewport();
            // console.info('Viewport', viewport);
            // pixel ratio
            var pixelRatio = this.getPixelRatio();
            // console.info('Pixel ratio:', pixelRatio);
            var data = {
                userAgent: userAgent,
                metaViewport: metaViewport,
                screenWidths: screenWidths,
                resolution: resolution,
                rootFontSize: rootFontSize,
                viewport: viewport,
                pixelRatio: pixelRatio
            };
            var message = {
                type: 'full',
                data: data
            };
            this.sendToDashboard(message);
        };
        DeviceClient.prototype.refreshResize = function () {
            if (typeof verge === 'undefined') {
                return;
            }
            var data = {
                screenWidths: this.getScreenWidths(),
                viewport: this.getViewport(),
            };
            var message = {
                type: 'resize',
                data: data
            };
            this.sendToDashboard(message);
            // console.log('Device information refreshed for resize.');
        };
        DeviceClient.prototype.getUserAgent = function () {
            return navigator.userAgent;
        };
        DeviceClient.prototype.getMetaViewport = function () {
            var metaViewportTag = document.querySelector('meta[name="viewport"]');
            var metaViewport;
            if ((metaViewport !== null || metaViewport === []) && typeof metaViewportTag != 'undefined' && metaViewportTag != null) {
                metaViewport = metaViewportTag.outerHTML;
            }
            else {
                console.log('No meta viewport tag found.');
                metaViewport = 'No meta viewport tag found.';
            }
            return metaViewport;
        };
        DeviceClient.prototype.getScreenWidths = function () {
            return {
                screenWidth: screen.width,
                screenAvailWidth: screen.availWidth,
                windowInnerWidth: window.innerWidth,
                bodyClientWidth: document.body.clientWidth,
            };
        };
        DeviceClient.prototype.getResolution = function () {
            return {
                dpi: res.dpi(),
                dppx: res.dppx(),
                dpcm: res.dpcm()
            };
        };
        DeviceClient.prototype.getRootFontSize = function () {
            // returns the root font size in pixels
            var htmlRoot = document.getElementsByTagName('html')[0];
            return parseInt(window.getComputedStyle(htmlRoot, null).getPropertyValue('font-size'));
        };
        DeviceClient.prototype.getViewport = function () {
            var rootFontSize = this.getRootFontSize();
            return {
                aspectRatio: verge.aspect(screen),
                width: verge.viewportW(),
                widthEm: (verge.viewportW() / rootFontSize).toFixed(0),
            };
        };
        DeviceClient.prototype.getPixelRatio = function () {
            // pixel ratio refers to ratio between physical pixels and logical pixels
            // see http://stackoverflow.com/a/8785677 for more information
            var pixelRatio = window.devicePixelRatio || window.screen.availWidth / document.documentElement.clientWidth;
            pixelRatio = pixelRatio.toFixed(2);
            return pixelRatio;
        };
        // This code will run on the client //////////////////////
        // Start the clientside code
        DeviceClient.prototype.startClientSide = function () {
            // load the "res" and "verge" libraries
            var _this = this;
            this._loadNewScriptAsync("res.min.js", function () {
                if (res) {
                    _this.refresh();
                }
            });
            this._loadNewScriptAsync("verge.min.js", function () {
                if (verge) {
                    _this.refresh();
                }
            });
            // update certain information when the page is resized
            window.addEventListener('resize', this.refreshResize.bind(this));
        };
        // Handle messages from the dashboard, on the client
        DeviceClient.prototype.onRealtimeMessageReceivedFromDashboardSide = function (receivedObject) {
            // the dashboard shouldn't be sending anything
        };
        return DeviceClient;
    }(VORLON.ClientPlugin));
    VORLON.DeviceClient = DeviceClient;
    // Register the plugin with vorlon core
    VORLON.Core.RegisterClientPlugin(new DeviceClient());
})(VORLON || (VORLON = {}));
