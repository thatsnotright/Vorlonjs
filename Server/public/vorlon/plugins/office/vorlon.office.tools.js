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
