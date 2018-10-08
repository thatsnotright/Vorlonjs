var VORLON;
(function (VORLON) {
    var OfficeFunction = (function () {
        /**
         * function ecosystem
         */
        function OfficeFunction(dashboardPlugin, treeCategory, functionName) {
            var _this = this;
            this.dashboardPlugin = dashboardPlugin;
            this.treeCategory = treeCategory;
            this.functionName = functionName;
            this.fullpathName = treeCategory + "." + functionName;
            this.elements = [];
            this.sendToClient = function () { return _this.dashboardPlugin.sendToClient({
                type: "function",
                name: _this.fullpathName,
                args: _this.getArgs(),
                hasAsyncResult: _this.isAsync()
            }); };
        }
        OfficeFunction.prototype.addTree = function () {
            var _this = this;
            var func = VORLON.OfficeTools.AddTreeFunction(this.treeCategory, this.functionName);
            func.click(function (e) {
                VORLON.OfficeTools.ShowFunction(_this.fullpathName, _this.sendToClient, _this.elements);
            });
        };
        OfficeFunction.prototype.getArgs = function () {
            var args = [];
            this.elements.forEach(function (element) {
                if (element.value !== null && element.value !== undefined && element.value !== "")
                    args.push(element.value);
            });
            return args;
        };
        OfficeFunction.prototype.isAsync = function () {
            var isAsync = (this.functionName.toLowerCase().indexOf("async") > 0);
            return isAsync;
        };
        return OfficeFunction;
    }());
    VORLON.OfficeFunction = OfficeFunction;
})(VORLON || (VORLON = {}));
