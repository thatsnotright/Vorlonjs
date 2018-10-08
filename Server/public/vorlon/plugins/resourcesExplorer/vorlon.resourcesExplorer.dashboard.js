var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VORLON;
(function (VORLON) {
    var ResourcesExplorerDashboard = (function (_super) {
        __extends(ResourcesExplorerDashboard, _super);
        function ResourcesExplorerDashboard() {
            _super.call(this, "resourcesExplorer", "control.html", "control.css", "control.js");
            this._ready = false;
            this._id = "RESOURCES";
            //this.debug = true;
        }
        ResourcesExplorerDashboard.prototype.startDashboardSide = function (div) {
            var _this = this;
            if (div === void 0) { div = null; }
            this._insertHtmlContentAsync(div, function (filledDiv) {
                _this._containerDiv = filledDiv;
                _this._containerLocalStorage = VORLON.Tools.QuerySelectorById(div, "localStorageTable");
                _this._containerSessionStorage = VORLON.Tools.QuerySelectorById(div, "sessionStorageTable");
                _this._containerCookies = VORLON.Tools.QuerySelectorById(div, "cookiesTable");
                _this.toogleMenu();
                _this.searchResource();
                _this.buttonEvent();
                _this.addResource();
                _this.removeResource();
                _this.updateResource();
                _this._ready = true;
            });
        };
        ResourcesExplorerDashboard.prototype.searchResource = function () {
            $("#searchlist").keyup(function () {
                var value = this.value.toLowerCase();
                $(".table-resources").find("tr").each(function (index) {
                    if (!index || $(this).hasClass('trHead'))
                        return;
                    var id = $(this).find("td").eq(1).text().toLowerCase();
                    $(this).toggle(id.indexOf(value) !== -1);
                });
            });
        };
        ResourcesExplorerDashboard.prototype.addResource = function () {
            var _that = this;
            $('.new-entry-localstorage input').keypress(function (e) {
                if (e.which == 13) {
                    var key = $('.new-entry-localstorage').find('.new-key-localstorage');
                    var value = $('.new-entry-localstorage').find('.new-value-localstorage');
                    _that.sendCommandToClient('order', {
                        order: "localStorage.setItem('" + key.val() + "', '" + value.val() + "')"
                    });
                    key.val('');
                    value.val('');
                    _that.sendCommandToClient('refresh');
                    $('.new-entry').fadeOut();
                }
            });
            $('.new-entry-sessionstorage input').keypress(function (e) {
                if (e.which == 13) {
                    var key = $('.new-entry-sessionstorage').find('.new-key-sessionstorage');
                    var value = $('.new-entry-sessionstorage').find('.new-value-sessionstorage');
                    _that.sendCommandToClient('order', {
                        order: "sessionStorage.setItem('" + key.val() + "', '" + value.val() + "')"
                    });
                    key.val('');
                    value.val('');
                    _that.sendCommandToClient('refresh');
                    $('.new-entry').fadeOut();
                }
            });
            $('.new-entry-cookies input').keypress(function (e) {
                if (e.which == 13) {
                    var key = $('.new-entry-cookies').find('.new-key-cookies');
                    var value = $('.new-entry-cookies').find('.new-value-cookies');
                    _that.sendCommandToClient('order', {
                        order: "document.cookie='" + key.val() + "=" + value.val() + "';"
                    });
                    key.val('');
                    value.val('');
                    _that.sendCommandToClient('refresh');
                    $('.new-entry').fadeOut();
                }
            });
        };
        ResourcesExplorerDashboard.prototype.removeResource = function () {
            var _that = this;
            $('#localStorageTable').on('click', '.actionClass', function () {
                var key = $(this).next('td').text();
                _that.sendCommandToClient('order', {
                    order: "localStorage.removeItem('" + key + "')"
                });
                $(this).parent().remove();
            });
            $('#sessionStorageTable').on('click', '.actionClass', function () {
                var key = $(this).next('td').text();
                _that.sendCommandToClient('order', {
                    order: "sessionStorage.removeItem('" + key + "')"
                });
                $(this).parent().remove();
            });
            $('#cookiesTable').on('click', '.actionClass', function () {
                var key = $(this).next('td').text();
                _that.sendCommandToClient('order', {
                    order: "document.cookie='" + key + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';"
                });
                $(this).parent().remove();
            });
        };
        ResourcesExplorerDashboard.prototype.updateResource = function () {
            var _that = this;
            $('.table-resources-localStorage').on('change', function (evt, newValue) {
                if ($(evt.target).hasClass('keyClass')) {
                    var key = $(evt.target).data('key');
                    _that.sendCommandToClient('order', {
                        order: "localStorage.setItem('" + newValue + "', localStorage.getItem('" + key + "')); localStorage.removeItem('" + key + "');"
                    });
                    $(evt.target).data('key', newValue);
                }
                else {
                    var key = $(evt.target).prev('td').text();
                    _that.sendCommandToClient('order', {
                        order: "localStorage.setItem('" + key + "', '" + newValue + "')"
                    });
                }
            });
            $('.table-resources-sessionStorage').on('change', function (evt, newValue) {
                if ($(evt.target).hasClass('keyClass')) {
                    var key = $(evt.target).data('key');
                    _that.sendCommandToClient('order', {
                        order: "sessionStorage.setItem('" + newValue + "', sessionStorage.getItem('" + key + "')); sessionStorage.removeItem('" + key + "');"
                    });
                    $(evt.target).data('key', newValue);
                }
                else {
                    var key = $(evt.target).prev('td').text();
                    _that.sendCommandToClient('order', {
                        order: "sessionStorage.setItem('" + key + "', '" + newValue + "')"
                    });
                }
            });
            $('.table-resources-cookies').on('change', function (evt, newValue) {
                if ($(evt.target).hasClass('keyClass')) {
                    var key = $(evt.target).data('key');
                    var value = $(evt.target).next('td').text();
                    _that.sendCommandToClient('order', {
                        order: "document.cookie='" + key + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';"
                    });
                    _that.sendCommandToClient('order', {
                        order: "document.cookie='" + newValue + "=" + value + "';"
                    });
                    $(evt.target).data('key', newValue);
                }
                else {
                    var key = $(evt.target).prev('td').text();
                    _that.sendCommandToClient('order', {
                        order: "document.cookie='" + key + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';"
                    });
                    _that.sendCommandToClient('order', {
                        order: "document.cookie='" + key + "=" + newValue + "';"
                    });
                }
            });
        };
        ResourcesExplorerDashboard.prototype.buttonEvent = function () {
            var _this = this;
            $('.refresh').click(function () {
                _this.sendCommandToClient('refresh');
            });
            $('.add-value').click(function () {
                if ($('.new-entry').is(':visible')) {
                    $('.new-entry').fadeOut();
                }
                else {
                    $("#treeView2").animate({ scrollTop: $('#treeView2').height() }, 1000);
                    $('.new-entry').fadeIn();
                }
            });
        };
        ResourcesExplorerDashboard.prototype.toogleMenu = function () {
            $('.open-menu').click(function () {
                $('.open-menu').removeClass('active-menu');
                $('#searchlist').val('');
                $('.explorer-menu').hide();
                $('#' + $(this).data('menu')).show();
                $('.new-entry').fadeOut();
                $(this).addClass('active-menu');
            });
        };
        ResourcesExplorerDashboard.prototype.processEntries = function (receivedObject) {
            if (!this._containerLocalStorage) {
                console.warn("ResourcesExplorer dashboard receive client message but is not ready");
                return;
            }
            this._containerLocalStorage.innerHTML = "";
            this._containerSessionStorage.innerHTML = "";
            this._containerCookies.innerHTML = "";
            if (!receivedObject)
                return;
            if (receivedObject.localStorageList) {
                for (var i = 0; i < receivedObject.localStorageList.length; i++) {
                    var tr = document.createElement('tr');
                    var tdKey = document.createElement('td');
                    var tdValue = document.createElement('td');
                    var tdAction = document.createElement('td');
                    tdKey.className += " keyClass";
                    tdKey.dataset['key'] = receivedObject.localStorageList[i].key;
                    tdValue.className += " valueClass";
                    tdAction.className += " actionClass";
                    tdKey.innerHTML = receivedObject.localStorageList[i].key;
                    tdValue.innerHTML = receivedObject.localStorageList[i].value;
                    tdAction.innerHTML = '<i class="fa fa-times"></i>';
                    tr.appendChild(tdAction);
                    tr.appendChild(tdKey);
                    tr.appendChild(tdValue);
                    this._containerLocalStorage.appendChild(tr);
                }
                $('.table-resources-localStorage').editableTableWidget({ editor: $('<textarea>') });
            }
            if (receivedObject.cookiesList) {
                for (var i = 0; i < receivedObject.cookiesList.length; i++) {
                    var tr = document.createElement('tr');
                    var tdKey = document.createElement('td');
                    var tdValue = document.createElement('td');
                    var tdAction = document.createElement('td');
                    tdKey.className += " keyClass";
                    tdKey.dataset['key'] = receivedObject.cookiesList[i].key;
                    tdValue.className += " valueClass";
                    tdAction.className += " actionClass";
                    tdKey.innerHTML = receivedObject.cookiesList[i].key;
                    tdValue.innerHTML = receivedObject.cookiesList[i].value;
                    tdAction.innerHTML = '<i class="fa fa-times"></i>';
                    tr.appendChild(tdAction);
                    tr.appendChild(tdKey);
                    tr.appendChild(tdValue);
                    this._containerCookies.appendChild(tr);
                }
                $('.table-resources-cookies').editableTableWidget({ editor: $('<textarea>') });
            }
            if (receivedObject.sessionStorageList) {
                for (var i = 0; i < receivedObject.sessionStorageList.length; i++) {
                    var tr = document.createElement('tr');
                    var tdKey = document.createElement('td');
                    var tdValue = document.createElement('td');
                    var tdAction = document.createElement('td');
                    tdKey.className += " keyClass";
                    tdKey.dataset['key'] = receivedObject.sessionStorageList[i].key;
                    tdValue.className += " valueClass";
                    tdAction.className += " actionClass";
                    tdKey.innerHTML = receivedObject.sessionStorageList[i].key;
                    tdValue.innerHTML = receivedObject.sessionStorageList[i].value;
                    tdAction.innerHTML = '<i class="fa fa-times"></i>';
                    tr.appendChild(tdAction);
                    tr.appendChild(tdKey);
                    tr.appendChild(tdValue);
                    this._containerSessionStorage.appendChild(tr);
                }
                $('.table-resources-sessionStorage').editableTableWidget({ editor: $('<textarea>') });
            }
        };
        return ResourcesExplorerDashboard;
    }(VORLON.DashboardPlugin));
    VORLON.ResourcesExplorerDashboard = ResourcesExplorerDashboard;
    ResourcesExplorerDashboard.prototype.DashboardCommands = {
        resourceitems: function (data) {
            var plugin = this;
            plugin.processEntries(data);
        }
    };
    //Register the plugin with vorlon core 
    VORLON.Core.RegisterDashboardPlugin(new ResourcesExplorerDashboard());
})(VORLON || (VORLON = {}));
