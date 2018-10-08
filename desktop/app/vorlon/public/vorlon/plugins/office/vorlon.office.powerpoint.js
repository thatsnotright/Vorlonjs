var $;
var VORLON;
(function (VORLON) {
    var OfficePowerPoint = (function () {
        function OfficePowerPoint(dashboardPlugin) {
            var _this = this;
            this.apis = [
                function () {
                    return (new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.document", "getActiveViewAsync"));
                },
                function () {
                    return (new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.document", "getFilePropertiesAsync"));
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.document", "getSelectedDataAsync");
                    var coercionType = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".coercionType", "Coercion type", "text");
                    var filterType = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".filterType", "Filter type", "all");
                    var valueFormat = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".valueFormat", "Value format", "unformatted");
                    fn.elements.push(coercionType, filterType, valueFormat);
                    fn.getArgs = function () {
                        var args = [coercionType.value, {
                                filterType: filterType.value === "" ? null : filterType.value,
                                valueFormat: valueFormat.value === "" ? null : valueFormat.value
                            }];
                        return args;
                    };
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.document", "setSelectedDataAsync");
                    var data = VORLON.OfficeTools.CreateTextArea(fn.fullpathName + ".data", "Data", "Hello World");
                    var coercionType = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".coerctionType", "Type", "text");
                    fn.elements.push(data, coercionType);
                    fn.getArgs = function () {
                        var args = [data.value, {
                                coercionType: coercionType.value === "" ? null : coercionType.value
                            }];
                        return args;
                    };
                    return fn;
                }
            ];
            this.dashboardPlugin = dashboardPlugin;
        }
        OfficePowerPoint.prototype.execute = function () {
            this.apis.forEach(function (api) {
                api().addTree();
            });
        };
        return OfficePowerPoint;
    }());
    VORLON.OfficePowerPoint = OfficePowerPoint;
})(VORLON || (VORLON = {}));
