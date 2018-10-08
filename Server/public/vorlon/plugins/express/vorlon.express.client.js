var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VORLON;
(function (VORLON) {
    var ExpressClient = (function (_super) {
        __extends(ExpressClient, _super);
        function ExpressClient() {
            _super.call(this, "express"); // Name
            this.hooked = false;
            this._ready = true; // No need to wait
            console.log('Started');
        }
        //Return unique id for your plugin
        ExpressClient.prototype.getID = function () {
            return "EXPRESS";
        };
        ExpressClient.prototype.refresh = function () {
            //override this method with cleanup work that needs to happen
            //as the user switches between clients on the dashboard
            //we don't really need to do anything in this sample
        };
        // This code will run on the client //////////////////////
        // Start the clientside code
        ExpressClient.prototype.startClientSide = function () {
        };
        // Handle messages from the dashboard, on the client
        ExpressClient.prototype.onRealtimeMessageReceivedFromDashboardSide = function (receivedObject) {
            if (!VORLON.Tools.IsWindowAvailable) {
                if (receivedObject == 'express') {
                    if (typeof global.EXPRESS_VORLONJS === 'undefined') {
                        this.sendToDashboard({ type: 'express', data: false });
                    }
                    else {
                        this.sendToDashboard({ type: 'express', data: true });
                    }
                }
                else if (receivedObject == 'express_route') {
                    var routes = [];
                    global.EXPRESS_VORLONJS._router.stack // registered routes
                        .filter(function (r) { return r.route; }) // take out all the middleware
                        .map(function (r) { return routes.push(r.route); }); // get all the paths
                    this.sendToDashboard({ type: 'express_route', data: routes });
                }
                else if (receivedObject == 'express_request') {
                    var __this = this;
                    var found = false;
                    var middlewares = global.EXPRESS_VORLONJS._router.stack;
                    for (var m = 0, len = middlewares.length; m < len; m++) {
                        if (middlewares[m].name == 'request_interceptor') {
                            found = true;
                        }
                    }
                    if (!found) {
                        global.EXPRESS_VORLONJS.use('request_interceptor', function (req, res, next) {
                            req.on("end", function () {
                                __this.sendToDashboard({
                                    type: 'express_request',
                                    data: {
                                        code: res.statusCode,
                                        method: req.method,
                                        url: req.url,
                                        headers: req.headers
                                    }
                                });
                            });
                            next();
                        });
                    }
                    var middlewares = global.EXPRESS_VORLONJS._router.stack;
                    for (var m = 0, len = middlewares.length; m < len; m++) {
                        if (middlewares[m].regexp.toString().indexOf('request_interceptor') != -1) {
                            var element = middlewares[m];
                            var regexp = /^\/?(?=\/|$)/i;
                            global.EXPRESS_VORLONJS._router.stack[m].regexp = regexp;
                            global.EXPRESS_VORLONJS._router.stack[m].name = 'request_interceptor';
                            global.EXPRESS_VORLONJS._router.stack.splice(m, 1);
                            global.EXPRESS_VORLONJS._router.stack.splice(2, 0, element);
                        }
                    }
                }
                else if (receivedObject == 'express_locals') {
                    this.sendToDashboard({ type: 'express_locals', data: JSON.stringify(global.EXPRESS_VORLONJS.locals, undefined, 4) });
                }
            }
        };
        return ExpressClient;
    }(VORLON.ClientPlugin));
    VORLON.ExpressClient = ExpressClient;
    //Register the plugin with vorlon core
    VORLON.Core.RegisterClientPlugin(new ExpressClient());
})(VORLON || (VORLON = {}));
