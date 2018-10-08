var VORLON;
(function (VORLON) {
    var WebStandards;
    (function (WebStandards) {
        var Rules;
        (function (Rules) {
            var Accessibility;
            (function (Accessibility) {
                Accessibility.aXeCheck = {
                    id: "accessibility.aXeCheck",
                    title: "aXe accessibility check",
                    description: "We are using aXe helps you catch accessibility issues early.",
                    prepare: function (rulecheck, analyzeSummary) {
                        analyzeSummary.pendingLoad++;
                        // Using aXe
                        axe.a11yCheck(document, function (results) {
                            rulecheck.items = [];
                            rulecheck.failed = (results.violations.length > 0);
                            rulecheck.skipRootLevel = rulecheck.failed;
                            for (var index = 0; index < results.violations.length; index++) {
                                var check = results.violations[index];
                                var item = {
                                    description: check.description,
                                    failed: true,
                                    id: check.id,
                                    title: check.help,
                                    type: "blockitems",
                                    items: []
                                };
                                rulecheck.items.push(item);
                                for (var nodeIndex = 0; nodeIndex < check.nodes.length; nodeIndex++) {
                                    var node = check.nodes[nodeIndex];
                                    var nodeEntry = {
                                        title: node.html,
                                        items: []
                                    };
                                    item.items.push(nodeEntry);
                                    for (var anyIndex = 0; anyIndex < node.any.length; anyIndex++) {
                                        nodeEntry.items.push({ title: node.any[anyIndex].message });
                                    }
                                }
                            }
                            analyzeSummary.pendingLoad--;
                        });
                    }
                };
            })(Accessibility = Rules.Accessibility || (Rules.Accessibility = {}));
        })(Rules = WebStandards.Rules || (WebStandards.Rules = {}));
    })(WebStandards = VORLON.WebStandards || (VORLON.WebStandards = {}));
})(VORLON || (VORLON = {}));

var VORLON;
(function (VORLON) {
    var WebStandards;
    (function (WebStandards) {
        var Rules;
        (function (Rules) {
            var DOM;
            (function (DOM) {
                DOM.deviceIcons = {
                    id: "mobileweb.deviceIcons",
                    title: "define platform icons",
                    description: "Platform icons helps user pinning your website with an icon that fits well on mobile device home.",
                    nodeTypes: ["meta", "link"],
                    prepare: function (rulecheck, analyzeSummary) {
                        rulecheck.items = rulecheck.items || [];
                        rulecheck.type = "blockitems";
                        rulecheck.data = {
                            hasWindowsIcons: false,
                            hasWindowsNotification: false,
                            hasIOSIcons: false
                        };
                    },
                    check: function (node, rulecheck, analyzeSummary, htmlString) {
                        if (node.nodeName == "LINK") {
                            var rel = node.getAttribute("rel");
                            if (rel && rel == "apple-touch-icon-precomposed") {
                                rulecheck.data.hasIOSIcons = true;
                            }
                        }
                        else if (node.nodeName == "META") {
                            var name = node.getAttribute("name");
                            if (name) {
                                if (name.toLowerCase() == "msapplication-notification") {
                                    rulecheck.data.hasWindowsNotification = true;
                                }
                                else if (name.toLowerCase().indexOf("msapplication-") == 0) {
                                    rulecheck.data.hasWindowsIcons = true;
                                }
                            }
                        }
                    },
                    endcheck: function (rulecheck, analyzeSummary) {
                        if (!rulecheck.data.hasIOSIcons) {
                            rulecheck.failed = true;
                            rulecheck.items.push({
                                title: 'add Apple - iOS icons by adding link tags like <link rel="apple-touch-icon" href="youricon" sizes="57x57"" />'
                            });
                        }
                        if (!rulecheck.data.hasWindowsIcons) {
                            rulecheck.failed = true;
                            //https://msdn.microsoft.com/en-us/library/dn255024(v=vs.85).aspx
                            rulecheck.items.push({
                                title: 'add Microsoft - Windows tiles by adding meta tags like <link name="msapplication-square150x150logo" content="yourimage" />'
                            });
                        }
                    }
                };
            })(DOM = Rules.DOM || (Rules.DOM = {}));
        })(Rules = WebStandards.Rules || (WebStandards.Rules = {}));
    })(WebStandards = VORLON.WebStandards || (VORLON.WebStandards = {}));
})(VORLON || (VORLON = {}));

var VORLON;
(function (VORLON) {
    var WebStandards;
    (function (WebStandards) {
        var Rules;
        (function (Rules) {
            var CSS;
            (function (CSS) {
                CSS.mobileMediaqueries = {
                    id: "mobileweb.usemediaqueries",
                    title: "use responsive approaches",
                    description: "Even if your website target only certain devices, you may have users with unexpected devices or screen ratio.",
                    prepare: function (rulecheck, analyzeSummary) {
                        rulecheck.items = rulecheck.items || [];
                        rulecheck.type = "blockitems";
                        if (!rulecheck.data) {
                            rulecheck.data = {
                                cssnbqueries: 0,
                                domnbqueries: 0
                            };
                        }
                    },
                    check: function (url, ast, rulecheck, analyzeSummary) {
                        //console.log("check css prefixes");
                        this.checkNodes(url, rulecheck, ast);
                    },
                    checkNodes: function (url, rulecheck, ast) {
                        if (!ast)
                            return;
                        ast.forEach(function (node, i) {
                            var nodeitem = null;
                            //scan content for media queries
                            if (node.type === "media") {
                                var media = node.selector;
                                if (media) {
                                    media = media.toLowerCase();
                                    if (media.indexOf("width") >= 0 || media.indexOf("height") >= 0) {
                                        rulecheck.data.cssnbqueries++;
                                    }
                                }
                            }
                        });
                    },
                    endcheck: function (rulecheck, analyzeSummary) {
                    }
                };
            })(CSS = Rules.CSS || (Rules.CSS = {}));
        })(Rules = WebStandards.Rules || (WebStandards.Rules = {}));
    })(WebStandards = VORLON.WebStandards || (VORLON.WebStandards = {}));
})(VORLON || (VORLON = {}));
var VORLON;
(function (VORLON) {
    var WebStandards;
    (function (WebStandards) {
        var Rules;
        (function (Rules) {
            var DOM;
            (function (DOM) {
                DOM.mobileMediaqueries = {
                    id: "mobileweb.usemediaqueries",
                    title: "use responsive approaches",
                    description: "Even if your website target only certain devices, you may have users with unexpected devices or screen ratio.",
                    nodeTypes: ["link"],
                    prepare: function (rulecheck, analyzeSummary) {
                        rulecheck.items = rulecheck.items || [];
                        if (!rulecheck.data) {
                            rulecheck.data = {
                                cssnbqueries: 0,
                                domnbqueries: 0
                            };
                        }
                    },
                    check: function (node, rulecheck, analyzeSummary, htmlstring) {
                        if (!node.getAttribute)
                            return;
                        var rel = node.getAttribute("rel");
                        if (rel && rel.toLocaleLowerCase() == "stylesheet") {
                            var media = node.getAttribute("media");
                            if (media) {
                                media = media.toLowerCase();
                                if (media.indexOf("width") >= 0 || media.indexOf("height") >= 0) {
                                    rulecheck.data.domnbqueries++;
                                }
                            }
                        }
                    },
                    endcheck: function (rulecheck, analyzeSummary) {
                        //console.log("media queries css:" + rulecheck.cssnbqueries + ", dom:" + rulecheck.domnbqueries);
                        if (rulecheck.data.cssnbqueries == 0 && rulecheck.data.domnbqueries == 0) {
                            if (rulecheck.data.cssnbqueries == 0) {
                                rulecheck.failed = true;
                                rulecheck.items.push({
                                    title: 'your css (either files or inline) does not use any media queries'
                                });
                            }
                            if (rulecheck.data.domnbqueries == 0) {
                                rulecheck.failed = true;
                                rulecheck.items.push({
                                    title: 'your link tags does not use any media queries'
                                });
                            }
                        }
                    }
                };
            })(DOM = Rules.DOM || (Rules.DOM = {}));
        })(Rules = WebStandards.Rules || (WebStandards.Rules = {}));
    })(WebStandards = VORLON.WebStandards || (VORLON.WebStandards = {}));
})(VORLON || (VORLON = {}));

var VORLON;
(function (VORLON) {
    var WebStandards;
    (function (WebStandards) {
        var Rules;
        (function (Rules) {
            var DOM;
            (function (DOM) {
                DOM.useViewport = {
                    id: "mobileweb.use-viewport",
                    title: "use meta viewport",
                    description: "Use meta viewport tag to choose how your website will get scaled on smaller devices like phones. Define at least <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">",
                    nodeTypes: ["meta"],
                    prepare: function (rulecheck, analyzeSummary) {
                        rulecheck.failed = true;
                    },
                    check: function (node, rulecheck, analyzeSummary, htmlString) {
                        var viewportattr = node.getAttribute("name");
                        if (viewportattr && viewportattr.toLowerCase() == "viewport") {
                            rulecheck.failed = false;
                        }
                    }
                };
            })(DOM = Rules.DOM || (Rules.DOM = {}));
        })(Rules = WebStandards.Rules || (WebStandards.Rules = {}));
    })(WebStandards = VORLON.WebStandards || (VORLON.WebStandards = {}));
})(VORLON || (VORLON = {}));

var VORLON;
(function (VORLON) {
    var WebStandards;
    (function (WebStandards) {
        var Rules;
        (function (Rules) {
            var Files;
            (function (Files) {
                var cssFilesLimit = 5;
                var scriptsFilesLimit = 5;
                Files.filesBundle = {
                    id: "performances.bundles",
                    title: "try bundling your files",
                    description: "Multiple http requests makes your site slower, especially on mobile devices",
                    check: function (rulecheck, analyzeSummary) {
                        rulecheck.items = rulecheck.items || [];
                        rulecheck.type = "blockitems";
                        var countStylesheets = 0;
                        for (var n in analyzeSummary.files.stylesheets) {
                            var isVorlonInjection = n.toLowerCase().indexOf("vorlon/plugins") >= 0;
                            if (!isVorlonInjection)
                                countStylesheets++;
                        }
                        if (countStylesheets > cssFilesLimit) {
                            rulecheck.failed = true;
                            rulecheck.items.push({
                                title: "You have more than " + cssFilesLimit + " stylesheets in your page, consider bundling your stylesheets."
                            });
                        }
                        var countScripts = 0;
                        for (var n in analyzeSummary.files.scripts) {
                            var isVorlonInjection = n.toLowerCase().indexOf("vorlon/plugins") >= 0;
                            if (!isVorlonInjection)
                                countScripts++;
                        }
                        if (countScripts > scriptsFilesLimit) {
                            rulecheck.failed = true;
                            rulecheck.items.push({
                                title: "You have more than " + scriptsFilesLimit + " scripts files in your page, consider bundling your scripts."
                            });
                        }
                    }
                };
            })(Files = Rules.Files || (Rules.Files = {}));
        })(Rules = WebStandards.Rules || (WebStandards.Rules = {}));
    })(WebStandards = VORLON.WebStandards || (VORLON.WebStandards = {}));
})(VORLON || (VORLON = {}));

var VORLON;
(function (VORLON) {
    var WebStandards;
    (function (WebStandards) {
        var Rules;
        (function (Rules) {
            var Files;
            (function (Files) {
                Files.contentEncoding = {
                    id: "performances.contentencoding",
                    title: "encode static content",
                    description: "content encoding like gzip or deflate helps reducing the network bandwith required to display your website, it is especially important for mobile devices. Use content encoding for static files like CSS and JavaScript files.",
                    check: function (rulecheck, analyzeSummary) {
                        rulecheck.items = rulecheck.items || [];
                        rulecheck.type = "blockitems";
                        for (var n in analyzeSummary.files.stylesheets) {
                            var isVorlonInjection = n.toLowerCase().indexOf("vorlon/plugins") >= 0;
                            if (!isVorlonInjection && analyzeSummary.files.stylesheets[n].encoding && analyzeSummary.files.stylesheets[n].encoding == "none") {
                                rulecheck.failed = true;
                                rulecheck.items.push({
                                    title: "use content encoding for " + n
                                });
                            }
                        }
                        for (var n in analyzeSummary.files.scripts) {
                            var isVorlonInjection = n.toLowerCase().indexOf("vorlon/plugins") >= 0;
                            if (!isVorlonInjection && analyzeSummary.files.scripts[n].encoding && analyzeSummary.files.scripts[n].encoding == "none") {
                                rulecheck.failed = true;
                                rulecheck.items.push({
                                    title: "use content encoding for " + n
                                });
                            }
                        }
                    }
                };
            })(Files = Rules.Files || (Rules.Files = {}));
        })(Rules = WebStandards.Rules || (WebStandards.Rules = {}));
    })(WebStandards = VORLON.WebStandards || (VORLON.WebStandards = {}));
})(VORLON || (VORLON = {}));

var VORLON;
(function (VORLON) {
    var WebStandards;
    (function (WebStandards) {
        var Rules;
        (function (Rules) {
            var Files;
            (function (Files) {
                Files.filesMinification = {
                    id: "performances.minification",
                    title: "minify static files",
                    description: "minification helps reducing the network bandwith required to display your website, it is especially important for mobile devices. Minify static files like CSS and JavaScript files.",
                    check: function (rulecheck, analyzeSummary) {
                        rulecheck.items = rulecheck.items || [];
                        rulecheck.type = "blockitems";
                        for (var n in analyzeSummary.files.stylesheets) {
                            var isVorlonInjection = n.toLowerCase().indexOf("vorlon/plugins") >= 0;
                            if (!isVorlonInjection) {
                                var charPerLines = this.getAverageCharacterPerLine(analyzeSummary.files.stylesheets[n].content);
                                if (charPerLines < 50) {
                                    rulecheck.failed = true;
                                    rulecheck.items.push({
                                        title: "minify " + n
                                    });
                                }
                            }
                        }
                        for (var n in analyzeSummary.files.scripts) {
                            var isVorlonInjection = n.toLowerCase().indexOf("vorlon/plugins") >= 0;
                            if (!isVorlonInjection) {
                                var charPerLines = this.getAverageCharacterPerLine(analyzeSummary.files.scripts[n].content);
                                if (charPerLines < 50) {
                                    rulecheck.failed = true;
                                    rulecheck.items.push({
                                        title: "minify " + n
                                    });
                                }
                            }
                        }
                    },
                    getAverageCharacterPerLine: function (content) {
                        if (!content)
                            return 1000;
                        var lines = content.split('\n');
                        if (lines.length == 0)
                            return 1000;
                        var total = 0;
                        lines.forEach(function (l) {
                            total += l.length;
                        });
                        return total / lines.length;
                    }
                };
            })(Files = Rules.Files || (Rules.Files = {}));
        })(Rules = WebStandards.Rules || (WebStandards.Rules = {}));
    })(WebStandards = VORLON.WebStandards || (VORLON.WebStandards = {}));
})(VORLON || (VORLON = {}));

var VORLON;
(function (VORLON) {
    var WebStandards;
    (function (WebStandards) {
        var Rules;
        (function (Rules) {
            var DOM;
            (function (DOM) {
                DOM.dontUsePlugins = {
                    id: "webstandards.dont-use-plugins",
                    title: "object and embed",
                    description: "With HTML5 embed or object tags can often be replaced with HTML5 features.",
                    nodeTypes: ["EMBED", "OBJECT"],
                    prepare: function (rulecheck, analyzeSummary) {
                        rulecheck.items = rulecheck.items || [];
                        rulecheck.type = "blockitems";
                    },
                    check: function (node, rulecheck, analyzeSummary, htmlString) {
                        //console.log("check for plugins");
                        var source = null, data = null, type = null;
                        var source = node.getAttribute("src");
                        if (source)
                            source = source.toLowerCase();
                        else
                            source = "";
                        var data = node.getAttribute("data");
                        if (data)
                            data = data.toLowerCase();
                        else
                            data = "";
                        var type = node.getAttribute("type");
                        if (type)
                            type = type.toLowerCase();
                        else
                            type = "";
                        if (source.indexOf(".swf") > 0 || data.indexOf("swf") > 0) {
                            rulecheck.failed = true;
                            rulecheck.items.push({ message: "consider using HTML5 instead of Flash", content: VORLON.Tools.htmlToString(node.outerHTML) });
                        }
                        else if (type.indexOf("silverlight") > 0) {
                            rulecheck.failed = true;
                            rulecheck.items.push({ message: "consider using HTML5 instead of Silverlight", content: VORLON.Tools.htmlToString(node.outerHTML) });
                        }
                        else if (source.indexOf(".svg") > 0 || data.indexOf("svg") > 0) {
                            rulecheck.failed = true;
                            rulecheck.items.push({ message: "dont't use SVG with " + node.nodeType, content: VORLON.Tools.htmlToString(node.outerHTML) });
                        }
                        else {
                            rulecheck.failed = true;
                            rulecheck.items.push({ message: "use HTML5 instead of embed or object elements", content: VORLON.Tools.htmlToString(node.outerHTML) });
                        }
                    }
                };
            })(DOM = Rules.DOM || (Rules.DOM = {}));
        })(Rules = WebStandards.Rules || (WebStandards.Rules = {}));
    })(WebStandards = VORLON.WebStandards || (VORLON.WebStandards = {}));
})(VORLON || (VORLON = {}));

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

var VORLON;
(function (VORLON) {
    var WebStandards;
    (function (WebStandards) {
        var Rules;
        (function (Rules) {
            var DOM;
            (function (DOM) {
                DOM.browserinterop = {
                    id: "webstandards.avoid-browser-specific-content",
                    title: "avoid browser specific content",
                    description: "Avoid serving content based on user-agent. Browsers evolve fast and user-agent based content may frustrate your users by not getting the best content for their preferred browser.",
                    nodeTypes: ["#comment"],
                    userAgents: {
                        "Microsoft Edge": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10240',
                        "Microsoft IE11": 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; Touch; rv:11.0) like Gecko',
                        "Google Chrome": 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
                        "Firefox": 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:41.0) Gecko/20100101 Firefox/41.0'
                    },
                    prepare: function (rulecheck, analyzeSummary) {
                        rulecheck.items = rulecheck.items || [];
                        rulecheck.type = "blockitems";
                        analyzeSummary.files.browserInterop = {};
                        var serverurl = VORLON.Core._messenger._serverUrl;
                        if (!serverurl) {
                            console.warn('no Vorlon server url for browser interop', VORLON.Core._messenger);
                            return;
                        }
                        if (serverurl[serverurl.length - 1] !== '/')
                            serverurl = serverurl + "/";
                        for (var n in this.userAgents) {
                            this.fetchHTMLDocument(serverurl, n, this.userAgents[n], analyzeSummary);
                        }
                    },
                    check: function (node, rulecheck, analyzeSummary, htmlString) {
                    },
                    endcheck: function (rulecheck, analyzeSummary) {
                        var detection = analyzeSummary.files.browserInterop;
                        var comparisons = {};
                        for (var n in detection) {
                            for (var b in detection) {
                                if (b != n && !comparisons[n + b]) {
                                    //console.log("comparing content from " + n + " and " + b);
                                    comparisons[b + n] = true;
                                    if (detection[b].loaded && detection[n].loaded && detection[b].content != detection[n].content) {
                                        rulecheck.failed = true;
                                        rulecheck.items.push({
                                            title: n + " and " + b + " received different content"
                                        });
                                    }
                                }
                            }
                        }
                    },
                    fetchHTMLDocument: function (serverurl, browser, userAgent, analyzeSummary) {
                        var xhr = null;
                        var timeoutRef = null;
                        var completed = false;
                        var documentUrl = serverurl + "httpproxy/fetch?fetchurl=" + encodeURIComponent(analyzeSummary.location) + "&fetchuseragent=" + encodeURIComponent(userAgent);
                        //console.log("getting HTML reference for " + browser + " " + documentUrl);
                        try {
                            xhr = new XMLHttpRequest();
                            xhr.onreadystatechange = function () {
                                if (xhr.readyState == 4) {
                                    completed = true;
                                    clearTimeout(timeoutRef);
                                    analyzeSummary.pendingLoad--;
                                    //console.log("received content for " + browser + "(" + xhr.status + ") " + analyzeSummary.pendingLoad);
                                    if (xhr.status == 200) {
                                        analyzeSummary.files.browserInterop[browser] = {
                                            loaded: true, url: analyzeSummary.location.href, userAgent: userAgent, status: xhr.status, content: xhr.responseText
                                        };
                                    }
                                    else {
                                        analyzeSummary.files.browserInterop[browser] = {
                                            loaded: false, url: analyzeSummary.location.href, userAgent: userAgent, status: xhr.status, content: null, error: xhr.statusText
                                        };
                                    }
                                }
                            };
                            xhr.open("GET", documentUrl, true);
                            analyzeSummary.pendingLoad++;
                            xhr.send(null);
                            //console.log("request file " + browser + " " + analyzeSummary.pendingLoad);
                            timeoutRef = setTimeout(function () {
                                if (!completed) {
                                    completed = true;
                                    analyzeSummary.pendingLoad--;
                                    console.warn("fetch timeout for " + browser);
                                    xhr.abort();
                                    analyzeSummary.files.browserInterop[browser] = {
                                        loaded: false, url: analyzeSummary.location.href, userAgent: userAgent, status: xhr.status, content: null, error: "timeout"
                                    };
                                }
                            }, 20 * 1000);
                        }
                        catch (e) {
                            analyzeSummary.pendingLoad--;
                            console.error(e);
                            console.warn("received error for " + browser + "(" + xhr.status + ") " + analyzeSummary.pendingLoad);
                            analyzeSummary.files.browserInterop[browser] = { loaded: false, url: analyzeSummary.location.href, status: 0, content: null, error: e.message };
                        }
                    }
                };
            })(DOM = Rules.DOM || (Rules.DOM = {}));
        })(Rules = WebStandards.Rules || (WebStandards.Rules = {}));
    })(WebStandards = VORLON.WebStandards || (VORLON.WebStandards = {}));
})(VORLON || (VORLON = {}));

var VORLON;
(function (VORLON) {
    var WebStandards;
    (function (WebStandards) {
        var Rules;
        (function (Rules) {
            var DOM;
            (function (DOM) {
                DOM.dontUseBrowserConditionalComment = {
                    id: "webstandards.avoid-browser-specific-css",
                    title: "avoid conditional comments",
                    description: "Conditional comments are not the best way to adapt your website to target browser, and support is dropped for IE > 9.",
                    nodeTypes: ["#comment"],
                    prepare: function (rulecheck, analyzeSummary) {
                        rulecheck.items = rulecheck.items || [];
                        rulecheck.type = "blockitems";
                    },
                    check: function (node, rulecheck, analyzeSummary, htmlString) {
                        //console.log("checking comment " + node.nodeValue);
                        var commentContent = node.nodeValue.toLowerCase();
                        var hasConditionalComment = commentContent.indexOf("[if ie ") >= 0 ||
                            commentContent.indexOf("[if !ie]") >= 0 ||
                            commentContent.indexOf("[if gt ie ") >= 0 ||
                            commentContent.indexOf("[if gte ie ") >= 0 ||
                            commentContent.indexOf("[if lt ie ") >= 0 ||
                            commentContent.indexOf("[if lte ie ") >= 0;
                        if (hasConditionalComment) {
                            rulecheck.failed = true;
                            rulecheck.items.push({
                                title: VORLON.Tools.htmlToString(node.nodeValue)
                            });
                        }
                    }
                };
            })(DOM = Rules.DOM || (Rules.DOM = {}));
        })(Rules = WebStandards.Rules || (WebStandards.Rules = {}));
    })(WebStandards = VORLON.WebStandards || (VORLON.WebStandards = {}));
})(VORLON || (VORLON = {}));

var VORLON;
(function (VORLON) {
    var WebStandards;
    (function (WebStandards) {
        var Rules;
        (function (Rules) {
            var CSS;
            (function (CSS) {
                CSS.cssfallback = {
                    id: "webstandards.cssfallback",
                    title: "incorrect use of css fallback",
                    description: "Ensure css fallback.",
                    prepare: function (rulecheck, analyzeSummary) {
                        this.fallBackErrorList = [];
                    },
                    check: function (url, ast, rulecheck, analyzeSummary) {
                        var parsed = ast;
                        for (var i = 0; i < parsed.length; i++) {
                            var selector = parsed[i].selector;
                            var rules = parsed[i].rules;
                            var resultsList = this.checkPrefix(rules);
                            if (resultsList.length > 0) {
                                // if (!results[url])
                                //     results[url] = {}
                                // if (!results[url][selector])
                                //     results[url][selector] = [];
                                //     
                                // for (var x = 0; x < resultsList.length; x++) {
                                //     results[url][selector].push(resultsList[x]);
                                // }
                                this.fallBackErrorList.push(resultsList);
                            }
                        }
                    },
                    capitalizeFirstLetter: function (string) {
                        return string.charAt(0).toUpperCase() + string.slice(1);
                    },
                    checkPrefix: function (rules) {
                        var errorList = [];
                        if (rules && rules.length)
                            for (var i = 0; i < rules.length; i++) {
                                if (rules[i].directive.indexOf('-webkit') === 0) {
                                    var _unprefixedPropertyName = this.unprefixedPropertyName(rules[i].directive);
                                    var good = this.checkIfNoPrefix(rules, _unprefixedPropertyName);
                                    if (!good) {
                                        var divTest = document.createElement('div');
                                        divTest.style['webkit' + this.capitalizeFirstLetter(_unprefixedPropertyName)] = rules[i].value;
                                        if (divTest.style['webkit' + this.capitalizeFirstLetter(_unprefixedPropertyName)] !== undefined) {
                                            good = true;
                                        }
                                    }
                                    if (!good) {
                                        errorList.push(rules[i].directive);
                                    }
                                }
                            }
                        return errorList;
                    },
                    checkIfNoPrefix: function (rules, prefix) {
                        var present = false;
                        if (rules && rules.length)
                            for (var i = 0; i < rules.length; i++) {
                                if (rules[i].directive.indexOf(prefix) === 0) {
                                    present = true;
                                    break;
                                }
                            }
                        if (!present) {
                            present = this.checkIfMsPrefix(rules, prefix);
                        }
                        return present;
                    },
                    checkIfMsPrefix: function (rules, prefix) {
                        var present = false;
                        if (rules && rules.length)
                            for (var i = 0; i < rules.length; i++) {
                                if (rules[i].directive.indexOf('-ms-' + prefix) === 0) {
                                    present = true;
                                    break;
                                }
                            }
                        return present;
                    },
                    unprefixedPropertyName: function (property) {
                        return property.replace("-webkit-", "").replace("-moz-", "").replace("-o-", "").replace("-ms-", "");
                    },
                    endcheck: function (rulecheck, analyzeSummary) {
                        //console.log("check css css fallback");
                        var nodes = [];
                        rulecheck.items = [];
                        var failed = false;
                        if (!this.fallBackErrorList) {
                            rulecheck.title = "(disabled !) incorrect use of css fallback";
                            failed = true;
                            var np = {
                                title: "the check of css Fallback is disabled",
                                type: "blockitems",
                                failed: true,
                                items: []
                            };
                            rulecheck.items.push(np);
                        }
                        else {
                            for (var ii = 0; ii < this.fallBackErrorList.length; ii++) {
                                for (var fallErrorFile in this.fallBackErrorList[ii]) {
                                    failed = true;
                                    var fallError = this.fallBackErrorList[ii][fallErrorFile];
                                    var proprules = {
                                        title: fallErrorFile,
                                        type: "itemslist",
                                        items: []
                                    };
                                    for (var errorFile in fallError) {
                                        var peroor = {
                                            failed: true,
                                            id: "." + fallError[errorFile][ind],
                                            items: [],
                                            title: errorFile
                                        };
                                        proprules.items.push(peroor);
                                        for (var ind = 0; ind < fallError[errorFile].length; ind++) {
                                            peroor.items.push({
                                                failed: true, id: "." + fallError[errorFile][ind], items: [],
                                                title: "from " + fallError[errorFile][ind] + " to " + fallError[errorFile][ind].replace("-webkit-", "").replace("-moz-", "").replace("-o-", "").replace("-ms-", ""), type: "error"
                                            });
                                        }
                                        if (proprules.items.length) {
                                            rulecheck.items.push(proprules);
                                        }
                                    }
                                }
                            }
                        }
                        rulecheck.failed = failed;
                    },
                };
            })(CSS = Rules.CSS || (Rules.CSS = {}));
        })(Rules = WebStandards.Rules || (WebStandards.Rules = {}));
    })(WebStandards = VORLON.WebStandards || (VORLON.WebStandards = {}));
})(VORLON || (VORLON = {}));

var VORLON;
(function (VORLON) {
    var WebStandards;
    (function (WebStandards) {
        var Rules;
        (function (Rules) {
            var CSS;
            (function (CSS) {
                var compatiblePrefixes = {
                    'animation': 'webkit',
                    'animation-delay': 'webkit',
                    'animation-direction': 'webkit',
                    'animation-duration': 'webkit',
                    'animation-fill-mode': 'webkit',
                    'animation-iteration-count': 'webkit',
                    'animation-name': 'webkit',
                    'animation-play-state': 'webkit',
                    'animation-timing-function': 'webkit',
                    'appearance': 'webkit moz',
                    'border-end': 'webkit moz',
                    'border-end-color': 'webkit moz',
                    'border-end-style': 'webkit moz',
                    'border-end-width': 'webkit moz',
                    'border-image': 'webkit o',
                    'border-start': 'webkit moz',
                    'border-start-color': 'webkit moz',
                    'border-start-style': 'webkit moz',
                    'border-start-width': 'webkit moz',
                    'box-sizing': 'webkit',
                    'column-count': 'webkit moz',
                    'column-gap': 'webkit moz',
                    'column-rule': 'webkit moz',
                    'column-rule-color': 'webkit moz',
                    'column-rule-style': 'webkit moz',
                    'column-rule-width': 'webkit moz',
                    'column-width': 'webkit moz',
                    'hyphens': 'webkit moz ms',
                    'margin-end': 'webkit moz',
                    'margin-start': 'webkit moz',
                    'padding-end': 'webkit moz',
                    'padding-start': 'webkit moz',
                    'tab-size': 'webkit moz o',
                    'text-size-adjust': 'webkit moz ms',
                    'transform': 'webkit ms',
                    'transform-origin': 'webkit ms',
                    'transition': 'webkit moz o',
                    'transition-delay': 'webkit moz o',
                    'transition-duration': 'webkit',
                    'transition-property': 'webkit',
                    'transition-timing-function': 'webkit',
                    'user-select': 'webkit moz ms'
                };
                var variations, prefixed, arrayPush = Array.prototype.push, applyTo = new Array();
                for (var prop in compatiblePrefixes) {
                    if (compatiblePrefixes.hasOwnProperty(prop)) {
                        variations = [];
                        prefixed = compatiblePrefixes[prop].split(' ');
                        for (var i = 0, len = prefixed.length; i < len; i++) {
                            variations.push('-' + prefixed[i] + '-' + prop);
                        }
                        compatiblePrefixes[prop] = variations;
                        variations.forEach(function (obj, i) {
                            applyTo[obj] = i;
                        });
                    }
                }
                CSS.cssprefixes = {
                    id: "webstandards.prefixes",
                    title: "incorrect use of prefixes",
                    description: "Ensure you use all vendor prefixes and unprefixed version for HTML5 CSS properties.",
                    check: function (url, ast, rulecheck, analyzeSummary) {
                        //console.log("check css prefixes");
                        var nodes = [];
                        var filerules = {
                            title: url,
                            type: "itemslist",
                            items: []
                        };
                        rulecheck.items = rulecheck.items || [];
                        this.checkNodes(url, compatiblePrefixes, filerules, ast, nodes);
                        if (filerules.items.length) {
                            rulecheck.items.push(filerules);
                            rulecheck.failed = true;
                        }
                    },
                    unprefixedPropertyName: function (property) {
                        return property.replace("-webkit-", "").replace("-moz-", "").replace("-o-", "").replace("-ms-", "");
                    },
                    getMissingPrefixes: function (compatiblePrefixes, node, property) {
                        var allProperty = compatiblePrefixes[property];
                        var prefixes = [];
                        allProperty.forEach(function (prop, y) {
                            var hasPrefix = node.rules.some(function (r) { return r.directive == prop; });
                            if (!hasPrefix) {
                                prefixes.push(prop);
                            }
                        });
                        return prefixes;
                    },
                    checkNodes: function (url, compatiblePrefixes, rulecheck, ast, nodes) {
                        var _this = this;
                        if (!ast)
                            return;
                        ast.forEach(function (node, i) {
                            var nodeitem = null;
                            if (node.rules && node.rules.length > 0) {
                                var checked = {};
                                for (var x = 0, len = node.rules.length; x < len; x++) {
                                    var property = node.rules[x].directive;
                                    var unprefixed = _this.unprefixedPropertyName(property);
                                    if (!checked[unprefixed] && compatiblePrefixes.hasOwnProperty(unprefixed)) {
                                        if (compatiblePrefixes[unprefixed].indexOf(unprefixed) == -1)
                                            compatiblePrefixes[unprefixed].push(unprefixed);
                                        var missings = _this.getMissingPrefixes(compatiblePrefixes, node, unprefixed);
                                        if (missings.length) {
                                            if (!nodeitem) {
                                                rulecheck.failed = true;
                                                rulecheck.items = rulecheck.items || [];
                                                nodeitem = {
                                                    title: node.selector,
                                                    items: []
                                                };
                                                rulecheck.items.push(nodeitem);
                                            }
                                            nodeitem.items.push({
                                                title: "<strong>" + unprefixed + "</strong> : missing " + missings,
                                            });
                                        }
                                    }
                                    checked[unprefixed] = true;
                                }
                            }
                            //scan content of media queries
                            if (node.type === "media") {
                                _this.checkNodes(url, compatiblePrefixes, rulecheck, node.subStyles, nodes);
                            }
                        });
                    }
                };
            })(CSS = Rules.CSS || (Rules.CSS = {}));
        })(Rules = WebStandards.Rules || (WebStandards.Rules = {}));
    })(WebStandards = VORLON.WebStandards || (VORLON.WebStandards = {}));
})(VORLON || (VORLON = {}));

var VORLON;
(function (VORLON) {
    var WebStandards;
    (function (WebStandards) {
        var Rules;
        (function (Rules) {
            var DOM;
            (function (DOM) {
                DOM.modernDocType = {
                    id: "webstandards.documentmode",
                    title: "use modern doctype",
                    description: "Modern doctype like <!DOCTYPE html> are better for browser compatibility and enable using HTML5 features.",
                    nodeTypes: ["META"],
                    prepare: function (rulecheck, analyzeSummary) {
                        rulecheck.items = rulecheck.items || [];
                        rulecheck.type = "blockitems";
                    },
                    check: function (node, rulecheck, analyzeSummary, htmlString) {
                        var httpequiv = node.getAttribute("http-equiv");
                        if (httpequiv && httpequiv.toLowerCase() == "x-ua-compatible") {
                            var content = node.getAttribute("content");
                            if (!(content.toLowerCase().indexOf("edge") >= 0)) {
                                rulecheck.failed = true;
                                //current.content = doctype.html;
                                rulecheck.items.push({
                                    title: "your website use IE's document mode compatibility for an older version of IE ",
                                    content: node.outerHTML
                                });
                            }
                        }
                    },
                    endcheck: function (rulecheck, analyzeSummary) {
                        //console.log("checking comment " + node.nodeValue);
                        var doctype = analyzeSummary.doctype || {};
                        var current = {
                            title: "used doctype is " + doctype.html
                        };
                        if (doctype.publicId || doctype.systemId) {
                            rulecheck.failed = true;
                            //current.content = doctype.html;
                            rulecheck.items.push(current);
                        }
                    }
                };
            })(DOM = Rules.DOM || (Rules.DOM = {}));
        })(Rules = WebStandards.Rules || (WebStandards.Rules = {}));
    })(WebStandards = VORLON.WebStandards || (VORLON.WebStandards = {}));
})(VORLON || (VORLON = {}));

var VORLON;
(function (VORLON) {
    var WebStandards;
    (function (WebStandards) {
        var Rules;
        (function (Rules) {
            var JavaScript;
            (function (JavaScript) {
                var libraries = [
                    {
                        name: 'Prototype',
                        minVersions: [
                            { major: '1.7.', minor: '2' }
                        ],
                        check: function (checkVersion, scriptText) {
                            var version = scriptText.match(/Prototype JavaScript framework, version (\d+\.\d+\.\d+)/m);
                            return version && checkVersion(this, version[1]);
                        }
                    },
                    {
                        name: 'Dojo',
                        minVersions: [
                            { major: '1.5.', minor: '3' },
                            { major: '1.6.', minor: '2' },
                            { major: '1.7.', minor: '5' },
                            { major: '1.8.', minor: '5' },
                            { major: '1.9.', minor: '2' },
                            { major: '1.10.', minor: '0' }
                        ],
                        check: function (checkVersion, scriptText) {
                            if (scriptText.indexOf('dojo') === -1) {
                                return false;
                            }
                            var version = scriptText.match(/\.version\s*=\s*\{\s*major:\s*(\d+)\D+(\d+)\D+(\d+)/m);
                            if (version) {
                                return checkVersion(this, version[1] + '.' + version[2] + '.' + version[3]);
                            }
                            version = scriptText.match(/\s*major:\s*(\d+),\s*minor:\s*(\d+),\s*patch:\s*(\d+),/mi);
                            return version && checkVersion(this, version[1] + '.' + version[2] + '.' + version[3]);
                        }
                    },
                    {
                        name: 'Mootools',
                        minVersions: [
                            { major: '1.2.', minor: '6' },
                            { major: '1.4.', minor: '5' },
                            { major: '1.5.', minor: '' }
                        ],
                        check: function (checkVersion, scriptText) {
                            var version = scriptText.match(/this.MooTools\s*=\s*\{version:\s*'(\d+\.\d+\.\d+)/m);
                            return version && checkVersion(this, version[1]);
                        }
                    },
                    {
                        name: 'SWFObject',
                        minVersions: [
                            { major: '2.', minor: '2' }
                        ],
                        check: function (checkVersion, scriptText) {
                            var version = scriptText.match(/\*\s+SWFObject v(\d+\.\d+)/m);
                            return version && checkVersion(this, version[1]);
                        }
                    },
                    {
                        name: 'jQuery Form Plugin',
                        minVersions: [
                            { major: '3.', minor: '22' }
                        ],
                        check: function (checkVersion, scriptText) {
                            var version = scriptText.match(/Form Plugin\s+\*\s+version: (\d+\.\d+)/m);
                            return version && checkVersion(this, version[1]);
                        }
                    },
                    {
                        name: 'Modernizr',
                        minVersions: [
                            { major: '2.5.', minor: '2' },
                            { major: '2.6.', minor: '2' },
                            { major: '2.7.', minor: '1' },
                            { major: '2.8.', minor: '3' }
                        ],
                        check: function (checkVersion, scriptText) {
                            // Static analysis. :(  The version is set as a local variable, far from
                            // where Modernizr._version is set. Just see if we have a comment header.
                            // ALT: look for /VAR="1.2.3"/ then for /._version=VAR/ ... ugh.
                            var version = scriptText.match(/\*\s*Modernizr\s+(\d+\.\d+\.\d+)/m);
                            return version && checkVersion(this, version[1]);
                        }
                    },
                    {
                        name: 'jQuery cookie',
                        minVersions: [
                            { major: '1.3.', minor: '1' },
                            { major: '1.4.', minor: '1' }
                        ],
                        patchOptional: false,
                        check: function (checkVersion, scriptText) {
                            var version = scriptText.match(/\*\s*jQuery Cookie Plugin v(\d+\.\d+\.\d+)/m);
                            return version && checkVersion(this, version[1]);
                        }
                    },
                    {
                        name: 'hoverIntent',
                        minVersions: [
                            { major: '1.8.', minor: '1' }
                        ],
                        patchOptional: false,
                        check: function (checkVersion, scriptText) {
                            var version = scriptText.match(/\*\s*hoverIntent v(\d+\.\d+\.\d+)/m);
                            return version && checkVersion(this, version[1]);
                        }
                    },
                    {
                        name: 'jQuery Easing',
                        minVersions: [
                            { major: '1.3.', minor: '0' }
                        ],
                        patchOptional: true,
                        check: function (checkVersion, scriptText) {
                            var version = scriptText.match(/\*\s*jQuery Easing v(\d+\.\d+)\s*/m);
                            return version && checkVersion(this, version[1]);
                        }
                    },
                    {
                        name: 'underscore',
                        minVersions: [
                            { major: '1.8.', minor: '3' },
                            { major: '1.7.', minor: '0' },
                            { major: '1.6.', minor: '0' },
                            { major: '1.5.', minor: '2' }
                        ],
                        patchOptional: false,
                        check: function (checkVersion, scriptText) {
                            var version = scriptText.match(/exports._(?:.*)?.VERSION="(\d+.\d+.\d+)"/m);
                            return version && checkVersion(this, version[1]);
                        }
                    },
                    {
                        name: 'hammer js',
                        minVersions: [
                            { major: '2.0.', minor: '4' }
                        ],
                        patchOptional: false,
                        check: function (checkVersion, scriptText) {
                            if (scriptText.indexOf('hammer.input') !== -1) {
                                var version = scriptText.match(/.VERSION\s*=\s*['|"](\d+.\d+.\d+)['|"]/m);
                                return version && checkVersion(this, version[1]);
                            }
                            return false;
                        }
                    },
                    {
                        name: 'jQuery Superfish',
                        minVersions: [
                            { major: '1.7.', minor: '4' }
                        ],
                        patchOptional: false,
                        check: function (checkVersion, scriptText) {
                            var version = scriptText.match(/jQuery Superfish Menu Plugin - v(\d+.\d+.\d+)"/m);
                            return version && checkVersion(this, version[1]);
                        }
                    },
                    {
                        name: 'jQuery mousewheel',
                        minVersions: [
                            { major: '3.1.', minor: '12' }
                        ],
                        patchOptional: true,
                        check: function (checkVersion, scriptText) {
                            var version = scriptText.match(/.mousewheel={version:"(\d+.\d+.\d+)/);
                            return version && checkVersion(this, version[1]);
                        }
                    },
                    {
                        name: 'jQuery mobile',
                        minVersions: [
                            { major: '1.4.', minor: '5' },
                            { major: '1.3.', minor: '2' }
                        ],
                        patchOptional: true,
                        check: function (checkVersion, scriptText) {
                            var version = scriptText.match(/.mobile,{version:"(\d+.\d+.\d+)/);
                            return version && checkVersion(this, version[1]);
                        }
                    },
                    {
                        name: 'jQuery UI',
                        minVersions: [
                            { major: '1.8.', minor: '24' },
                            { major: '1.9.', minor: '2' },
                            { major: '1.10.', minor: '4' },
                            { major: '1.11.', minor: '4' }
                        ],
                        check: function (checkVersion, scriptText) {
                            var version = scriptText.match(/\.ui,[\s\r\n]*\{[\s\r\n]*version:\s*"(\d+.\d+.\d+)/m);
                            return version && checkVersion(this, version[1]);
                        }
                    },
                    {
                        name: 'jQuery',
                        minVersions: [
                            { major: '1.6.', minor: '4' },
                            { major: '1.7.', minor: '2' },
                            { major: '1.8.', minor: '2' },
                            { major: '1.9.', minor: '1' },
                            { major: '1.10.', minor: '2' },
                            { major: '1.11.', minor: '3' },
                            { major: '2.0.', minor: '3' },
                            { major: '2.1.', minor: '4' }
                        ],
                        patchOptional: true,
                        check: function (checkVersion, scriptText) {
                            //We search the version in the header
                            //Explanation: Some libraries have things like: Requires: jQuery v1.7.1 (cycle, for example)
                            //We are matching regex that contain jQuery vx.y.z but do not have : right before jQuery
                            var regex = /(?:jQuery\s*v)(\d+.\d+.\d+)\s/g;
                            var regversion = regex.exec(scriptText);
                            if (regversion) {
                                var isPluginRegExp = new RegExp('(?::\\s*)' + regversion[0], 'g');
                                if (!isPluginRegExp.exec(scriptText)) {
                                    return checkVersion(this, regversion[1]);
                                }
                            }
                            var matchversion = scriptText.match(/jquery:\s*"([^"]+)/);
                            if (matchversion) {
                                return checkVersion(this, matchversion[1]);
                            }
                            //If header fails, we look with another pattern
                            var regex = /(?:jquery[,\)].{0,200}=")(\d+\.\d+)(\..*?)"/gi;
                            var results = regex.exec(scriptText);
                            var version = results ? (results[1] + (results[2] || '')) : null;
                            return version && checkVersion(this, version);
                        }
                    }
                ];
                JavaScript.librariesVersions = {
                    id: "webstandards.javascript-libraries-versions",
                    title: "update javascript libraries",
                    description: "Try being up to date with your JavaScript libraries like jQuery. Latest versions usually improves performances and browsers compatibility.",
                    prepare: function (rulecheck, analyzeSummary) {
                        rulecheck.items = rulecheck.items || [];
                        rulecheck.type = "blockitems";
                    },
                    check: function (url, javascriptContent, rulecheck, analyzeSummary) {
                        rulecheck.items = rulecheck.items || [];
                        var filecheck = null;
                        if (!javascriptContent || url == "inline")
                            return;
                        for (var i = 0; i < libraries.length; i++) {
                            var lib = libraries[i], result;
                            result = lib.check.call(lib, this.checkVersion, javascriptContent);
                            if (result && result.needsUpdate) {
                                if (!filecheck) {
                                    filecheck = {
                                        title: url,
                                        items: []
                                    };
                                    rulecheck.items.push(filecheck);
                                }
                                filecheck.items.push({
                                    title: "detected " + result.name + " version " + result.version,
                                });
                                rulecheck.failed = true;
                                break;
                            }
                        }
                    },
                    checkVersion: function (library, version) {
                        var vinfo = {
                            name: library.name,
                            needsUpdate: true,
                            minVersion: library.minVersions[0].major + library.minVersions[0].minor,
                            version: version,
                            bannedVersion: null
                        };
                        if (library.patchOptional) {
                            // If lib can have an implied ".0", add it when needed
                            // match 1.17, 1.17b2, 1.17-beta2; not 1.17.0, 1.17.2, 1.17b2
                            var parts = version.match(/^(\d+\.\d+)(.*)$/);
                            if (parts && !/^\.\d+/.test(parts[2])) {
                                version = parts[1] + '.0' + parts[2];
                            }
                        }
                        for (var i = 0; i < library.minVersions.length; i++) {
                            var gv = library.minVersions[i];
                            if (version.indexOf(gv.major) === 0) {
                                vinfo.minVersion = gv.major + gv.minor;
                                vinfo.needsUpdate = +version.slice(gv.major.length) < +gv.minor;
                                break;
                            }
                        }
                        if (library.bannedVersions) {
                            if (library.bannedVersions.indexOf(version) >= 0) {
                                vinfo.bannedVersion = version;
                                vinfo.needsUpdate = true;
                            }
                        }
                        return vinfo;
                    }
                };
            })(JavaScript = Rules.JavaScript || (Rules.JavaScript = {}));
        })(Rules = WebStandards.Rules || (WebStandards.Rules = {}));
    })(WebStandards = VORLON.WebStandards || (VORLON.WebStandards = {}));
})(VORLON || (VORLON = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VORLON;
(function (VORLON) {
    var WebStandardsClient = (function (_super) {
        __extends(WebStandardsClient, _super);
        function WebStandardsClient() {
            _super.call(this, "webstandards");
            this._currentAnalyze = {};
            this._id = "WEBSTANDARDS";
            //this.debug = true;
        }
        WebStandardsClient.prototype.refresh = function () {
        };
        // Start the clientside code
        WebStandardsClient.prototype.startClientSide = function () {
            var _this = this;
            this._loadNewScriptAsync("css.js", function () {
                _this._loadNewScriptAsync("axe.min.js", function () {
                    _this._ready = true;
                    for (var generalRuleName in VORLON.WebStandards.Rules) {
                        for (var ruleName in VORLON.WebStandards.Rules[generalRuleName]) {
                            var rule = VORLON.WebStandards.Rules[generalRuleName][ruleName];
                            if (rule.init) {
                                rule.init();
                            }
                        }
                    }
                }, true);
            }, true);
        };
        WebStandardsClient.prototype.startNewAnalyze = function (data) {
            var _this = this;
            this.trace("start webstandards analyzis " + data.id);
            this._currentAnalyze = {
                id: data.id,
                results: {},
                processing: true,
                canceled: false,
                location: window.location.href,
                html: document.documentElement.outerHTML,
                doctype: {
                    html: null,
                    name: null,
                    publicId: null,
                    systemId: null
                },
                files: {
                    scripts: {},
                    stylesheets: {}
                },
                pendingLoad: 0,
                lastActivity: new Date()
            };
            this.prepareAnalyze(this._currentAnalyze);
            var node = document.doctype;
            if (node) {
                var doctypeHtml = "<!DOCTYPE "
                    + node.name
                    + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '')
                    + (!node.publicId && node.systemId ? ' SYSTEM' : '')
                    + (node.systemId ? ' "' + node.systemId + '"' : '')
                    + '>';
                this._currentAnalyze.doctype = {
                    html: doctypeHtml,
                    name: node.name,
                    publicId: node.publicId,
                    systemId: node.systemId
                };
            }
            var stylesheets = document.querySelectorAll("link[rel=stylesheet]");
            var nbStylesheets = stylesheets.length;
            for (var i = 0; i < stylesheets.length; i++) {
                var s = stylesheets[i];
                var href = s.attributes.getNamedItem("href");
                if (href) {
                    var file = { url: href.value, loaded: false, content: null };
                    this._currentAnalyze.files.stylesheets[href.value] = file;
                    this.getDocumentContent({ analyzeid: data.id, url: href.value }, file, function (url, file) {
                        _this.analyzeCssDocument(url, file.content, _this._currentAnalyze);
                    });
                }
            }
            var scripts = document.querySelectorAll("script");
            var nbScripts = scripts.length;
            for (var i = 0; i < scripts.length; i++) {
                var s = scripts[i];
                var src = s.attributes.getNamedItem("src");
                if (src && src.value) {
                    var isVorlon = src.value.indexOf('vorlon.js') > 0 || src.value.indexOf('vorlon.min.js') > 0 || src.value.indexOf('vorlon.max.js') > 0;
                    if (!isVorlon) {
                        var file = { url: src.value, loaded: false, content: null };
                        this._currentAnalyze.files.scripts[src.value] = file;
                        this.getDocumentContent({ analyzeid: data.id, url: src.value }, file, function (url, file) {
                            _this.analyzeJsDocument(url, file.content, _this._currentAnalyze);
                        });
                    }
                }
            }
            this.analyzeDOM(document, this._currentAnalyze.html, this._currentAnalyze);
            this._refreshLoop = setInterval(function () {
                _this.checkLoadingState();
            }, 1000);
        };
        WebStandardsClient.prototype.checkLoadingState = function () {
            if (this._currentAnalyze && this._currentAnalyze.pendingLoad <= 0) {
                this.trace("resource load completed");
                this._currentAnalyze.processing = false;
            }
            if (!this._currentAnalyze || this._currentAnalyze.ended || this._currentAnalyze.canceled) {
                return;
            }
            if (this._currentAnalyze.processing) {
                return;
            }
            else {
                this._currentAnalyze.ended = true;
                this.endAnalyze(this._currentAnalyze);
            }
        };
        WebStandardsClient.prototype.initialiseRuleSummary = function (rule, analyze) {
            var tokens = rule.id.split('.');
            var current = analyze.results;
            var id = "";
            current.rules = current.rules || {};
            tokens.forEach(function (t) {
                id = (id.length > 0) ? "." + t : t;
                if (!current.rules) {
                    current.rules = {};
                }
                if (!current.rules[t])
                    current.rules[t] = { id: id };
                current = current.rules[t];
            });
            if (current.failed === undefined) {
                current.failed = false;
                current.title = rule.title;
                current.description = rule.description;
            }
            return current;
        };
        WebStandardsClient.prototype.prepareAnalyze = function (analyze) {
            for (var n in VORLON.WebStandards.Rules.CSS) {
                var cssrule = VORLON.WebStandards.Rules.CSS[n];
                if (cssrule) {
                    var current = this.initialiseRuleSummary(cssrule, analyze);
                    if (cssrule.prepare)
                        cssrule.prepare(current, analyze);
                }
            }
            for (var n in VORLON.WebStandards.Rules.JavaScript) {
                var scriptrule = VORLON.WebStandards.Rules.JavaScript[n];
                if (scriptrule) {
                    var current = this.initialiseRuleSummary(scriptrule, analyze);
                    if (scriptrule.prepare)
                        scriptrule.prepare(current, analyze);
                }
            }
            for (var n in VORLON.WebStandards.Rules.Accessibility) {
                var accessibilityRule = VORLON.WebStandards.Rules.Accessibility[n];
                if (accessibilityRule) {
                    var current = this.initialiseRuleSummary(accessibilityRule, analyze);
                    if (accessibilityRule.prepare)
                        accessibilityRule.prepare(current, analyze);
                }
            }
        };
        WebStandardsClient.prototype.endAnalyze = function (analyze) {
            clearInterval(this._refreshLoop);
            for (var n in VORLON.WebStandards.Rules.DOM) {
                var rule = VORLON.WebStandards.Rules.DOM[n];
                if (rule && !rule.generalRule && rule.endcheck) {
                    var current = this.initialiseRuleSummary(rule, analyze);
                    rule.endcheck(current, analyze);
                }
            }
            for (var n in VORLON.WebStandards.Rules.CSS) {
                var cssrule = VORLON.WebStandards.Rules.CSS[n];
                if (cssrule) {
                    var current = this.initialiseRuleSummary(cssrule, analyze);
                    if (cssrule.endcheck)
                        cssrule.endcheck(current, analyze);
                }
            }
            for (var n in VORLON.WebStandards.Rules.JavaScript) {
                var scriptrule = VORLON.WebStandards.Rules.JavaScript[n];
                if (scriptrule) {
                    var current = this.initialiseRuleSummary(scriptrule, analyze);
                    if (scriptrule.endcheck)
                        scriptrule.endcheck(current, analyze);
                }
            }
            this.analyzeFiles(this._currentAnalyze);
            this.trace("sending result to dashboard");
            this.sendCommandToDashboard("analyseResult", { result: this._currentAnalyze });
        };
        WebStandardsClient.prototype.cancelAnalyse = function (id) {
            clearInterval(this._refreshLoop);
            this.trace("canceling analyze " + id);
            if (this._currentAnalyze && this._currentAnalyze.id == id) {
                this.trace("analyze " + id + " canceled");
                this._currentAnalyze.canceled = true;
                this._currentAnalyze.processing = false;
                this.sendCommandToDashboard("analyseCanceled", { id: this._currentAnalyze.id });
            }
        };
        WebStandardsClient.prototype.analyzeDOM = function (document, htmlContent, analyze) {
            var _this = this;
            var generalRules = [];
            var commonRules = [];
            var rules = {
                domRulesIndex: {},
                domRulesForAllNodes: []
            };
            //we index rules based on target node types
            for (var n in VORLON.WebStandards.Rules.DOM) {
                var rule = VORLON.WebStandards.Rules.DOM[n];
                if (rule) {
                    var rulecheck = this.initialiseRuleSummary(rule, analyze);
                    if (rule.prepare) {
                        rule.prepare(rulecheck, analyze);
                    }
                    if (rule.generalRule) {
                        generalRules.push(rule);
                    }
                    else {
                        commonRules.push(rule);
                        if (rule.nodeTypes.length) {
                            rule.nodeTypes.forEach(function (n) {
                                n = n.toUpperCase();
                                if (!rules.domRulesIndex[n])
                                    rules.domRulesIndex[n] = [];
                                rules.domRulesIndex[n].push(rule);
                            });
                        }
                        else {
                            rules.domRulesForAllNodes.push(rule);
                        }
                    }
                }
            }
            this.analyzeDOMNode(document, rules, analyze, htmlContent);
            generalRules.forEach(function (rule) {
                _this.applyDOMNodeRule(document, rule, analyze, htmlContent);
            });
        };
        WebStandardsClient.prototype.analyzeDOMNode = function (node, rules, analyze, htmlContent) {
            var _this = this;
            if (node.nodeName === "STYLE") {
                this.analyzeCssDocument("inline", node.innerHTML, analyze);
            }
            if (node.nodeName === "SCRIPT") {
                var domnode = node;
                var scriptType = domnode.getAttribute("type");
                var hasContent = domnode.innerHTML.trim().length > 0;
                if (!scriptType || scriptType == "text/javascript" && hasContent) {
                    this.analyzeJsDocument("inline", domnode.innerHTML, analyze);
                }
            }
            var specificRules = rules.domRulesIndex[node.nodeName.toUpperCase()];
            if (specificRules && specificRules.length) {
                specificRules.forEach(function (r) {
                    _this.applyDOMNodeRule(node, r, analyze, htmlContent);
                });
            }
            if (rules.domRulesForAllNodes && rules.domRulesForAllNodes.length) {
                rules.domRulesForAllNodes.forEach(function (r) {
                    _this.applyDOMNodeRule(node, r, analyze, htmlContent);
                });
            }
            for (var i = 0, l = node.childNodes.length; i < l; i++) {
                this.analyzeDOMNode(node.childNodes[i], rules, analyze, htmlContent);
            }
        };
        WebStandardsClient.prototype.applyDOMNodeRule = function (node, rule, analyze, htmlContent) {
            var current = this.initialiseRuleSummary(rule, analyze);
            rule.check(node, current, analyze, htmlContent);
        };
        WebStandardsClient.prototype.analyzeCssDocument = function (url, content, analyze) {
            var parser = new cssjs();
            var parsed = parser.parseCSS(content);
            this.trace("processing css " + url);
            //we index rules based on target node types
            for (var n in VORLON.WebStandards.Rules.CSS) {
                var rule = VORLON.WebStandards.Rules.CSS[n];
                if (rule) {
                    var current = this.initialiseRuleSummary(rule, analyze);
                    rule.check(url, parsed, current, analyze);
                }
            }
        };
        WebStandardsClient.prototype.analyzeFiles = function (analyze) {
            for (var n in VORLON.WebStandards.Rules.Files) {
                var rule = VORLON.WebStandards.Rules.Files[n];
                if (rule) {
                    var current = this.initialiseRuleSummary(rule, analyze);
                    rule.check(current, analyze);
                }
            }
        };
        WebStandardsClient.prototype.analyzeJsDocument = function (url, content, analyze) {
            this.trace("processing script " + url);
            for (var n in VORLON.WebStandards.Rules.JavaScript) {
                var rule = VORLON.WebStandards.Rules.JavaScript[n];
                if (rule) {
                    var current = this.initialiseRuleSummary(rule, analyze);
                    rule.check(url, content, current, analyze);
                }
            }
        };
        WebStandardsClient.prototype.getDocumentContent = function (data, file, resultcallback) {
            var _this = this;
            this._currentAnalyze.pendingLoad++;
            this.trace("request file " + data.url + " " + this._currentAnalyze.pendingLoad);
            this.xhrDocumentContent(data, function (url, content, status, contentlength, encoding, error) {
                file.content = content;
                file.loaded = (error == null || error == undefined);
                file.encoding = encoding;
                file.contentLength = contentlength;
                file.error = error;
                file.status = status;
                _this._currentAnalyze.lastActivity = new Date();
                _this._currentAnalyze.pendingLoad--;
                _this.checkLoadingState();
                if (file.loaded && !_this._currentAnalyze.canceled) {
                    resultcallback(data.url, file);
                }
            });
        };
        WebStandardsClient.prototype.xhrDocumentContent = function (data, resultcallback) {
            var _this = this;
            var xhr = null;
            var completed = false;
            var timeoutRef = null;
            if (!data || !data.url) {
                this.trace("invalid fetch request");
                return;
            }
            var documentUrl = data.url;
            if (documentUrl.indexOf("//") === 0) {
                documentUrl = window.location.protocol + documentUrl;
            }
            documentUrl = this.getAbsolutePath(documentUrl);
            this.trace("fetching " + documentUrl);
            try {
                xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            completed = true;
                            clearTimeout(timeoutRef);
                            var encoding = xhr.getResponseHeader("X-VorlonProxyEncoding") || xhr.getResponseHeader("content-encoding");
                            var contentLength = xhr.getResponseHeader("content-length");
                            _this.trace("encoding for " + data.url + " is " + encoding);
                            resultcallback(data.url, xhr.responseText, xhr.status, contentLength, encoding, null);
                        }
                        else {
                            completed = true;
                            clearTimeout(timeoutRef);
                            resultcallback(data.url, null, xhr.status, null, null, xhr.responseText);
                        }
                    }
                };
                xhr.open("GET", documentUrl, true);
                xhr.send(null);
                timeoutRef = setTimeout(function () {
                    if (!completed) {
                        completed = true;
                        _this.trace("fetch timeout for " + data.url);
                        xhr.abort();
                        resultcallback(data.url, null, null, null, null, "timeout");
                    }
                }, 20 * 1000);
            }
            catch (e) {
                console.error(e);
                completed = true;
                clearTimeout(timeoutRef);
                resultcallback(data.url, null, null, null, null, e.message);
            }
        };
        WebStandardsClient.prototype.getAbsolutePath = function (url) {
            var a = document.createElement('a');
            a.href = url;
            return a.href;
        };
        return WebStandardsClient;
    }(VORLON.ClientPlugin));
    VORLON.WebStandardsClient = WebStandardsClient;
    WebStandardsClient.prototype.ClientCommands = {
        startNewAnalyze: function (data) {
            var plugin = this;
            plugin.startNewAnalyze(data);
        },
        cancelAnalyze: function (data) {
            var plugin = this;
            plugin.cancelAnalyse(data.id);
        }
    };
    //Register the plugin with vorlon core
    VORLON.Core.RegisterClientPlugin(new WebStandardsClient());
})(VORLON || (VORLON = {}));
