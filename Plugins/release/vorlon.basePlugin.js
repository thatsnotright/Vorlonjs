var VORLON;
(function (VORLON) {
    var BasePlugin = (function () {
        function BasePlugin(name) {
            this.name = name;
            this._ready = true;
            this._id = "";
            this._type = VORLON.PluginType.OneOne;
            this.traceLog = function (msg) { console.log(msg); };
            this.traceNoop = function (msg) { };
            this.loadingDirectory = "vorlon/plugins";
            this.debug = VORLON.Core.debug;
        }
        Object.defineProperty(BasePlugin.prototype, "Type", {
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BasePlugin.prototype, "debug", {
            get: function () {
                return this._debug;
            },
            set: function (val) {
                this._debug = val;
                if (val) {
                    this.trace = this.traceLog;
                }
                else {
                    this.trace = this.traceNoop;
                }
            },
            enumerable: true,
            configurable: true
        });
        BasePlugin.prototype.getID = function () {
            return this._id;
        };
        BasePlugin.prototype.isReady = function () {
            return this._ready;
        };
        return BasePlugin;
    }());
    VORLON.BasePlugin = BasePlugin;
})(VORLON || (VORLON = {}));
