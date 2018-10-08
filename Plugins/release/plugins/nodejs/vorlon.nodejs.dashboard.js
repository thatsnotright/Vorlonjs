var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VORLON;
(function (VORLON) {
    var NodejsDashboard = (function (_super) {
        __extends(NodejsDashboard, _super);
        //Do any setup you need, call super to configure
        //the plugin with html and css for the dashboard
        function NodejsDashboard() {
            //     name   ,  html for dash   css for dash
            _super.call(this, "nodejs", "control.html", ["control.css", "tree.css"], ["chart.js", "chart-legend.js"]);
            this._ready = true;
            this.__MEGA_BYTE = 1048576;
            console.log('Started');
        }
        //Return unique id for your plugin
        NodejsDashboard.prototype.getID = function () {
            return "NODEJS";
        };
        NodejsDashboard.prototype.startDashboardSide = function (div) {
            var _this = this;
            if (div === void 0) { div = null; }
            this._insertHtmlContentAsync(div, function (filledDiv) {
                var _that = _this;
                _this.toogleMenu();
                _this._time = 5;
                _this._chart = false;
                _this._chart_data = { labels: [0], series: [[0], [0], [0]] };
                _this._set_chart = setInterval(function () {
                    _that.chart();
                }, 500);
                _this.__html = [];
                _this.sendToClient('infos');
                _this.sendToClient('memory');
                _this.sendToClient('modules');
            });
        };
        NodejsDashboard.prototype.chart = function () {
            if (typeof Chartist !== 'object') {
                return;
            }
            this._chart = true;
            clearInterval(this._set_chart);
            console.log('stating chart');
            new Chartist.Line('#memory-chart', this._chart_data, {
                plugins: [
                    Chartist.plugins.legend({
                        legendNames: ['HEAP Used', 'HEAP Total', 'RSS'],
                    })
                ],
                fullWidth: true,
                chartPadding: {
                    right: 40
                },
                axisY: {
                    labelInterpolationFnc: function (value) {
                        return value + 'MB';
                    }
                }
            });
        };
        NodejsDashboard.prototype.jstree = function () {
            $('.tree li').each(function () {
                if ($(this).find('ul').children('li').length > 0) {
                    $(this).addClass('parent');
                }
            });
            $('.tree li.parent > a').click(function () {
                $(this).parent().toggleClass('active');
                $(this).parent().children('ul').slideToggle('fast');
            });
        };
        NodejsDashboard.prototype.toogleMenu = function () {
            $('.plugin-nodejs .open-menu').click(function () {
                $('.plugin-nodejs .open-menu').removeClass('active-menu');
                $('.plugin-nodejs #searchlist').val('');
                $('.plugin-nodejs .explorer-menu').hide();
                $('.plugin-nodejs #' + $(this).data('menu')).show();
                $('.plugin-nodejs .new-entry').fadeOut();
                $(this).addClass('active-menu');
            });
        };
        NodejsDashboard.prototype.renderTree = function (arr) {
            var __that = this;
            __that.__html.push('<ul>');
            $.each(arr, function (i, val) {
                __that.__html.push('<li><a>' + val.text + '</a>');
                if (val.children) {
                    __that.renderTree(val.children);
                }
                __that.__html.push('</li>');
            });
            __that.__html.push('</ul>');
        };
        NodejsDashboard.prototype.buildTree = function (parts, treeNode) {
            if (parts.length === 0) {
                return;
            }
            for (var i = 0; i < treeNode.length; i++) {
                if (parts[0] == treeNode[i].text) {
                    this.buildTree(parts.splice(1, parts.length), treeNode[i].children);
                    return;
                }
            }
            var newNode = { 'text': parts[0], 'children': [] };
            treeNode.push(newNode);
            this.buildTree(parts.splice(1, parts.length), newNode.children);
        };
        NodejsDashboard.prototype.onRealtimeMessageReceivedFromClientSide = function (receivedObject) {
            if (receivedObject.type == 'modules') {
                var list = receivedObject.data;
                var data = [];
                for (var i = 0; i < list.length; i++) {
                    list[i] = list[i].split("\\");
                    for (var z = 0; z < list[i].length; z++) {
                        if (list[i][z] == 'node_modules') {
                            list[i].splice(0, z);
                            break;
                        }
                    }
                    this.buildTree(list[i], data);
                }
                this.renderTree(data);
                $('#jstree').append(this.__html.join(''));
                this.jstree();
            }
            if (receivedObject.type == 'infos') {
                for (var k in receivedObject.data) {
                    $('.infos-' + k).append(receivedObject.data[k]);
                }
                var icon = '';
                switch (receivedObject.data['platform']) {
                    case 'linux':
                        icon = 'linux.png';
                        break;
                    case 'win32':
                        icon = 'windows.png';
                        break;
                    case 'win64':
                        icon = 'windows.png';
                        break;
                    case 'darwin':
                        icon = 'apple.png';
                        break;
                }
                $('.infos-platform img').attr('src', '/images/systems/' + icon);
            }
            if (receivedObject.type == 'memory') {
                if (!this._chart) {
                    return;
                }
                if (this._time >= 70) {
                    this._chart_data.series[0].splice(0, 1);
                    this._chart_data.series[1].splice(0, 1);
                    this._chart_data.series[2].splice(0, 1);
                    this._chart_data.labels.splice(0, 1);
                }
                this._chart_data.labels.push(this._time);
                this._chart_data.series[0].push(receivedObject.data['heapUsed'] / this.__MEGA_BYTE);
                this._chart_data.series[1].push(receivedObject.data['heapTotal'] / this.__MEGA_BYTE);
                this._chart_data.series[2].push(receivedObject.data['rss'] / this.__MEGA_BYTE);
                this.chart();
                this._time += 5;
            }
        };
        return NodejsDashboard;
    }(VORLON.DashboardPlugin));
    VORLON.NodejsDashboard = NodejsDashboard;
    VORLON.Core.RegisterDashboardPlugin(new NodejsDashboard());
})(VORLON || (VORLON = {}));
