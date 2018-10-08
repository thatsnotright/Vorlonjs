var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VORLON;
(function (VORLON) {
    var UnitTestRunnerDashboard = (function (_super) {
        __extends(UnitTestRunnerDashboard, _super);
        function UnitTestRunnerDashboard() {
            _super.call(this, "unitTestRunner", "control.html", "control.css");
            this._ready = true;
        }
        UnitTestRunnerDashboard.prototype.getID = function () {
            return "UNITTEST";
        };
        UnitTestRunnerDashboard.prototype.handleFileSelect = function (files) {
            var _this = this;
            this._txtRunTest.innerHTML = "";
            var reader = [];
            for (var i = 0, f; f = files[i]; i++) {
                reader.push(new FileReader());
                reader[i].onload = function (e) {
                    _this._txtRunTest.innerHTML += e.target.result;
                };
                reader[i].readAsText(f);
            }
        };
        UnitTestRunnerDashboard.prototype.startDashboardSide = function (div) {
            var _this = this;
            if (div === void 0) { div = null; }
            var self = this;
            this._insertHtmlContentAsync(div, function (filledDiv) {
                _this._btnRunTest = VORLON.Tools.QuerySelectorById(div, "runTest");
                _this._inputFile = VORLON.Tools.QuerySelectorById(div, "files");
                _this._inputFile.onchange = function (evt) {
                    _this.handleFileSelect(evt.target.files);
                };
                _this._dropPanel = VORLON.Tools.QuerySelectorById(div, "dropPanel");
                _this._dropPanel.ondrop = function (evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    _this.handleFileSelect(evt.dataTransfer.files);
                };
                _this._dropPanel.ondragover = function (evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    evt.dataTransfer.dropEffect = 'copy';
                };
                _this._dropPanel.ondragenter = function (evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    self._dropPanel.classList.add("droppable");
                };
                _this._dropPanel.ondragleave = function (evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    self._dropPanel.classList.remove("droppable");
                };
                _this._txtRunTest = VORLON.Tools.QuerySelectorById(div, "txtRunTest");
                _this._btnRunTest.addEventListener("run", function () {
                    _this.sendCommandToClient("runTest", _this._txtRunTest.value);
                });
                _this._containerList = VORLON.Tools.QuerySelectorById(div, "testResultsList");
                _this._containerSummary = VORLON.Tools.QuerySelectorById(div, "testResultsSummary");
            });
        };
        UnitTestRunnerDashboard.prototype.onRealtimeMessageReceivedFromClientSide = function (receivedObject) {
            //console.log(receivedObject);
            switch (receivedObject.commandType) {
                case "testDone":
                    var tr = document.createElement('tr');
                    var tdName = document.createElement('td');
                    var tdModule = document.createElement('td');
                    var tdPassed = document.createElement('td');
                    var tdFailed = document.createElement('td');
                    var tdTime = document.createElement('td');
                    var tdTotal = document.createElement('td');
                    tdName.innerHTML = receivedObject.name;
                    tdModule.innerHTML = receivedObject.module;
                    tdPassed.innerHTML = receivedObject.passed;
                    tdFailed.innerHTML = receivedObject.failed;
                    tdTime.innerHTML = receivedObject.runtime;
                    tdTotal.innerHTML = receivedObject.total;
                    tr.appendChild(tdName);
                    tr.appendChild(tdModule);
                    tr.appendChild(tdPassed);
                    tr.appendChild(tdFailed);
                    tr.appendChild(tdTime);
                    tr.appendChild(tdTotal);
                    this._containerList.appendChild(tr);
                    break;
                case "done":
                    var tdName = document.createElement('td');
                    var tdModule = document.createElement('td');
                    var tdPassed = document.createElement('td');
                    var tdFailed = document.createElement('td');
                    var tdTime = document.createElement('td');
                    var tdTotal = document.createElement('td');
                    tdPassed.innerHTML = receivedObject.passed;
                    tdFailed.innerHTML = receivedObject.failed;
                    //** Need to fix because receivedObject.runtime return a wrong value
                    //   it's a Qunit problem
                    tdTime.innerHTML = ""; // receivedObject.runtime;
                    //**
                    tdTotal.innerHTML = receivedObject.total;
                    this._containerSummary.innerHTML = "";
                    this._containerSummary.appendChild(tdName);
                    this._containerSummary.appendChild(tdModule);
                    this._containerSummary.appendChild(tdPassed);
                    this._containerSummary.appendChild(tdFailed);
                    this._containerSummary.appendChild(tdTime);
                    this._containerSummary.appendChild(tdTotal);
                    break;
            }
        };
        return UnitTestRunnerDashboard;
    }(VORLON.DashboardPlugin));
    VORLON.UnitTestRunnerDashboard = UnitTestRunnerDashboard;
    //Register the plugin with vorlon core 
    VORLON.Core.RegisterDashboardPlugin(new UnitTestRunnerDashboard());
})(VORLON || (VORLON = {}));
