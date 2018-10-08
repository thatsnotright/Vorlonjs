///<reference path='vorlon.office.tools.ts' />
///<reference path='vorlon.office.interfaces.ts' />
///<reference path='../../vorlon.dashboardPlugin.ts' />
var $;
var VORLON;
(function (VORLON) {
    var OfficeDocument = (function () {
        function OfficeDocument(dashboardPlugin) {
            var _this = this;
            this.apis = [
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.requirements", "isSetSupported");
                    var apiName = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".apiName", "Api name");
                    var apiVersion = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".apiVersion", "Api Version");
                    fn.elements.push(apiName, apiVersion);
                    return fn;
                },
                function () {
                    return new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.document", "getAllAsync");
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
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.document", "getFileAsync");
                    fn.elements.push(VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".fileType", "Type", "text"));
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
        OfficeDocument.prototype.execute = function () {
            this.apis.forEach(function (api) {
                api().addTree();
            });
        };
        return OfficeDocument;
    }());
    VORLON.OfficeDocument = OfficeDocument;
})(VORLON || (VORLON = {}));
