var VORLON;
(function (VORLON) {
    var WebStandards;
    (function (WebStandards) {
        var Rules;
        (function (Rules) {
            var DOM;
            (function (DOM) {
                DOM.browserdetection = {
                    id: "webstandards.avoid-browser-detection",
                    exceptions: [
                        "ajax.googleapis.com",
                        "ajax.aspnetcdn.com",
                        "ajax.microsoft.com",
                        "jquery",
                        "mootools",
                        "prototype",
                        "protoaculous",
                        "google-analytics.com",
                        "partner.googleadservices.com",
                        "vorlon"
                    ],
                    title: "avoid browser detection",
                    description: "Nowadays, browser have very similar user agent, and browser feature moves very fast. Browser detection leads to britle code. Consider using feature detection instead.",
                    nodeTypes: ["#comment"],
                    violations: [],
                    prepare: function (rulecheck, analyzeSummary) {
                        rulecheck.items = rulecheck.items || [];
                        rulecheck.type = "blockitems";
                    },
                    init: function () {
                        var pageWindow = document.parentNode;
                        try {
                            this.hook("navigator", "userAgent");
                            this.hook("navigator", "appVersion");
                            this.hook("navigator", "appName");
                            this.hook("navigator", "product");
                            this.hook("navigator", "vendor");
                        }
                        catch (e) {
                            console.warn("Vorlon.js Web Standards Plugin : Browser detection rule not available due to browser limitations");
                            var check = {
                                title: "Vorlon.js Web Standards Plugin no available.",
                                content: "Browser detection rule not available due to browser limitations"
                            };
                            this.violations.push(check);
                        }
                    },
                    hook: function (root, prop) {
                        var _this = this;
                        VORLON.Tools.HookProperty(root, prop, function (stack) {
                            //this.trace("browser detection " + stack.file);
                            //this.trace(stack.stack);
                            if (stack.file) {
                                if (_this.isException(stack.file)) {
                                    //this.trace("skip browser detection access " + stack.file)
                                    return;
                                }
                            }
                            var check = {
                                title: "Access to window.navigator." + stack.property,
                                content: "From " + stack.file + " at " + stack.line
                            };
                            _this.violations.push(check);
                        });
                    },
                    check: function (node, rulecheck, analyzeSummary, htmlString) {
                    },
                    isException: function (file) {
                        if (!file)
                            return false;
                        return this.exceptions.some(function (e) {
                            return file.indexOf(e) >= 0;
                        });
                    },
                    endcheck: function (rulecheck, analyzeSummary) {
                        if (this.violations.length > 0) {
                            rulecheck.failed = true;
                            for (var index = 0; index < this.violations.length; index++) {
                                rulecheck.items.push(this.violations[index]);
                            }
                        }
                    },
                };
            })(DOM = Rules.DOM || (Rules.DOM = {}));
        })(Rules = WebStandards.Rules || (WebStandards.Rules = {}));
    })(WebStandards = VORLON.WebStandards || (VORLON.WebStandards = {}));
})(VORLON || (VORLON = {}));
