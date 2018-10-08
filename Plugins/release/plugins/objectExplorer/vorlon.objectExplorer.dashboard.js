var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VORLON;
(function (VORLON) {
    var ObjectExplorerDashboard = (function (_super) {
        __extends(ObjectExplorerDashboard, _super);
        function ObjectExplorerDashboard() {
            _super.call(this, "objectExplorer", "control.html", "control.css");
            this._id = "OBJEXPLORER";
            this._ready = false;
            this._contentCallbacks = {};
        }
        ObjectExplorerDashboard.prototype.startDashboardSide = function (div) {
            var _this = this;
            if (div === void 0) { div = null; }
            this._dashboardDiv = div;
            this._insertHtmlContentAsync(this._dashboardDiv, function (filledDiv) {
                _this._containerDiv = filledDiv;
                _this._filterInput = _this._containerDiv.querySelector("#txtFilter");
                _this._searchBoxInput = _this._containerDiv.querySelector("#txtPropertyName");
                _this._searchBtn = _this._containerDiv.querySelector("#btnSearchProp");
                _this._searchUpBtn = _this._containerDiv.querySelector("#btnSearchUp");
                _this._treeDiv = _this._containerDiv.querySelector("#treeViewObj");
                _this._addLoader();
                _this._searchBtn.onclick = function () {
                    var path = _this._searchBoxInput.value;
                    if (path) {
                        _this.setCurrent(path);
                    }
                };
                _this._searchUpBtn.onclick = function () {
                    var path = _this._searchBoxInput.value;
                    if (path) {
                        var tokens = path.split('.');
                        if (tokens.length > 1) {
                            tokens.splice(tokens.length - 1, 1);
                            _this.setCurrent(tokens.join('.'));
                        }
                    }
                };
                _this._searchBoxInput.addEventListener("keydown", function (evt) {
                    if (evt.keyCode === 13 || evt.keyCode === 9) {
                        var path = _this._searchBoxInput.value;
                        if (path) {
                            _this.setCurrent(path);
                        }
                    }
                });
                _this._filterInput.addEventListener("input", function (evt) {
                    //setTimeout(function(){});
                    _this.filter();
                });
                _this._ready = true;
            });
        };
        ObjectExplorerDashboard.prototype._addLoader = function () {
            var loader = document.createElement("div");
            loader.className = "loader";
            loader.innerHTML = '<span class="fa fa-spinner fa-spin"></span> loading...';
            this._treeDiv.appendChild(loader);
        };
        ObjectExplorerDashboard.prototype.setCurrent = function (path) {
            if (path !== this._currentPropertyPath)
                this._filterInput.value = '';
            this._searchBoxInput.value = path;
            this._currentPropertyPath = path;
            this.queryObjectContent(this._currentPropertyPath);
            this._empty();
            this._treeDiv.scrollTop = 0;
            this._addLoader();
        };
        ObjectExplorerDashboard.prototype.filter = function () {
            var path = this._filterInput.value.toLowerCase();
            var items = this._treeDiv.querySelectorAll("[data-propname]");
            for (var index = 0, l = items.length; index < l; index++) {
                var node = items[index];
                var propname = node.getAttribute('data-propname');
                if (!propname || !path) {
                    node.style.display = '';
                }
                else {
                    if (propname.indexOf(path) >= 0) {
                        node.style.display = '';
                    }
                    else {
                        node.style.display = 'none';
                    }
                }
            }
        };
        ObjectExplorerDashboard.prototype.queryObjectContent = function (objectPath) {
            this.sendCommandToClient("query", { path: objectPath });
        };
        ObjectExplorerDashboard.prototype._sortedList = function (list) {
            if (list && list.length) {
                return list.sort(function (a, b) {
                    var lowerAName = a.name.toLowerCase();
                    var lowerBName = b.name.toLowerCase();
                    if (lowerAName > lowerBName)
                        return 1;
                    if (lowerAName < lowerBName)
                        return -1;
                    return 0;
                });
            }
            return [];
        };
        ObjectExplorerDashboard.prototype._render = function (tagname, parentNode, classname, value) {
            var elt = document.createElement(tagname);
            elt.className = classname || '';
            if (value)
                elt.innerHTML = value;
            parentNode.appendChild(elt);
            return elt;
        };
        ObjectExplorerDashboard.prototype._empty = function () {
            while (this._treeDiv.hasChildNodes()) {
                this._treeDiv.removeChild(this._treeDiv.lastChild);
            }
        };
        ObjectExplorerDashboard.prototype.onRealtimeMessageReceivedFromClientSide = function (receivedObject) {
        };
        ObjectExplorerDashboard.prototype.setRoot = function (obj) {
            this._searchBoxInput.value = obj.fullpath;
            this._currentPropertyPath = obj.fullpath;
            if (this.root) {
                this.root.dispose();
                this.root = null;
            }
            this._empty();
            this.root = new ObjDescriptorControl(this, this._treeDiv, obj, true);
        };
        ObjectExplorerDashboard.prototype.setContent = function (obj) {
            if (this.root) {
                this.root.setContent(obj);
            }
        };
        return ObjectExplorerDashboard;
    }(VORLON.DashboardPlugin));
    VORLON.ObjectExplorerDashboard = ObjectExplorerDashboard;
    var ObjDescriptorControl = (function () {
        function ObjDescriptorControl(plugin, parent, item, isRoot) {
            if (isRoot === void 0) { isRoot = false; }
            var elt = new VORLON.FluentDOM('DIV', 'objdescriptor', parent);
            this.element = elt.element;
            this.isRoot = isRoot;
            this.element.__vorlon = this;
            this.item = item;
            this.plugin = plugin;
            this.childs = [];
            this.render(elt);
        }
        ObjDescriptorControl.prototype.clear = function () {
            if (this.childs) {
                this.childs.forEach(function (c) {
                    c.dispose();
                });
                this.childs = [];
            }
            if (this.proto)
                this.proto.dispose();
            this.element.innerHTML = "";
        };
        ObjDescriptorControl.prototype.dispose = function () {
            this.clear();
            this.element.__vorlon = null;
            this.plugin = null;
            this.element = null;
            this.item = null;
        };
        ObjDescriptorControl.prototype.setContent = function (item) {
            if (!item.fullpath)
                return false;
            console.log("checking " + item.fullpath + "/" + this.item.fullpath + " (" + this.childs.length + ")");
            if (item.fullpath == this.item.fullpath) {
                this.item = item;
                this.render();
                return true;
            }
            else {
                if (item.fullpath.indexOf(this.item.fullpath) === 0) {
                    for (var i = 0, l = this.childs.length; i < l; i++) {
                        if (this.childs[i].obj && this.childs[i].obj.setContent(item)) {
                            return true;
                        }
                    }
                }
            }
            if (this.proto && this.proto.setContent(item)) {
                return true;
            }
            return false;
        };
        ObjDescriptorControl.prototype.render = function (elt) {
            var _this = this;
            if (!elt)
                elt = VORLON.FluentDOM.forElement(this.element);
            this.clear();
            if (!this.item) {
                return;
            }
            if (!this.item.contentFetched) {
                if (this.item.type === "notfound") {
                    elt.element.innerHTML = '<div class="loader">Nothing found, please change your filter (or use <b>"window"</b>)...</div>';
                }
                else {
                    elt.element.innerHTML = '<div class="loader"><span class="fa fa-spin fa-spinner"></span> loading content...</div>';
                }
                return;
            }
            if (this.item.proto) {
                elt.append('DIV', 'objdescriptor-prototype expandable', function (protoContainer) {
                    var btn;
                    protoContainer.append("DIV", "expand", function (expandContainer) {
                        btn = expandContainer.createChild("SPAN", "expand-btn").text("+");
                        expandContainer.createChild("SPAN", "expand-label").text("[Prototype]");
                    }).click(function (arg) {
                        arg.stopPropagation();
                        VORLON.Tools.ToggleClass(protoContainer.element, "expanded", function (expanded) {
                            expanded ? btn.text("-") : btn.text("+");
                        });
                    });
                    protoContainer.append("DIV", "expand-content", function (itemsContainer) {
                        _this.proto = new ObjDescriptorControl(_this.plugin, itemsContainer.element, _this.item.proto);
                    });
                });
            }
            if (this.item.functions && this.item.functions.length) {
                elt.append('DIV', 'objdescriptor-methods expandable', function (methodsContainer) {
                    var btn;
                    methodsContainer.append("DIV", "expand", function (expandContainer) {
                        btn = expandContainer.createChild("SPAN", "expand-btn").text("+");
                        expandContainer.createChild("SPAN", "expand-label").text("[Methods]");
                    }).click(function (arg) {
                        arg.stopPropagation();
                        VORLON.Tools.ToggleClass(methodsContainer.element, "expanded", function (expanded) {
                            expanded ? btn.text("-") : btn.text("+");
                        });
                    });
                    methodsContainer.append("DIV", "expand-content", function (itemsContainer) {
                        _this.item.functions.forEach(function (p) {
                            itemsContainer.append("DIV", "obj-method", function (methodItem) {
                                if (_this.isRoot)
                                    methodItem.attr("data-propname", (_this.item.fullpath + "." + p.name).toLowerCase());
                                methodItem.createChild("SPAN", "method-name").text(p.name);
                            });
                        });
                    });
                });
            }
            if (this.item.properties && this.item.properties.length) {
                elt.append('DIV', 'objdescriptor-properties', function (propertiesContainer) {
                    _this.item.properties.forEach(function (p) {
                        var propctrl = new ObjPropertyControl(_this.plugin, propertiesContainer.element, p, _this.item, _this.isRoot);
                        _this.childs.push(propctrl);
                    });
                });
            }
        };
        ObjDescriptorControl.prototype.getContent = function () {
            this.plugin.sendCommandToClient("queryContent", { path: this.item.fullpath });
        };
        return ObjDescriptorControl;
    }());
    var ObjFunctionControl = (function () {
        function ObjFunctionControl() {
        }
        return ObjFunctionControl;
    }());
    var ObjPropertyControl = (function () {
        function ObjPropertyControl(plugin, parent, prop, parentObj, isRoot) {
            this.isRoot = false;
            this.plugin = plugin;
            this.parent = parent;
            this.parentObj = parentObj;
            this.prop = prop;
            this.isRoot = isRoot;
            this.element = new VORLON.FluentDOM("DIV", "property", parent);
            if (prop.type !== "object") {
                this.renderValueProperty();
            }
            else {
                this.renderObjectProperty();
            }
        }
        ObjPropertyControl.prototype.dispose = function () {
            this.plugin = null;
            this.parentObj = null;
            this.parent = null;
            this.prop = null;
            if (this.obj) {
                this.obj.dispose();
                this.obj = null;
            }
        };
        ObjPropertyControl.prototype.renderValueProperty = function () {
            if (this.isRoot)
                this.element.attr("data-propname", (this.prop.fullpath + "." + this.prop.name).toLowerCase());
            this.element.createChild("SPAN", "prop-name").text(this.prop.name);
            this.element.createChild("SPAN", "prop-value").text(this.prop.value);
        };
        ObjPropertyControl.prototype.renderObjectProperty = function () {
            var _this = this;
            var btn;
            this.element.addClass("prop-object");
            this.element.addClass("expandable");
            if (this.isRoot)
                this.element.attr("data-propname", (this.prop.fullpath + "." + this.prop.name).toLowerCase());
            this.element.append("DIV", "expand", function (expandContainer) {
                btn = expandContainer.createChild("SPAN", "expand-btn").text("+");
                expandContainer.createChild("SPAN", "expand-label").text(_this.prop.name);
                expandContainer.createChild("SPAN", "makeroot actionicon fa fa-external-link").click(function (arg) {
                    _this.plugin.setCurrent(_this.prop.fullpath);
                    arg.stopPropagation();
                });
            }).click(function (arg) {
                arg.stopPropagation();
                VORLON.Tools.ToggleClass(_this.element.element, "expanded", function (expanded) {
                    if (!expanded) {
                        btn.text("+");
                        return;
                    }
                    btn.text("-");
                    var elt = _this.element.element.querySelector(".expand-content > .objdescriptor");
                    if (elt) {
                        var ctrl = elt.__vorlon;
                        if (ctrl) {
                            setTimeout(function () {
                                ctrl.getContent();
                            }, 0);
                        }
                    }
                });
            });
            this.element.append("DIV", "expand-content", function (itemsContainer) {
                _this.obj = new ObjDescriptorControl(_this.plugin, itemsContainer.element, _this.prop);
            });
        };
        return ObjPropertyControl;
    }());
    ObjectExplorerDashboard.prototype.DashboardCommands = {
        root: function (data) {
            var plugin = this;
            plugin.setRoot(data);
        },
        content: function (data) {
            var plugin = this;
            if (data) {
                plugin.setContent(data);
            }
        }
    };
    // Register
    VORLON.Core.RegisterDashboardPlugin(new ObjectExplorerDashboard());
})(VORLON || (VORLON = {}));
