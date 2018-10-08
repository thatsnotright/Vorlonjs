var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../vorlon.clientPlugin.ts" />
/// <reference path="../../vorlon.tools.ts" />
/// <reference path="../../vorlon.core.ts" />
/// <reference path="../../vorlon.basePlugin.ts" />
/// <reference path="vorlon.objectExplorer.interfaces.ts" />
var VORLON;
(function (VORLON) {
    var ObjectExplorerClient = (function (_super) {
        __extends(ObjectExplorerClient, _super);
        function ObjectExplorerClient() {
            _super.call(this, "objectExplorer");
            this._objPrototype = Object.getPrototypeOf({});
            this.STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
            this.ARGUMENT_NAMES = /([^\s,]+)/g;
            this.rootProperty = VORLON.Tools.IsWindowAvailable ? 'window' : "global";
            this._id = "OBJEXPLORER";
            this._ready = true;
        }
        ObjectExplorerClient.prototype.getFunctionArgumentNames = function (func) {
            var result = [];
            try {
                var fnStr = func.toString().replace(this.STRIP_COMMENTS, '');
                result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(this.ARGUMENT_NAMES);
                if (result === null)
                    result = [];
            }
            catch (exception) {
                console.error(exception);
            }
            return result;
        };
        ObjectExplorerClient.prototype.inspect = function (path, obj, context) {
            if (obj === undefined)
                return null;
            var res = {
                proto: null,
                fullpath: path.join('.'),
                name: path[path.length - 1],
                functions: [],
                properties: [],
                contentFetched: true,
                type: typeof obj
            };
            this.trace("inspecting " + res.fullpath + " as " + res.type);
            if (res.type === "function") {
                return res;
            }
            else if (obj === null) {
                res.type = "null";
                res.value = null;
                return res;
            }
            else if (res.type !== "object") {
                res.value = obj.toString();
                return res;
            }
            var objProperties = Object.getOwnPropertyNames(obj);
            var proto = Object.getPrototypeOf(obj);
            if (proto && proto != this._objPrototype)
                res.proto = this.inspect(path, proto, context);
            for (var i = 0, l = objProperties.length; i < l; i++) {
                var p = objProperties[i];
                var propertyType = "";
                if (p === '__vorlon')
                    continue;
                var propPath = JSON.parse(JSON.stringify(path));
                propPath.push(p);
                try {
                    var objValue = context[p];
                    propertyType = typeof objValue;
                    if (propertyType === 'function') {
                        res.functions.push({
                            name: p,
                            fullpath: propPath.join('.'),
                            args: this.getFunctionArgumentNames(objValue)
                        });
                    }
                    else if (propertyType === 'undefined') {
                        res.properties.push({
                            name: p,
                            type: propertyType,
                            fullpath: propPath.join('.'),
                            value: undefined
                        });
                    }
                    else if (propertyType === 'null') {
                        res.properties.push({
                            name: p,
                            type: propertyType,
                            fullpath: propPath.join('.'),
                            value: null
                        });
                    }
                    else if (propertyType === 'object') {
                        var desc = {
                            name: p,
                            type: propertyType,
                            fullpath: propPath.join('.'),
                            contentFetched: false
                        };
                        if (objValue === null) {
                            desc.type = "null";
                            desc.contentFetched = true;
                        }
                        res.properties.push(desc);
                    }
                    else {
                        res.properties.push({
                            name: p,
                            fullpath: propPath.join('.'),
                            type: propertyType,
                            value: objValue.toString()
                        });
                    }
                }
                catch (exception) {
                    this.trace('error reading property ' + p + ' of type ' + propertyType);
                    this.trace(exception);
                    res.properties.push({
                        name: p,
                        type: propertyType,
                        fullpath: propPath.join('.'),
                        val: "oups, Vorlon has an error reading this " + propertyType + " property..."
                    });
                }
            }
            res.functions = res.functions.sort(function (a, b) {
                var lowerAName = a.name.toLowerCase();
                var lowerBName = b.name.toLowerCase();
                if (lowerAName > lowerBName)
                    return 1;
                if (lowerAName < lowerBName)
                    return -1;
                return 0;
            });
            res.properties = res.properties.sort(function (a, b) {
                var lowerAName = a.name.toLowerCase();
                var lowerBName = b.name.toLowerCase();
                if (lowerAName > lowerBName)
                    return 1;
                if (lowerAName < lowerBName)
                    return -1;
                return 0;
            });
            return res;
        };
        ObjectExplorerClient.prototype._getProperty = function (propertyPath) {
            var selectedObj = VORLON.Tools.IsWindowAvailable ? window : global;
            var tokens = [this.rootProperty];
            this.trace("getting obj at " + propertyPath);
            if (propertyPath && propertyPath !== this.rootProperty) {
                tokens = propertyPath.split('.');
                if (tokens && tokens.length) {
                    for (var i = 0, l = tokens.length; i < l; i++) {
                        selectedObj = selectedObj[tokens[i]];
                        if (selectedObj === undefined) {
                            this.trace(tokens[i] + " not found");
                            break;
                        }
                    }
                }
            }
            if (selectedObj === undefined) {
                console.log('not found');
                return { type: 'notfound', name: 'not found', val: null, functions: [], properties: [], contentFetched: false, fullpath: null };
            }
            var res = this.inspect(tokens, selectedObj, selectedObj);
            return res;
        };
        ObjectExplorerClient.prototype._packageAndSendObjectProperty = function (path) {
            path = path || this._currentPropertyPath;
            var packagedObject = this._getProperty(path);
            this.sendCommandToDashboard('update', packagedObject);
            //this.sendToDashboard({ type: type, path: packagedObject.fullpath, property: packagedObject });
        };
        ObjectExplorerClient.prototype.startClientSide = function () {
        };
        ObjectExplorerClient.prototype.onRealtimeMessageReceivedFromDashboardSide = function (receivedObject) {
            //switch (receivedObject.type) {
            //    case "query":
            //        this._currentPropertyPath = receivedObject.path;
            //        this._packageAndSendObjectProperty(receivedObject.type);
            //        break;
            //    case "queryContent":
            //        this._packageAndSendObjectProperty(receivedObject.type, receivedObject.path);
            //        break;
            //    default:
            //        break;
            //}
        };
        ObjectExplorerClient.prototype.query = function (path) {
            this._currentPropertyPath = path;
            var packagedObject = this._getProperty(path);
            this.sendCommandToDashboard('root', packagedObject);
        };
        ObjectExplorerClient.prototype.queryContent = function (path) {
            var packagedObject = this._getProperty(path);
            this.sendCommandToDashboard('content', packagedObject);
        };
        ObjectExplorerClient.prototype.refresh = function () {
            this.query(this._currentPropertyPath);
        };
        return ObjectExplorerClient;
    }(VORLON.ClientPlugin));
    VORLON.ObjectExplorerClient = ObjectExplorerClient;
    ObjectExplorerClient.prototype.ClientCommands = {
        query: function (data) {
            var plugin = this;
            plugin.query(data.path);
        },
        queryContent: function (data) {
            var plugin = this;
            plugin.queryContent(data.path);
        }
    };
    // Register
    VORLON.Core.RegisterClientPlugin(new ObjectExplorerClient());
})(VORLON || (VORLON = {}));
