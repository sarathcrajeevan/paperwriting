! function(e, r) {
    "object" == typeof exports && "object" == typeof module ? module.exports = r(require("_")) : "function" == typeof define && define.amd ? define(["_"], r) : "object" == typeof exports ? exports["wix-code-viewer-app"] = r(require("_")) : e["wix-code-viewer-app"] = r(e._)
}("undefined" != typeof self ? self : this, function(e) {
    return function(e) {
        var r = {};

        function t(n) {
            if (r[n]) return r[n].exports;
            var o = r[n] = {
                i: n,
                l: !1,
                exports: {}
            };
            return e[n].call(o.exports, o, o.exports, t), o.l = !0, o.exports
        }
        return t.m = e, t.c = r, t.d = function(e, r, n) {
            t.o(e, r) || Object.defineProperty(e, r, {
                enumerable: !0,
                get: n
            })
        }, t.r = function(e) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                value: "Module"
            }), Object.defineProperty(e, "__esModule", {
                value: !0
            })
        }, t.t = function(e, r) {
            if (1 & r && (e = t(e)), 8 & r) return e;
            if (4 & r && "object" == typeof e && e && e.__esModule) return e;
            var n = Object.create(null);
            if (t.r(n), Object.defineProperty(n, "default", {
                    enumerable: !0,
                    value: e
                }), 2 & r && "string" != typeof e)
                for (var o in e) t.d(n, o, function(r) {
                    return e[r]
                }.bind(null, o));
            return n
        }, t.n = function(e) {
            var r = e && e.__esModule ? function() {
                return e.default
            } : function() {
                return e
            };
            return t.d(r, "a", r), r
        }, t.o = function(e, r) {
            return Object.prototype.hasOwnProperty.call(e, r)
        }, t.p = "", t(t.s = 19)
    }([function(r, t) {
        r.exports = e
    }, function(e, r, t) {
        "use strict";
        var n = t(26),
            o = n.create,
            i = n.matchAny,
            a = t(30).consoleHandlerCreator;
        e.exports = {
            create: o,
            matchAny: i,
            consoleHandlerCreator: a
        }
    }, function(e, r, t) {
        "use strict";
        var n, o;

        function i(e, r, t) {
            return r in e ? Object.defineProperty(e, r, {
                value: t,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[r] = t, e
        }
        var a = t(9).logLevels,
            u = {
                INFO: "INFO",
                WARN: "WARNING",
                ERROR: "ERROR",
                LOG: "LOG",
                VERBOSE: "VERBOSE",
                DEBUG: "DEBUG",
                ASSERT: "ASSERT",
                DIR: "DIR",
                TABLE: "TABLE",
                TRACE: "TRACE"
            },
            s = {
                DEFAULT: "DEFAULT",
                DEBUG: "DEBUG",
                INFO: "INFO",
                WARNING: "WARNING",
                ERROR: "ERROR"
            },
            c = (i(n = {}, u.INFO, s.INFO), i(n, u.WARN, s.WARNING), i(n, u.ERROR, s.ERROR), i(n, u.LOG, s.INFO), i(n, u.VERBOSE, s.DEBUG), i(n, u.DEBUG, s.DEBUG), i(n, u.ASSERT, s.ERROR), i(n, u.DIR, s.INFO), i(n, u.TABLE, s.INFO), i(n, u.TRACE, s.INFO), n),
            f = (i(o = {}, u.INFO, a.INFO), i(o, u.WARN, a.WARNING), i(o, u.ERROR, a.ERROR), i(o, u.LOG, a.LOG), i(o, u.VERBOSE, a.VERBOSE), i(o, u.DEBUG, a.LOG), i(o, u.ASSERT, a.ERROR), i(o, u.DIR, a.LOG), i(o, u.TABLE, a.LOG), i(o, u.TRACE, a.LOG), o);
        e.exports.wixCodeLogLevel = u, e.exports.siteMonitoringSeverity = s, e.exports.convertToSiteMonitoringSeverity = function(e) {
            return c[e]
        }, e.exports.convertToDeveloperConsoleSeverity = function(e) {
            return f[e]
        }
    }, function(e, r, t) {
        "use strict";
        var n = t(10).traceHandlerIds.SYSTEM_TRACING,
            o = t(52).traceLevels;
        e.exports.initAppForPage = function() {
            return {
                actionName: "wixCode/initAppForPage",
                options: {
                    level: o.INFO,
                    reportToHandlers: [n]
                }
            }
        }, e.exports.createControllers = function() {
            return {
                actionName: "wixCode/createControllers",
                options: {
                    level: o.INFO,
                    reportToHandlers: [n]
                }
            }
        }, e.exports.loadUserCode = function() {
            return {
                actionName: "wixCode/loadUserCode",
                options: {
                    level: o.INFO,
                    reportToHandlers: [n]
                }
            }
        }, e.exports.loadSiteMonitoringConfig = function() {
            return {
                actionName: "wixCode/loadSiteMonitoringConfig",
                options: {
                    level: o.INFO,
                    reportToHandlers: [n]
                }
            }
        }
    }, function(e, r, t) {
        "use strict";
        var n = function() {
            var e = new Error;
            return e.stack ? e.stack.toString() : ""
        };
        e.exports.getAppUrl = function(e) {
            var r = n().match(new RegExp("https?://.*?" + e + ".*?.js"));
            return r ? r[0] : ""
        }, e.exports.isLocalhost = function() {
            return /https?:\/\/localhost/.test(n())
        }
    }, function(e, r) {
        var t;
        t = function() {
            return this
        }();
        try {
            t = t || Function("return this")() || (0, eval)("this")
        } catch (e) {
            "object" == typeof window && (t = window)
        }
        e.exports = t
    }, function(e, r, t) {
        "use strict";
        var n = t(34),
            o = t(35),
            i = t(36);
        e.exports = {
            union: n,
            Result: o,
            Maybe: i
        }
    }, function(e, r, t) {
        "use strict";

        function n(e, r) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !r || "object" != typeof r && "function" != typeof r ? e : r
        }

        function o(e) {
            function r() {
                e.apply(this, arguments)
            }
            return r.prototype = Object.create(e.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), Object.setPrototypeOf ? Object.setPrototypeOf(r, e) : r.__proto__ = e, r
        }
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var i = function(e) {
            function r() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
                ! function(e, r) {
                    if (!(e instanceof r)) throw new TypeError("Cannot call a class as a function")
                }(this, r);
                var t = n(this, (r.__proto__ || Object.getPrototypeOf(r)).call(this, e));
                return Object.defineProperty(t, "message", {
                    configurable: !0,
                    enumerable: !1,
                    value: e,
                    writable: !0
                }), Object.defineProperty(t, "name", {
                    configurable: !0,
                    enumerable: !1,
                    value: t.constructor.name,
                    writable: !0
                }), Error.hasOwnProperty("captureStackTrace") ? (Error.captureStackTrace(t, t.constructor), n(t)) : (Object.defineProperty(t, "stack", {
                    configurable: !0,
                    enumerable: !1,
                    value: new Error(e).stack,
                    writable: !0
                }), t)
            }
            return function(e, r) {
                if ("function" != typeof r && null !== r) throw new TypeError("Super expression must either be null or a function, not " + typeof r);
                e.prototype = Object.create(r && r.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), r && (Object.setPrototypeOf ? Object.setPrototypeOf(e, r) : e.__proto__ = r)
            }(r, o(Error)), r
        }();
        r.default = i, e.exports = r.default
    }, function(e, r, t) {
        "use strict";
        e.exports = {
            userCodeLoaded: function(e) {
                return {
                    evid: 133,
                    worker_id: e.pageId
                }
            },
            active$wSiteViewMode: function(e) {
                var r = e.isPopup,
                    t = e.isServerSide;
                return {
                    evid: 136,
                    worker_id: e.pageId,
                    is_lightbox: r,
                    isServerSide: t,
                    pn: e.pageNumber,
                    page_url: e.pageUrl,
                    tsn: e.tsn
                }
            },
            active$wPreviewMode: function(e) {
                var r = e.pageNumber,
                    t = e.pageUrl,
                    n = e.tsn;
                return {
                    evid: 150,
                    pn: r,
                    pageurl: t,
                    pageId: e.pageId,
                    tsn: n
                }
            },
            pageCodeRun: function(e) {
                return {
                    evid: 272,
                    msid: e.metaSiteId,
                    bsi: e.bsi,
                    vsi: e.viewerSessionId,
                    pageId: e.pageId,
                    file_code: e.pageName,
                    page_url: e.pageUrl,
                    code_app_id: e.codeAppId,
                    running_environment: e.viewMode,
                    tsn: e.tsn
                }
            }
        }
    }, function(e, r, t) {
        "use strict";
        var n = t(0),
            o = t(22),
            i = t(23),
            a = "WIX_CODE",
            u = "console";

        function s() {
            return o.parent && o.parent !== o
        }

        function c(e) {
            for (var r = arguments.length, t = new Array(r > 1 ? r - 1 : 0), n = 1; n < r; n++) t[n - 1] = arguments[n];
            return {
                intent: a,
                type: u,
                data: {
                    logLevel: e,
                    args: [].concat(t)
                }
            }
        }

        function f(e) {
            o.parent.postMessage(l(e), "*")
        }

        function l(e) {
            return JSON.stringify(e, i)
        }
        var p = {
            LOG: "LOG",
            INFO: "INFO",
            WARNING: "WARNING",
            VERBOSE: "VERBOSE",
            ERROR: "ERROR"
        };
        e.exports = {
            logLevels: p,
            logWixCodeConsoleMessage: function(e, r) {
                if (void 0 === r && (r = p.info), e) {
                    if (r === p.ERROR) throw new Error('For error messages, please use "logWixCodeConsoleError"');
                    n.isString(e) && (e = c(r, e)),
                        function(e) {
                            return e.intent === a && e.type === u
                        }(e) && s() && f(e)
                }
            },
            logWixCodeConsoleError: function(e) {
                s() && f(c(p.ERROR, e.name, e.message, e.stack))
            },
            serializeMessage: l
        }
    }, function(e, r, t) {
        "use strict";
        var n = t(4).isLocalhost,
            o = t(25).loggerCreator,
            i = t(1).consoleHandlerCreator,
            a = {
                SYSTEM_TRACING: t(16).id
            };
        e.exports.logger = function() {
            var e = i({
                shouldLog: n
            }).consoleHandler;
            return o({
                consoleHandler: e
            })
        }, e.exports.traceHandlerIds = a
    }, function(e, r, t) {
        "use strict";
        var n = t(27),
            o = t(28),
            i = t(29);
        e.exports = {
            union: n,
            Result: o,
            Maybe: i
        }
    }, function(e, r, t) {
        "use strict";
        var n = t(38),
            o = t(39),
            i = t(40);
        e.exports = {
            union: n,
            Result: o,
            Maybe: i
        }
    }, function(e, r, t) {
        "use strict";
        var n = t(7),
            o = "LoadUserCodeError",
            i = function(e) {
                function r(e, t) {
                    ! function(e, r) {
                        if (!(e instanceof r)) throw new TypeError("Cannot call a class as a function")
                    }(this, r);
                    var n = function(e, r) {
                        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        return !r || "object" != typeof r && "function" != typeof r ? e : r
                    }(this, (r.__proto__ || Object.getPrototypeOf(r)).call(this, "Failed to import user code script: " + e.message));
                    return n.name = o, n.originalError = e, n.url = t, n
                }
                return function(e, r) {
                    if ("function" != typeof r && null !== r) throw new TypeError("Super expression must either be null or a function, not " + typeof r);
                    e.prototype = Object.create(r && r.prototype, {
                        constructor: {
                            value: e,
                            enumerable: !1,
                            writable: !0,
                            configurable: !0
                        }
                    }), r && (Object.setPrototypeOf ? Object.setPrototypeOf(e, r) : e.__proto__ = r)
                }(r, n), r
            }();
        e.exports.LoadUserCodeError = i, e.exports.ERROR_NAME = o
    }, function(e, r, t) {
        "use strict";
        var n = t(7),
            o = "TelemetryConfigurationNetworkError",
            i = function(e) {
                function r(e, t) {
                    ! function(e, r) {
                        if (!(e instanceof r)) throw new TypeError("Cannot call a class as a function")
                    }(this, r);
                    var n = function(e, r) {
                        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        return !r || "object" != typeof r && "function" != typeof r ? e : r
                    }(this, (r.__proto__ || Object.getPrototypeOf(r)).call(this, e.message));
                    return n.name = o, n.originalError = e, n.url = t, n
                }
                return function(e, r) {
                    if ("function" != typeof r && null !== r) throw new TypeError("Super expression must either be null or a function, not " + typeof r);
                    e.prototype = Object.create(r && r.prototype, {
                        constructor: {
                            value: e,
                            enumerable: !1,
                            writable: !0,
                            configurable: !0
                        }
                    }), r && (Object.setPrototypeOf ? Object.setPrototypeOf(e, r) : e.__proto__ = r)
                }(r, n), r
            }();
        e.exports.TelemetryConfigurationNetworkError = i, e.exports.ERROR_NAME = o
    }, function(e, r, t) {
        "use strict";
        var n = t(7),
            o = "TelemetryLogSendError",
            i = function(e) {
                function r(e, t) {
                    ! function(e, r) {
                        if (!(e instanceof r)) throw new TypeError("Cannot call a class as a function")
                    }(this, r);
                    var n = function(e, r) {
                        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        return !r || "object" != typeof r && "function" != typeof r ? e : r
                    }(this, (r.__proto__ || Object.getPrototypeOf(r)).call(this, e.message));
                    return n.name = o, n.originalError = e, n.payload = t, n
                }
                return function(e, r) {
                    if ("function" != typeof r && null !== r) throw new TypeError("Super expression must either be null or a function, not " + typeof r);
                    e.prototype = Object.create(r && r.prototype, {
                        constructor: {
                            value: e,
                            enumerable: !1,
                            writable: !0,
                            configurable: !0
                        }
                    }), r && (Object.setPrototypeOf ? Object.setPrototypeOf(e, r) : e.__proto__ = r)
                }(r, n), r
            }();
        e.exports.TelemetryLogSendError = i, e.exports.ERROR_NAME = o
    }, function(e, r, t) {
        "use strict";

        function n(e, r, t) {
            return r in e ? Object.defineProperty(e, r, {
                value: t,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[r] = t, e
        }
        var o = t(0).noop,
            i = t(6),
            a = i.union,
            u = i.Result,
            s = t(1).matchAny,
            c = t(51).filterByReportToHandlers,
            f = "SYSTEM_TRACING",
            l = a("Environment", {
                NotInitialized: function() {},
                Initialized: function(e) {
                    return {
                        reportTrace: e.reportTrace
                    }
                }
            });

        function p(e, r) {
            u.try(function() {
                return e(r)
            })
        }
        e.exports.id = f, e.exports.systemTracingHandlerCreator = function() {
            var e = l.NotInitialized();
            return function() {
                return {
                    init: function(r) {
                        var t = r.reportTrace;
                        e = l.Initialized({
                            reportTrace: t
                        })
                    },
                    log: c(f, function(r) {
                        e.matchWith({
                            Initialized: function(e) {
                                var t = e.reportTrace;
                                r.matchWith(n({
                                    Trace: function(e) {
                                        var r = e.payload.actionName;
                                        e.position.matchWith(n({
                                            Start: function() {
                                                return p(t, {
                                                    actionName: r,
                                                    tracePosition: "before"
                                                })
                                            },
                                            End: function(e) {
                                                var n = e.durationMs;
                                                return p(t, {
                                                    actionName: r,
                                                    tracePosition: "after",
                                                    actionDurationMs: n
                                                })
                                            }
                                        }, s, o))
                                    }
                                }, s, o))
                            },
                            NotInitialized: function() {
                                throw new Error("You cannot report to system tracer before setting the logger environment.\n              Make sure you call logger.init before reporting.")
                            }
                        })
                    })
                }
            }
        }
    }, function(e, r, t) {
        "use strict";
        (function(t) {
            var n, o, i, a = function() {
                    function e(e, r) {
                        for (var t = 0; t < r.length; t++) {
                            var n = r[t];
                            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                        }
                    }
                    return function(r, t, n) {
                        return t && e(r.prototype, t), n && e(r, n), r
                    }
                }(),
                u = Object.assign || function(e) {
                    for (var r = 1; r < arguments.length; r++) {
                        var t = arguments[r];
                        for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
                    }
                    return e
                },
                s = function() {
                    return function(e, r) {
                        if (Array.isArray(e)) return e;
                        if (Symbol.iterator in Object(e)) return function(e, r) {
                            var t = [],
                                n = !0,
                                o = !1,
                                i = void 0;
                            try {
                                for (var a, u = e[Symbol.iterator](); !(n = (a = u.next()).done) && (t.push(a.value), !r || t.length !== r); n = !0);
                            } catch (e) {
                                o = !0, i = e
                            } finally {
                                try {
                                    !n && u.return && u.return()
                                } finally {
                                    if (o) throw i
                                }
                            }
                            return t
                        }(e, r);
                        throw new TypeError("Invalid attempt to destructure non-iterable instance")
                    }
                }(),
                c = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                    return typeof e
                } : function(e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                };

            function f(e) {
                return function() {
                    var r = e.apply(this, arguments);
                    return new Promise(function(e, t) {
                        return function n(o, i) {
                            try {
                                var a = r[o](i),
                                    u = a.value
                            } catch (e) {
                                return void t(e)
                            }
                            if (!a.done) return Promise.resolve(u).then(function(e) {
                                n("next", e)
                            }, function(e) {
                                n("throw", e)
                            });
                            e(u)
                        }("next")
                    })
                }
            }

            function l(e, r) {
                if (!(e instanceof r)) throw new TypeError("Cannot call a class as a function")
            }

            function p(e, r) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !r || "object" != typeof r && "function" != typeof r ? e : r
            }

            function d(e, r) {
                if ("function" != typeof r && null !== r) throw new TypeError("Super expression must either be null or a function, not " + typeof r);
                e.prototype = Object.create(r && r.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), r && (Object.setPrototypeOf ? Object.setPrototypeOf(e, r) : e.__proto__ = r)
            }

            function v(e, r, t) {
                return r in e ? Object.defineProperty(e, r, {
                    value: t,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : e[r] = t, e
            }

            function g(e) {
                if (Array.isArray(e)) {
                    for (var r = 0, t = Array(e.length); r < e.length; r++) t[r] = e[r];
                    return t
                }
                return Array.from(e)
            }! function(t, a) {
                "object" === c(r) && void 0 !== e ? a(r) : (o = [r], void 0 === (i = "function" == typeof(n = a) ? n.apply(r, o) : n) || (e.exports = i))
            }(0, function(e) {
                /*! MIT License © Sindre Sorhus */
                var r = this,
                    n = function(e) {
                        return "undefined" != typeof self && self && e in self ? self[e] : "undefined" != typeof window && window && e in window ? window[e] : void 0 !== t && t && e in t ? t[e] : "undefined" != typeof globalThis && globalThis ? globalThis[e] : void 0
                    },
                    o = n("document"),
                    i = n("Headers"),
                    h = n("Response"),
                    y = n("fetch"),
                    b = n("AbortController"),
                    m = function(e) {
                        return null !== e && "object" === (void 0 === e ? "undefined" : c(e))
                    },
                    w = "function" == typeof n("AbortController"),
                    x = function e() {
                        for (var r = arguments.length, t = Array(r), n = 0; n < r; n++) t[n] = arguments[n];
                        var o = {},
                            i = !0,
                            a = !1,
                            c = void 0;
                        try {
                            for (var f, l = t[Symbol.iterator](); !(i = (f = l.next()).done); i = !0) {
                                var p = f.value;
                                if (Array.isArray(p)) Array.isArray(o) || (o = []), o = [].concat(g(o), g(p));
                                else if (m(p)) {
                                    var d = !0,
                                        h = !1,
                                        y = void 0;
                                    try {
                                        for (var b, w = Object.entries(p)[Symbol.iterator](); !(d = (b = w.next()).done); d = !0) {
                                            var x = b.value,
                                                E = s(x, 2),
                                                O = E[0],
                                                S = E[1];
                                            m(S) && Reflect.has(o, O) && (S = e(o[O], S)), o = u({}, o, v({}, O, S))
                                        }
                                    } catch (e) {
                                        h = !0, y = e
                                    } finally {
                                        try {
                                            !d && w.return && w.return()
                                        } finally {
                                            if (h) throw y
                                        }
                                    }
                                }
                            }
                        } catch (e) {
                            a = !0, c = e
                        } finally {
                            try {
                                !i && l.return && l.return()
                            } finally {
                                if (a) throw c
                            }
                        }
                        return o
                    },
                    E = ["get", "post", "put", "patch", "head", "delete"],
                    O = ["json", "text", "formData", "arrayBuffer", "blob"],
                    S = new Set(["get", "put", "head", "delete", "options", "trace"]),
                    R = new Set([408, 413, 429, 500, 502, 503, 504]),
                    k = new Set([413, 429, 503]),
                    j = function(e) {
                        function r(e) {
                            l(this, r);
                            var t = p(this, (r.__proto__ || Object.getPrototypeOf(r)).call(this, e.statusText));
                            return t.name = "HTTPError", t.response = e, t
                        }
                        return d(r, Error), r
                    }(),
                    N = function(e) {
                        function r() {
                            l(this, r);
                            var e = p(this, (r.__proto__ || Object.getPrototypeOf(r)).call(this, "Request timed out"));
                            return e.name = "TimeoutError", e
                        }
                        return d(r, Error), r
                    }(),
                    _ = function(e) {
                        return new Promise(function(r) {
                            return setTimeout(r, e)
                        })
                    },
                    C = function(e, t, n) {
                        return Promise.race([e, f(regeneratorRuntime.mark(function e() {
                            return regeneratorRuntime.wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return e.next = 2, _(t);
                                    case 2:
                                        throw n && setTimeout(function() {
                                            return n.abort()
                                        }, 1), new N;
                                    case 4:
                                    case "end":
                                        return e.stop()
                                }
                            }, e, r)
                        }))()])
                    },
                    T = function(e) {
                        return E.includes(e) ? e.toUpperCase() : e
                    },
                    A = function() {
                        function e(r, t) {
                            var n = this,
                                a = t.timeout,
                                s = void 0 === a ? 1e4 : a,
                                c = t.hooks,
                                p = t.throwHttpErrors,
                                d = void 0 === p || p,
                                v = t.searchParams,
                                g = t.json,
                                y = function(e, r) {
                                    var t = {};
                                    for (var n in e) r.indexOf(n) >= 0 || Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
                                    return t
                                }(t, ["timeout", "hooks", "throwHttpErrors", "searchParams", "json"]);
                            if (l(this, e), this._retryCount = 0, this._options = u({
                                    method: "get",
                                    credentials: "same-origin",
                                    retry: 2
                                }, y), w && (this.abortController = new b, this._options.signal && this._options.signal.addEventListener("abort", function() {
                                    n.abortController.abort()
                                }), this._options.signal = this.abortController.signal), this._options.method = T(this._options.method), this._options.prefixUrl = String(this._options.prefixUrl || ""), this._input = String(r || ""), this._options.prefixUrl && this._input.startsWith("/")) throw new Error("`input` must not begin with a slash when using `prefixUrl`");
                            if (this._options.prefixUrl && !this._options.prefixUrl.endsWith("/") && (this._options.prefixUrl += "/"), this._input = this._options.prefixUrl + this._input, v) {
                                var m = new URL(this._input, o && o.baseURI);
                                if ("string" == typeof v || URLSearchParams && v instanceof URLSearchParams) m.search = v;
                                else {
                                    if (!Object.values(v).every(function(e) {
                                            return "number" == typeof e || "string" == typeof e
                                        })) throw new Error("The `searchParams` option must be either a string, `URLSearchParams` instance or an object with string and number values");
                                    m.search = new URLSearchParams(v).toString()
                                }
                                this._input = m.toString()
                            }
                            this._timeout = s, this._hooks = x({
                                beforeRequest: [],
                                afterResponse: []
                            }, c), this._throwHttpErrors = d;
                            var E = new i(this._options.headers || {});
                            if (g) {
                                if (this._options.body) throw new Error("The `json` option cannot be used with the `body` option");
                                E.set("content-type", "application/json"), this._options.body = JSON.stringify(g)
                            }
                            this._options.headers = E;
                            var R = function() {
                                    var e = f(regeneratorRuntime.mark(function e() {
                                        var r, t, o, i, a, u, s, c;
                                        return regeneratorRuntime.wrap(function(e) {
                                            for (;;) switch (e.prev = e.next) {
                                                case 0:
                                                    return e.next = 2, n._fetch();
                                                case 2:
                                                    r = e.sent, t = !0, o = !1, i = void 0, e.prev = 6, a = n._hooks.afterResponse[Symbol.iterator]();
                                                case 8:
                                                    if (t = (u = a.next()).done) {
                                                        e.next = 17;
                                                        break
                                                    }
                                                    return s = u.value, e.next = 12, s(r.clone());
                                                case 12:
                                                    (c = e.sent) instanceof h && (r = c);
                                                case 14:
                                                    t = !0, e.next = 8;
                                                    break;
                                                case 17:
                                                    e.next = 23;
                                                    break;
                                                case 19:
                                                    e.prev = 19, e.t0 = e.catch(6), o = !0, i = e.t0;
                                                case 23:
                                                    e.prev = 23, e.prev = 24, !t && a.return && a.return();
                                                case 26:
                                                    if (e.prev = 26, !o) {
                                                        e.next = 29;
                                                        break
                                                    }
                                                    throw i;
                                                case 29:
                                                    return e.finish(26);
                                                case 30:
                                                    return e.finish(23);
                                                case 31:
                                                    if (r.ok || !n._throwHttpErrors) {
                                                        e.next = 33;
                                                        break
                                                    }
                                                    throw new j(r);
                                                case 33:
                                                    return e.abrupt("return", r);
                                                case 34:
                                                case "end":
                                                    return e.stop()
                                            }
                                        }, e, n, [
                                            [6, 19, 23, 31],
                                            [24, , 26, 30]
                                        ])
                                    }));
                                    return function() {
                                        return e.apply(this, arguments)
                                    }
                                }(),
                                k = S.has(this._options.method.toLowerCase()) ? this._retry(R) : R(),
                                N = function(e) {
                                    k[e] = f(regeneratorRuntime.mark(function r() {
                                        return regeneratorRuntime.wrap(function(r) {
                                            for (;;) switch (r.prev = r.next) {
                                                case 0:
                                                    return r.next = 2, k;
                                                case 2:
                                                    return r.t0 = e, r.abrupt("return", r.sent.clone()[r.t0]());
                                                case 4:
                                                case "end":
                                                    return r.stop()
                                            }
                                        }, r, n)
                                    }))
                                },
                                _ = !0,
                                C = !1,
                                A = void 0;
                            try {
                                for (var I, P = O[Symbol.iterator](); !(_ = (I = P.next()).done); _ = !0) {
                                    N(I.value)
                                }
                            } catch (e) {
                                C = !0, A = e
                            } finally {
                                try {
                                    !_ && P.return && P.return()
                                } finally {
                                    if (C) throw A
                                }
                            }
                            return k
                        }
                        return a(e, [{
                            key: "_calculateRetryDelay",
                            value: function(e) {
                                if (this._retryCount++, this._retryCount < this._options.retry && !(e instanceof N)) {
                                    if (e instanceof j) {
                                        if (!R.has(e.response.status)) return 0;
                                        var r = e.response.headers.get("Retry-After");
                                        if (r && k.has(e.response.status)) {
                                            var t = Number(r);
                                            return Number.isNaN(t) ? t = Date.parse(r) - Date.now() : t *= 1e3, t
                                        }
                                        if (413 === e.response.status) return 0
                                    }
                                    return .3 * Math.pow(2, this._retryCount - 1) * 1e3
                                }
                                return 0
                            }
                        }, {
                            key: "_retry",
                            value: function() {
                                var e = f(regeneratorRuntime.mark(function e(r) {
                                    var t;
                                    return regeneratorRuntime.wrap(function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                return e.prev = 0, e.next = 3, r();
                                            case 3:
                                                return e.abrupt("return", e.sent);
                                            case 6:
                                                if (e.prev = 6, e.t0 = e.catch(0), !(0 !== (t = this._calculateRetryDelay(e.t0)) && this._retryCount > 0)) {
                                                    e.next = 13;
                                                    break
                                                }
                                                return e.next = 12, _(t);
                                            case 12:
                                                return e.abrupt("return", this._retry(r));
                                            case 13:
                                                if (!this._throwHttpErrors) {
                                                    e.next = 15;
                                                    break
                                                }
                                                throw e.t0;
                                            case 15:
                                            case "end":
                                                return e.stop()
                                        }
                                    }, e, this, [
                                        [0, 6]
                                    ])
                                }));
                                return function(r) {
                                    return e.apply(this, arguments)
                                }
                            }()
                        }, {
                            key: "_fetch",
                            value: function() {
                                var e = f(regeneratorRuntime.mark(function e() {
                                    var r, t, n, o, i, a;
                                    return regeneratorRuntime.wrap(function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                r = !0, t = !1, n = void 0, e.prev = 3, o = this._hooks.beforeRequest[Symbol.iterator]();
                                            case 5:
                                                if (r = (i = o.next()).done) {
                                                    e.next = 12;
                                                    break
                                                }
                                                return a = i.value, e.next = 9, a(this._options);
                                            case 9:
                                                r = !0, e.next = 5;
                                                break;
                                            case 12:
                                                e.next = 18;
                                                break;
                                            case 14:
                                                e.prev = 14, e.t0 = e.catch(3), t = !0, n = e.t0;
                                            case 18:
                                                e.prev = 18, e.prev = 19, !r && o.return && o.return();
                                            case 21:
                                                if (e.prev = 21, !t) {
                                                    e.next = 24;
                                                    break
                                                }
                                                throw n;
                                            case 24:
                                                return e.finish(21);
                                            case 25:
                                                return e.finish(18);
                                            case 26:
                                                return e.abrupt("return", C(y(this._input, this._options), this._timeout, this.abortController));
                                            case 27:
                                            case "end":
                                                return e.stop()
                                        }
                                    }, e, this, [
                                        [3, 14, 18, 26],
                                        [19, , 21, 25]
                                    ])
                                }));
                                return function() {
                                    return e.apply(this, arguments)
                                }
                            }()
                        }]), e
                    }(),
                    I = function e() {
                        var r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                        if (!m(r) || Array.isArray(r)) throw new TypeError("The `defaultOptions` argument must be an object");
                        var t = function(e, t) {
                                return new A(e, x({}, r, t))
                            },
                            n = function(e) {
                                t[e] = function(t, n) {
                                    return new A(t, x({}, r, n, {
                                        method: e
                                    }))
                                }
                            },
                            o = !0,
                            i = !1,
                            a = void 0;
                        try {
                            for (var u, s = E[Symbol.iterator](); !(o = (u = s.next()).done); o = !0) n(u.value)
                        } catch (e) {
                            i = !0, a = e
                        } finally {
                            try {
                                !o && s.return && s.return()
                            } finally {
                                if (i) throw a
                            }
                        }
                        return t.extend = function(r) {
                            return e(r)
                        }, t
                    }();
                e.default = I, e.HTTPError = j, e.TimeoutError = N, Object.defineProperty(e, "__esModule", {
                    value: !0
                })
            })
        }).call(this, t(5))
    }, function(e, r, t) {
        var n = t(79).Symbol;
        e.exports = n
    }, function(e, r, t) {
        e.exports = t(20)
    }, function(e, r, t) {
        "use strict";
        var n = t(21).create,
            o = (0, t(88).logger)();
        e.exports = n({
            appLogger: o,
            userConsole: console
        })
    }, function(e, r, t) {
        "use strict";
        var n = function() {
            return function(e, r) {
                if (Array.isArray(e)) return e;
                if (Symbol.iterator in Object(e)) return function(e, r) {
                    var t = [],
                        n = !0,
                        o = !1,
                        i = void 0;
                    try {
                        for (var a, u = e[Symbol.iterator](); !(n = (a = u.next()).done) && (t.push(a.value), !r || t.length !== r); n = !0);
                    } catch (e) {
                        o = !0, i = e
                    } finally {
                        try {
                            !n && u.return && u.return()
                        } finally {
                            if (o) throw i
                        }
                    }
                    return t
                }(e, r);
                throw new TypeError("Invalid attempt to destructure non-iterable instance")
            }
        }();

        function o(e) {
            return function() {
                var r = e.apply(this, arguments);
                return new Promise(function(e, t) {
                    return function n(o, i) {
                        try {
                            var a = r[o](i),
                                u = a.value
                        } catch (e) {
                            return void t(e)
                        }
                        if (!a.done) return Promise.resolve(u).then(function(e) {
                            n("next", e)
                        }, function(e) {
                            n("throw", e)
                        });
                        e(u)
                    }("next")
                })
            }
        }
        var i = t(0).get,
            a = t(9).serializeMessage,
            u = t(24),
            s = u.fetchUserCode,
            c = u.fetchUserCodeAsync,
            f = t(53).runUserCode,
            l = t(68),
            p = t(70).isWebWorker,
            d = t(71),
            v = d.importSync,
            g = d.importAsync,
            h = t(72),
            y = t(3),
            b = t(8),
            m = t(73).createFedopsLogger,
            w = t(2).convertToDeveloperConsoleSeverity,
            x = t(74).active$wBiFactoryCreator,
            E = t(75).createUserCodeMapWithEnrichedUrls,
            O = function(e) {
                return function(r) {
                    if ("ASSERT" !== r.logLevel || !r.args[0]) {
                        var t = Object.assign({}, r, {
                            logLevel: w(r.logLevel)
                        });
                        e.site.notifyEventToEditorApp("wix-code", {
                            eventType: "addConsoleMessage",
                            eventPayload: {
                                consoleMessage: a(t)
                            }
                        })
                    }
                }
            };
        e.exports.create = function(e) {
            var r = e.appLogger,
                t = e.userConsole,
                a = new Map,
                u = !0,
                d = !0,
                w = function() {
                    throw new Error("onLog was used before it was created")
                },
                S = function() {
                    throw new Error("onUnhandledRejection was used before it was created")
                },
                R = void 0,
                k = void 0,
                j = function() {
                    var e = o(regeneratorRuntime.mark(function e(n) {
                        var o, i, a = n.userCodeMap,
                            u = n.isWebWorker,
                            f = n.viewMode,
                            l = n.codePackagesData;
                        return regeneratorRuntime.wrap(function(e) {
                            for (;;) switch (e.prev = e.next) {
                                case 0:
                                    if (o = E({
                                            userCodeMap: a,
                                            codePackagesData: l
                                        }), !u) {
                                        e.next = 7;
                                        break
                                    }
                                    return e.next = 4, s(t, r, k, o, v);
                                case 4:
                                    e.t0 = e.sent, e.next = 10;
                                    break;
                                case 7:
                                    return e.next = 9, c(r, o, g);
                                case 9:
                                    e.t0 = e.sent;
                                case 10:
                                    return i = e.t0, "Site" === f && a.length && r.bi(b.userCodeLoaded({
                                        pageId: a[0].id
                                    })), e.abrupt("return", i);
                                case 13:
                                case "end":
                                    return e.stop()
                            }
                        }, e, void 0)
                    }));
                    return function(r) {
                        return e.apply(this, arguments)
                    }
                }(),
                N = function() {
                    var e = o(regeneratorRuntime.mark(function e(n) {
                        var o, s, c = n.wixCodeApi,
                            f = n.userCodeMap,
                            p = n.isWebWorker,
                            d = n.codePackagesData;
                        return regeneratorRuntime.wrap(function(e) {
                            for (;;) switch (e.prev = e.next) {
                                case 0:
                                    return h.setExtraHeaders(c, r), o = i(c, ["window", "viewMode"]), u && (s = l.wrapConsole(t), w = s.onLog, R = s.consoleProxy, S = l.handlePromiseRejections(), "Site" !== o && (w(O(c)), S(O(c))), u = !1), e.next = 5, j({
                                        userCodeMap: f,
                                        isWebWorker: p,
                                        viewMode: o,
                                        codePackagesData: d
                                    });
                                case 5:
                                    a = e.sent;
                                case 6:
                                case "end":
                                    return e.stop()
                            }
                        }, e, void 0)
                    }));
                    return function(r) {
                        return e.apply(this, arguments)
                    }
                }(),
                _ = function(e) {
                    var t = e.wixCodeApi,
                        n = e.reportTrace,
                        o = e.biLoggerFactory,
                        a = e.fedOpsLoggerFactory,
                        u = e.createRavenClient,
                        s = e.userCodeMap,
                        c = e.isWebWorker,
                        f = i(t, ["user", "currentUser", "id"]),
                        l = i(t, ["window", "viewMode"]);
                    r.init({
                        user: {
                            id: f
                        },
                        hostType: c ? "worker" : "iframe",
                        viewMode: l,
                        reportTrace: n,
                        biLoggerFactory: o,
                        fedOpsLoggerFactory: a,
                        createRavenClient: u
                    }), r.addSessionData(function() {
                        return {
                            userCodeScripts: s,
                            elementoryArguments: {
                                baseUrl: self.elementorySupport.baseUrl,
                                queryParameters: self.elementorySupport.queryParameters,
                                options: self.elementorySupport.options
                            }
                        }
                    })
                };
            return {
                initAppForPage: function() {
                    var e = o(regeneratorRuntime.mark(function e(t, n, o, i) {
                        var a, u, s, c, f, l, d, v, g;
                        return regeneratorRuntime.wrap(function(e) {
                            for (;;) switch (e.prev = e.next) {
                                case 0:
                                    return e.prev = 0, a = t.appData, u = a.userCodeMap, s = a.codePackagesData, c = i.biLoggerFactory, f = i.fedOpsLoggerFactory, l = i.monitoring, d = i.reportTrace, v = y.initAppForPage(), (k = m(f)).interactionStarted(v.actionName), g = p(), _({
                                        wixCodeApi: o,
                                        reportTrace: d,
                                        biLoggerFactory: c,
                                        fedOpsLoggerFactory: f,
                                        createRavenClient: l.createMonitor,
                                        userCodeMap: u,
                                        isWebWorker: g
                                    }), e.next = 10, r.traceAsync(v, function() {
                                        return N({
                                            wixCodeApi: o,
                                            userCodeMap: u,
                                            isWebWorker: g,
                                            codePackagesData: s
                                        })
                                    });
                                case 10:
                                    k.interactionEnded(v.actionName), e.next = 17;
                                    break;
                                case 13:
                                    throw e.prev = 13, e.t0 = e.catch(0), r.error(e.t0), e.t0;
                                case 17:
                                case "end":
                                    return e.stop()
                            }
                        }, e, void 0, [
                            [0, 13]
                        ])
                    }));
                    return function(r, t, n, o) {
                        return e.apply(this, arguments)
                    }
                }(),
                createControllers: function(e) {
                    try {
                        var o = y.createControllers();
                        k.interactionStarted(o.actionName);
                        var i = r.traceSync(o, function() {
                            return function(e) {
                                var o = n(e, 1)[0],
                                    i = o.$w,
                                    u = o.wixCodeApi,
                                    s = o.appParams,
                                    c = s.instance,
                                    l = s.appData,
                                    p = l.userCodeMap,
                                    v = l.codeAppId,
                                    g = l.codePackagesData,
                                    h = o.platformAPIs;
                                if (a.size > 0) {
                                    var y = x({
                                            appLogger: r,
                                            platformBi: h.bi
                                        }),
                                        b = E({
                                            userCodeMap: p,
                                            codePackagesData: g
                                        }),
                                        m = f({
                                            userConsole: t,
                                            appLogger: r,
                                            fedopsLogger: k,
                                            active$wBiFactory: y,
                                            instance: c,
                                            wixSdk: u,
                                            $w: i,
                                            userCodeModules: a,
                                            wixCodeScripts: b,
                                            onLog: w,
                                            consoleProxy: R,
                                            firstUserCodeRun: d,
                                            platformBi: h.bi,
                                            codeAppId: v
                                        });
                                    d = !1, u.events.setStaticEventHandlers(m)
                                }
                                return []
                            }(e)
                        });
                        return k.interactionEnded(o.actionName), i
                    } catch (e) {
                        throw r.error(e), e
                    }
                }
            }
        }
    }, function(e, r, t) {
        "use strict";
        e.exports = "undefined" != typeof window && window
    }, function(e, r, t) {
        "use strict";
        e.exports = function(e, r) {
            if ("symbol" == typeof r) return r.toString();
            if (Number.isNaN(r)) return "NaN";
            switch (r) {
                case void 0:
                    return "undefined";
                case null:
                    return "null";
                case 1 / 0:
                    return "Infinity";
                case -1 / 0:
                    return "-Infinity";
                default:
                    return r
            }
        }
    }, function(e, r, t) {
        "use strict";
        var n = function() {
            var e = function(e) {
                return function() {
                    var r = e.apply(this, arguments);
                    return new Promise(function(e, t) {
                        return function n(o, i) {
                            try {
                                var a = r[o](i),
                                    u = a.value
                            } catch (e) {
                                return void t(e)
                            }
                            if (!a.done) return Promise.resolve(u).then(function(e) {
                                n("next", e)
                            }, function(e) {
                                n("throw", e)
                            });
                            e(u)
                        }("next")
                    })
                }
            }(regeneratorRuntime.mark(function e(r, t, n) {
                var o;
                return regeneratorRuntime.wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                        case 0:
                            return o = new Map, e.next = 3, t.reduce(function(e, r) {
                                return e.then(function() {
                                    return n(r.url)
                                }).then(function(e) {
                                    return o.set(r.url, e)
                                })
                            }, Promise.resolve());
                        case 3:
                            return e.abrupt("return", o);
                        case 4:
                        case "end":
                            return e.stop()
                    }
                }, e, this)
            }));
            return function(r, t, n) {
                return e.apply(this, arguments)
            }
        }();
        var o = t(3);

        function i() {
            return {}
        }
        e.exports.fetchUserCode = function(e, r, t, n, a) {
            var u = o.loadUserCode();
            return n.reduce(function(n, o) {
                try {
                    return r.traceSync(u, function() {
                        t.interactionStarted(u.actionName);
                        var e = a(o.url, o.displayName);
                        return n.set(o.url, e), t.interactionEnded(u.actionName), n
                    })
                } catch (t) {
                    return r.error(t), e.error(t), n.set(o.url, i), n
                }
            }, new Map)
        }, e.exports.fetchUserCodeAsync = n
    }, function(e, r, t) {
        "use strict";
        var n = t(1).create,
            o = t(31).ravenHandlerCreator,
            i = t(49).biHandlerCreator,
            a = t(16).systemTracingHandlerCreator;
        e.exports.loggerCreator = function(e) {
            var r = e.consoleHandler,
                t = o(),
                u = a(),
                s = i();
            return n({
                handlerCreators: [r, t, u, s]
            })
        }
    }, function(e, r, t) {
        "use strict";
        var n = t(11),
            o = n.union,
            i = n.Result,
            a = t(0).pull,
            u = t(0).merge,
            s = t(0).uniqueId,
            c = t(0).isFunction,
            f = t(0).isObject,
            l = o("LogEvent", {
                BI: function(e) {
                    return {
                        biEvent: e.biEvent
                    }
                },
                Trace: function(e) {
                    return {
                        position: e.position,
                        payload: e.payload
                    }
                },
                Info: function(e) {
                    return {
                        message: e.message,
                        options: e.options,
                        sessionData: e.sessionData
                    }
                },
                Warn: function(e) {
                    return {
                        message: e.message,
                        options: e.options,
                        sessionData: e.sessionData
                    }
                },
                Error: function(e) {
                    return {
                        error: e.error,
                        options: e.options,
                        sessionData: e.sessionData
                    }
                }
            }),
            p = o("TracePosition", {
                None: function() {},
                Start: function(e) {
                    return {
                        traceId: e.traceId
                    }
                },
                End: function(e) {
                    return {
                        traceId: e.traceId,
                        durationMs: e.durationMs,
                        result: e.result
                    }
                }
            }),
            d = function(e) {
                return function(e) {
                    return e && Array.isArray(e) && 0 !== e.length ? e.reduce(function(e, r) {
                        return e.chain(function() {
                            return c(r) ? e : i.Error("`handlerCreators` must be an array of functions.")
                        })
                    }, i.Ok(e)) : i.Error("`handlerCreators` is missing or empty, the logger needs at least one handler to work.")
                }(e).map(function(e) {
                    return e.map(function(e) {
                        return e()
                    })
                }).chain(function(e) {
                    return function(e) {
                        return e.reduce(function(e, r) {
                            return e.chain(function() {
                                return f(r) ? c(r.init) ? c(r.log) ? e : i.Error("Handler must have a log function.") : i.Error("Handler must have an init function.") : i.Error("Handler must be an object.")
                            })
                        }, i.Ok(e))
                    }(e)
                }).fold(function(e) {
                    throw new Error(e)
                }, function(e) {
                    return e
                })
            },
            v = function(e, r) {
                e.forEach(function(e) {
                    return e.log(r)
                })
            };
        e.exports = {
            create: function() {
                var e = (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}).handlerCreators,
                    r = d(e),
                    t = function() {
                        var e = [];
                        return {
                            register: function(r) {
                                return e.push(r),
                                    function() {
                                        a(e, r)
                                    }
                            },
                            getCallbacks: function() {
                                return e.slice()
                            }
                        }
                    }(),
                    n = (new Map, function() {
                        return t.getCallbacks().reduce(function(e, r) {
                            return u(e, function(e) {
                                return i.try(e).fold(function(e) {
                                    return {
                                        sessionDataError: e.stack
                                    }
                                }, function(e) {
                                    return e
                                })
                            }(r))
                        }, {})
                    });
                return {
                    addSessionData: t.register,
                    init: function(e) {
                        r.forEach(function(r) {
                            return r.init(e)
                        })
                    },
                    bi: function(e) {
                        return function(r) {
                            var t = l.BI({
                                biEvent: r
                            });
                            v(e, t)
                        }
                    }(r),
                    info: function(e, r) {
                        return function(t, n) {
                            var o = l.Info({
                                message: t,
                                options: n,
                                sessionData: r()
                            });
                            v(e, o)
                        }
                    }(r, n),
                    warn: function(e, r) {
                        return function(t, n) {
                            var o = l.Warn({
                                message: t,
                                options: n,
                                sessionData: r()
                            });
                            v(e, o)
                        }
                    }(r, n),
                    error: function(e, r) {
                        return function(t, n) {
                            var o = l.Error({
                                error: t,
                                options: n,
                                sessionData: r()
                            });
                            v(e, o)
                        }
                    }(r, n),
                    trace: function(e) {
                        return function(r) {
                            var t = p.None(),
                                n = l.Trace({
                                    position: t,
                                    payload: r
                                });
                            v(e, n)
                        }
                    }(r),
                    traceSync: function(e) {
                        return function(r, t) {
                            var n = Date.now(),
                                o = s();
                            v(e, l.Trace({
                                position: p.Start({
                                    traceId: o
                                }),
                                payload: r
                            }));
                            try {
                                var a = t(),
                                    u = Date.now() - n;
                                return v(e, l.Trace({
                                    position: p.End({
                                        traceId: o,
                                        durationMs: u,
                                        result: i.Ok()
                                    }),
                                    payload: r
                                })), a
                            } catch (t) {
                                var c = Date.now() - n;
                                throw v(e, l.Trace({
                                    position: p.End({
                                        traceId: o,
                                        durationMs: c,
                                        result: i.Error(t)
                                    }),
                                    payload: r
                                })), t
                            }
                        }
                    }(r),
                    traceAsync: function(e) {
                        return function(r, t) {
                            var n = Date.now(),
                                o = s();
                            return v(e, l.Trace({
                                position: p.Start({
                                    traceId: o
                                }),
                                payload: r
                            })), t().then(function(t) {
                                var a = Date.now() - n;
                                return v(e, l.Trace({
                                    position: p.End({
                                        traceId: o,
                                        durationMs: a,
                                        result: i.Ok()
                                    }),
                                    payload: r
                                })), t
                            }).catch(function(t) {
                                var a = Date.now() - n;
                                return v(e, l.Trace({
                                    position: p.End({
                                        traceId: o,
                                        durationMs: a,
                                        result: i.Error(t)
                                    }),
                                    payload: r
                                })), Promise.reject(t)
                            })
                        }
                    }(r)
                }
            },
            matchAny: o.any
        }
    }, function(e, r, t) {
        "use strict";
        var n = Symbol.for("union-type-any-symbol"),
            o = function(e, r, t, o) {
                var i = Symbol("[" + e + ":" + r + "]"),
                    a = function() {
                        var e = t.apply(void 0, arguments),
                            a = function(e, r, t) {
                                return r in e ? Object.defineProperty(e, r, {
                                    value: t,
                                    enumerable: !0,
                                    configurable: !0,
                                    writable: !0
                                }) : e[r] = t, e
                            }({
                                matchWith: function(e) {
                                    return function(r) {
                                        var t = Object.keys(r),
                                            o = !0,
                                            i = !1,
                                            a = void 0;
                                        try {
                                            for (var u, s = t[Symbol.iterator](); !(o = (u = s.next()).done); o = !0) {
                                                var c = u.value;
                                                if (c === e.name) return r[c](e.payload)
                                            }
                                        } catch (e) {
                                            i = !0, a = e
                                        } finally {
                                            try {
                                                !o && s.return && s.return()
                                            } finally {
                                                if (i) throw a
                                            }
                                        }
                                        if (r[n]) return r[n]();
                                        throw new Error('Variant "' + e.name + '" not covered in pattern with keys [' + t + "].\nThis could mean you did not include all variants in your Union's matchWith function.")
                                    }
                                }({
                                    name: r,
                                    payload: e
                                }),
                                toString: function() {
                                    return r
                                }
                            }, i, !0);
                        return Object.keys(o).forEach(function(e) {
                            a[e] = o[e](a)
                        }), a
                    };
                return a.hasInstance = function(e) {
                    return e && !0 === e[i]
                }, a
            },
            i = function(e, r) {
                var t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
                return Object.keys(r).reduce(function(n, i) {
                    return n[i] = o(e, i, r[i], t), n
                }, {})
            };
        i.any = n, e.exports = i
    }, function(e, r, t) {
        "use strict";
        var n = function e(r) {
                return {
                    map: function(t) {
                        return e(t(r))
                    },
                    chain: function(e) {
                        return e(r)
                    },
                    fold: function(e, t) {
                        return t(r)
                    },
                    getOrElse: function() {
                        return r
                    },
                    merge: function() {
                        return r
                    }
                }
            },
            o = function e(r) {
                return {
                    map: function() {
                        return e(r)
                    },
                    chain: function() {
                        return e(r)
                    },
                    fold: function(e) {
                        return e(r)
                    },
                    getOrElse: function(e) {
                        return e
                    },
                    merge: function() {
                        return r
                    }
                }
            },
            i = {
                Ok: n,
                Error: o,
                try: function(e) {
                    try {
                        return n(e())
                    } catch (e) {
                        return o(e)
                    }
                },
                fromNullable: function(e, r) {
                    return null != e ? n(e) : o(r)
                },
                fromMaybe: function(e, r) {
                    return e.fold(function() {
                        return o(r)
                    }, function(e) {
                        return n(e)
                    })
                },
                of: function(e) {
                    return n(e)
                }
            };
        e.exports = i
    }, function(e, r, t) {
        "use strict";
        var n = function e(r) {
                return {
                    map: function(t) {
                        return e(t(r))
                    },
                    chain: function(e) {
                        return e(r)
                    },
                    fold: function(e, t) {
                        return t(r)
                    },
                    getOrElse: function() {
                        return r
                    },
                    orElse: function() {
                        return e(r)
                    },
                    filter: function(t) {
                        return t(r) ? e(r) : o()
                    }
                }
            },
            o = function e() {
                return {
                    map: function() {
                        return e()
                    },
                    chain: function() {
                        return e()
                    },
                    fold: function(e) {
                        return e()
                    },
                    getOrElse: function(e) {
                        return e
                    },
                    orElse: function(e) {
                        return e()
                    },
                    filter: function() {
                        return e()
                    }
                }
            },
            i = {
                Just: n,
                Nothing: o,
                fromNullable: function(e) {
                    return null != e ? n(e) : o()
                },
                of: function(e) {
                    return n(e)
                }
            };
        e.exports = i
    }, function(e, r, t) {
        "use strict";
        var n = function() {
            return function(e, r) {
                if (Array.isArray(e)) return e;
                if (Symbol.iterator in Object(e)) return function(e, r) {
                    var t = [],
                        n = !0,
                        o = !1,
                        i = void 0;
                    try {
                        for (var a, u = e[Symbol.iterator](); !(n = (a = u.next()).done) && (t.push(a.value), !r || t.length !== r); n = !0);
                    } catch (e) {
                        o = !0, i = e
                    } finally {
                        try {
                            !n && u.return && u.return()
                        } finally {
                            if (o) throw i
                        }
                    }
                    return t
                }(e, r);
                throw new TypeError("Invalid attempt to destructure non-iterable instance")
            }
        }();
        var o = t(0).noop,
            i = t(0).isError,
            a = t(11).union;
        e.exports.consoleHandlerCreator = function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                r = e.shouldLog,
                t = e.ignoredErrorMessages,
                u = (void 0 === t ? [] : t).slice(),
                s = function(e, r) {
                    (function(e) {
                        return u.some(function(r) {
                            return e === r
                        })
                    })(e) || console.error(r)
                };
            return {
                setIgnoredErrorMessages: function(e) {
                    u = e.slice()
                },
                consoleHandler: function() {
                    return {
                        init: function() {},
                        log: function(e) {
                            e.matchWith(function(e, r, t) {
                                return r in e ? Object.defineProperty(e, r, {
                                    value: t,
                                    enumerable: !0,
                                    configurable: !0,
                                    writable: !0
                                }) : e[r] = t, e
                            }({
                                Warn: function(e) {
                                    var t = e.message;
                                    if (r()) {
                                        var o = i(t) ? [t, t.message] : [new Error(t), t],
                                            a = n(o, 2),
                                            u = a[0],
                                            c = a[1];
                                        s(c, u.stack)
                                    }
                                },
                                Error: function(e) {
                                    var t = e.error;
                                    if (r()) {
                                        var n = t.message ? t.message : t,
                                            o = t.stack ? t.stack : t;
                                        s(n, o)
                                    }
                                }
                            }, a.any, o))
                        }
                    }
                }
            }
        }
    }, function(e, r, t) {
        "use strict";
        (function(r) {
            var n = t(32),
                o = t(6).union,
                i = t(1).matchAny,
                a = t(0).noop,
                u = t(0).merge,
                s = t(0).fromPairs,
                c = t(37).configureForViewerWorker,
                f = t(13).ERROR_NAME,
                l = t(14).ERROR_NAME,
                p = t(15).ERROR_NAME,
                d = "https://760a5dce5978409b86a97e1ccd21aa7a@sentry.wixpress.com/154",
                v = o("Environment", {
                    NotInitialized: function() {},
                    Initialized: function(e) {
                        var t = e.createRavenClient,
                            n = e.ravenOptions,
                            o = e.user,
                            i = e.hostType,
                            a = t(d);
                        return c({
                            Raven: a,
                            globalScope: r,
                            dsn: d,
                            appName: "wix-code-viewer-app",
                            params: n
                        }), a.setUserContext(o), a.setTagsContext({
                            hostType: i
                        }), {
                            raven: a
                        }
                    }
                }),
                g = "warning",
                h = "error";
            e.exports.ravenHandlerCreator = function() {
                var e = (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}).ravenOptions;
                return function() {
                    var r = v.NotInitialized(),
                        t = function(e) {
                            return r.matchWith({
                                Initialized: function(e) {
                                    return e.raven
                                },
                                NotInitialized: function() {
                                    var r = e && e.stack || e;
                                    throw new Error("You cannot use raven before setting the logger environment. Original message: " + r)
                                }
                            })
                        },
                        o = function() {
                            try {
                                var e = n(self.navigator.userAgent),
                                    r = e.os,
                                    t = e.browser,
                                    o = parseFloat(r.version),
                                    i = parseInt(t.major),
                                    a = "iOS" === r.name && o < 11 || "Safari" === t.name && i < 11,
                                    u = "Android" === r.name && o < 7,
                                    s = "QQBrowser" === t.name && i < 9 || "Chrome" === t.name && i < 50;
                                return a || u || s
                            } catch (e) {
                                return !1
                            }
                        }(),
                        c = function(e) {
                            var r = e.level,
                                t = e.sessionData,
                                n = e.options,
                                o = void 0 === n ? {} : n,
                                i = e.fingerprint,
                                a = e.tags,
                                s = void 0 === a ? {} : a,
                                c = e.extra;
                            return u({
                                level: r
                            }, {
                                extra: t
                            }, {
                                extra: void 0 === c ? {} : c
                            }, {
                                tags: s
                            }, {
                                fingerprint: i
                            }, o)
                        },
                        d = function(e) {
                            try {
                                if (e.response) {
                                    var r = e.response,
                                        t = r.headers,
                                        n = r.status,
                                        o = r.url;
                                    return {
                                        headers: s([].concat(function(e) {
                                            if (Array.isArray(e)) {
                                                for (var r = 0, t = Array(e.length); r < e.length; r++) t[r] = e[r];
                                                return t
                                            }
                                            return Array.from(e)
                                        }(t.entries()))),
                                        status: n,
                                        url: o
                                    }
                                }
                            } catch (e) {
                                return e.stack
                            }
                        },
                        y = function(e) {
                            return e && e.headers.has("x-seen-by")
                        },
                        b = function(e) {
                            var r = e.raven,
                                t = e.error,
                                n = e.options,
                                o = e.sessionData;
                            try {
                                var i = function(e) {
                                        switch (e.name) {
                                            case l:
                                                return function(e) {
                                                    return !e.response
                                                }(e.originalError) ? g : y(e.originalError.response) ? h : g;
                                            case p:
                                            case f:
                                                return g;
                                            default:
                                                return h
                                        }
                                    }(t),
                                    a = function(e) {
                                        switch (e.name) {
                                            case l:
                                                var r = y(e.originalError.response) ? "wix-server" : "non-wix-server",
                                                    t = [l, r],
                                                    n = {
                                                        requestUrl: e.url
                                                    },
                                                    o = d(e.originalError);
                                                return o && void 0 !== o.status && (n.httpStatus = o.status, t.push(String(o.status))), {
                                                    fingerprint: t,
                                                    tags: n,
                                                    extra: {
                                                        extraResponseData: o,
                                                        originalError: e.originalError.stack
                                                    }
                                                };
                                            case p:
                                                var i = y(e.originalError.response) ? "wix-server" : "non-wix-server",
                                                    a = [p, i],
                                                    u = d(e.originalError);
                                                return u && void 0 !== u.status && a.push(String(u.status)), {
                                                    fingerprint: a,
                                                    extra: {
                                                        extraResponseData: u,
                                                        logsPayload: e.payload,
                                                        originalError: e.originalError.stack
                                                    }
                                                };
                                            case f:
                                                var s = {
                                                        requestUrl: e.url,
                                                        isCompressed: e.url.includes("use-compressed-bundle")
                                                    },
                                                    c = ["new_" + f],
                                                    v = d(e.originalError);
                                                return v && void 0 !== v.status && (s.httpStatus = v.status, c.push(String(v.status))), {
                                                    tags: s,
                                                    fingerprint: c,
                                                    extra: {
                                                        extraResponseData: v,
                                                        originalError: e.originalError.stack
                                                    }
                                                };
                                            default:
                                                return {}
                                        }
                                    }(t),
                                    u = a.tags,
                                    s = a.extra,
                                    v = a.fingerprint,
                                    b = c({
                                        level: i,
                                        sessionData: o,
                                        options: n,
                                        fingerprint: v,
                                        tags: u,
                                        extra: s
                                    });
                                r.captureException(t, b)
                            } catch (e) {
                                r.captureException(t)
                            }
                        };
                    return {
                        init: function(t) {
                            var n = t.user,
                                o = t.hostType,
                                i = t.createRavenClient;
                            r = v.Initialized({
                                createRavenClient: i,
                                ravenOptions: e,
                                user: n,
                                hostType: o
                            })
                        },
                        log: function(e) {
                            o || e.matchWith(function(e, r, t) {
                                return r in e ? Object.defineProperty(e, r, {
                                    value: t,
                                    enumerable: !0,
                                    configurable: !0,
                                    writable: !0
                                }) : e[r] = t, e
                            }({
                                Info: function(e) {
                                    var r = e.message,
                                        n = e.options,
                                        o = e.sessionData;
                                    t(r).captureMessage(r, c({
                                        level: "info",
                                        sessionData: o,
                                        options: n
                                    }))
                                },
                                Warn: function(e) {
                                    var r = e.message,
                                        n = e.options,
                                        o = e.sessionData;
                                    t(r).captureMessage(r, c({
                                        level: "warning",
                                        sessionData: o,
                                        options: n
                                    }))
                                },
                                Error: function(e) {
                                    var r = e.error,
                                        n = e.options,
                                        o = e.sessionData,
                                        i = t(r);
                                    b({
                                        raven: i,
                                        error: r,
                                        options: n,
                                        sessionData: o
                                    })
                                }
                            }, i, a))
                        }
                    }
                }
            }
        }).call(this, t(5))
    }, function(e, r, t) {
        var n;
        /*!
         * UAParser.js v0.7.19
         * Lightweight JavaScript-based User-Agent string parser
         * https://github.com/faisalman/ua-parser-js
         *
         * Copyright © 2012-2016 Faisal Salman <fyzlman@gmail.com>
         * Dual licensed under GPLv2 or MIT
         */
        /*!
         * UAParser.js v0.7.19
         * Lightweight JavaScript-based User-Agent string parser
         * https://github.com/faisalman/ua-parser-js
         *
         * Copyright © 2012-2016 Faisal Salman <fyzlman@gmail.com>
         * Dual licensed under GPLv2 or MIT
         */
        ! function(o, i) {
            "use strict";
            var a = "model",
                u = "name",
                s = "type",
                c = "vendor",
                f = "version",
                l = "mobile",
                p = "tablet",
                d = {
                    extend: function(e, r) {
                        var t = {};
                        for (var n in e) r[n] && r[n].length % 2 == 0 ? t[n] = r[n].concat(e[n]) : t[n] = e[n];
                        return t
                    },
                    has: function(e, r) {
                        return "string" == typeof e && -1 !== r.toLowerCase().indexOf(e.toLowerCase())
                    },
                    lowerize: function(e) {
                        return e.toLowerCase()
                    },
                    major: function(e) {
                        return "string" == typeof e ? e.replace(/[^\d\.]/g, "").split(".")[0] : void 0
                    },
                    trim: function(e) {
                        return e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")
                    }
                },
                v = {
                    rgx: function(e, r) {
                        for (var t, n, o, i, a, u, s = 0; s < r.length && !a;) {
                            var c = r[s],
                                f = r[s + 1];
                            for (t = n = 0; t < c.length && !a;)
                                if (a = c[t++].exec(e))
                                    for (o = 0; o < f.length; o++) u = a[++n], "object" == typeof(i = f[o]) && i.length > 0 ? 2 == i.length ? "function" == typeof i[1] ? this[i[0]] = i[1].call(this, u) : this[i[0]] = i[1] : 3 == i.length ? "function" != typeof i[1] || i[1].exec && i[1].test ? this[i[0]] = u ? u.replace(i[1], i[2]) : void 0 : this[i[0]] = u ? i[1].call(this, u, i[2]) : void 0 : 4 == i.length && (this[i[0]] = u ? i[3].call(this, u.replace(i[1], i[2])) : void 0) : this[i] = u || void 0;
                            s += 2
                        }
                    },
                    str: function(e, r) {
                        for (var t in r)
                            if ("object" == typeof r[t] && r[t].length > 0) {
                                for (var n = 0; n < r[t].length; n++)
                                    if (d.has(r[t][n], e)) return "?" === t ? void 0 : t
                            } else if (d.has(r[t], e)) return "?" === t ? void 0 : t;
                        return e
                    }
                },
                g = {
                    browser: {
                        oldsafari: {
                            version: {
                                "1.0": "/8",
                                1.2: "/1",
                                1.3: "/3",
                                "2.0": "/412",
                                "2.0.2": "/416",
                                "2.0.3": "/417",
                                "2.0.4": "/419",
                                "?": "/"
                            }
                        }
                    },
                    device: {
                        amazon: {
                            model: {
                                "Fire Phone": ["SD", "KF"]
                            }
                        },
                        sprint: {
                            model: {
                                "Evo Shift 4G": "7373KT"
                            },
                            vendor: {
                                HTC: "APA",
                                Sprint: "Sprint"
                            }
                        }
                    },
                    os: {
                        windows: {
                            version: {
                                ME: "4.90",
                                "NT 3.11": "NT3.51",
                                "NT 4.0": "NT4.0",
                                2000: "NT 5.0",
                                XP: ["NT 5.1", "NT 5.2"],
                                Vista: "NT 6.0",
                                7: "NT 6.1",
                                8: "NT 6.2",
                                8.1: "NT 6.3",
                                10: ["NT 6.4", "NT 10.0"],
                                RT: "ARM"
                            }
                        }
                    }
                },
                h = {
                    browser: [
                        [/(opera\smini)\/([\w\.-]+)/i, /(opera\s[mobiletab]+).+version\/([\w\.-]+)/i, /(opera).+version\/([\w\.]+)/i, /(opera)[\/\s]+([\w\.]+)/i],
                        [u, f],
                        [/(opios)[\/\s]+([\w\.]+)/i],
                        [
                            [u, "Opera Mini"], f
                        ],
                        [/\s(opr)\/([\w\.]+)/i],
                        [
                            [u, "Opera"], f
                        ],
                        [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]*)/i, /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i, /(?:ms|\()(ie)\s([\w\.]+)/i, /(rekonq)\/([\w\.]*)/i, /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark)\/([\w\.-]+)/i],
                        [u, f],
                        [/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i],
                        [
                            [u, "IE"], f
                        ],
                        [/(edge|edgios|edga)\/((\d+)?[\w\.]+)/i],
                        [
                            [u, "Edge"], f
                        ],
                        [/(yabrowser)\/([\w\.]+)/i],
                        [
                            [u, "Yandex"], f
                        ],
                        [/(puffin)\/([\w\.]+)/i],
                        [
                            [u, "Puffin"], f
                        ],
                        [/(focus)\/([\w\.]+)/i],
                        [
                            [u, "Firefox Focus"], f
                        ],
                        [/(opt)\/([\w\.]+)/i],
                        [
                            [u, "Opera Touch"], f
                        ],
                        [/((?:[\s\/])uc?\s?browser|(?:juc.+)ucweb)[\/\s]?([\w\.]+)/i],
                        [
                            [u, "UCBrowser"], f
                        ],
                        [/(comodo_dragon)\/([\w\.]+)/i],
                        [
                            [u, /_/g, " "], f
                        ],
                        [/(micromessenger)\/([\w\.]+)/i],
                        [
                            [u, "WeChat"], f
                        ],
                        [/(brave)\/([\w\.]+)/i],
                        [
                            [u, "Brave"], f
                        ],
                        [/(qqbrowserlite)\/([\w\.]+)/i],
                        [u, f],
                        [/(QQ)\/([\d\.]+)/i],
                        [u, f],
                        [/m?(qqbrowser)[\/\s]?([\w\.]+)/i],
                        [u, f],
                        [/(BIDUBrowser)[\/\s]?([\w\.]+)/i],
                        [u, f],
                        [/(2345Explorer)[\/\s]?([\w\.]+)/i],
                        [u, f],
                        [/(MetaSr)[\/\s]?([\w\.]+)/i],
                        [u],
                        [/(LBBROWSER)/i],
                        [u],
                        [/xiaomi\/miuibrowser\/([\w\.]+)/i],
                        [f, [u, "MIUI Browser"]],
                        [/;fbav\/([\w\.]+);/i],
                        [f, [u, "Facebook"]],
                        [/safari\s(line)\/([\w\.]+)/i, /android.+(line)\/([\w\.]+)\/iab/i],
                        [u, f],
                        [/headlesschrome(?:\/([\w\.]+)|\s)/i],
                        [f, [u, "Chrome Headless"]],
                        [/\swv\).+(chrome)\/([\w\.]+)/i],
                        [
                            [u, /(.+)/, "$1 WebView"], f
                        ],
                        [/((?:oculus|samsung)browser)\/([\w\.]+)/i],
                        [
                            [u, /(.+(?:g|us))(.+)/, "$1 $2"], f
                        ],
                        [/android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*/i],
                        [f, [u, "Android Browser"]],
                        [/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i],
                        [u, f],
                        [/(dolfin)\/([\w\.]+)/i],
                        [
                            [u, "Dolphin"], f
                        ],
                        [/((?:android.+)crmo|crios)\/([\w\.]+)/i],
                        [
                            [u, "Chrome"], f
                        ],
                        [/(coast)\/([\w\.]+)/i],
                        [
                            [u, "Opera Coast"], f
                        ],
                        [/fxios\/([\w\.-]+)/i],
                        [f, [u, "Firefox"]],
                        [/version\/([\w\.]+).+?mobile\/\w+\s(safari)/i],
                        [f, [u, "Mobile Safari"]],
                        [/version\/([\w\.]+).+?(mobile\s?safari|safari)/i],
                        [f, u],
                        [/webkit.+?(gsa)\/([\w\.]+).+?(mobile\s?safari|safari)(\/[\w\.]+)/i],
                        [
                            [u, "GSA"], f
                        ],
                        [/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i],
                        [u, [f, v.str, g.browser.oldsafari.version]],
                        [/(konqueror)\/([\w\.]+)/i, /(webkit|khtml)\/([\w\.]+)/i],
                        [u, f],
                        [/(navigator|netscape)\/([\w\.-]+)/i],
                        [
                            [u, "Netscape"], f
                        ],
                        [/(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i, /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([\w\.-]+)$/i, /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i, /(links)\s\(([\w\.]+)/i, /(gobrowser)\/?([\w\.]*)/i, /(ice\s?browser)\/v?([\w\._]+)/i, /(mosaic)[\/\s]([\w\.]+)/i],
                        [u, f]
                    ],
                    cpu: [
                        [/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i],
                        [
                            ["architecture", "amd64"]
                        ],
                        [/(ia32(?=;))/i],
                        [
                            ["architecture", d.lowerize]
                        ],
                        [/((?:i[346]|x)86)[;\)]/i],
                        [
                            ["architecture", "ia32"]
                        ],
                        [/windows\s(ce|mobile);\sppc;/i],
                        [
                            ["architecture", "arm"]
                        ],
                        [/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i],
                        [
                            ["architecture", /ower/, "", d.lowerize]
                        ],
                        [/(sun4\w)[;\)]/i],
                        [
                            ["architecture", "sparc"]
                        ],
                        [/((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+[;l]))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i],
                        [
                            ["architecture", d.lowerize]
                        ]
                    ],
                    device: [
                        [/\((ipad|playbook);[\w\s\);-]+(rim|apple)/i],
                        [a, c, [s, p]],
                        [/applecoremedia\/[\w\.]+ \((ipad)/],
                        [a, [c, "Apple"],
                            [s, p]
                        ],
                        [/(apple\s{0,1}tv)/i],
                        [
                            [a, "Apple TV"],
                            [c, "Apple"]
                        ],
                        [/(archos)\s(gamepad2?)/i, /(hp).+(touchpad)/i, /(hp).+(tablet)/i, /(kindle)\/([\w\.]+)/i, /\s(nook)[\w\s]+build\/(\w+)/i, /(dell)\s(strea[kpr\s\d]*[\dko])/i],
                        [c, a, [s, p]],
                        [/(kf[A-z]+)\sbuild\/.+silk\//i],
                        [a, [c, "Amazon"],
                            [s, p]
                        ],
                        [/(sd|kf)[0349hijorstuw]+\sbuild\/.+silk\//i],
                        [
                            [a, v.str, g.device.amazon.model],
                            [c, "Amazon"],
                            [s, l]
                        ],
                        [/android.+aft([bms])\sbuild/i],
                        [a, [c, "Amazon"],
                            [s, "smarttv"]
                        ],
                        [/\((ip[honed|\s\w*]+);.+(apple)/i],
                        [a, c, [s, l]],
                        [/\((ip[honed|\s\w*]+);/i],
                        [a, [c, "Apple"],
                            [s, l]
                        ],
                        [/(blackberry)[\s-]?(\w+)/i, /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[\s_-]?([\w-]*)/i, /(hp)\s([\w\s]+\w)/i, /(asus)-?(\w+)/i],
                        [c, a, [s, l]],
                        [/\(bb10;\s(\w+)/i],
                        [a, [c, "BlackBerry"],
                            [s, l]
                        ],
                        [/android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone)/i],
                        [a, [c, "Asus"],
                            [s, p]
                        ],
                        [/(sony)\s(tablet\s[ps])\sbuild\//i, /(sony)?(?:sgp.+)\sbuild\//i],
                        [
                            [c, "Sony"],
                            [a, "Xperia Tablet"],
                            [s, p]
                        ],
                        [/android.+\s([c-g]\d{4}|so[-l]\w+)\sbuild\//i],
                        [a, [c, "Sony"],
                            [s, l]
                        ],
                        [/\s(ouya)\s/i, /(nintendo)\s([wids3u]+)/i],
                        [c, a, [s, "console"]],
                        [/android.+;\s(shield)\sbuild/i],
                        [a, [c, "Nvidia"],
                            [s, "console"]
                        ],
                        [/(playstation\s[34portablevi]+)/i],
                        [a, [c, "Sony"],
                            [s, "console"]
                        ],
                        [/(sprint\s(\w+))/i],
                        [
                            [c, v.str, g.device.sprint.vendor],
                            [a, v.str, g.device.sprint.model],
                            [s, l]
                        ],
                        [/(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i],
                        [c, a, [s, p]],
                        [/(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i, /(zte)-(\w*)/i, /(alcatel|geeksphone|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]*)/i],
                        [c, [a, /_/g, " "],
                            [s, l]
                        ],
                        [/(nexus\s9)/i],
                        [a, [c, "HTC"],
                            [s, p]
                        ],
                        [/d\/huawei([\w\s-]+)[;\)]/i, /(nexus\s6p)/i],
                        [a, [c, "Huawei"],
                            [s, l]
                        ],
                        [/(microsoft);\s(lumia[\s\w]+)/i],
                        [c, a, [s, l]],
                        [/[\s\(;](xbox(?:\sone)?)[\s\);]/i],
                        [a, [c, "Microsoft"],
                            [s, "console"]
                        ],
                        [/(kin\.[onetw]{3})/i],
                        [
                            [a, /\./g, " "],
                            [c, "Microsoft"],
                            [s, l]
                        ],
                        [/\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?:?(\s4g)?)[\w\s]+build\//i, /mot[\s-]?(\w*)/i, /(XT\d{3,4}) build\//i, /(nexus\s6)/i],
                        [a, [c, "Motorola"],
                            [s, l]
                        ],
                        [/android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i],
                        [a, [c, "Motorola"],
                            [s, p]
                        ],
                        [/hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i],
                        [
                            [c, d.trim],
                            [a, d.trim],
                            [s, "smarttv"]
                        ],
                        [/hbbtv.+maple;(\d+)/i],
                        [
                            [a, /^/, "SmartTV"],
                            [c, "Samsung"],
                            [s, "smarttv"]
                        ],
                        [/\(dtv[\);].+(aquos)/i],
                        [a, [c, "Sharp"],
                            [s, "smarttv"]
                        ],
                        [/android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i, /((SM-T\w+))/i],
                        [
                            [c, "Samsung"], a, [s, p]
                        ],
                        [/smart-tv.+(samsung)/i],
                        [c, [s, "smarttv"], a],
                        [/((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i, /(sam[sung]*)[\s-]*(\w+-?[\w-]*)/i, /sec-((sgh\w+))/i],
                        [
                            [c, "Samsung"], a, [s, l]
                        ],
                        [/sie-(\w*)/i],
                        [a, [c, "Siemens"],
                            [s, l]
                        ],
                        [/(maemo|nokia).*(n900|lumia\s\d+)/i, /(nokia)[\s_-]?([\w-]*)/i],
                        [
                            [c, "Nokia"], a, [s, l]
                        ],
                        [/android\s3\.[\s\w;-]{10}(a\d{3})/i],
                        [a, [c, "Acer"],
                            [s, p]
                        ],
                        [/android.+([vl]k\-?\d{3})\s+build/i],
                        [a, [c, "LG"],
                            [s, p]
                        ],
                        [/android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i],
                        [
                            [c, "LG"], a, [s, p]
                        ],
                        [/(lg) netcast\.tv/i],
                        [c, a, [s, "smarttv"]],
                        [/(nexus\s[45])/i, /lg[e;\s\/-]+(\w*)/i, /android.+lg(\-?[\d\w]+)\s+build/i],
                        [a, [c, "LG"],
                            [s, l]
                        ],
                        [/android.+(ideatab[a-z0-9\-\s]+)/i],
                        [a, [c, "Lenovo"],
                            [s, p]
                        ],
                        [/linux;.+((jolla));/i],
                        [c, a, [s, l]],
                        [/((pebble))app\/[\d\.]+\s/i],
                        [c, a, [s, "wearable"]],
                        [/android.+;\s(oppo)\s?([\w\s]+)\sbuild/i],
                        [c, a, [s, l]],
                        [/crkey/i],
                        [
                            [a, "Chromecast"],
                            [c, "Google"]
                        ],
                        [/android.+;\s(glass)\s\d/i],
                        [a, [c, "Google"],
                            [s, "wearable"]
                        ],
                        [/android.+;\s(pixel c)[\s)]/i],
                        [a, [c, "Google"],
                            [s, p]
                        ],
                        [/android.+;\s(pixel( [23])?( xl)?)\s/i],
                        [a, [c, "Google"],
                            [s, l]
                        ],
                        [/android.+;\s(\w+)\s+build\/hm\1/i, /android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i, /android.+(mi[\s\-_]*(?:one|one[\s_]plus|note lte)?[\s_]*(?:\d?\w?)[\s_]*(?:plus)?)\s+build/i, /android.+(redmi[\s\-_]*(?:note)?(?:[\s_]*[\w\s]+))\s+build/i],
                        [
                            [a, /_/g, " "],
                            [c, "Xiaomi"],
                            [s, l]
                        ],
                        [/android.+(mi[\s\-_]*(?:pad)(?:[\s_]*[\w\s]+))\s+build/i],
                        [
                            [a, /_/g, " "],
                            [c, "Xiaomi"],
                            [s, p]
                        ],
                        [/android.+;\s(m[1-5]\snote)\sbuild/i],
                        [a, [c, "Meizu"],
                            [s, p]
                        ],
                        [/(mz)-([\w-]{2,})/i],
                        [
                            [c, "Meizu"], a, [s, l]
                        ],
                        [/android.+a000(1)\s+build/i, /android.+oneplus\s(a\d{4})\s+build/i],
                        [a, [c, "OnePlus"],
                            [s, l]
                        ],
                        [/android.+[;\/]\s*(RCT[\d\w]+)\s+build/i],
                        [a, [c, "RCA"],
                            [s, p]
                        ],
                        [/android.+[;\/\s]+(Venue[\d\s]{2,7})\s+build/i],
                        [a, [c, "Dell"],
                            [s, p]
                        ],
                        [/android.+[;\/]\s*(Q[T|M][\d\w]+)\s+build/i],
                        [a, [c, "Verizon"],
                            [s, p]
                        ],
                        [/android.+[;\/]\s+(Barnes[&\s]+Noble\s+|BN[RT])(V?.*)\s+build/i],
                        [
                            [c, "Barnes & Noble"], a, [s, p]
                        ],
                        [/android.+[;\/]\s+(TM\d{3}.*\b)\s+build/i],
                        [a, [c, "NuVision"],
                            [s, p]
                        ],
                        [/android.+;\s(k88)\sbuild/i],
                        [a, [c, "ZTE"],
                            [s, p]
                        ],
                        [/android.+[;\/]\s*(gen\d{3})\s+build.*49h/i],
                        [a, [c, "Swiss"],
                            [s, l]
                        ],
                        [/android.+[;\/]\s*(zur\d{3})\s+build/i],
                        [a, [c, "Swiss"],
                            [s, p]
                        ],
                        [/android.+[;\/]\s*((Zeki)?TB.*\b)\s+build/i],
                        [a, [c, "Zeki"],
                            [s, p]
                        ],
                        [/(android).+[;\/]\s+([YR]\d{2})\s+build/i, /android.+[;\/]\s+(Dragon[\-\s]+Touch\s+|DT)(\w{5})\sbuild/i],
                        [
                            [c, "Dragon Touch"], a, [s, p]
                        ],
                        [/android.+[;\/]\s*(NS-?\w{0,9})\sbuild/i],
                        [a, [c, "Insignia"],
                            [s, p]
                        ],
                        [/android.+[;\/]\s*((NX|Next)-?\w{0,9})\s+build/i],
                        [a, [c, "NextBook"],
                            [s, p]
                        ],
                        [/android.+[;\/]\s*(Xtreme\_)?(V(1[045]|2[015]|30|40|60|7[05]|90))\s+build/i],
                        [
                            [c, "Voice"], a, [s, l]
                        ],
                        [/android.+[;\/]\s*(LVTEL\-)?(V1[12])\s+build/i],
                        [
                            [c, "LvTel"], a, [s, l]
                        ],
                        [/android.+;\s(PH-1)\s/i],
                        [a, [c, "Essential"],
                            [s, l]
                        ],
                        [/android.+[;\/]\s*(V(100MD|700NA|7011|917G).*\b)\s+build/i],
                        [a, [c, "Envizen"],
                            [s, p]
                        ],
                        [/android.+[;\/]\s*(Le[\s\-]+Pan)[\s\-]+(\w{1,9})\s+build/i],
                        [c, a, [s, p]],
                        [/android.+[;\/]\s*(Trio[\s\-]*.*)\s+build/i],
                        [a, [c, "MachSpeed"],
                            [s, p]
                        ],
                        [/android.+[;\/]\s*(Trinity)[\-\s]*(T\d{3})\s+build/i],
                        [c, a, [s, p]],
                        [/android.+[;\/]\s*TU_(1491)\s+build/i],
                        [a, [c, "Rotor"],
                            [s, p]
                        ],
                        [/android.+(KS(.+))\s+build/i],
                        [a, [c, "Amazon"],
                            [s, p]
                        ],
                        [/android.+(Gigaset)[\s\-]+(Q\w{1,9})\s+build/i],
                        [c, a, [s, p]],
                        [/\s(tablet|tab)[;\/]/i, /\s(mobile)(?:[;\/]|\ssafari)/i],
                        [
                            [s, d.lowerize], c, a
                        ],
                        [/(android[\w\.\s\-]{0,9});.+build/i],
                        [a, [c, "Generic"]]
                    ],
                    engine: [
                        [/windows.+\sedge\/([\w\.]+)/i],
                        [f, [u, "EdgeHTML"]],
                        [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i, /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i, /(icab)[\/\s]([23]\.[\d\.]+)/i],
                        [u, f],
                        [/rv\:([\w\.]{1,9}).+(gecko)/i],
                        [f, u]
                    ],
                    os: [
                        [/microsoft\s(windows)\s(vista|xp)/i],
                        [u, f],
                        [/(windows)\snt\s6\.2;\s(arm)/i, /(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s\w]*)/i, /(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i],
                        [u, [f, v.str, g.os.windows.version]],
                        [/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i],
                        [
                            [u, "Windows"],
                            [f, v.str, g.os.windows.version]
                        ],
                        [/\((bb)(10);/i],
                        [
                            [u, "BlackBerry"], f
                        ],
                        [/(blackberry)\w*\/?([\w\.]*)/i, /(tizen)[\/\s]([\w\.]+)/i, /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]*)/i, /linux;.+(sailfish);/i],
                        [u, f],
                        [/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]*)/i],
                        [
                            [u, "Symbian"], f
                        ],
                        [/\((series40);/i],
                        [u],
                        [/mozilla.+\(mobile;.+gecko.+firefox/i],
                        [
                            [u, "Firefox OS"], f
                        ],
                        [/(nintendo|playstation)\s([wids34portablevu]+)/i, /(mint)[\/\s\(]?(\w*)/i, /(mageia|vectorlinux)[;\s]/i, /(joli|[kxln]?ubuntu|debian|suse|opensuse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]*)/i, /(hurd|linux)\s?([\w\.]*)/i, /(gnu)\s?([\w\.]*)/i],
                        [u, f],
                        [/(cros)\s[\w]+\s([\w\.]+\w)/i],
                        [
                            [u, "Chromium OS"], f
                        ],
                        [/(sunos)\s?([\w\.\d]*)/i],
                        [
                            [u, "Solaris"], f
                        ],
                        [/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]*)/i],
                        [u, f],
                        [/(haiku)\s(\w+)/i],
                        [u, f],
                        [/cfnetwork\/.+darwin/i, /ip[honead]{2,4}(?:.*os\s([\w]+)\slike\smac|;\sopera)/i],
                        [
                            [f, /_/g, "."],
                            [u, "iOS"]
                        ],
                        [/(mac\sos\sx)\s?([\w\s\.]*)/i, /(macintosh|mac(?=_powerpc)\s)/i],
                        [
                            [u, "Mac OS"],
                            [f, /_/g, "."]
                        ],
                        [/((?:open)?solaris)[\/\s-]?([\w\.]*)/i, /(aix)\s((\d)(?=\.|\)|\s)[\w\.])*/i, /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms|fuchsia)/i, /(unix)\s?([\w\.]*)/i],
                        [u, f]
                    ]
                },
                y = function(e, r) {
                    if ("object" == typeof e && (r = e, e = void 0), !(this instanceof y)) return new y(e, r).getResult();
                    var t = e || (o && o.navigator && o.navigator.userAgent ? o.navigator.userAgent : ""),
                        n = r ? d.extend(h, r) : h;
                    return this.getBrowser = function() {
                        var e = {
                            name: void 0,
                            version: void 0
                        };
                        return v.rgx.call(e, t, n.browser), e.major = d.major(e.version), e
                    }, this.getCPU = function() {
                        var e = {
                            architecture: void 0
                        };
                        return v.rgx.call(e, t, n.cpu), e
                    }, this.getDevice = function() {
                        var e = {
                            vendor: void 0,
                            model: void 0,
                            type: void 0
                        };
                        return v.rgx.call(e, t, n.device), e
                    }, this.getEngine = function() {
                        var e = {
                            name: void 0,
                            version: void 0
                        };
                        return v.rgx.call(e, t, n.engine), e
                    }, this.getOS = function() {
                        var e = {
                            name: void 0,
                            version: void 0
                        };
                        return v.rgx.call(e, t, n.os), e
                    }, this.getResult = function() {
                        return {
                            ua: this.getUA(),
                            browser: this.getBrowser(),
                            engine: this.getEngine(),
                            os: this.getOS(),
                            device: this.getDevice(),
                            cpu: this.getCPU()
                        }
                    }, this.getUA = function() {
                        return t
                    }, this.setUA = function(e) {
                        return t = e, this
                    }, this
                };
            y.VERSION = "0.7.19", y.BROWSER = {
                NAME: u,
                MAJOR: "major",
                VERSION: f
            }, y.CPU = {
                ARCHITECTURE: "architecture"
            }, y.DEVICE = {
                MODEL: a,
                VENDOR: c,
                TYPE: s,
                CONSOLE: "console",
                MOBILE: l,
                SMARTTV: "smarttv",
                TABLET: p,
                WEARABLE: "wearable",
                EMBEDDED: "embedded"
            }, y.ENGINE = {
                NAME: u,
                VERSION: f
            }, y.OS = {
                NAME: u,
                VERSION: f
            }, void 0 !== r ? (void 0 !== e && e.exports && (r = e.exports = y), r.UAParser = y) : t(33) ? void 0 === (n = function() {
                return y
            }.call(r, t, r, e)) || (e.exports = n) : o && (o.UAParser = y);
            var b = o && (o.jQuery || o.Zepto);
            if (void 0 !== b && !b.ua) {
                var m = new y;
                b.ua = m.getResult(), b.ua.get = function() {
                    return m.getUA()
                }, b.ua.set = function(e) {
                    m.setUA(e);
                    var r = m.getResult();
                    for (var t in r) b.ua[t] = r[t]
                }
            }
        }("object" == typeof window ? window : this)
    }, function(e, r) {
        (function(r) {
            e.exports = r
        }).call(this, {})
    }, function(e, r, t) {
        "use strict";
        var n = Symbol.for("union-type-any-symbol"),
            o = function(e, r, t, o) {
                var i = Symbol("[" + e + ":" + r + "]"),
                    a = function() {
                        var e = t.apply(void 0, arguments),
                            a = function(e, r, t) {
                                return r in e ? Object.defineProperty(e, r, {
                                    value: t,
                                    enumerable: !0,
                                    configurable: !0,
                                    writable: !0
                                }) : e[r] = t, e
                            }({
                                matchWith: function(e) {
                                    return function(r) {
                                        var t = Object.keys(r),
                                            o = !0,
                                            i = !1,
                                            a = void 0;
                                        try {
                                            for (var u, s = t[Symbol.iterator](); !(o = (u = s.next()).done); o = !0) {
                                                var c = u.value;
                                                if (c === e.name) return r[c](e.payload)
                                            }
                                        } catch (e) {
                                            i = !0, a = e
                                        } finally {
                                            try {
                                                !o && s.return && s.return()
                                            } finally {
                                                if (i) throw a
                                            }
                                        }
                                        if (r[n]) return r[n]();
                                        throw new Error('Variant "' + e.name + '" not covered in pattern with keys [' + t + "].\nThis could mean you did not include all variants in your Union's matchWith function.")
                                    }
                                }({
                                    name: r,
                                    payload: e
                                }),
                                toString: function() {
                                    return r
                                }
                            }, i, !0);
                        return Object.keys(o).forEach(function(e) {
                            a[e] = o[e](a)
                        }), a
                    };
                return a.hasInstance = function(e) {
                    return e && !0 === e[i]
                }, a
            },
            i = function(e, r) {
                var t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
                return Object.keys(r).reduce(function(n, i) {
                    return n[i] = o(e, i, r[i], t), n
                }, {})
            };
        i.any = n, e.exports = i
    }, function(e, r, t) {
        "use strict";
        var n = function e(r) {
                return {
                    map: function(t) {
                        return e(t(r))
                    },
                    chain: function(e) {
                        return e(r)
                    },
                    fold: function(e, t) {
                        return t(r)
                    },
                    getOrElse: function() {
                        return r
                    },
                    merge: function() {
                        return r
                    }
                }
            },
            o = function e(r) {
                return {
                    map: function() {
                        return e(r)
                    },
                    chain: function() {
                        return e(r)
                    },
                    fold: function(e) {
                        return e(r)
                    },
                    getOrElse: function(e) {
                        return e
                    },
                    merge: function() {
                        return r
                    }
                }
            },
            i = {
                Ok: n,
                Error: o,
                try: function(e) {
                    try {
                        return n(e())
                    } catch (e) {
                        return o(e)
                    }
                },
                fromNullable: function(e, r) {
                    return null != e ? n(e) : o(r)
                },
                fromMaybe: function(e, r) {
                    return e.fold(function() {
                        return o(r)
                    }, function(e) {
                        return n(e)
                    })
                },
                of: function(e) {
                    return n(e)
                }
            };
        e.exports = i
    }, function(e, r, t) {
        "use strict";
        var n = function e(r) {
                return {
                    map: function(t) {
                        return e(t(r))
                    },
                    chain: function(e) {
                        return e(r)
                    },
                    fold: function(e, t) {
                        return t(r)
                    },
                    getOrElse: function() {
                        return r
                    },
                    orElse: function() {
                        return e(r)
                    },
                    filter: function(t) {
                        return t(r) ? e(r) : o()
                    }
                }
            },
            o = function e() {
                return {
                    map: function() {
                        return e()
                    },
                    chain: function() {
                        return e()
                    },
                    fold: function(e) {
                        return e()
                    },
                    getOrElse: function(e) {
                        return e
                    },
                    orElse: function(e) {
                        return e()
                    },
                    filter: function() {
                        return e()
                    }
                }
            },
            i = {
                Just: n,
                Nothing: o,
                fromNullable: function(e) {
                    return null != e ? n(e) : o()
                },
                of: function(e) {
                    return n(e)
                }
            };
        e.exports = i
    }, function(e, r, t) {
        "use strict";
        var n = t(0).identity,
            o = t(12).Result,
            i = t(41),
            a = t(4).isLocalhost,
            u = function(e) {
                return o.try(e).getOrElse("unknown")
            },
            s = function(e) {
                return o.try(e).fold(function(e) {
                    return e.message
                }, function(e) {
                    return e
                })
            };
        e.exports.configureForViewerWorker = function(e) {
            var r = e.Raven,
                t = e.globalScope,
                o = e.dsn,
                c = e.params,
                f = void 0 === c ? {} : c,
                l = e.appName;
            a() || (i({
                Raven: r,
                appName: l,
                browserUrlGetter: function() {
                    return u(function() {
                        return t["wix-location"].url
                    })
                },
                dsn: o,
                params: f
            }), r.setDataCallback(function(e) {
                var r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : n;
                return e.extra = Object.assign(e.extra || {}, function(e) {
                    return {
                        referrer: s(function() {
                            return e["wix-window"].referrer
                        }),
                        workerUrl: s(function() {
                            return e.location.href
                        })
                    }
                }(t)), e.tags = Object.assign(e.tags || {}, f.tags || {}, function(e) {
                    return {
                        renderMode: u(function() {
                            return e["wix-window"].rendering.env
                        }),
                        viewMode: u(function() {
                            return e["wix-window"].viewMode
                        }),
                        santaVersion: u(function() {
                            return function(e) {
                                var r = e.match(/santa\/([^/]*)/);
                                return r ? r[1] : "unknown"
                            }(e.location.href)
                        })
                    }
                }(t)), r(e)
            }))
        }
    }, function(e, r, t) {
        "use strict";
        var n = Symbol.for("union-type-any-symbol"),
            o = function(e, r, t, o) {
                var i = Symbol("[" + e + ":" + r + "]"),
                    a = function() {
                        var e = t.apply(void 0, arguments),
                            a = function(e, r, t) {
                                return r in e ? Object.defineProperty(e, r, {
                                    value: t,
                                    enumerable: !0,
                                    configurable: !0,
                                    writable: !0
                                }) : e[r] = t, e
                            }({
                                matchWith: function(e) {
                                    return function(r) {
                                        var t = Object.keys(r),
                                            o = !0,
                                            i = !1,
                                            a = void 0;
                                        try {
                                            for (var u, s = t[Symbol.iterator](); !(o = (u = s.next()).done); o = !0) {
                                                var c = u.value;
                                                if (c === e.name) return r[c](e.payload)
                                            }
                                        } catch (e) {
                                            i = !0, a = e
                                        } finally {
                                            try {
                                                !o && s.return && s.return()
                                            } finally {
                                                if (i) throw a
                                            }
                                        }
                                        if (r[n]) return r[n]();
                                        throw new Error('Variant "' + e.name + '" not covered in pattern with keys [' + t + "].\nThis could mean you did not include all variants in your Union's matchWith function.")
                                    }
                                }({
                                    name: r,
                                    payload: e
                                }),
                                toString: function() {
                                    return r
                                }
                            }, i, !0);
                        return Object.keys(o).forEach(function(e) {
                            a[e] = o[e](a)
                        }), a
                    };
                return a.hasInstance = function(e) {
                    return e && !0 === e[i]
                }, a
            },
            i = function(e, r) {
                var t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
                return Object.keys(r).reduce(function(n, i) {
                    return n[i] = o(e, i, r[i], t), n
                }, {})
            };
        i.any = n, e.exports = i
    }, function(e, r, t) {
        "use strict";
        var n = function e(r) {
                return {
                    map: function(t) {
                        return e(t(r))
                    },
                    chain: function(e) {
                        return e(r)
                    },
                    fold: function(e, t) {
                        return t(r)
                    },
                    getOrElse: function() {
                        return r
                    },
                    merge: function() {
                        return r
                    }
                }
            },
            o = function e(r) {
                return {
                    map: function() {
                        return e(r)
                    },
                    chain: function() {
                        return e(r)
                    },
                    fold: function(e) {
                        return e(r)
                    },
                    getOrElse: function(e) {
                        return e
                    },
                    merge: function() {
                        return r
                    }
                }
            },
            i = {
                Ok: n,
                Error: o,
                try: function(e) {
                    try {
                        return n(e())
                    } catch (e) {
                        return o(e)
                    }
                },
                fromNullable: function(e, r) {
                    return null != e ? n(e) : o(r)
                },
                fromMaybe: function(e, r) {
                    return e.fold(function() {
                        return o(r)
                    }, function(e) {
                        return n(e)
                    })
                },
                of: function(e) {
                    return n(e)
                }
            };
        e.exports = i
    }, function(e, r, t) {
        "use strict";
        var n = function e(r) {
                return {
                    map: function(t) {
                        return e(t(r))
                    },
                    chain: function(e) {
                        return e(r)
                    },
                    fold: function(e, t) {
                        return t(r)
                    },
                    getOrElse: function() {
                        return r
                    },
                    orElse: function() {
                        return e(r)
                    },
                    filter: function(t) {
                        return t(r) ? e(r) : o()
                    }
                }
            },
            o = function e() {
                return {
                    map: function() {
                        return e()
                    },
                    chain: function() {
                        return e()
                    },
                    fold: function(e) {
                        return e()
                    },
                    getOrElse: function(e) {
                        return e
                    },
                    orElse: function(e) {
                        return e()
                    },
                    filter: function() {
                        return e()
                    }
                }
            },
            i = {
                Just: n,
                Nothing: o,
                fromNullable: function(e) {
                    return null != e ? n(e) : o()
                },
                of: function(e) {
                    return n(e)
                }
            };
        e.exports = i
    }, function(e, r, t) {
        "use strict";
        var n = t(0).identity,
            o = t(42),
            i = t(43),
            a = t(4).getAppUrl,
            u = t(44);
        e.exports = function(e) {
            var r = e.Raven,
                t = e.appName,
                s = e.browserUrlGetter,
                c = e.dsn,
                f = e.params,
                l = a(t),
                p = i(l);
            r.config(c, Object.assign({}, o, {
                captureUnhandledRejections: !1,
                autoBreadcrumbs: {
                    dom: !1
                }
            })), r.setRelease(f.release || p), r.setShouldSendCallback(f.shouldSendCallback || u), r.setDataCallback(function(e) {
                var r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : n;
                return e.request = Object.assign(e.request || {}, {
                    url: s()
                }), r(e)
            });
            return function() {
                r.setDataCallback(n)
            }
        }
    }, function(e, r, t) {
        "use strict";
        e.exports = {
            maxUrlLength: 1e3
        }
    }, function(e, r, t) {
        "use strict";
        var n = function(e) {
            var r = e.split("/"),
                t = r[r.length - 3],
                n = r[r.length - 2];
            if (! function(e) {
                    return /^\d+\.\d+\.\d+$/.test(e)
                }(n)) throw Error("Invalid version string " + n);
            return {
                appName: t,
                version: n
            }
        };
        e.exports = function(e) {
            try {
                var r = n(e);
                return r.appName + "@" + r.version
            } catch (e) {
                return "unknown"
            }
        }, e.exports.getAppVersion = function(e) {
            try {
                return n(e).version
            } catch (e) {
                return "unknown"
            }
        }, e.exports.UNKNOWN_VERSION = "unknown"
    }, function(e, r, t) {
        "use strict";
        var n = t(45),
            o = n.extract,
            i = n.parse,
            a = t(0).get,
            u = t(0).includes,
            s = t(0).identity,
            c = t(12),
            f = c.Result,
            l = c.Maybe,
            p = ["ReactSource", "EditorSource", "experiments", "petri_ovr", "WixCodeRuntimeSource", "js-wixcode-sdk-override", "debug"],
            d = function(e) {
                return l.fromNullable(e).chain(function(e) {
                    return f.try(function() {
                        return i(o(e))
                    })
                }).map(function(e) {
                    return function(e) {
                        return "true" === e.forceReportSentry
                    }(e) || function(e) {
                        return Object.keys(e).every(function(e) {
                            return !u(p, e)
                        })
                    }(e)
                }).getOrElse(!0)
            },
            v = [function(e) {
                return function(e) {
                    return [a(e, ["request", "headers", "Referer"]), a(e, ["request", "url"])]
                }(e).every(d)
            }];
        e.exports = function(e) {
            var r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : s;
            return v.concat(r).every(function(r) {
                return r(e)
            })
        }
    }, function(e, r, t) {
        "use strict";
        var n = t(46),
            o = t(47),
            i = t(48);

        function a(e, r) {
            return r.encode ? r.strict ? n(e) : encodeURIComponent(e) : e
        }

        function u(e) {
            var r = e.indexOf("?");
            return -1 === r ? "" : e.slice(r + 1)
        }

        function s(e, r) {
            var t = function(e) {
                    var r;
                    switch (e.arrayFormat) {
                        case "index":
                            return function(e, t, n) {
                                r = /\[(\d*)\]$/.exec(e), e = e.replace(/\[\d*\]$/, ""), r ? (void 0 === n[e] && (n[e] = {}), n[e][r[1]] = t) : n[e] = t
                            };
                        case "bracket":
                            return function(e, t, n) {
                                r = /(\[\])$/.exec(e), e = e.replace(/\[\]$/, ""), r ? void 0 !== n[e] ? n[e] = [].concat(n[e], t) : n[e] = [t] : n[e] = t
                            };
                        default:
                            return function(e, r, t) {
                                void 0 !== t[e] ? t[e] = [].concat(t[e], r) : t[e] = r
                            }
                    }
                }(r = o({
                    arrayFormat: "none"
                }, r)),
                n = Object.create(null);
            return "string" != typeof e ? n : (e = e.trim().replace(/^[?#&]/, "")) ? (e.split("&").forEach(function(e) {
                var r = e.replace(/\+/g, " ").split("="),
                    o = r.shift(),
                    a = r.length > 0 ? r.join("=") : void 0;
                a = void 0 === a ? null : i(a), t(i(o), a, n)
            }), Object.keys(n).sort().reduce(function(e, r) {
                var t = n[r];
                return Boolean(t) && "object" == typeof t && !Array.isArray(t) ? e[r] = function e(r) {
                    return Array.isArray(r) ? r.sort() : "object" == typeof r ? e(Object.keys(r)).sort(function(e, r) {
                        return Number(e) - Number(r)
                    }).map(function(e) {
                        return r[e]
                    }) : r
                }(t) : e[r] = t, e
            }, Object.create(null))) : n
        }
        r.extract = u, r.parse = s, r.stringify = function(e, r) {
            !1 === (r = o({
                encode: !0,
                strict: !0,
                arrayFormat: "none"
            }, r)).sort && (r.sort = function() {});
            var t = function(e) {
                switch (e.arrayFormat) {
                    case "index":
                        return function(r, t, n) {
                            return null === t ? [a(r, e), "[", n, "]"].join("") : [a(r, e), "[", a(n, e), "]=", a(t, e)].join("")
                        };
                    case "bracket":
                        return function(r, t) {
                            return null === t ? a(r, e) : [a(r, e), "[]=", a(t, e)].join("")
                        };
                    default:
                        return function(r, t) {
                            return null === t ? a(r, e) : [a(r, e), "=", a(t, e)].join("")
                        }
                }
            }(r);
            return e ? Object.keys(e).sort(r.sort).map(function(n) {
                var o = e[n];
                if (void 0 === o) return "";
                if (null === o) return a(n, r);
                if (Array.isArray(o)) {
                    var i = [];
                    return o.slice().forEach(function(e) {
                        void 0 !== e && i.push(t(n, e, i.length))
                    }), i.join("&")
                }
                return a(n, r) + "=" + a(o, r)
            }).filter(function(e) {
                return e.length > 0
            }).join("&") : ""
        }, r.parseUrl = function(e, r) {
            return {
                url: e.split("?")[0] || "",
                query: s(u(e), r)
            }
        }
    }, function(e, r, t) {
        "use strict";
        e.exports = function(e) {
            return encodeURIComponent(e).replace(/[!'()*]/g, function(e) {
                return "%" + e.charCodeAt(0).toString(16).toUpperCase()
            })
        }
    }, function(e, r, t) {
        "use strict";
        /*
        object-assign
        (c) Sindre Sorhus
        @license MIT
        */
        var n = Object.getOwnPropertySymbols,
            o = Object.prototype.hasOwnProperty,
            i = Object.prototype.propertyIsEnumerable;
        e.exports = function() {
            try {
                if (!Object.assign) return !1;
                var e = new String("abc");
                if (e[5] = "de", "5" === Object.getOwnPropertyNames(e)[0]) return !1;
                for (var r = {}, t = 0; t < 10; t++) r["_" + String.fromCharCode(t)] = t;
                if ("0123456789" !== Object.getOwnPropertyNames(r).map(function(e) {
                        return r[e]
                    }).join("")) return !1;
                var n = {};
                return "abcdefghijklmnopqrst".split("").forEach(function(e) {
                    n[e] = e
                }), "abcdefghijklmnopqrst" === Object.keys(Object.assign({}, n)).join("")
            } catch (e) {
                return !1
            }
        }() ? Object.assign : function(e, r) {
            for (var t, a, u = function(e) {
                    if (null === e || void 0 === e) throw new TypeError("Object.assign cannot be called with null or undefined");
                    return Object(e)
                }(e), s = 1; s < arguments.length; s++) {
                for (var c in t = Object(arguments[s])) o.call(t, c) && (u[c] = t[c]);
                if (n) {
                    a = n(t);
                    for (var f = 0; f < a.length; f++) i.call(t, a[f]) && (u[a[f]] = t[a[f]])
                }
            }
            return u
        }
    }, function(e, r, t) {
        "use strict";
        var n = new RegExp("%[a-f0-9]{2}", "gi"),
            o = new RegExp("(%[a-f0-9]{2})+", "gi");

        function i(e, r) {
            try {
                return decodeURIComponent(e.join(""))
            } catch (e) {}
            if (1 === e.length) return e;
            r = r || 1;
            var t = e.slice(0, r),
                n = e.slice(r);
            return Array.prototype.concat.call([], i(t), i(n))
        }

        function a(e) {
            try {
                return decodeURIComponent(e)
            } catch (o) {
                for (var r = e.match(n), t = 1; t < r.length; t++) r = (e = i(r, t).join("")).match(n);
                return e
            }
        }
        e.exports = function(e) {
            if ("string" != typeof e) throw new TypeError("Expected `encodedURI` to be of type `string`, got `" + typeof e + "`");
            try {
                return e = e.replace(/\+/g, " "), decodeURIComponent(e)
            } catch (r) {
                return function(e) {
                    for (var r = {
                            "%FE%FF": "��",
                            "%FF%FE": "��"
                        }, t = o.exec(e); t;) {
                        try {
                            r[t[0]] = decodeURIComponent(t[0])
                        } catch (e) {
                            var n = a(t[0]);
                            n !== t[0] && (r[t[0]] = n)
                        }
                        t = o.exec(e)
                    }
                    r["%C2"] = "�";
                    for (var i = Object.keys(r), u = 0; u < i.length; u++) {
                        var s = i[u];
                        e = e.replace(new RegExp(s, "g"), r[s])
                    }
                    return e
                }(e)
            }
        }
    }, function(e, r, t) {
        "use strict";
        var n = t(6).union,
            o = t(1).matchAny,
            i = t(50),
            a = i.BI_SOURCE,
            u = i.BI_ENDPOINT,
            s = i.BI_VIEWER_ENDPOINT,
            c = n("Environment", {
                NotInitialized: function() {},
                Initialized: function(e) {
                    var r = e.viewMode;
                    return {
                        biLogger: (0, e.biLoggerFactory)().updateDefaults({
                            src: a
                        }).logger({
                            endpoint: function(e) {
                                return "Site" !== e ? u : s
                            }(r)
                        })
                    }
                }
            });
        e.exports.biHandlerCreator = function() {
            var e = c.NotInitialized();
            return function() {
                return {
                    init: function(r) {
                        var t = r.viewMode,
                            n = r.biLoggerFactory;
                        n && (e = c.Initialized({
                            viewMode: t,
                            biLoggerFactory: n
                        }))
                    },
                    log: function(r) {
                        r.matchWith(function(e, r, t) {
                            return r in e ? Object.defineProperty(e, r, {
                                value: t,
                                enumerable: !0,
                                configurable: !0,
                                writable: !0
                            }) : e[r] = t, e
                        }({
                            BI: function(r) {
                                var t = r.biEvent;
                                e.matchWith({
                                    Initialized: function(e) {
                                        e.biLogger.log(t, {
                                            useBatch: !1
                                        })
                                    },
                                    NotInitialized: function() {
                                        throw new Error("You cannot report to BI before setting the logger environment.\n                  Make sure you call logger.init before reporting.")
                                    }
                                })
                            }
                        }, o, function() {}))
                    }
                }
            }
        }
    }, function(e, r, t) {
        "use strict";
        e.exports.BI_ENDPOINT = "platform", e.exports.BI_CM_ENDPOINT = "platform-cm", e.exports.BI_SANTA_EDITOR_ENDPOINT = "editor", e.exports.BI_VIEWER_ENDPOINT = "platform-viewer", e.exports.BI_ERROR_ENDPOINT = "trg", e.exports.BI_SOURCE = 79, e.exports.BI_CM_SOURCE = 83, e.exports.BI_SANTA_EDITOR_SOURCE = 38
    }, function(e, r, t) {
        "use strict";
        var n = t(1).matchAny;
        e.exports.filterByReportToHandlers = function(e, r) {
            return function(t) {
                t.matchWith(function(e, r, t) {
                    return r in e ? Object.defineProperty(e, r, {
                        value: t,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }) : e[r] = t, e
                }({
                    Trace: function(n) {
                        n.payload.options.reportToHandlers.includes(e) && r(t)
                    }
                }, n, function() {
                    return r(t)
                }))
            }
        }
    }, function(e, r, t) {
        "use strict";
        e.exports.traceLevels = {
            INFO: "info",
            WARN: "warn",
            ERROR: "error"
        }
    }, function(e, r, t) {
        "use strict";
        var n = t(0).values,
            o = t(54).reportRunCodeBi,
            i = t(55).init,
            a = t(66).buildNamespacesMap,
            u = "There was an error in your script",
            s = "wixCodeDisableUserCode";
        var c = function(e) {
            var r = e.appLogger,
                t = e.userConsole,
                n = e.modules;
            try {
                return n.reduce(function(e, r) {
                    return Object.keys(r || {}).forEach(function(n) {
                        var o = r[n];
                        e[n] = function() {
                            try {
                                return o.apply(void 0, arguments)
                            } catch (e) {
                                t.error(e)
                            }
                        }
                    }), e
                }, {})
            } catch (e) {
                r.error(e)
            }
        };
        e.exports = {
            runUserCode: function() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                    r = e.userConsole,
                    t = e.appLogger,
                    f = e.fedopsLogger,
                    l = e.active$wBiFactory,
                    p = e.wixSdk,
                    d = e.$w,
                    v = e.userCodeModules,
                    g = e.wixCodeScripts,
                    h = e.instance,
                    y = e.onLog,
                    b = e.consoleProxy,
                    m = e.firstUserCodeRun,
                    w = e.platformBi,
                    x = e.codeAppId;
                try {
                    if (function(e) {
                            return "true" === (e.location.query || {})[s]
                        }(p)) return;
                    var E = g.reduce(function(e, r) {
                        return e[r.scriptName] = "Loading the code for the " + r.displayName + ". To debug this code, open " + r.scriptName + " in Developer Tools.", e
                    }, {});
                    if (m && i({
                            appLogger: t,
                            fedopsLogger: f,
                            wixSdk: p,
                            instance: h,
                            onLog: y,
                            ignoredConsoleMessages: n(E)
                        }), 0 === g.length) return {};
                    var O = a(p, self.fetch.bind(self), l.wrapObjectPropertiesWithBi),
                        S = l.wrapFunctionReturnValueWithBi(d);
                    S.at = l.wrapFunctionCallWithBi(d.at, d);
                    var R = g.map(function(e) {
                        r && r.info && r.info(E[e.scriptName]);
                        var n = {};
                        if (v.has(e.url)) {
                            try {
                                var i = v.get(e.url);
                                n = i && i({
                                    $w: S,
                                    $ns: O,
                                    consoleProxy: b
                                })
                            } catch (e) {
                                r.error(u), r.error(e)
                            }
                            return o({
                                appLogger: t,
                                platformBi: w,
                                codeAppId: x,
                                pageName: e.displayName
                            }), n
                        }
                        t.warn("Trying to run a user code script which was not loaded", {
                            extra: {
                                script: e
                            }
                        })
                    });
                    return c({
                        appLogger: t,
                        userConsole: r,
                        modules: R
                    })
                } catch (e) {
                    throw t.error(e), e
                }
            }
        }
    }, function(e, r, t) {
        "use strict";
        var n = t(0).invoke,
            o = t(8).pageCodeRun;
        e.exports.reportRunCodeBi = function(e) {
            var r = e.appLogger,
                t = e.platformBi,
                i = e.codeAppId,
                a = e.pageName,
                u = t.networkPageLoadStart,
                s = t.isServerSide,
                c = t.getBsi,
                f = t.metaSiteId,
                l = t.viewerSessionId,
                p = t.pageId,
                d = t.pageUrl,
                v = t.viewMode;
            if (!s) {
                var g = u ? Date.now() - Math.round(u) : null,
                    h = o({
                        metaSiteId: f,
                        bsi: n(c),
                        viewerSessionId: l,
                        pageId: p,
                        pageName: a,
                        pageUrl: d,
                        codeAppId: i,
                        viewMode: v,
                        tsn: g
                    });
                r.bi(h)
            }
        }
    }, function(e, r, t) {
        "use strict";
        var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        } : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        };

        function o(e) {
            return function() {
                var r = e.apply(this, arguments);
                return new Promise(function(e, t) {
                    return function n(o, i) {
                        try {
                            var a = r[o](i),
                                u = a.value
                        } catch (e) {
                            return void t(e)
                        }
                        if (!a.done) return Promise.resolve(u).then(function(e) {
                            n("next", e)
                        }, function(e) {
                            n("throw", e)
                        });
                        e(u)
                    }("next")
                })
            }
        }
        var i = t(0).get,
            a = t(2),
            u = a.wixCodeLogLevel,
            s = a.siteMonitoringSeverity,
            c = a.convertToSiteMonitoringSeverity,
            f = t(56).create,
            l = t(57).throttledLogSender,
            p = t(60).create;

        function d(e) {
            return null === e ? String(e) : void 0 === e ? String(void 0) : "object" === (void 0 === e ? "undefined" : n(e)) ? JSON.stringify(e) : e
        }
        var v = function(e) {
                var r = e.sendLog,
                    t = e.onWorkerLoggerLog,
                    n = function(e) {
                        var r = function(r) {
                            var t = function(e) {
                                return e.stack || e.message || e.name || e
                            }(r.reason || {});
                            e({
                                message: t,
                                severity: s.ERROR
                            })
                        };
                        return self.addEventListener("unhandledrejection", r),
                            function() {
                                return self.removeEventListener("unhandledrejection", r)
                            }
                    }(r),
                    o = function(e, r) {
                        return r(function(r) {
                            var t = r.logLevel,
                                n = r.args,
                                o = r.stack;
                            if (t === u.ASSERT) {
                                if (n[0]) {
                                    var i = n.slice(1).map(d).join(" ");
                                    e({
                                        message: i,
                                        severity: s.ERROR
                                    })
                                }
                            } else if (t !== u.VERBOSE) {
                                var a = n.map(d).join(" "),
                                    f = [u.ERROR, u.TRACE].includes(t) ? function(e, r) {
                                        try {
                                            return e + "\n" + r.split("\n").slice(1).join("\n")
                                        } catch (t) {
                                            return e + "\n" + r
                                        }
                                    }(a, o) : a,
                                    l = c(t);
                                e({
                                    message: f,
                                    severity: l
                                })
                            }
                        })
                    }(r, t);
                return function() {
                    n(), o()
                }
            },
            g = function(e) {
                if ("Site" !== e.window.viewMode || "undefined" != typeof window) {
                    if ("undefined" != typeof window && void 0 !== window._virtualConsole) {
                        var r = window.location.href;
                        return r.substring(0, r.length - 1)
                    }
                    return ""
                }
                return e.location.baseUrl
            },
            h = function(e) {
                var r = e.substring(e.lastIndexOf(".") + 1);
                return JSON.parse(atob(r))
            },
            y = function() {
                var e = o(regeneratorRuntime.mark(function e(r) {
                    var t, n, a, u, s, c, d, y, b, m, w = r.appLogger,
                        x = r.fedopsLogger,
                        E = r.wixSdk,
                        O = r.instance,
                        S = r.onLog,
                        R = r.ignoredConsoleMessages;
                    return regeneratorRuntime.wrap(function(e) {
                        for (;;) switch (e.prev = e.next) {
                            case 0:
                                if (e.prev = 0, !("backend" === i(E, ["window", "rendering", "env"]))) {
                                    e.next = 4;
                                    break
                                }
                                return e.abrupt("return");
                            case 4:
                                if (t = h(O), n = t.metaSiteId) {
                                    e.next = 7;
                                    break
                                }
                                return e.abrupt("return");
                            case 7:
                                return a = p({
                                    wixSdk: E,
                                    metaSiteId: n,
                                    ignoredConsoleMessages: R
                                }), u = a.createLogEntry, s = f({
                                    appLogger: w,
                                    fedopsLogger: x,
                                    baseUrl: g(E),
                                    metaSiteId: n,
                                    instance: O
                                }), c = s.fetchConfiguration(), d = l({
                                    appLogger: w
                                }), y = d.sendLogThrottled, b = function() {
                                    var e = o(regeneratorRuntime.mark(function e(r) {
                                        var t, n = r.message,
                                            o = r.severity,
                                            i = r.sourceLocation;
                                        return regeneratorRuntime.wrap(function(e) {
                                            for (;;) switch (e.prev = e.next) {
                                                case 0:
                                                    if (!(t = u({
                                                            message: n,
                                                            severity: o,
                                                            sourceLocation: i
                                                        }))) {
                                                        e.next = 6;
                                                        break
                                                    }
                                                    return e.next = 4, c;
                                                case 4:
                                                    e.sent.hasSinks && y(t);
                                                case 6:
                                                case "end":
                                                    return e.stop()
                                            }
                                        }, e, void 0)
                                    }));
                                    return function(r) {
                                        return e.apply(this, arguments)
                                    }
                                }(), m = v({
                                    sendLog: b,
                                    onWorkerLoggerLog: S
                                }), e.next = 15, c;
                            case 15:
                                e.sent.hasSinks || m(), e.next = 22;
                                break;
                            case 19:
                                e.prev = 19, e.t0 = e.catch(0), w.error(e.t0);
                            case 22:
                            case "end":
                                return e.stop()
                        }
                    }, e, void 0, [
                        [0, 19]
                    ])
                }));
                return function(r) {
                    return e.apply(this, arguments)
                }
            }();
        e.exports = {
            init: y
        }
    }, function(e, r, t) {
        "use strict";
        var n = t(17).default,
            o = t(14).TelemetryConfigurationNetworkError,
            i = t(3);
        e.exports.create = function(e) {
            var r = e.appLogger,
                t = e.fedopsLogger,
                a = e.baseUrl,
                u = e.metaSiteId,
                s = e.instance,
                c = a + "/_api/wix-code-telemetry-registry-public/v1/sites/" + u + "/telemetry/runtime-configuration",
                f = {
                    hasSinks: !1
                };
            return {
                fetchConfiguration: function() {
                    var e = i.loadSiteMonitoringConfig();
                    return r.traceAsync(e, function(e) {
                        return function() {
                            var r = e.apply(this, arguments);
                            return new Promise(function(e, t) {
                                return function n(o, i) {
                                    try {
                                        var a = r[o](i),
                                            u = a.value
                                    } catch (e) {
                                        return void t(e)
                                    }
                                    if (!a.done) return Promise.resolve(u).then(function(e) {
                                        n("next", e)
                                    }, function(e) {
                                        n("throw", e)
                                    });
                                    e(u)
                                }("next")
                            })
                        }
                    }(regeneratorRuntime.mark(function r() {
                        var o;
                        return regeneratorRuntime.wrap(function(r) {
                            for (;;) switch (r.prev = r.next) {
                                case 0:
                                    return t.interactionStarted(e.actionName), r.next = 3, n.get(c, {
                                        headers: {
                                            Authorization: s
                                        }
                                    }).then(function(e) {
                                        return e.json()
                                    });
                                case 3:
                                    return o = r.sent, t.interactionEnded(e.actionName), r.abrupt("return", o);
                                case 6:
                                case "end":
                                    return r.stop()
                            }
                        }, r, void 0)
                    }))).catch(function(e) {
                        return r.error(new o(e, c)), f
                    })
                }
            }
        }
    }, function(e, r, t) {
        "use strict";
        var n = t(17).default,
            o = t(58),
            i = t(59),
            a = t(15).TelemetryLogSendError;
        e.exports.throttledLogSender = function(e) {
            var r = e.appLogger,
                t = e.requestLimit,
                u = void 0 === t ? 1 : t,
                s = e.requestInterval,
                c = void 0 === s ? 1e3 : s,
                f = e.logsPerBatch,
                l = void 0 === f ? 10 : f,
                p = e.batchDrainTimeout,
                d = void 0 === p ? 500 : p,
                v = i.create(d, l),
                g = o(function(e) {
                    n.post("https://frog.wix.com/wct", {
                        json: e
                    }).catch(function(t) {
                        return r.error(new a(t, e))
                    })
                }, u, c, 1e4);
            return v.onData(function(e) {
                return g(e)
            }), {
                sendLogThrottled: function(e) {
                    return v.add(e)
                }
            }
        }
    }, function(e, r, t) {
        "use strict";
        e.exports = function(e, r, t, n) {
            var o = [],
                i = 0;

            function a() {
                i--, o.length && u()
            }

            function u() {
                i++;
                var r = o.shift();
                r[2](e.apply(r[0], r[1])), setTimeout(a, t)
            }
            return n || (n = Math.pow(2, 32) - 1),
                function() {
                    var e = this,
                        t = arguments;
                    return new Promise(function(a, s) {
                        if (o.length === n) return s(new Error("Queue is full"));
                        o.push([e, t, a]), i < r && u()
                    })
                }
        }
    }, function(e, r, t) {
        "use strict";
        e.exports.create = function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : -1,
                r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : -1,
                t = {},
                n = [];

            function o(e) {
                var r = t[e] || {
                    data: []
                };
                delete t[e], n.forEach(function(t) {
                    return t(r.data, e)
                })
            }
            return {
                add: function(n, i) {
                    var a = t[i] || {
                        data: []
                    };
                    t[i] = a, clearTimeout(a.timeout), a.data.push(n), r < 0 && e < 0 || r >= 0 && a.data.length >= r ? o(i) : e >= 0 && (a.timeout = setTimeout(function() {
                        o(i)
                    }, e))
                },
                onData: function(e) {
                    n.push(e)
                }
            }
        }
    }, function(e, r, t) {
        "use strict";
        var n = t(61),
            o = t(65).safeGet,
            i = t(2).siteMonitoringSeverity;
        e.exports.create = function(e) {
            var r = e.wixSdk,
                t = e.ignoredConsoleMessages,
                a = e.metaSiteId,
                u = new n,
                s = new n;
            return {
                createLogEntry: function(e) {
                    var n = e.message,
                        c = void 0 === n ? "[UNKNOWN ERROR]" : n,
                        f = e.severity,
                        l = void 0 === f ? i.DEFAULT : f,
                        p = e.sourceLocation,
                        d = void 0 === p ? {} : p;
                    if ("Script error." !== c && !t.includes(c)) return {
                        insertId: s.new(),
                        timestamp: (new Date).toISOString(),
                        severity: l,
                        labels: {
                            siteUrl: o(function() {
                                return r.location.baseUrl
                            }, ""),
                            namespace: "Velo",
                            tenantId: a,
                            viewMode: o(function() {
                                return r.window.viewMode
                            }, ""),
                            revision: o(function() {
                                return r.site.revision.toString()
                            }, "")
                        },
                        operation: {
                            id: u.new(),
                            producer: o(function() {
                                return function(e) {
                                    if (function(e) {
                                            return "" === e.location.baseUrl
                                        }(e)) return "";
                                    var r = e.location.url.replace(e.location.baseUrl, "");
                                    return (-1 === r.indexOf("?") ? r : r.slice(0, r.indexOf("?"))) || "/"
                                }(r)
                            }, ""),
                            first: !1,
                            last: !1
                        },
                        sourceLocation: d,
                        jsonPayload: {
                            message: c
                        }
                    }
                }
            }
        }
    }, function(e, r, t) {
        "use strict";
        var n = t(62),
            o = ".PYFGCRLAOEUIDHTNSQJKXBMWVZ_pyfgcrlaoeuidhtnsqjkxbmwvz1234567890".split("").sort().join("");

        function i() {
            this.b = new Array(24), this.b.fill(0), n(null, this.b, 8)
        }
        i.prototype.new = function() {
            for (var e = 7; e >= 0; e--) {
                if (255 !== this.b[e]) {
                    this.b[e]++;
                    break
                }
                this.b[e] = 0
            }
            return function(e) {
                for (var r = "", t = e.length, n = 0, i = 0; i < t; i++) {
                    var a = e[i];
                    switch (i % 3) {
                        case 0:
                            r += o[a >> 2], n = (3 & a) << 4;
                            break;
                        case 1:
                            r += o[n | a >> 4], n = (15 & a) << 2;
                            break;
                        case 2:
                            r += o[n | a >> 6], r += o[63 & a], n = 0
                    }
                }
                return t % 3 && (r += o[n]), r
            }(this.b)
        }, e.exports = i
    }, function(e, r, t) {
        var n = t(63),
            o = t(64);
        e.exports = function(e, r, t) {
            var i = r && t || 0;
            "string" == typeof e && (r = "binary" === e ? new Array(16) : null, e = null);
            var a = (e = e || {}).random || (e.rng || n)();
            if (a[6] = 15 & a[6] | 64, a[8] = 63 & a[8] | 128, r)
                for (var u = 0; u < 16; ++u) r[i + u] = a[u];
            return r || o(a)
        }
    }, function(e, r) {
        var t = "undefined" != typeof crypto && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || "undefined" != typeof msCrypto && "function" == typeof window.msCrypto.getRandomValues && msCrypto.getRandomValues.bind(msCrypto);
        if (t) {
            var n = new Uint8Array(16);
            e.exports = function() {
                return t(n), n
            }
        } else {
            var o = new Array(16);
            e.exports = function() {
                for (var e, r = 0; r < 16; r++) 0 == (3 & r) && (e = 4294967296 * Math.random()), o[r] = e >>> ((3 & r) << 3) & 255;
                return o
            }
        }
    }, function(e, r) {
        for (var t = [], n = 0; n < 256; ++n) t[n] = (n + 256).toString(16).substr(1);
        e.exports = function(e, r) {
            var n = r || 0,
                o = t;
            return [o[e[n++]], o[e[n++]], o[e[n++]], o[e[n++]], "-", o[e[n++]], o[e[n++]], "-", o[e[n++]], o[e[n++]], "-", o[e[n++]], o[e[n++]], "-", o[e[n++]], o[e[n++]], o[e[n++]], o[e[n++]], o[e[n++]], o[e[n++]]].join("")
        }
    }, function(e, r, t) {
        "use strict";
        e.exports.safeGet = function(e, r) {
            try {
                return e()
            } catch (e) {
                return r
            }
        }
    }, function(e, r, t) {
        "use strict";
        (function(e) {
            var t, n, o, i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            };
            ! function(a, u) {
                "object" == i(r) && "object" == i(e) ? e.exports = u() : (n = [], void 0 === (o = "function" == typeof(t = u) ? t.apply(r, n) : t) || (e.exports = o))
            }("undefined" != typeof self && self, function() {
                return function(e) {
                    var r = {};

                    function t(n) {
                        if (r[n]) return r[n].exports;
                        var o = r[n] = {
                            i: n,
                            l: !1,
                            exports: {}
                        };
                        return e[n].call(o.exports, o, o.exports, t), o.l = !0, o.exports
                    }
                    return t.m = e, t.c = r, t.d = function(e, r, n) {
                        t.o(e, r) || Object.defineProperty(e, r, {
                            enumerable: !0,
                            get: n
                        })
                    }, t.r = function(e) {
                        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                            value: "Module"
                        }), Object.defineProperty(e, "__esModule", {
                            value: !0
                        })
                    }, t.t = function(e, r) {
                        if (1 & r && (e = t(e)), 8 & r) return e;
                        if (4 & r && "object" == (void 0 === e ? "undefined" : i(e)) && e && e.__esModule) return e;
                        var n = Object.create(null);
                        if (t.r(n), Object.defineProperty(n, "default", {
                                enumerable: !0,
                                value: e
                            }), 2 & r && "string" != typeof e)
                            for (var o in e) t.d(n, o, function(r) {
                                return e[r]
                            }.bind(null, o));
                        return n
                    }, t.n = function(e) {
                        var r = e && e.__esModule ? function() {
                            return e.default
                        } : function() {
                            return e
                        };
                        return t.d(r, "a", r), r
                    }, t.o = function(e, r) {
                        return Object.prototype.hasOwnProperty.call(e, r)
                    }, t.p = "", t(t.s = 0)
                }([function(e, r, t) {
                    var n = t(1).buildNamespacesMap;
                    e.exports = {
                        buildNamespacesMap: n
                    }
                }, function(e, r, t) {
                    var n = t(2).createWixFetch;
                    e.exports = {
                        buildNamespacesMap: function(e, r) {
                            var t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : function(e) {
                                return e
                            };
                            return Object.keys(e).reduce(function(r, n) {
                                var o = e[n];
                                switch (n) {
                                    case "events":
                                        break;
                                    case "user":
                                        r["wix-users"] = t(o);
                                        break;
                                    case "wixEvents":
                                        r["wix-events"] = t(o);
                                        break;
                                    default:
                                        r["wix-" + n] = t(o)
                                }
                                return r
                            }, {
                                "wix-fetch": t(n(r))
                            })
                        }
                    }
                }, function(e, r, t) {
                    var n = Object.assign || function(e) {
                        for (var r = 1; r < arguments.length; r++) {
                            var t = arguments[r];
                            for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
                        }
                        return e
                    };
                    e.exports = {
                        createWixFetch: function(e) {
                            return {
                                fetch: e,
                                getJSON: function(r) {
                                    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
                                        o = n({}, t, {
                                            method: "GET",
                                            headers: n({
                                                Accept: "application/json"
                                            }, t.headers)
                                        });
                                    return e(r, o).then(function(e) {
                                        return e.json()
                                    })
                                }
                            }
                        }
                    }
                }])
            })
        }).call(this, t(67)(e))
    }, function(e, r) {
        e.exports = function(e) {
            return e.webpackPolyfill || (e.deprecate = function() {}, e.paths = [], e.children || (e.children = []), Object.defineProperty(e, "loaded", {
                enumerable: !0,
                get: function() {
                    return e.l
                }
            }), Object.defineProperty(e, "id", {
                enumerable: !0,
                get: function() {
                    return e.i
                }
            }), e.webpackPolyfill = 1), e
        }
    }, function(e, r, t) {
        "use strict";
        var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            o = t(0).isError,
            i = t(2).wixCodeLogLevel,
            a = t(69).callbackRegistrar,
            u = {
                info: i.INFO,
                warn: i.WARN,
                error: i.ERROR,
                log: i.LOG,
                debug: i.DEBUG,
                assert: i.ASSERT,
                dir: i.DIR,
                table: i.TABLE,
                trace: i.TRACE
            },
            s = 5,
            c = 6;

        function f(e, r, t) {
            if (t > c) return e instanceof Map ? "[Map]" : e instanceof Set ? "[Set]" : "[Array]";
            if (e instanceof Map) {
                var n = ["[Map]"];
                return e.forEach(function(e, o) {
                    return n.push([l(o, r, t), l(e, r, t)])
                }), n
            }
            if (e instanceof Set) {
                var o = ["[Set]"];
                return e.forEach(function(e) {
                    return o.push(l(e, r, t))
                }), o
            }
            return Array.prototype.map.call(e, function(e) {
                return l(e, r, t)
            })
        }

        function l(e, r, t) {
            if (null === e || void 0 === e) return e;
            if (e instanceof Error || e instanceof Date || "symbol" === (void 0 === e ? "undefined" : n(e)) || "function" == typeof e) return e.toString();
            if (Array.isArray(e) || e instanceof Map || e instanceof Set) {
                if (r.includes(e)) return "[Circular]";
                r.push(e);
                var o = f(e, r, t + 1);
                return r.pop(), o
            }
            if ("function" == typeof e.then) return "Promise<>";
            if ("object" === (void 0 === e ? "undefined" : n(e))) {
                if (t > s) return "[Object]";
                if (e.type && "string" == typeof e.type && 0 === e.type.indexOf("$w.")) return e.id ? "$w('#" + e.id + "')" : "$w('" + e.type.substr(3) + "')";
                r.push(e);
                var i = Object.keys(e).reduce(function(n, o) {
                    var i = e[o];
                    return r.includes(i) ? n[o] = "[Circular]" : n[o] = l(i, r, t + 1), n
                }, {});
                return r.pop(), i
            }
            return e
        }

        function p(e, r, t, n) {
            return function() {
                var i = o(arguments[0]) ? arguments[0].stack : (new Error).stack,
                    a = f(arguments, [], 0);
                n({
                    logLevel: r,
                    args: a,
                    stack: i
                }), t.apply(e, arguments)
            }
        }
        e.exports = {
            wrapConsole: function(e) {
                var r = a(),
                    t = r.register,
                    n = r.call,
                    o = {};
                if (e) {
                    var s = e.log || function() {};
                    for (var c in u)
                        if (u.hasOwnProperty(c) && e.hasOwnProperty(c)) {
                            var f = p(e, u[c], e[c], n);
                            o[c] = f, e[c] = f
                        }
                    var l = p(e, i.VERBOSE, s, n);
                    o.verbose = l, e.verbose = l
                }
                return {
                    onLog: t,
                    consoleProxy: o
                }
            },
            handlePromiseRejections: function() {
                return function(e) {
                    self.addEventListener("unhandledrejection", function(r) {
                        var t = r.reason,
                            o = "object" === (void 0 === t ? "undefined" : n(t)) ? t : {
                                message: t
                            };
                        e({
                            args: [function(e) {
                                return e.message || e.name
                            }(o)],
                            logLevel: "ERROR",
                            stack: o.stack
                        })
                    })
                }
            }
        }
    }, function(e, r, t) {
        "use strict";
        e.exports.callbackRegistrar = function() {
            var e = [];
            return {
                register: function(r) {
                    return e.push(r),
                        function() {
                            var t = e.indexOf(r);
                            t >= 0 && e.splice(t, 1)
                        }
                },
                call: function() {
                    for (var r = arguments.length, t = Array(r), n = 0; n < r; n++) t[n] = arguments[n];
                    e.forEach(function(e) {
                        return e.apply(void 0, t)
                    })
                }
            }
        }
    }, function(e, r, t) {
        "use strict";
        e.exports.isWebWorker = function() {
            return "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope
        }
    }, function(e, r, t) {
        "use strict";
        var n = t(13).LoadUserCodeError,
            o = function(e) {
                return new Promise(function(r, t) {
                    var o = document.createElement("script");
                    o.async = !1, o.src = e, o.onload = function() {
                        return r()
                    }, o.onerror = function(r) {
                        return t(new n(r, e))
                    }, document.body.appendChild(o)
                })
            },
            i = function() {
                var e = function(e) {
                    return function() {
                        var r = e.apply(this, arguments);
                        return new Promise(function(e, t) {
                            return function n(o, i) {
                                try {
                                    var a = r[o](i),
                                        u = a.value
                                } catch (e) {
                                    return void t(e)
                                }
                                if (!a.done) return Promise.resolve(u).then(function(e) {
                                    n("next", e)
                                }, function(e) {
                                    n("throw", e)
                                });
                                e(u)
                            }("next")
                        })
                    }
                }(regeneratorRuntime.mark(function e(r) {
                    var t, n;
                    return regeneratorRuntime.wrap(function(e) {
                        for (;;) switch (e.prev = e.next) {
                            case 0:
                                return t = null, n = self.define, self.define = function(e, r) {
                                    t = r
                                }, self.define.amd = !0, e.prev = 4, e.next = 7, o(r);
                            case 7:
                                return e.abrupt("return", t);
                            case 8:
                                return e.prev = 8, n ? self.define = n : delete self.define, e.finish(8);
                            case 11:
                            case "end":
                                return e.stop()
                        }
                    }, e, void 0, [
                        [4, , 8, 11]
                    ])
                }));
                return function(r) {
                    return e.apply(this, arguments)
                }
            }();
        e.exports.importSync = function(e) {
            var r = null,
                t = self.define;
            self.define = function(e, t) {
                r = t
            }, self.define.amd = !0;
            try {
                return self.importScripts(e), r
            } catch (r) {
                throw new n(r, e)
            } finally {
                t ? self.define = t : delete self.define
            }
        }, e.exports.importAsync = i
    }, function(e, r, t) {
        "use strict";
        var n = t(0).assign;
        e.exports = {
            setExtraHeaders: function(e, r) {
                try {
                    self.elementorySupport.options = self.elementorySupport.options || {}, self.elementorySupport.options.headers = n({}, self.elementorySupport.options.headers, {
                        "x-wix-site-revision": e.site.revision
                    })
                } catch (e) {
                    r.error(e)
                }
            }
        }
    }, function(e, r, t) {
        "use strict";
        e.exports = {
            createFedopsLogger: function(e) {
                return e.getLoggerForWidget({
                    appId: "675bbcef-18d8-41f5-800e-131ec9e08762",
                    appName: "675bbcef-18d8-41f5-800e-131ec9e08762"
                })
            }
        }
    }, function(e, r, t) {
        "use strict";
        var n = function() {
                return function(e, r) {
                    if (Array.isArray(e)) return e;
                    if (Symbol.iterator in Object(e)) return function(e, r) {
                        var t = [],
                            n = !0,
                            o = !1,
                            i = void 0;
                        try {
                            for (var a, u = e[Symbol.iterator](); !(n = (a = u.next()).done) && (t.push(a.value), !r || t.length !== r); n = !0);
                        } catch (e) {
                            o = !0, i = e
                        } finally {
                            try {
                                !n && u.return && u.return()
                            } finally {
                                if (o) throw i
                            }
                        }
                        return t
                    }(e, r);
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }
            }(),
            o = t(0).isFunction,
            i = t(8);
        e.exports = {
            active$wBiFactoryCreator: function(e) {
                var r = e.appLogger,
                    t = e.platformBi,
                    a = void 0 === t ? {} : t,
                    u = a.isPopup,
                    s = a.isServerSide,
                    c = a.networkPageLoadStart,
                    f = a.pageId,
                    l = a.pageNumber,
                    p = a.pageUrl,
                    d = a.viewMode,
                    v = a.viewerName,
                    g = !1,
                    h = new WeakMap,
                    y = function() {
                        return !s && !g && "thunderbolt" === v
                    },
                    b = function(e) {
                        return function() {
                            ! function() {
                                if (y()) {
                                    var e = c ? Date.now() - Math.round(c) : null,
                                        t = "site" === d ? i.active$wSiteViewMode({
                                            isPopup: u,
                                            isServerSide: s,
                                            pageId: f,
                                            pageNumber: l,
                                            pageUrl: p,
                                            tsn: e
                                        }) : i.active$wPreviewMode({
                                            pageNumber: l,
                                            pageUrl: p,
                                            tsn: e,
                                            pageId: f
                                        });
                                    r.bi(t), g = !0
                                }
                            }();
                            for (var t = arguments.length, n = Array(t), o = 0; o < t; o++) n[o] = arguments[o];
                            return e.apply(this, n)
                        }
                    },
                    m = function e(r) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
                        if (0 === t || !(r instanceof Object) || h.has(r)) return r;
                        h.set(r, !0);
                        var n = Object.getOwnPropertyDescriptors(r);
                        for (var i in n) {
                            var a = n[i];
                            a.configurable && ("constructor" === i || (a.set || a.get ? Object.defineProperty(r, i, {
                                configurable: !0,
                                get: a.get ? w(a.get) : void 0,
                                set: a.set ? b(a.set) : void 0
                            }) : o(a.value) ? Object.defineProperty(r, i, {
                                configurable: !0,
                                value: b(a.value)
                            }) : "[object Object]" === Object.prototype.toString.call(a.value) && Object.defineProperty(r, i, {
                                configurable: !0,
                                value: e(a.value, t - 1)
                            })))
                        }
                        return r
                    },
                    w = function(e) {
                        if (!y()) return e;
                        var r = function() {
                                for (var r = arguments.length, t = Array(r), n = 0; n < r; n++) t[n] = arguments[n];
                                return y() ? m(e.apply(this, t), 2) : e.apply(this, t)
                            },
                            t = !0,
                            o = !1,
                            i = void 0;
                        try {
                            for (var a, u = Object.entries(e)[Symbol.iterator](); !(t = (a = u.next()).done); t = !0) {
                                var s = a.value,
                                    c = n(s, 2),
                                    f = c[0],
                                    l = c[1];
                                r[f] = l
                            }
                        } catch (e) {
                            o = !0, i = e
                        } finally {
                            try {
                                !t && u.return && u.return()
                            } finally {
                                if (o) throw i
                            }
                        }
                        return r
                    };
                return {
                    wrapObjectPropertiesWithBi: function(e) {
                        return y() ? m(e, 2) : e
                    },
                    wrapFunctionReturnValueWithBi: w,
                    wrapFunctionCallWithBi: function(e) {
                        return y() ? b(e) : e
                    }
                }
            }
        }
    }, function(e, r, t) {
        "use strict";
        var n = Object.assign || function(e) {
                for (var r = 1; r < arguments.length; r++) {
                    var t = arguments[r];
                    for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
                }
                return e
            },
            o = t(76),
            i = o.generateDependenciesToken,
            a = o.EMPTY_DEPENDENCIES_TOKEN,
            u = t(87).enrichUrl;
        e.exports = {
            createUserCodeMapWithEnrichedUrls: function(e) {
                var r = e.userCodeMap,
                    t = function(e) {
                        if (!e || e === []) return a;
                        var r = e.reduce(function(e, r) {
                            return e[r.importName] = r.gridAppId, e
                        }, {});
                        return i(r)
                    }(e.codePackagesData);
                return r.map(function(e) {
                    return n({}, e, {
                        url: u(e.url, {
                            "dependencies-token": t
                        })
                    })
                })
            }
        }
    }, function(e, r, t) {
        "use strict";
        var n = this && this.__assign || function() {
                return (n = Object.assign || function(e) {
                    for (var r, t = 1, n = arguments.length; t < n; t++)
                        for (var o in r = arguments[t]) Object.prototype.hasOwnProperty.call(r, o) && (e[o] = r[o]);
                    return e
                }).apply(this, arguments)
            },
            o = this && this.__importDefault || function(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            };
        Object.defineProperty(r, "__esModule", {
            value: !0
        }), r.EMPTY_DEPENDENCIES_TOKEN = r.generateDependenciesToken = void 0;
        var i = o(t(77)),
            a = t(86),
            u = function(e) {
                if (!i.default(e)) throw new Error("dependencies must be an object");
                var r = Object.keys(e).sort().reduce(function(r, t) {
                    var o;
                    return n(n({}, r), ((o = {})[t] = e[t], o))
                }, {});
                return a.hashString(JSON.stringify(r))
            };
        r.generateDependenciesToken = u;
        var s = u({});
        r.EMPTY_DEPENDENCIES_TOKEN = s
    }, function(e, r, t) {
        var n = t(78),
            o = t(83),
            i = t(85),
            a = "[object Object]",
            u = Function.prototype,
            s = Object.prototype,
            c = u.toString,
            f = s.hasOwnProperty,
            l = c.call(Object);
        e.exports = function(e) {
            if (!i(e) || n(e) != a) return !1;
            var r = o(e);
            if (null === r) return !0;
            var t = f.call(r, "constructor") && r.constructor;
            return "function" == typeof t && t instanceof t && c.call(t) == l
        }
    }, function(e, r, t) {
        var n = t(18),
            o = t(81),
            i = t(82),
            a = "[object Null]",
            u = "[object Undefined]",
            s = n ? n.toStringTag : void 0;
        e.exports = function(e) {
            return null == e ? void 0 === e ? u : a : s && s in Object(e) ? o(e) : i(e)
        }
    }, function(e, r, t) {
        var n = t(80),
            o = "object" == typeof self && self && self.Object === Object && self,
            i = n || o || Function("return this")();
        e.exports = i
    }, function(e, r, t) {
        (function(r) {
            var t = "object" == typeof r && r && r.Object === Object && r;
            e.exports = t
        }).call(this, t(5))
    }, function(e, r, t) {
        var n = t(18),
            o = Object.prototype,
            i = o.hasOwnProperty,
            a = o.toString,
            u = n ? n.toStringTag : void 0;
        e.exports = function(e) {
            var r = i.call(e, u),
                t = e[u];
            try {
                e[u] = void 0;
                var n = !0
            } catch (e) {}
            var o = a.call(e);
            return n && (r ? e[u] = t : delete e[u]), o
        }
    }, function(e, r) {
        var t = Object.prototype.toString;
        e.exports = function(e) {
            return t.call(e)
        }
    }, function(e, r, t) {
        var n = t(84)(Object.getPrototypeOf, Object);
        e.exports = n
    }, function(e, r) {
        e.exports = function(e, r) {
            return function(t) {
                return e(r(t))
            }
        }
    }, function(e, r) {
        e.exports = function(e) {
            return null != e && "object" == typeof e
        }
    }, function(e, r, t) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }), r.hashString = void 0;
        r.hashString = function(e) {
            return Array.from(e).reduce(function(r, t, n) {
                return r = (r << 5) - r + e.charCodeAt(n), r &= r
            }, 0).toString()
        }
    }, function(e, r, t) {
        "use strict";
        e.exports = {
            enrichUrl: function(e, r) {
                var t = Object.keys(r).reduce(function(e, t) {
                    return [].concat(function(e) {
                        if (Array.isArray(e)) {
                            for (var r = 0, t = Array(e.length); r < e.length; r++) t[r] = e[r];
                            return t
                        }
                        return Array.from(e)
                    }(e), [t + "=" + r[t]])
                }, []).join("&");
                return e + (e.includes("?") ? "&" : "?") + t
            }
        }
    }, function(e, r, t) {
        "use strict";
        var n = t(10).logger;
        e.exports = {
            logger: n
        }
    }])
});
//# sourceMappingURL=app.js.map