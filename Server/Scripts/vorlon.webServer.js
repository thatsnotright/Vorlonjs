"use strict";
var express = require("express");
var path = require("path");
var stylus = require("stylus");
var fs = require("fs");
var mkdirp = require("mkdirp");
var vauth = require("./vorlon.authentication");
var VORLON;
(function (VORLON) {
    var WebServer = (function () {
        function WebServer(context) {
            this._bodyParser = require("body-parser");
            this._cookieParser = require("cookie-parser");
            this._methodOverride = require("method-override");
            this._session = require("express-session");
            this._json = require("json");
            this._multer = require("multer");
            this._passport = require("passport");
            this._localStrategy = require("passport-local");
            this._twitterStrategy = require("passport-twitter");
            this._app = express();
            this._components = new Array();
            this.httpConfig = context.httpConfig;
            this.baseURLConfig = context.baseURLConfig;
            this._log = context.logger;
        }
        WebServer.prototype.init = function () {
            for (var id in this._components) {
                var component = this._components[id];
                component.addRoutes(this._app, this._passport);
            }
        };
        Object.defineProperty(WebServer.prototype, "components", {
            get: function () {
                return this._components;
            },
            set: function (comp) {
                this._components = comp;
            },
            enumerable: true,
            configurable: true
        });
        WebServer.prototype.start = function () {
            var _this = this;
            var app = this._app;
            //Command line
            var stopExecution = false;
            process.argv.forEach(function (val, index, array) {
                var _this = this;
                switch (val) {
                    case "--version":
                        fs.readFile(path.join(__dirname, "../../package.json"), "utf8", function (err, packageData) {
                            if (err) {
                                _this._log.error("Error reading package.json file");
                                return;
                            }
                            var _package = JSON.parse(packageData.replace(/^\uFEFF/, ''));
                            _this._log.info('Vorlon.js v' + _package.version);
                        });
                        stopExecution = true;
                        break;
                }
            });
            if (stopExecution) {
                return;
            }
            var cors = require("cors");
            //Sets
            app.set('host', this.httpConfig.host);
            app.set('port', this.httpConfig.port);
            app.set('socket', this.httpConfig.socket);
            app.set('views', path.join(__dirname, '../views'));
            app.set('view engine', 'jade');
            // Cors
            var corsOptions = {
                origin: true,
                credentials: true,
                exposedHeaders: ["X-VorlonProxyEncoding", "Content-Encoding", "Content-Length"]
            };
            app.use(cors(corsOptions));
            app.options('*', cors(corsOptions));
            //Uses
            this._passport.use(new this._localStrategy(function (username, password, done) {
                // insert your MongoDB check here. For now, just a simple hardcoded check.
                if (username === vauth.VORLON.Authentication.UserName && password === vauth.VORLON.Authentication.Password) {
                    done(null, { user: username });
                }
                else {
                    done(null, false);
                }
            }));
            this._passport.serializeUser(function (user, done) {
                done(null, user);
            });
            this._passport.deserializeUser(function (user, done) {
                done(null, user);
            });
            app.use(stylus.middleware(path.join(__dirname, '../public')));
            app.use(this.baseURLConfig.baseURL, express.static(path.join(__dirname, '../public')));
            app.use(this._bodyParser.urlencoded({ extended: false }));
            app.use(this._bodyParser.json());
            app.use(this._cookieParser());
            app.use(this._multer());
            app.use(this._methodOverride());
            app.use(this._session({
                secret: '1th3is4is3as2e5cr6ec7t7keyf23or1or5lon5',
                expires: false,
                saveUninitialized: true,
                resave: true }));
            app.use(this._passport.initialize());
            app.use(this._passport.session());
            vauth.VORLON.Authentication.loadAuthConfig(this.baseURLConfig.baseURL);
            this.init();
            if (this.httpConfig.socket) {
                // In case we didn't shutdown gracefully last time
                if (fs.existsSync(app.get('socket'))) {
                    fs.unlinkSync(app.get('socket'));
                }
                mkdirp.sync(path.dirname(app.get('socket')));
                this._httpServer = this.httpConfig.httpModule.createServer(app).listen(app.get('socket'), function () {
                    fs.chmodSync(app.get('socket'), '700'); // Socket is user only for security
                    _this._log.info('Vorlon.js SERVER listening on socket ' + app.get('socket'));
                });
            }
            else if (this.httpConfig.useSSL) {
                this._httpServer = this.httpConfig.httpModule.createServer(this.httpConfig.options, app).listen(app.get('port'), app.get('host'), undefined, function () {
                    _this._log.info('Vorlon.js SERVER with SSL listening at ' + app.get('host') + ':' + app.get('port'));
                });
            }
            else {
                this._httpServer = this.httpConfig.httpModule.createServer(app).listen(app.get('port'), app.get('host'), undefined, function () {
                    _this._log.info('Vorlon.js SERVER listening at ' + app.get('host') + ':' + app.get('port'));
                });
            }
            for (var id in this._components) {
                var component = this._components[id];
                component.start(this._httpServer);
            }
        };
        Object.defineProperty(WebServer.prototype, "httpServer", {
            get: function () {
                return this._httpServer;
            },
            enumerable: true,
            configurable: true
        });
        return WebServer;
    }());
    VORLON.WebServer = WebServer;
})(VORLON = exports.VORLON || (exports.VORLON = {}));
