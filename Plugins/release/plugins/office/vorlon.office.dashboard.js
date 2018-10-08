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

var $;
var VORLON;
(function (VORLON) {
    var OfficeTools = (function () {
        function OfficeTools() {
        }
        OfficeTools.IsOutlook = function () {
            var parentTreeCategory = "window.Office.context.mailbox";
            return (document.getElementById(parentTreeCategory) !== null && document.getElementById(parentTreeCategory) !== undefined);
        };
        OfficeTools.AddTreeFunction = function (treeCategory, functionName) {
            if (document.getElementById(treeCategory) === null || document.getElementById(treeCategory) === undefined) {
                return;
            }
            var fullpathName = treeCategory + "." + functionName;
            var category = document.getElementById(treeCategory).querySelector('.expand-content');
            var zone = new VORLON.FluentDOM('DIV', 'obj-func', category);
            var func = zone.createChild("SPAN", "func-name").text(functionName);
            return func;
        };
        OfficeTools._ClearPropertiesAndResults = function () {
            // var propertiesDiv = <HTMLDivElement>document.querySelector('#office-results');
            // if (propertiesDiv !== undefined && propertiesDiv !== null) {
            //     while (propertiesDiv.hasChildNodes()) {
            //         propertiesDiv.removeChild(propertiesDiv.lastChild);
            //     }
            // }
            var propertiesDiv = document.querySelector('#office-properties');
            if (propertiesDiv !== undefined && propertiesDiv !== null) {
                while (propertiesDiv.hasChildNodes()) {
                    propertiesDiv.removeChild(propertiesDiv.lastChild);
                }
            }
        };
        OfficeTools.GetOfficeType = function (sets) {
            if (sets == "Outlook") {
                return { officeType: "Outlook", version: "", background: "#0173C7" };
            }
            if (sets.wordapi) {
                return { officeType: "Word", version: sets.wordapi, background: "#2A579A" };
            }
            if (sets.excelapi) {
                return { officeType: "Excel", version: sets.excelapi, background: "#227447" };
            }
            if (!sets.excelapi && !sets.wordapi) {
                return { officeType: "PowerPoint", version: sets.pdf, background: "#B7472A" };
            }
            if (sets.project) {
                return { officeType: "Project", version: sets.projectapi, background: "#2E7237" };
            }
            return { officeType: "Office", version: '1.0', background: "#0173C7" };
        };
        OfficeTools.ShowFunctionResult = function (r) {
            if (r.value !== undefined && r.value !== null)
                r.value = JSON.parse(r.value);
            var jsonValue = JSON.stringify(r.value, undefined, 4);
            var propertiesDiv = document.querySelector('#office-properties');
            var propValues = document.querySelector('#office-results-values');
            if (propValues !== undefined && propValues !== null) {
                while (propValues.hasChildNodes()) {
                    propValues.removeChild(propValues.lastChild);
                }
            }
            else {
                propValues = document.createElement('DIV');
                propValues.className = 'office-results-values';
                propValues.id = 'office-results-values';
                propertiesDiv.appendChild(propValues);
            }
            var container = document.createElement('pre');
            container.className = 'results';
            container.innerHTML = OfficeTools.FormatJson(jsonValue);
            propValues.appendChild(container);
        };
        OfficeTools.FormatJson = function (json) {
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                var cls = 'number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key';
                    }
                    else {
                        cls = 'string';
                    }
                }
                else if (/true|false/.test(match)) {
                    cls = 'boolean';
                }
                else if (/null/.test(match)) {
                    cls = 'null';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            });
        };
        OfficeTools.ShowFunction = function (fullpathName, callbackClick, options) {
            VORLON.OfficeTools._ClearPropertiesAndResults();
            var propertiesDiv = document.querySelector('#office-properties');
            var titleDive = document.querySelector('#office-properties-title');
            titleDive.innerHTML = "Function";
            var zone = new VORLON.FluentDOM('DIV', 'office-properties-values', propertiesDiv);
            zone.append('div', 'fullpath', function (container) {
                container.createChild("SPAN", "function-name").text('Function');
                container.createChild("SPAN", "function-value").text(fullpathName);
            });
            if (options !== undefined && options.length > 0) {
                for (var i in options) {
                    var option = options[i];
                    zone.append('div', 'options', function (container) {
                        container.createChild("SPAN", "function-name").text(option.attributes.getNamedItem('tag').value);
                        container.element.appendChild(option);
                    });
                }
            }
            zone.append('div', 'invoker', function (container) {
                var btn = new VORLON.FluentDOM("INPUT", 'function-invoker', container.element);
                btn.attr('type', 'button');
                btn.attr('value', 'invoke');
                btn.attr('id', fullpathName);
                btn.click(callbackClick);
            });
        };
        OfficeTools.ShowProperty = function (prop) {
            VORLON.OfficeTools._ClearPropertiesAndResults();
            var propertiesDiv = document.querySelector('#office-properties');
            var titleDive = document.querySelector('#office-properties-title');
            titleDive.innerHTML = "Property";
            var zone = new VORLON.FluentDOM('DIV', 'office-properties-values', propertiesDiv);
            zone.append('div', 'prop-fullpath', function (container) {
                container.createChild("SPAN", "name").text('Name');
                container.createChild("SPAN", "value").text(prop.fullpath);
            });
            zone.append('div', 'prop-name', function (container) {
                container.createChild("SPAN", "name").text('Type');
                container.createChild("SPAN", "value").text(prop.type);
            });
            zone.append('div', 'prop-type', function (container) {
                container.createChild("SPAN", "name").text('Value');
                container.createChild("SPAN", "value").text(prop.value);
            });
        };
        OfficeTools.AddZone = function (parentTreeCategory, category) {
            if (document.getElementById(parentTreeCategory) === null || document.getElementById(parentTreeCategory) === undefined) {
                return;
            }
            if (document.getElementById(parentTreeCategory + "." + category) !== null && document.getElementById(parentTreeCategory + "." + category) !== undefined) {
                return;
            }
            var itemBody = document.getElementById(parentTreeCategory).children[1];
            // root of all
            var elt = new VORLON.FluentDOM('DIV', 'objdescriptor', itemBody);
            // Create the div for the current path
            elt.append('DIV', 'expandable expanded', function (zone) {
                var btn;
                zone.attr("id", parentTreeCategory + "." + category);
                // create the div containing both sigle (+ or -) and the label
                zone.append('DIV', 'expand', function (container) {
                    btn = container.createChild("SPAN", "expand-btn").text("-");
                    btn.click(function (arg) {
                        arg.stopPropagation();
                        VORLON.Tools.ToggleClass(zone.element, "expanded", function (expanded) {
                            expanded ? btn.text("-") : btn.text("+");
                        });
                    });
                    container.createChild("SPAN", "expand-label").text(category);
                });
                zone.append("DIV", "expand-content", function (category) {
                });
            });
        };
        OfficeTools.CreateTextArea = function (name, label, value) {
            var formData = document.createElement('textarea');
            formData.setAttribute("rows", "4");
            formData.setAttribute("cols", "40");
            formData.setAttribute("name", name);
            formData.setAttribute("id", name);
            if (value)
                formData.value = value;
            formData.setAttribute("tag", label + ": ");
            return formData;
        };
        OfficeTools.CreateTextBlock = function (name, label, value) {
            var inputText = document.createElement('input');
            inputText.setAttribute("type", "text");
            inputText.setAttribute("name", name + ".coercionType");
            inputText.setAttribute("id", name + ".coercionType ");
            if (value !== undefined) {
                inputText.value = value;
            }
            inputText.setAttribute("tag", label + " : ");
            return inputText;
        };
        return OfficeTools;
    }());
    VORLON.OfficeTools = OfficeTools;
})(VORLON || (VORLON = {}));

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

var $;
var VORLON;
(function (VORLON) {
    var OfficeOutlook = (function () {
        function OfficeOutlook(dashboardPlugin) {
            var _this = this;
            this.apis = [
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item", "getSelectedDataAsync");
                    fn.elements = [VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".coerciontyp", "Coercion type", "text")];
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item", "setSelectedDataAsync");
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
                },
                function () {
                    return (new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item", "getRegExMatches"));
                },
                function () {
                    return (new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item", "getUserIdentityTokenAsync"));
                },
                function () {
                    return (new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item", "getCallbackTokenAsync"));
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item", "getRegExMatchesByName");
                    var getRegExMatchesByName = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".getRegExMatchesByName", "Time value", Date.now().toString());
                    fn.elements.push(getRegExMatchesByName);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item", "displayReplyAllForm");
                    var value = JSON.stringify({ 'htmlBody': 'hi' });
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName + ".formData", "Xml value :", value);
                    fn.elements.push(formData);
                    fn.getArgs = function () {
                        var args = [{
                                value: formData.value,
                                type: 'Json'
                            }];
                        return args;
                    };
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox", "makeEwsRequestAsync");
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName + ".xmlValue", "Xml value :", "<?xml version=\"1.0\" encoding=\"utf-8\"?>");
                    fn.elements.push(formData);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox", "convertToLocalClientTime");
                    var timeValue = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".timeValue", "Time value :", Date.now().toString());
                    fn.elements.push(timeValue);
                    fn.getArgs = function () {
                        var args = [{
                                value: timeValue.value,
                                type: 'Datetime'
                            }];
                        return args;
                    };
                    return fn;
                },
                function () {
                    return (new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item", "getEntities"));
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.body", "setSelectedDataAsync");
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName + ".formData", "Data");
                    var getAsync = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".getAsync", "Coercion type", "text");
                    fn.elements.push(formData, getAsync);
                    fn.getArgs = function () {
                        var args = [formData.value, { coercionType: getAsync.value }];
                        return args;
                    };
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.body", "setAsync");
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName + ".formData", "Data");
                    var getAsync = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".formData", "Coercion type", "text");
                    fn.elements.push(formData, getAsync);
                    fn.getArgs = function () {
                        var args = [formData.value, { coercionType: getAsync.value }];
                        return args;
                    };
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.body", "prependAsync");
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName + ".formData", "Data");
                    var getAsync = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".formData", "Coercion type", "text");
                    fn.elements.push(formData, getAsync);
                    fn.getArgs = function () {
                        var args = [formData.value, { coercionType: getAsync.value }];
                        return args;
                    };
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.body", "getTypeAsync");
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.body", "getAsync");
                    var getAsync = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".getAsync", "Coercion type", "text");
                    fn.elements.push(getAsync);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item", "getEntitiesByType");
                    var entityType = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".entityType", "Office.MailboxEnums.EntityType");
                    fn.elements.push(entityType);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item", "getFilteredEntitiesByName");
                    var entityType = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".getFilteredEntitiesByName", "Entity name");
                    fn.elements.push(entityType);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item", "saveAsync");
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item", "addFileAttachmentAsync");
                    var uri = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".uri", "Uri");
                    var attachmentName = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".apiVersion", "Attachment name");
                    fn.elements.push(uri, attachmentName);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item", "removeAttachmentAsync");
                    var id = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".removeAttachmentAsync", "id");
                    fn.elements.push(id);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.notificationMessages", "getAllAsync");
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.notificationMessages", "addAsync");
                    var key = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".notificationMessages.addAsync.key", "key");
                    var jsonMessage = JSON.stringify({ type: "progressIndicator", message: "Processing the message ..." });
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName + ".notificationMessages.addAsync.json", "JSON message", jsonMessage);
                    fn.getArgs = function () {
                        var args = [key.value,
                            {
                                value: formData.value,
                                type: 'Json'
                            }];
                        return args;
                    };
                    fn.elements.push(key, formData);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.notificationMessages", "removeAsync");
                    var id = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + "notificationMessages.removeAsync", "key");
                    fn.elements.push(id);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.notificationMessages", "replaceAsync");
                    var key = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName + ".notificationMessages.replaceAsync.key", "key");
                    var jsonMessage = JSON.stringify({ type: "informationalMessage", message: "The message was processed successfuly", icon: "iconid", persistent: false });
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName + ".notificationMessages.replaceAsync.json", "JSON message", jsonMessage);
                    fn.getArgs = function () {
                        var args = [key.value,
                            {
                                value: formData.value,
                                type: 'Json'
                            }];
                        return args;
                    };
                    fn.elements.push(key, formData);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.to", "getAsync");
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.to", "addAsync");
                    var newRecipients = [
                        {
                            "displayName": "Allie Bellew",
                            "emailAddress": "allieb@contoso.com"
                        },
                        {
                            "displayName": "Alex Darrow",
                            "emailAddress": "alexd@contoso.com"
                        }
                    ];
                    var recipientsMessage = JSON.stringify(newRecipients);
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName, "Recipients", recipientsMessage);
                    fn.getArgs = function () {
                        var args = [
                            {
                                value: formData.value,
                                type: 'Json'
                            }];
                        return args;
                    };
                    fn.elements.push(formData);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.to", "setAsync");
                    var newRecipients = [
                        {
                            "displayName": "Allie Bellew",
                            "emailAddress": "allieb@contoso.com"
                        },
                        {
                            "displayName": "Alex Darrow",
                            "emailAddress": "alexd@contoso.com"
                        }
                    ];
                    var recipientsMessage = JSON.stringify(newRecipients);
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName, "Recipients", recipientsMessage);
                    fn.getArgs = function () {
                        var args = [
                            {
                                value: formData.value,
                                type: 'Json'
                            }];
                        return args;
                    };
                    fn.elements.push(formData);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.cc", "getAsync");
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.cc", "addAsync");
                    var newRecipients = [
                        {
                            "displayName": "Allie Bellew",
                            "emailAddress": "allieb@contoso.com"
                        },
                        {
                            "displayName": "Alex Darrow",
                            "emailAddress": "alexd@contoso.com"
                        }
                    ];
                    var recipientsMessage = JSON.stringify(newRecipients);
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName, "Recipients", recipientsMessage);
                    fn.getArgs = function () {
                        var args = [
                            {
                                value: formData.value,
                                type: 'Json'
                            }];
                        return args;
                    };
                    fn.elements.push(formData);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.cc", "setAsync");
                    var newRecipients = [
                        {
                            "displayName": "Allie Bellew",
                            "emailAddress": "allieb@contoso.com"
                        },
                        {
                            "displayName": "Alex Darrow",
                            "emailAddress": "alexd@contoso.com"
                        }
                    ];
                    var recipientsMessage = JSON.stringify(newRecipients);
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName, "Recipients", recipientsMessage);
                    fn.getArgs = function () {
                        var args = [
                            {
                                value: formData.value,
                                type: 'Json'
                            }];
                        return args;
                    };
                    fn.elements.push(formData);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.bcc", "getAsync");
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.bcc", "addAsync");
                    var newRecipients = [
                        {
                            "displayName": "Allie Bellew",
                            "emailAddress": "allieb@contoso.com"
                        },
                        {
                            "displayName": "Alex Darrow",
                            "emailAddress": "alexd@contoso.com"
                        }
                    ];
                    var recipientsMessage = JSON.stringify(newRecipients);
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName, "Recipients", recipientsMessage);
                    fn.getArgs = function () {
                        var args = [
                            {
                                value: formData.value,
                                type: 'Json'
                            }];
                        return args;
                    };
                    fn.elements.push(formData);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.bcc", "setAsync");
                    var newRecipients = [
                        {
                            "displayName": "Allie Bellew",
                            "emailAddress": "allieb@contoso.com"
                        },
                        {
                            "displayName": "Alex Darrow",
                            "emailAddress": "alexd@contoso.com"
                        }
                    ];
                    var recipientsMessage = JSON.stringify(newRecipients);
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName, "Recipients", recipientsMessage);
                    fn.getArgs = function () {
                        var args = [
                            {
                                value: formData.value,
                                type: 'Json'
                            }];
                        return args;
                    };
                    fn.elements.push(formData);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.requiredAttendees", "getAsync");
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.requiredAttendees", "addAsync");
                    var newRecipients = [
                        {
                            "displayName": "Allie Bellew",
                            "emailAddress": "allieb@contoso.com"
                        },
                        {
                            "displayName": "Alex Darrow",
                            "emailAddress": "alexd@contoso.com"
                        }
                    ];
                    var recipientsMessage = JSON.stringify(newRecipients);
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName, "Recipients", recipientsMessage);
                    fn.getArgs = function () {
                        var args = [
                            {
                                value: formData.value,
                                type: 'Json'
                            }];
                        return args;
                    };
                    fn.elements.push(formData);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.requiredAttendees", "setAsync");
                    var newRecipients = [
                        {
                            "displayName": "Allie Bellew",
                            "emailAddress": "allieb@contoso.com"
                        },
                        {
                            "displayName": "Alex Darrow",
                            "emailAddress": "alexd@contoso.com"
                        }
                    ];
                    var recipientsMessage = JSON.stringify(newRecipients);
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName, "Recipients", recipientsMessage);
                    fn.getArgs = function () {
                        var args = [
                            {
                                value: formData.value,
                                type: 'Json'
                            }];
                        return args;
                    };
                    fn.elements.push(formData);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.optionalAttendees", "getAsync");
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.optionalAttendees", "addAsync");
                    var newRecipients = [
                        {
                            "displayName": "Allie Bellew",
                            "emailAddress": "allieb@contoso.com"
                        },
                        {
                            "displayName": "Alex Darrow",
                            "emailAddress": "alexd@contoso.com"
                        }
                    ];
                    var recipientsMessage = JSON.stringify(newRecipients);
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName, "Recipients", recipientsMessage);
                    fn.getArgs = function () {
                        var args = [
                            {
                                value: formData.value,
                                type: 'Json'
                            }];
                        return args;
                    };
                    fn.elements.push(formData);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.optionalAttendees", "setAsync");
                    var newRecipients = [
                        {
                            "displayName": "Allie Bellew",
                            "emailAddress": "allieb@contoso.com"
                        },
                        {
                            "displayName": "Alex Darrow",
                            "emailAddress": "alexd@contoso.com"
                        }
                    ];
                    var recipientsMessage = JSON.stringify(newRecipients);
                    var formData = VORLON.OfficeTools.CreateTextArea(fn.fullpathName, "Recipients", recipientsMessage);
                    fn.getArgs = function () {
                        var args = [
                            {
                                value: formData.value,
                                type: 'Json'
                            }];
                        return args;
                    };
                    fn.elements.push(formData);
                    return fn;
                }, function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.roamingSettings", "get");
                    var id = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName, "key");
                    fn.elements.push(id);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.roamingSettings", "remove");
                    var id = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName, "key");
                    fn.elements.push(id);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.roamingSettings", "set");
                    var id = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName, "key");
                    var value = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName, "value");
                    fn.elements.push(id, value);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.roamingSettings", "saveAsync");
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.subject", "getAsync");
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.subject", "setAsync");
                    var id = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName, "Subject");
                    fn.elements.push(id);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.start", "getAsync");
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.start", "setAsync");
                    var timeValue = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName, "UTC Datetime");
                    fn.getArgs = function () {
                        var args = [{
                                value: timeValue.value,
                                type: 'Datetime'
                            }];
                        return args;
                    };
                    fn.elements.push(timeValue);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.end", "getAsync");
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.end", "setAsync");
                    var timeValue = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName, "UTC Datetime");
                    fn.getArgs = function () {
                        var args = [{
                                value: timeValue.value,
                                type: 'Datetime'
                            }];
                        return args;
                    };
                    fn.elements.push(timeValue);
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.location", "getAsync");
                    return fn;
                },
                function () {
                    var fn = new VORLON.OfficeFunction(_this.dashboardPlugin, "window.Office.context.mailbox.item.location", "setAsync");
                    var id = VORLON.OfficeTools.CreateTextBlock(fn.fullpathName, "Location");
                    fn.elements.push(id);
                    return fn;
                }
            ];
            this.dashboardPlugin = dashboardPlugin;
        }
        OfficeOutlook.prototype.execute = function () {
            VORLON.OfficeTools.AddZone("window.Office.context.mailbox.item", "to");
            VORLON.OfficeTools.AddZone("window.Office.context.mailbox.item", "bcc");
            VORLON.OfficeTools.AddZone("window.Office.context.mailbox.item", "cc");
            VORLON.OfficeTools.AddZone("window.Office.context.mailbox.item", "optionalAttendees");
            VORLON.OfficeTools.AddZone("window.Office.context.mailbox.item", "requiredAttendees");
            VORLON.OfficeTools.AddZone("window.Office.context.mailbox.item", "subject");
            VORLON.OfficeTools.AddZone("window.Office.context.mailbox.item", "body");
            VORLON.OfficeTools.AddZone("window.Office.context.mailbox.item", "start");
            VORLON.OfficeTools.AddZone("window.Office.context.mailbox.item", "end");
            VORLON.OfficeTools.AddZone("window.Office.context.mailbox.item", "location");
            VORLON.OfficeTools.AddZone("window.Office.context.mailbox.item", "notificationMessages");
            VORLON.OfficeTools.AddZone("window.Office.context", "roamingSettings");
            this.apis.forEach(function (api) {
                api().addTree();
            });
        };
        return OfficeOutlook;
    }());
    VORLON.OfficeOutlook = OfficeOutlook;
})(VORLON || (VORLON = {}));

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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var $;
var VORLON;
(function (VORLON) {
    var OfficeDashboard = (function (_super) {
        __extends(OfficeDashboard, _super);
        //Do any setup you need, call super to configure
        //the plugin with html and css for the dashboard
        function OfficeDashboard() {
            //     name   ,  html for dash   css for dash
            _super.call(this, "office", "control.html", "control.css");
            this._ready = true;
            this.mailFunctions = new VORLON.OfficeOutlook(this);
            this.documentFunctions = new VORLON.OfficeDocument(this);
            this.pptxFunctions = new VORLON.OfficePowerPoint(this);
        }
        //Return unique id for your plugin
        OfficeDashboard.prototype.getID = function () {
            return "OFFICE";
        };
        // This code will run on the dashboard //////////////////////
        // Start dashboard code
        // uses _insertHtmlContentAsync to insert the control.html content
        // into the dashboard
        OfficeDashboard.prototype.startDashboardSide = function (div) {
            var _this = this;
            if (div === void 0) { div = null; }
            this._insertHtmlContentAsync(div, function (filledDiv) {
                _this._filledDiv = filledDiv;
                _this._treeDiv = filledDiv.querySelector('#treeViewObj');
                _this.refreshButton = _this._filledDiv.querySelector('x-action[event="refresh"]');
                _this.treeviewwrapper = _this._filledDiv.querySelector('.tree-view-wrapper');
                _this.officetypeapp = _this._filledDiv.querySelector('#office-type-app');
                _this.officePropertiesTitle = _this._filledDiv.querySelector("#office-properties-title");
                _this.officePropertiesSection = _this._filledDiv.querySelector("#office-properties");
                _this.clearTreeview();
                _this._filledDiv.addEventListener('refresh', function () {
                    _this.clearTreeview();
                    _this.sendToClient({ type: "query", name: "Office" });
                    _this.sendToClient({ type: 'officetype' });
                });
                var _pluginContainer = $(filledDiv).parent();
                _pluginContainer.on("vorlon.plugins.active", function () {
                    var container = $('.office-container');
                    container.split({
                        orientation: 'vertical',
                        limit: 50,
                        position: '70%'
                    });
                });
                // $("#accordion h3", this._filledDiv).click((elt) => {
                //     $('.visible', elt.target.parentElement).removeClass('visible');
                //     $('#' + elt.target.className, elt.target.parentElement).addClass('visible');
                //     elt.target.classList.add('visible');
                // });
                _this.sendToClient({ type: 'officetype' });
            });
        };
        OfficeDashboard.prototype.update = function (remoteOffice) {
            this.constructTree(remoteOffice.value, this._treeDiv);
            if (remoteOffice.name === "Office") {
                this.sendToClient({ type: "query", name: "OfficeExt" });
                if (this.officetype.officeType == "Outlook") {
                    this.mailFunctions.execute();
                }
                else if (this.officetype.officeType == "PowerPoint") {
                    this.pptxFunctions.execute();
                }
                else {
                    this.sendToClient({ type: "query", name: "OfficeExtension" });
                    this.sendToClient({ type: "query", name: "Excel" });
                    this.sendToClient({ type: "query", name: "Word" });
                    this.documentFunctions.execute();
                }
            }
        };
        OfficeDashboard.prototype.clearTreeview = function () {
            while (this._treeDiv.hasChildNodes()) {
                this._treeDiv.removeChild(this._treeDiv.lastChild);
            }
        };
        OfficeDashboard.prototype.constructTree = function (currentObj, parent) {
            var _this = this;
            if (currentObj.properties === undefined || currentObj.properties.length === 0)
                return;
            // root of all
            var elt = new VORLON.FluentDOM('DIV', 'objdescriptor', parent);
            // Create the div for the current path
            elt.append('DIV', 'expandable expanded', function (zone) {
                var btn;
                zone.attr("id", currentObj.fullpath);
                // create the div containing both sigle (+ or -) and the label
                zone.append('DIV', 'expand', function (container) {
                    btn = container.createChild("SPAN", "expand-btn").text("-");
                    btn.click(function (arg) {
                        arg.stopPropagation();
                        VORLON.Tools.ToggleClass(zone.element, "expanded", function (expanded) {
                            expanded ? btn.text("-") : btn.text("+");
                        });
                    });
                    container.createChild("SPAN", "expand-label").text(currentObj.name);
                    if (currentObj.value !== undefined) {
                        container.createChild("SPAN", "prop-value").text(currentObj.value);
                    }
                });
                // add the childs
                if (currentObj.properties !== undefined) {
                    zone.append("DIV", "expand-content", function (itemsContainer) {
                        for (var i in currentObj.properties) {
                            var p = currentObj.properties[i];
                            if (p.properties !== undefined) {
                                _this.constructTree(p, itemsContainer.element);
                            }
                            else {
                                itemsContainer.append("DIV", "obj-method", function (methodItem) {
                                    methodItem.createChild("SPAN", "prop-name").text(p.name);
                                    methodItem.createChild("SPAN", "prop-value").text(p.value);
                                    methodItem.element.tag = p;
                                    methodItem.click(function (arg) {
                                        arg.stopPropagation();
                                        VORLON.OfficeTools.ShowProperty(arg.target.parentElement.tag);
                                    });
                                });
                            }
                        }
                    });
                }
            });
        };
        // When we get a message from the client, just show it
        OfficeDashboard.prototype.onRealtimeMessageReceivedFromClientSide = function (r) {
            if (r.type === 'object') {
                this.update(r);
            }
            else if (r.type === 'function') {
                VORLON.OfficeTools.ShowFunctionResult(r);
            }
            else if (r.type === 'officetype') {
                this.officetype = VORLON.OfficeTools.GetOfficeType(r.value.officeType);
                this.treeviewwrapper.style.background = this.officetype.background;
                var officeTypeText = this.officetype.officeType ? this.officetype.officeType : "Office";
                officeTypeText += this.officetype.version ? officeTypeText + " " + this.officetype.version : "";
                this.officetypeapp.innerHTML = officeTypeText;
                this.sendToClient({ type: "query", name: "Office" });
            }
            else if (r.type === 'error') {
                VORLON.OfficeTools.ShowFunctionResult(r);
            }
        };
        return OfficeDashboard;
    }(VORLON.DashboardPlugin));
    VORLON.OfficeDashboard = OfficeDashboard;
    //Register the plugin with vorlon core
    VORLON.Core.RegisterDashboardPlugin(new OfficeDashboard());
})(VORLON || (VORLON = {}));
