! function(e, t) {
    if ("object" == typeof exports && "object" == typeof module) module.exports = t(require("_"));
    else if ("function" == typeof define && define.amd) define(["_"], t);
    else {
        var r = "object" == typeof exports ? t(require("_")) : t(e._);
        for (var n in r)("object" == typeof exports ? exports : e)[n] = r[n]
    }
}("undefined" != typeof self ? self : this, function(e) {
    return function(e) {
        var t = {};

        function r(n) {
            if (t[n]) return t[n].exports;
            var o = t[n] = {
                i: n,
                l: !1,
                exports: {}
            };
            return e[n].call(o.exports, o, o.exports, r), o.l = !0, o.exports
        }
        return r.m = e, r.c = t, r.d = function(e, t, n) {
            r.o(e, t) || Object.defineProperty(e, t, {
                enumerable: !0,
                get: n
            })
        }, r.r = function(e) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                value: "Module"
            }), Object.defineProperty(e, "__esModule", {
                value: !0
            })
        }, r.t = function(e, t) {
            if (1 & t && (e = r(e)), 8 & t) return e;
            if (4 & t && "object" == typeof e && e && e.__esModule) return e;
            var n = Object.create(null);
            if (r.r(n), Object.defineProperty(n, "default", {
                    enumerable: !0,
                    value: e
                }), 2 & t && "string" != typeof e)
                for (var o in e) r.d(n, o, function(t) {
                    return e[t]
                }.bind(null, o));
            return n
        }, r.n = function(e) {
            var t = e && e.__esModule ? function() {
                return e.default
            } : function() {
                return e
            };
            return r.d(t, "a", t), t
        }, r.o = function(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }, r.p = "", r(r.s = 62)
    }([function(t, r) {
        t.exports = e
    }, function(e, t, r) {
        var n = r(68),
            o = r(69),
            i = r(70);
        e.exports = {
            union: n,
            Result: o,
            Maybe: i
        }
    }, function(e, t, r) {
        "use strict";
        var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                void 0 === n && (n = r), Object.defineProperty(e, n, {
                    enumerable: !0,
                    get: function() {
                        return t[r]
                    }
                })
            } : function(e, t, r, n) {
                void 0 === n && (n = r), e[n] = t[r]
            }),
            o = this && this.__exportStar || function(e, t) {
                for (var r in e) "default" === r || t.hasOwnProperty(r) || n(t, e, r)
            };
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), o(r(84), t), o(r(85), t), o(r(86), t), o(r(87), t)
    }, function(e, t, r) {
        "use strict";
        r.d(t, "a", function() {
            return o
        });
        var n = r(1),
            o = Object(n.union)("TraceType", {
                Breadcrumb: function(e) {
                    return {
                        category: e.category,
                        message: e.message,
                        level: e.level,
                        data: e.data
                    }
                },
                Action: function(e) {
                    return {
                        actionName: e.actionName,
                        options: e.options
                    }
                }
            })
    }, function(e, t, r) {
        "use strict";
        var n = r(13),
            o = r(42),
            i = r(0),
            a = r(43),
            u = r.n(a),
            c = {
                USER_SCOPE: "userCodeZone",
                APPLICATION_SCOPE: "applicationCodeZone",
                WIX_DATA_SCOPE: "wixDataCodeZone"
            },
            s = ["WD_SITE_IN_TEMPLATE_MODE", "WD_PERMISSION_DENIED"],
            l = Symbol("error was handled"),
            f = Symbol("error-boundary-scope"),
            d = function(e) {
                return e[l]
            },
            p = function(e, t) {
                e(t), t[l] = !0
            },
            m = function(e) {
                return function(t, r) {
                    throw Object(i.isError)(t) && !d(t) && (! function(e, t) {
                        return e[f] === c.USER_SCOPE || t === c.USER_SCOPE || t === c.WIX_DATA_SCOPE && s.includes(e.code)
                    }(t, r) ? ! function(e, t) {
                        return "WD_UNKNOWN_ERROR" === e.code || t === c.WIX_DATA_SCOPE
                    }(t, r) ? r === c.APPLICATION_SCOPE && p(e[c.APPLICATION_SCOPE], t) : p(e[c.WIX_DATA_SCOPE], t) : p(e[c.USER_SCOPE], t)), t
                }
            },
            h = function(e) {
                return u()({
                    scopes: Object.values(c),
                    errorHandler: m(e)
                })
            },
            v = function(e, t) {
                return e[f] = t
            },
            y = r(1),
            g = r(6),
            b = r(19),
            w = r.n(b),
            O = r(44),
            I = function(e) {
                var t = function(e) {
                    return Object(i.has)(e, "state.records") ? Object(i.omit)(e, "state.records") : e
                };
                e.setDataCallback(function(e) {
                    var r = (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : i.identity)(e);
                    return r.extra = function(e) {
                        return Object(i.mapValues)(e, t)
                    }(r.extra), r
                })
            },
            E = function(e) {
                var t = e.Raven,
                    r = e.globalScope,
                    n = e.dsn,
                    o = e.params,
                    i = e.appName,
                    a = e.user;
                Object(O.configureForViewerWorker)({
                    Raven: t,
                    globalScope: r,
                    dsn: n,
                    params: o,
                    appName: i
                }), I(t), t.setUserContext(a)
            };

        function R(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }
        var T = w.a.DBSMViewer,
            j = w.a.UserErrors,
            S = w.a.WixData,
            P = c.USER_SCOPE,
            C = c.WIX_DATA_SCOPE,
            D = c.APPLICATION_SCOPE,
            x = r(20),
            A = r(27),
            _ = r(26),
            k = r.n(_),
            N = r(8);

        function M(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function F(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? M(Object(r), !0).forEach(function(t) {
                    L(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : M(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function L(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }
        var U = {
                src: x.BI_SOURCE,
                ver: k()(Object(n.getAppUrl)("dbsm-viewer-app")),
                app_name: "dbsm-viewer-app",
                app_id: A.DATA_BINDING
            },
            W = function(e, t, r) {
                return r().updateDefaults(F(F({}, U), t)).logger({
                    endpoint: function(e) {
                        return Object(N.a)(e) ? x.BI_ENDPOINT : x.BI_VIEWER_ENDPOINT
                    }(e)
                })
            };

        function B(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function V(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }
        var G = function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                t = arguments.length > 1 ? arguments[1] : void 0,
                r = Object(N.b)(t) ? {
                    vsi: e.viewerSessionId
                } : {};
            return function(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var r = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? B(Object(r), !0).forEach(function(t) {
                        V(e, t, r[t])
                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : B(Object(r)).forEach(function(t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                    })
                }
                return e
            }({
                pageId: e.pageId
            }, r)
        };
        var q = Object(y.union)("Environment", {
                NotInitialized: function() {},
                SSR: function() {},
                Client: function(e) {
                    var t = e.viewMode,
                        r = e.platformBiParams,
                        n = e.biLoggerFactory;
                    return {
                        biLogger: W(t, G(r, t), n)
                    }
                }
            }),
            H = function() {
                var e = q.NotInitialized();
                return function() {
                    return {
                        init: function(t) {
                            var r = t.inSsr,
                                n = t.viewMode,
                                o = t.platformBiParams,
                                i = t.biLoggerFactory;
                            e = r ? q.SSR() : q.Client({
                                viewMode: n,
                                platformBiParams: o,
                                biLoggerFactory: i
                            })
                        },
                        log: function(t) {
                            t.matchWith(function(e, t, r) {
                                return t in e ? Object.defineProperty(e, t, {
                                    value: r,
                                    enumerable: !0,
                                    configurable: !0,
                                    writable: !0
                                }) : e[t] = r, e
                            }({
                                BI: function(t) {
                                    var r = t.biEvent;
                                    e.matchWith({
                                        Client: function(e) {
                                            return e.biLogger.log(r)
                                        },
                                        SSR: i.noop,
                                        NotInitialized: function() {
                                            throw new Error("You cannot report to BI before setting the logger environment.\n                  Make sure you call logger.init before reporting.")
                                        }
                                    })
                                }
                            }, g.matchAny, function() {}))
                        }
                    }
                }
            };

        function $(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }
        var Y = function(e, t) {
            return function(r) {
                r.matchWith($({
                    Trace: function(n) {
                        n.payload.matchWith($({
                            Action: function(n) {
                                n.options.reportToHandlers.includes(e) && t(r)
                            }
                        }, y.union.any, function() {
                            return t(r)
                        }))
                    }
                }, g.matchAny, function() {
                    return t(r)
                }))
            }
        };

        function z(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }
        var X = Object(y.union)("Environment", {
            NotInitialized: function() {},
            Initialized: function(e) {
                return {
                    reportTrace: e.reportTrace
                }
            }
        });

        function Q(e, t) {
            y.Result.try(function() {
                return e(t)
            })
        }
        var Z = r(3),
            J = function(e) {
                var t = function(e) {
                    return {
                        startHook: function(t) {
                            var r = t.name;
                            e.trace(Z.a.Breadcrumb({
                                category: "interaction start",
                                message: "interaction ".concat(r, " started")
                            }))
                        },
                        endHook: function(t) {
                            var r = t.name,
                                n = t.duration;
                            e.trace(Z.a.Breadcrumb({
                                category: "interaction end",
                                message: "interaction ".concat(r, " ended after ").concat(n, " ms")
                            }))
                        }
                    }
                }(e);
                return {
                    appId: "databinding",
                    appName: "databinding",
                    startHook: t.startHook,
                    endHook: t.endHook
                }
            };

        function K(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }
        var ee = Object(y.union)("Environment", {
                NotInitialized: function() {},
                Initialized: function(e) {
                    var t = e.appLogger,
                        r = e.fedOpsLoggerFactory,
                        n = J(t);
                    return {
                        logger: r.getLoggerForWidget(n)
                    }
                }
            }),
            te = function() {
                var e = ee.NotInitialized(),
                    t = function() {
                        return e.matchWith({
                            Initialized: function(e) {
                                return e.logger
                            },
                            NotInitialized: function() {
                                throw new Error("You cannot report to fedops before setting the logger environment.\n            Make sure you call logger.init before reporting.")
                            }
                        })
                    };
                return function() {
                    return {
                        init: function(t) {
                            var r = t.appLogger,
                                n = t.fedOpsLoggerFactory;
                            e = ee.Initialized({
                                appLogger: r,
                                fedOpsLoggerFactory: n
                            })
                        },
                        log: Y("FEDOPS", function(e) {
                            e.matchWith(K({
                                Trace: function(e) {
                                    var r = e.payload,
                                        n = e.position;
                                    r.matchWith(K({
                                        Action: function(e) {
                                            var r = e.actionName;
                                            n.matchWith(K({
                                                Start: function() {
                                                    ! function(e) {
                                                        t().interactionStarted(e)
                                                    }(r)
                                                },
                                                End: function(e) {
                                                    e.result,
                                                        function(e) {
                                                            t().interactionEnded(e)
                                                        }(r)
                                                }
                                            }, g.matchAny, i.noop))
                                        }
                                    }, y.union.any, i.noop))
                                }
                            }, g.matchAny, i.noop))
                        })
                    }
                }
            };

        function re(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function ne(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? re(Object(r), !0).forEach(function(t) {
                    oe(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : re(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function oe(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }
        var ie = c.USER_SCOPE,
            ae = c.WIX_DATA_SCOPE,
            ue = c.APPLICATION_SCOPE,
            ce = function(e) {
                var t, r = e.global,
                    n = e.appName,
                    a = e.consoleHandler,
                    u = function(e) {
                        var t = e.global,
                            r = e.appName;
                        return function() {
                            var e = function(e) {
                                    var t = e.level,
                                        r = e.sessionData,
                                        n = e.options,
                                        o = void 0 === n ? {} : n;
                                    return Object(i.merge)({
                                        level: t
                                    }, {
                                        extra: r
                                    }, o)
                                },
                                n = {},
                                o = function(e) {
                                    var t = n[e];
                                    if (!t) throw new Error("Raven was not initialized");
                                    return t
                                };
                            return {
                                init: function(e) {
                                    var o, i = e.user,
                                        a = e.createRavenClient,
                                        u = e.platformBiParams,
                                        c = a(T.dsn),
                                        s = a(j.dsn),
                                        l = a(S.dsn),
                                        f = {
                                            tags: {
                                                msid: u.metaSiteId
                                            }
                                        };
                                    E({
                                        Raven: c,
                                        globalScope: t,
                                        dsn: T.dsn,
                                        appName: r,
                                        user: i,
                                        params: f
                                    }), E({
                                        Raven: s,
                                        globalScope: t,
                                        dsn: j.dsn,
                                        appName: r,
                                        user: i,
                                        params: f
                                    }), E({
                                        Raven: l,
                                        globalScope: t,
                                        dsn: S.dsn,
                                        appName: r,
                                        user: i,
                                        params: f
                                    }), R(o = {}, D, c), R(o, P, s), R(o, C, l), n = o
                                },
                                log: function(t) {
                                    t.matchWith(R({
                                        Trace: function(e) {
                                            return e.payload.matchWith(R({
                                                Breadcrumb: function(e) {
                                                    return o(D).captureBreadcrumb(e)
                                                }
                                            }, y.union.any, i.noop))
                                        },
                                        Info: function(t) {
                                            var r = t.message,
                                                n = t.options,
                                                i = t.sessionData;
                                            o(D).captureMessage(r, e({
                                                level: "info",
                                                sessionData: i,
                                                options: n
                                            }))
                                        },
                                        Warn: function(t) {
                                            var r = t.message,
                                                n = t.options,
                                                i = t.sessionData;
                                            o(D).captureMessage(r, e({
                                                level: "warning",
                                                sessionData: i,
                                                options: n
                                            }))
                                        },
                                        Error: function(t) {
                                            var r = t.error,
                                                n = t.options,
                                                i = t.sessionData;
                                            return o(n.zone).captureException(r, e({
                                                sessionData: i,
                                                options: n
                                            }))
                                        }
                                    }, g.matchAny, i.noop))
                                }
                            }
                        }
                    }({
                        global: r,
                        appName: n
                    }),
                    c = H(),
                    s = function() {
                        var e = X.NotInitialized();
                        return function() {
                            return {
                                init: function(t) {
                                    var r = t.reportTrace;
                                    e = X.Initialized({
                                        reportTrace: r
                                    })
                                },
                                log: Y("SYSTEM_TRACING", function(t) {
                                    e.matchWith({
                                        Initialized: function(e) {
                                            var r = e.reportTrace;
                                            t.matchWith(z({
                                                Trace: function(e) {
                                                    var t = e.payload,
                                                        n = e.position;
                                                    t.matchWith(z({
                                                        Action: function(e) {
                                                            var t = e.actionName;
                                                            n.matchWith(z({
                                                                Start: function() {
                                                                    Q(r, {
                                                                        actionName: t,
                                                                        tracePosition: "before"
                                                                    })
                                                                },
                                                                End: function(e) {
                                                                    var n = e.durationMs;
                                                                    Q(r, {
                                                                        actionName: t,
                                                                        tracePosition: "after",
                                                                        actionDurationMs: n
                                                                    })
                                                                }
                                                            }, g.matchAny, i.noop))
                                                        }
                                                    }, y.union.any, i.noop))
                                                }
                                            }, g.matchAny, i.noop))
                                        },
                                        NotInitialized: function() {
                                            throw new Error("You cannot report to system tracer before setting the logger environment.\n              Make sure you call logger.init before reporting.")
                                        }
                                    })
                                })
                            }
                        }
                    }(),
                    l = te(),
                    f = Object(g.create)({
                        handlerCreators: [a, u, c, s, l]
                    }),
                    p = function(e) {
                        return function(t, r) {
                            var n = ne(ne({}, r), {}, {
                                zone: e
                            });
                            f.error(t, n)
                        }
                    },
                    m = h((oe(t = {}, ie, p(ie)), oe(t, ae, p(ae)), oe(t, ue, p(ue)), t));
                return Object(o.registerToUnexpectedErrors)({
                    onError: function(e) {
                        d(e) || p(ue)(e, {
                            level: "info",
                            tags: {
                                unHandledRejection: !0
                            }
                        })
                    },
                    appName: n,
                    global: r
                }), ne(ne({}, f), {}, {
                    error: p(ue),
                    applicationCodeZone: m.applicationCodeZone,
                    userCodeZone: m.userCodeZone,
                    wixDataCodeZone: m.wixDataCodeZone
                })
            },
            se = "SYSTEM_TRACING",
            le = "FEDOPS",
            fe = function(e) {
                var t = e.global,
                    r = e.appName,
                    o = Object(g.consoleHandlerCreator)({
                        shouldLog: n.isLocalhost
                    }).consoleHandler;
                return ce({
                    global: t,
                    appName: r,
                    consoleHandler: o
                })
            },
            de = function(e, t) {
                return null == e ? t : Object(i.set)(t, ["data", "result"], e)
            },
            pe = function(e, t, r) {
                return {
                    withBreadcrumbs: function(n, o) {
                        return function() {
                            for (var i = arguments.length, a = new Array(i), u = 0; u < i; u++) a[u] = arguments[u];
                            var c = t(n, a);
                            return y.Result.try(function() {
                                return o.apply(void 0, a)
                            }).fold(function(t) {
                                throw c.data = c.data || {}, c.data.exception = t, c.level = "error", e.trace(Z.a.Breadcrumb(c)), t
                            }, function(t) {
                                var n = de(r(t), c);
                                return e.trace(Z.a.Breadcrumb(n)), t
                            })
                        }
                    },
                    withBreadcrumbsAsync: function(n, o) {
                        return function() {
                            for (var i = arguments.length, a = new Array(i), u = 0; u < i; u++) a[u] = arguments[u];
                            var c = t(n, a);
                            return o.apply(void 0, a).then(function(t) {
                                var n = de(r(t), c);
                                return e.trace(Z.a.Breadcrumb(n)), t
                            }, function(t) {
                                throw c.data = c.data || {}, c.data.exception = t, c.level = "error", e.trace(Z.a.Breadcrumb(c)), t
                            })
                        }
                    }
                }
            },
            me = r(45),
            he = r.n(me);

        function ve(e) {
            "@babel/helpers - typeof";
            return (ve = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            })(e)
        }

        function ye(e, t) {
            return (ye = Object.setPrototypeOf || function(e, t) {
                return e.__proto__ = t, e
            })(e, t)
        }

        function ge(e) {
            var t = function() {
                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0
                } catch (e) {
                    return !1
                }
            }();
            return function() {
                var r, n = we(e);
                if (t) {
                    var o = we(this).constructor;
                    r = Reflect.construct(n, arguments, o)
                } else r = n.apply(this, arguments);
                return function(e, t) {
                    if (t && ("object" === ve(t) || "function" == typeof t)) return t;
                    if (void 0 !== t) throw new TypeError("Derived constructors may only return object or undefined");
                    return be(e)
                }(this, r)
            }
        }

        function be(e) {
            if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return e
        }

        function we(e) {
            return (we = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                return e.__proto__ || Object.getPrototypeOf(e)
            })(e)
        }
        var Oe = function(e) {
                ! function(e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                    e.prototype = Object.create(t && t.prototype, {
                        constructor: {
                            value: e,
                            writable: !0,
                            configurable: !0
                        }
                    }), t && ye(e, t)
                }(r, he.a);
                var t = ge(r);

                function r(e) {
                    var n;
                    return function(e, t) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    }(this, r), n = t.call(this, e), v(be(n), c.USER_SCOPE), n
                }
                return r
            }(),
            Ie = le,
            Ee = se,
            Re = "info",
            Te = {
                initAppForPage: function() {
                    return Z.a.Action({
                        actionName: "databinding/initAppForPage",
                        options: {
                            level: Re,
                            reportToHandlers: [Ie, Ee]
                        }
                    })
                },
                createControllers: function() {
                    return Z.a.Action({
                        actionName: "databinding/createControllers",
                        options: {
                            level: Re,
                            reportToHandlers: [Ie, Ee]
                        }
                    })
                },
                findRecords: function(e) {
                    var t = e.collectionName,
                        r = e.filter,
                        n = e.sort,
                        o = e.offset,
                        i = e.length;
                    return Z.a.Action({
                        actionName: "dataset/findRecords",
                        options: {
                            level: Re,
                            reportToHandlers: [Ee],
                            data: {
                                message: {
                                    collectionName: t,
                                    filter: r,
                                    sort: n,
                                    offset: o,
                                    length: i
                                }
                            }
                        }
                    })
                },
                loadSchemas: function() {
                    return Z.a.Action({
                        actionName: "databinding/loadSchemas",
                        options: {
                            level: Re,
                            reportToHandlers: [Ie, Ee]
                        }
                    })
                },
                pageReady: function() {
                    return Z.a.Action({
                        actionName: "dataset/pageReady",
                        options: {
                            level: Re,
                            reportToHandlers: [Ie, Ee]
                        }
                    })
                },
                pageReadyGetData: function() {
                    return Z.a.Action({
                        actionName: "dataset/pageReady/getData",
                        options: {
                            level: Re,
                            reportToHandlers: [Ie, Ee]
                        }
                    })
                },
                repeaterItemReady: function(e) {
                    return Z.a.Action({
                        actionName: "connectedRepeaterAdapter itemReady ".concat(e),
                        options: {
                            level: Re,
                            reportToHandlers: [Ee]
                        }
                    })
                },
                repeaterSetData: function() {
                    return Z.a.Action({
                        actionName: "connectedRepeaterAdapter setting repeater.data",
                        options: {
                            level: Re,
                            reportToHandlers: [Ee]
                        }
                    })
                },
                repeaterRecordSetLoaded: function() {
                    return Z.a.Action({
                        actionName: "connectedRepeaterAdapter recordSetLoaded",
                        options: {
                            level: Re,
                            reportToHandlers: [Ee]
                        }
                    })
                },
                repeaterCurrentViewChanged: function() {
                    return Z.a.Action({
                        actionName: "connectedRepeaterAdapter currentViewChanged",
                        options: {
                            level: Re,
                            reportToHandlers: [Ee]
                        }
                    })
                },
                fetchPrimaryInitialData: function() {
                    return Z.a.Action({
                        actionName: "dataset/fetchPrimaryInitialData",
                        options: {
                            level: Re,
                            reportToHandlers: [Ie, Ee]
                        }
                    })
                }
            },
            je = function(e, t) {
                return function(r) {
                    t("An error occurred in one of ".concat(e, " callbacks"), r)
                }
            };
        r.d(t, "c", function() {
            return fe
        }), r.d(t, "b", function() {
            return pe
        }), r.d(t, "a", function() {
            return Oe
        }), r.d(t, "e", function() {
            return Te
        }), r.d(t, "d", function() {
            return je
        })
    }, function(e, t, r) {
        "use strict";
        var n = r(0).mapValues,
            o = r(0).mapKeys,
            i = r(1).Maybe,
            a = {
                AddressInput: {
                    viewerType: ["wixui.AddressInput"],
                    sdkType: "$w.AddressInput"
                },
                Text: {
                    viewerType: ["wysiwyg.viewer.components.WRichText"],
                    sdkType: "$w.Text"
                },
                Image: {
                    viewerType: ["wysiwyg.viewer.components.WPhoto", "wixui.ImageX"],
                    sdkType: "$w.Image"
                },
                TextInput: {
                    viewerType: ["wysiwyg.viewer.components.inputs.TextInput"],
                    sdkType: "$w.TextInput"
                },
                TimePicker: {
                    viewerType: ["wixui.TimePicker"],
                    sdkType: "$w.TimePicker"
                },
                Button: {
                    viewerType: ["wysiwyg.viewer.components.SiteButton"],
                    sdkType: "$w.Button"
                },
                IconButton: {
                    viewerType: ["wysiwyg.common.components.imagebutton.viewer.ImageButton"],
                    sdkType: "$w.IconButton"
                },
                RatingsDisplay: {
                    viewerType: ["wixui.RatingsDisplay"],
                    sdkType: "$w.RatingsDisplay"
                },
                RatingsInput: {
                    viewerType: ["wixui.RatingsInput"],
                    sdkType: "$w.RatingsInput"
                },
                VerticalMenu: {
                    viewerType: ["wysiwyg.common.components.verticalmenu.viewer.VerticalMenu"],
                    sdkType: "$w.VerticalMenu"
                },
                Checkbox: {
                    viewerType: ["wysiwyg.viewer.components.inputs.Checkbox"],
                    sdkType: "$w.Checkbox"
                },
                Gallery: {
                    viewerType: ["wysiwyg.viewer.components.MatrixGallery", "wysiwyg.viewer.components.SliderGallery", "wysiwyg.viewer.components.SlideShowGallery", "wysiwyg.viewer.components.PaginatedGridGallery", "wysiwyg.viewer.components.tpapps.TPAWidget"],
                    sdkType: "$w.Gallery"
                },
                Dropdown: {
                    viewerType: ["wysiwyg.viewer.components.inputs.ComboBoxInput", "wixui.Dropdown"],
                    sdkType: "$w.Dropdown"
                },
                TextBox: {
                    viewerType: ["wysiwyg.viewer.components.inputs.TextAreaInput"],
                    sdkType: "$w.TextBox"
                },
                RichTextBox: {
                    viewerType: ["wixui.RichTextBox"],
                    sdkType: "$w.RichTextBox"
                },
                Table: {
                    viewerType: ["wysiwyg.viewer.components.Grid"],
                    sdkType: "$w.Table"
                },
                DatePicker: {
                    viewerType: ["wysiwyg.viewer.components.inputs.DatePicker"],
                    sdkType: "$w.DatePicker"
                },
                RadioButtonGroup: {
                    viewerType: ["wysiwyg.viewer.components.inputs.RadioGroup"],
                    sdkType: "$w.RadioButtonGroup"
                },
                UploadButton: {
                    viewerType: ["wysiwyg.viewer.components.inputs.UploadButton", "wixui.FileUploaderNew", "wysiwyg.viewer.components.inputs.FileUploader"],
                    sdkType: "$w.UploadButton"
                },
                ClassicSection: {
                    viewerType: ["wysiwyg.viewer.components.ClassicSection"],
                    sdkType: "$w.Section"
                },
                Column: {
                    viewerType: ["wysiwyg.viewer.components.Column"],
                    sdkType: "$w.Column"
                },
                Video: {
                    viewerType: ["wysiwyg.viewer.components.Video"],
                    sdkType: "$w.Video"
                },
                VideoPlayer: {
                    viewerType: ["wixui.VideoPlayer"],
                    sdkType: "$w.VideoPlayer"
                },
                VideoBox: {
                    viewerType: ["wysiwyg.viewer.components.MediaPlayer"],
                    sdkType: "$w.VideoBox"
                },
                MusicPlayer: {
                    viewerType: ["wixui.MusicPlayer"],
                    sdkType: "$w.AudioPlayer"
                },
                Repeater: {
                    viewerType: ["wysiwyg.viewer.components.Repeater"],
                    sdkType: "$w.Repeater"
                },
                Pagination: {
                    viewerType: ["wixui.Pagination"],
                    sdkType: "$w.Pagination"
                },
                Page: {
                    viewerType: ["mobile.core.components.Page"],
                    sdkType: "$w.Page"
                },
                Document: {
                    viewerType: ["fake-document-type"],
                    sdkType: "$w.Document"
                },
                MediaContainer: {
                    viewerType: ["wysiwyg.viewer.components.MediaContainer"],
                    sdkType: "$w.Container"
                },
                StripColumnsContainer: {
                    viewerType: ["wysiwyg.viewer.components.StripColumnsContainer"],
                    sdkType: "$w.ColumnStrip"
                },
                ToggleSwitch: {
                    viewerType: ["wixui.ToggleSwitch"],
                    sdkType: "$w.Switch"
                },
                Slider: {
                    viewerType: ["wixui.Slider"],
                    sdkType: "$w.Slider"
                },
                StylableButton: {
                    viewerType: ["wixui.StylableButton"],
                    sdkType: "$w.StylableButton"
                },
                GoogleMap: {
                    viewerType: ["wysiwyg.viewer.components.GoogleMap"],
                    sdkType: "$w.GoogleMap"
                },
                CheckboxGroup: {
                    viewerType: ["wysiwyg.viewer.components.inputs.CheckboxGroup"],
                    sdkType: "$w.CheckboxGroup"
                },
                ProgressBar: {
                    viewerType: ["wixui.ProgressBar"],
                    sdkType: "$w.ProgressBar"
                },
                VectorImage: {
                    viewerType: ["wysiwyg.viewer.components.VectorImage", "wysiwyg.viewer.components.svgshape.SvgShape"],
                    sdkType: "$w.VectorImage"
                },
                SelectionTags: {
                    viewerType: ["wixui.SelectionTagsList"],
                    sdkType: "$w.SelectionTags"
                },
                Section: {
                    viewerType: ["responsive.components.Section"],
                    sdkType: "$w.Section"
                },
                SignatureInput: {
                    viewerType: ["wixui.SignatureInput"],
                    sdkType: "$w.SignatureInput"
                },
                RefComponent: {
                    viewerType: ["wysiwyg.viewer.components.RefComponent"],
                    sdkType: "$w.RefComponent"
                },
                RichContent: {
                    viewerType: ["wysiwyg.viewer.components.tpapps.TPAWidget"],
                    sdkType: "$w.RichContent"
                }
            };
        e.exports = n(a, function(e) {
            return e.sdkType
        }), e.exports.getSdkTypeByViewerType = function(e) {
            return i.fromNullable(Object.keys(a).filter(function(t) {
                return a[t].viewerType.indexOf(e) >= 0
            }).map(function(e) {
                return a[e].sdkType
            })[0])
        }, e.exports.getViewerTypeBySdkType = function(e) {
            return i.fromNullable(Object.keys(a).filter(function(t) {
                return a[t].sdkType === e
            }).map(function(e) {
                return a[e].viewerType[0]
            })[0])
        }, e.exports.getViewerTypes = Object.keys(a).reduce(function(e, t) {
            return e.concat(a[t].viewerType), e
        }, []), e.exports.viewerTypes = Object.keys(a).map(function(e) {
            return a[e].viewerType
        }).reduce(function(e, t) {
            return e.concat(t)
        }, []).reduce(function(e, t) {
            return e[t.split(".").reverse()[0]] = t, e
        }, {}), e.exports.sdkTypes = Object.keys(a).map(function(e) {
            return a[e].sdkType
        }), e.exports.isSdkTypeSupported = function(e) {
            return !!o(a, function(e) {
                return e.sdkType
            })[e]
        }
    }, function(e, t, r) {
        "use strict";
        var n = r(71),
            o = n.create,
            i = n.matchAny,
            a = r(72).consoleHandlerCreator;
        e.exports = {
            create: o,
            matchAny: i,
            consoleHandlerCreator: a
        }
    }, function(e, t, r) {
        "use strict";
        r.d(t, "f", function() {
            return i
        }), r.d(t, "b", function() {
            return a
        }), r.d(t, "c", function() {
            return u
        }), r.d(t, "a", function() {
            return c
        }), r.d(t, "d", function() {
            return s
        }), r.d(t, "e", function() {
            return l
        });
        var n = r(0),
            o = r(10),
            i = function(e, t) {
                if (e !== t) return Object(n.isPlainObject)(e) ? e : t
            },
            a = function(e, t) {
                return function(r) {
                    if (Object(o.isFieldFromReferencedCollection)(r)) {
                        var i = Object(o.getReferenceFieldName)(r),
                            a = Object(o.getFieldFromReferencedCollectionName)(r),
                            u = e && e.fields[i] ? e.fields[i].referencedCollection : null,
                            c = t && u ? t[u] : null;
                        return Object(n.get)(c, ["fields", a, "type"])
                    }
                    return Object(n.get)(e, ["fields", r, "type"])
                }
            },
            u = function(e) {
                return e ? Object(n.flow)(function(e) {
                    return Object(n.pickBy)(e, function(e) {
                        var t = e.referencedCollection;
                        return Boolean(t)
                    })
                }, function(e) {
                    return Object(n.map)(e, function(e) {
                        return e.referencedCollection
                    })
                }, n.uniq, function(e) {
                    return e.filter(Boolean)
                })(e.fields) : []
            },
            c = function(e, t) {
                return null != t && null != t.fields[e] ? t.fields[e].referencedCollection : null
            },
            s = function(e) {
                return null != e ? e.displayField : null
            },
            l = function(e) {
                return null != e ? e.maxPageSize : void 0
            }
    }, function(e, t, r) {
        "use strict";
        r.d(t, "d", function() {
            return n
        }), r.d(t, "c", function() {
            return o
        }), r.d(t, "b", function() {
            return i
        }), r.d(t, "a", function() {
            return a
        });
        var n = function(e) {
                return "Preview" === e
            },
            o = function(e) {
                return "Editor" === e
            },
            i = function(e) {
                return "Site" === e
            },
            a = function(e) {
                return n(e) || o(e)
            }
    }, function(e, t, r) {
        "use strict";
        var n, o = {
                CENTER: "center",
                TOP: "top",
                TOP_LEFT: "top_left",
                TOP_RIGHT: "top_right",
                BOTTOM: "bottom",
                BOTTOM_LEFT: "bottom_left",
                BOTTOM_RIGHT: "bottom_right",
                LEFT: "left",
                RIGHT: "right"
            },
            i = ((n = {})[o.CENTER] = {
                x: .5,
                y: .5
            }, n[o.TOP_LEFT] = {
                x: 0,
                y: 0
            }, n[o.TOP_RIGHT] = {
                x: 1,
                y: .5
            }, n[o.TOP] = {
                x: .5,
                y: 0
            }, n[o.BOTTOM_LEFT] = {
                x: 0,
                y: 1
            }, n[o.BOTTOM_RIGHT] = {
                x: 1,
                y: 1
            }, n[o.BOTTOM] = {
                x: .5,
                y: 1
            }, n[o.RIGHT] = {
                x: 1,
                y: .5
            }, n[o.LEFT] = {
                x: 0,
                y: .5
            }, n),
            a = {
                JPG: "jpg",
                JPEG: "jpeg",
                JPE: "jpe",
                PNG: "png",
                WEBP: "webp",
                WIX_ICO_MP: "wix_ico_mp",
                WIX_MP: "wix_mp",
                GIF: "gif",
                SVG: "svg",
                UNRECOGNIZED: "unrecognized"
            },
            u = [a.JPG, a.JPEG, a.JPE, a.PNG, a.GIF, a.WEBP];
        e.exports = {
            alignTypes: o,
            alignTypesMap: {
                center: "c",
                top: "t",
                top_left: "tl",
                top_right: "tr",
                bottom: "b",
                bottom_left: "bl",
                bottom_right: "br",
                left: "l",
                right: "r"
            },
            transformTypes: {
                FIT: "fit",
                FILL: "fill",
                FILL_FOCAL: "fill_focal",
                CROP: "crop",
                LEGACY_CROP: "legacy_crop",
                LEGACY_FILL: "legacy_fill"
            },
            fittingTypes: {
                SCALE_TO_FILL: "fill",
                SCALE_TO_FIT: "fit",
                STRETCH: "stretch",
                ORIGINAL_SIZE: "original_size",
                TILE: "tile",
                TILE_HORIZONTAL: "tile_horizontal",
                TILE_VERTICAL: "tile_vertical",
                FIT_AND_TILE: "fit_and_tile",
                LEGACY_STRIP_TILE: "legacy_strip_tile",
                LEGACY_STRIP_TILE_HORIZONTAL: "legacy_strip_tile_horizontal",
                LEGACY_STRIP_TILE_VERTICAL: "legacy_strip_tile_vertical",
                LEGACY_STRIP_SCALE_TO_FILL: "legacy_strip_fill",
                LEGACY_STRIP_SCALE_TO_FIT: "legacy_strip_fit",
                LEGACY_STRIP_FIT_AND_TILE: "legacy_strip_fit_and_tile",
                LEGACY_STRIP_ORIGINAL_SIZE: "legacy_strip_original_size",
                LEGACY_ORIGINAL_SIZE: "actual_size",
                LEGACY_FIT_WIDTH: "fitWidth",
                LEGACY_FIT_HEIGHT: "fitHeight",
                LEGACY_FULL: "full",
                LEGACY_BG_FIT_AND_TILE: "legacy_tile",
                LEGACY_BG_FIT_AND_TILE_HORIZONTAL: "legacy_tile_horizontal",
                LEGACY_BG_FIT_AND_TILE_VERTICAL: "legacy_tile_vertical",
                LEGACY_BG_NORMAL: "legacy_normal"
            },
            htmlTag: {
                BG: "bg",
                IMG: "img",
                SVG: "svg"
            },
            upscaleMethods: {
                AUTO: "auto",
                CLASSIC: "classic",
                SUPER: "super"
            },
            upscaleMethodsValues: {
                classic: 1,
                super: 2
            },
            defaultUSM: {
                radius: .66,
                amount: 1,
                threshold: .01
            },
            emptyData: {
                uri: "",
                css: {
                    img: {},
                    container: {}
                },
                attr: {
                    img: {},
                    container: {}
                }
            },
            imageQuality: {
                HIGH: "HIGH",
                MEDIUM: "MEDIUM",
                LOW: "LOW",
                TINY: "TINY"
            },
            imageFilters: {
                CONTRAST: "contrast",
                BRIGHTNESS: "brightness",
                SATURATION: "saturation",
                HUE: "hue",
                BLUR: "blur"
            },
            imageScaleDefaults: {
                HIGH: {
                    size: 196e4,
                    quality: 90,
                    maxUpscale: 1
                },
                MEDIUM: {
                    size: 36e4,
                    quality: 85,
                    maxUpscale: 1
                },
                LOW: {
                    size: 16e4,
                    quality: 80,
                    maxUpscale: 1.2
                },
                TINY: {
                    size: 0,
                    quality: 80,
                    maxUpscale: 1.4
                }
            },
            fileType: a,
            supportedExtensions: u,
            webp: {
                LOSSLESS: "lossless",
                LOSSY: "lossy",
                ALPHA: "alpha",
                ANIMATION: "animation"
            },
            noWEBP: {
                lossless: !1,
                lossy: !1,
                alpha: !1,
                animation: !1
            },
            DSKTP_MAX_BG_SITE_LEGACY_WIDTH: 1920,
            MOBILE_MAX_BG_SITE_LEGACY_WIDTH: 1e3,
            DSKTP_MAX_BG_SITE_LEGACY_HEIGHT: 1920,
            MOBILE_MAX_BG_SITE_LEGACY_HEIGHT: 1e3,
            SAFE_TRANSFORMED_AREA: 25e6,
            SUPER_UPSCALE_MODELS: [1.5, 2, 4],
            MAX_DEVICE_PIXEL_RATIO: 2,
            ALIGN_TYPE_TO_FOCAL_POINT: i,
            API_VERSION: "v1"
        }
    }, function(e, t, r) {
        "use strict";
        var n = r(0).last,
            o = r(0).head,
            i = r(0).includes,
            a = function(e) {
                return n(e.split("."))
            },
            u = function(e) {
                return o(e.split("."))
            };
        e.exports.FIELD_PATH_SEPARATOR = ".", e.exports.toFieldPath = function(e, t) {
            return t ? [t, e].join(".") : e
        }, e.exports.isFieldFromReferencedCollection = function(e) {
            return i(e, ".")
        }, e.exports.getFieldFromReferencedCollectionName = a, e.exports.getReferenceFieldName = u, e.exports.getFieldFromReferencedCollection = function(e, t, r) {
            var n = u(e),
                o = a(e),
                i = t.fields.find(function(e) {
                    return e.name === n
                }).referencedCollection;
            return r.find(function(e) {
                return e.id === i
            }).fields.find(function(e) {
                return e.name === o
            })
        }
    }, function(e, t) {
        var r = Object.prototype.toString;
        e.exports = function(e) {
            var t = typeof e;
            return "undefined" === t ? "undefined" : null === e ? "null" : !0 === e || !1 === e || e instanceof Boolean ? "boolean" : "string" === t || e instanceof String ? "string" : "number" === t || e instanceof Number ? "number" : "function" === t || e instanceof Function ? void 0 !== e.constructor.name && "Generator" === e.constructor.name.slice(0, 9) ? "generatorfunction" : "function" : void 0 !== Array.isArray && Array.isArray(e) ? "array" : e instanceof RegExp ? "regexp" : e instanceof Date ? "date" : "[object RegExp]" === (t = r.call(e)) ? "regexp" : "[object Date]" === t ? "date" : "[object Arguments]" === t ? "arguments" : "[object Error]" === t ? "error" : "[object Promise]" === t ? "promise" : function(e) {
                return e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e)
            }(e) ? "buffer" : "[object Set]" === t ? "set" : "[object WeakSet]" === t ? "weakset" : "[object Map]" === t ? "map" : "[object WeakMap]" === t ? "weakmap" : "[object Symbol]" === t ? "symbol" : "[object Map Iterator]" === t ? "mapiterator" : "[object Set Iterator]" === t ? "setiterator" : "[object Int8Array]" === t ? "int8array" : "[object Uint8Array]" === t ? "uint8array" : "[object Uint8ClampedArray]" === t ? "uint8clampedarray" : "[object Int16Array]" === t ? "int16array" : "[object Uint16Array]" === t ? "uint16array" : "[object Int32Array]" === t ? "int32array" : "[object Uint32Array]" === t ? "uint32array" : "[object Float32Array]" === t ? "float32array" : "[object Float64Array]" === t ? "float64array" : "object"
        }
    }, function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.exceptionToWebMethodPayload = t.resultToWebMethodPayload = t.convertFromCustomFormat = t.convertToCustomFormat = void 0;
        var n = r(33);
        Object.defineProperty(t, "convertToCustomFormat", {
            enumerable: !0,
            get: function() {
                return n.convertToCustomFormat
            }
        }), Object.defineProperty(t, "convertFromCustomFormat", {
            enumerable: !0,
            get: function() {
                return n.convertFromCustomFormat
            }
        });
        var o = r(83);
        Object.defineProperty(t, "resultToWebMethodPayload", {
            enumerable: !0,
            get: function() {
                return o.resultToWebMethodPayload
            }
        }), Object.defineProperty(t, "exceptionToWebMethodPayload", {
            enumerable: !0,
            get: function() {
                return o.exceptionToWebMethodPayload
            }
        })
    }, function(e, t) {
        var r = function() {
            var e = new Error;
            return e.stack ? e.stack.toString() : ""
        };
        e.exports.getAppUrl = function(e) {
            var t = r().match(new RegExp("https?://.*?".concat(e, ".*?.js")));
            return t ? t[0] : ""
        }, e.exports.isLocalhost = function() {
            return /https?:\/\/localhost/.test(r())
        }
    }, function(e, t) {
        var r;
        r = function() {
            return this
        }();
        try {
            r = r || new Function("return this")()
        } catch (e) {
            "object" == typeof window && (r = window)
        }
        e.exports = r
    }, function(e, t, r) {
        "use strict";
        var n = r(24),
            o = r(9);

        function i(e) {
            var t = [o.fileType.PNG, o.fileType.JPEG, o.fileType.JPG, o.fileType.JPE, o.fileType.WIX_ICO_MP, o.fileType.WIX_MP];
            return n.includes(t, c(e))
        }

        function a(e) {
            return n.includes(["webp"], c(e))
        }

        function u(e) {
            return /(^https?)|(^data)|(^\/\/)/.test(e)
        }

        function c(e) {
            return (/[.]([^.]+)$/.exec(e) && /[.]([^.]+)$/.exec(e)[1] || "").toLowerCase()
        }

        function s(e, t, r, n, i) {
            return i === o.transformTypes.FILL ? function(e, t, r, n) {
                return Math.max(r / e, n / t)
            }(e, t, r, n) : i === o.transformTypes.FIT ? function(e, t, r, n) {
                return Math.min(r / e, n / t)
            }(e, t, r, n) : 1
        }

        function l(e) {
            var t = null;
            return "number" != typeof e.x || isNaN(e.x) || "number" != typeof e.y || isNaN(e.y) || (t = {
                x: h(Math.max(0, Math.min(100, e.x)) / 100, 2),
                y: h(Math.max(0, Math.min(100, e.y)) / 100, 2)
            }), t
        }

        function f(e, t) {
            var r = m(e, t);
            return {
                optimizedScaleFactor: o.imageScaleDefaults[r].maxUpscale,
                upscaleMethodValue: o.upscaleMethodsValues.classic,
                forceUSM: !1
            }
        }

        function d(e, t) {
            var r = m(e, t);
            return {
                optimizedScaleFactor: o.imageScaleDefaults[r].maxUpscale,
                upscaleMethodValue: o.upscaleMethodsValues.classic,
                forceUSM: !1
            }
        }

        function p(e, t, r) {
            return {
                optimizedScaleFactor: n.last(o.SUPER_UPSCALE_MODELS),
                upscaleMethodValue: o.upscaleMethodsValues.super,
                forceUSM: !(o.SUPER_UPSCALE_MODELS.includes(r) || r > n.last(o.SUPER_UPSCALE_MODELS))
            }
        }

        function m(e, t) {
            var r = e * t;
            return r > o.imageScaleDefaults[o.imageQuality.HIGH].size ? o.imageQuality.HIGH : r > o.imageScaleDefaults[o.imageQuality.MEDIUM].size ? o.imageQuality.MEDIUM : r > o.imageScaleDefaults[o.imageQuality.LOW].size ? o.imageQuality.LOW : o.imageQuality.TINY
        }

        function h(e, t) {
            var r = Math.pow(10, t || 0);
            return (e * r / r).toFixed(parseInt(t, 10))
        }
        e.exports.isImageTransformApplicable = function(e) {
            return i(e) && !u(e)
        }, e.exports.isValidRequest = function(e, t, r) {
            return r && t && ! function(e) {
                return !e || !e.trim() || "none" === e.toLowerCase()
            }(t.id) && n.includes(o.fittingTypes, e)
        }, e.exports.isImageTypeSupported = i, e.exports.isExternalUrl = u, e.exports.isWEBP = a, e.exports.isSEOBot = function(e) {
            return e && e.isSEOBot || !1
        }, e.exports.getFileType = function(e) {
            return function(e) {
                return n.includes([o.fileType.JPEG, o.fileType.JPG, o.fileType.JPE], c(e))
            }(e) ? o.fileType.JPG : function(e) {
                return n.includes(["png"], c(e))
            }(e) ? o.fileType.PNG : a(e) ? o.fileType.WEBP : o.fileType.UNRECOGNIZED
        }, e.exports.getFileExtension = c, e.exports.getFileName = function(e, t) {
            var r = /\.([^.]*)$/;
            if ("string" == typeof t && t.length) {
                var i = ["/", "\\", "?", "<", ">", "|", "“", ":", '"'].map(encodeURIComponent),
                    a = new RegExp("(" + i.concat(["\\.", "\\*"]).join("|") + ")", "g"),
                    u = t,
                    c = t.match(r);
                return c && n.includes(o.supportedExtensions, c[1]) && (u = t.replace(r, "")), encodeURIComponent(u).replace(a, "_")
            }
            var s = e.match(/\/(.*?)$/);
            return (s ? s[1] : e).replace(r, "")
        }, e.exports.getAlignedRect = function(e, t, r, n) {
            var i = l(t) || function(e) {
                    return void 0 === e && (e = o.alignTypes.CENTER), o.ALIGN_TYPE_TO_FOCAL_POINT[e]
                }(n),
                a = Math.max(0, Math.min(e.width - r.width, i.x * e.width - r.width / 2)),
                u = Math.max(0, Math.min(e.height - r.height, i.y * e.height - r.height / 2));
            return {
                x: e.x ? e.x + a : a,
                y: e.y ? e.y + u : u,
                width: Math.min(e.width, r.width),
                height: Math.min(e.height, r.height)
            }
        }, e.exports.getOverlappingRect = function(e, t) {
            var r = Math.max(0, Math.min(e.width, t.x + t.width) - Math.max(0, t.x)),
                n = Math.max(0, Math.min(e.height, t.y + t.height) - Math.max(0, t.y));
            return r && n && (e.width !== r || e.height !== n) ? {
                x: Math.max(0, t.x),
                y: Math.max(0, t.y),
                width: r,
                height: n
            } : null
        }, e.exports.getScaleFactor = s, e.exports.getTransformData = function(e, t, r, n, i, a) {
            var u = function(e, t, r, n, i) {
                    var a, u, c;
                    if (a = s(e, t, r, n, i), i === o.transformTypes.FILL ? (u = r, c = n) : i === o.transformTypes.FIT && (u = e * a, c = t * a), u * c > o.SAFE_TRANSFORMED_AREA) {
                        var l = Math.sqrt(o.SAFE_TRANSFORMED_AREA / (u * c));
                        a = s(e, t, u *= l, c *= l, i)
                    }
                    return {
                        scaleFactor: a,
                        width: u,
                        height: c
                    }
                }(e = e || r.width, t = t || r.height, r.width * n, r.height * n, i),
                c = u.scaleFactor;
            return function(e, t, r, n, i, a, u) {
                var c, s, l = function(e, t, r, n) {
                        return {
                            classic: f,
                            auto: d,
                            super: p
                        }[n](e, t, r)
                    }(e, t, a, i),
                    m = l.optimizedScaleFactor,
                    h = l.upscaleMethodValue,
                    v = l.forceUSM;
                if (a <= m) return {
                    width: r,
                    height: n,
                    scaleFactor: a,
                    upscaleMethodValue: h,
                    forceUSM: v,
                    cssUpscaleNeeded: !1
                };
                switch (u) {
                    case o.transformTypes.FILL:
                        c = r * (m / a), s = n * (m / a);
                        break;
                    case o.transformTypes.FIT:
                        c = e * m, s = t * m
                }
                return {
                    width: c,
                    height: s,
                    scaleFactor: m,
                    upscaleMethodValue: h,
                    forceUSM: v,
                    cssUpscaleNeeded: !0
                }
            }(e, t, u.width, u.height, a, c, i)
        }, e.exports.getDevicePixelRatio = function(e) {
            return Math.min(e.pixelAspectRatio || 1, o.MAX_DEVICE_PIXEL_RATIO)
        }, e.exports.getAlignment = function(e) {
            return o.alignTypesMap[e.alignment] || o.alignTypesMap[o.alignTypes.CENTER]
        }, e.exports.getPreferredImageQuality = function(e, t) {
            return o.imageScaleDefaults[m(e, t)].quality
        }, e.exports.getDimension = function(e, t, r, n, o) {
            var i = s(e, t, r, n, o);
            return {
                width: Math.round(e * i),
                height: Math.round(t * i)
            }
        }, e.exports.getFocalPoint = l, e.exports.getUpscaleString = function(e) {
            return e && e.upscaleMethod && "string" == typeof e.upscaleMethod && o.upscaleMethods[e.upscaleMethod.toUpperCase()] || o.upscaleMethods.AUTO
        }, e.exports.roundToFixed = h
    }, function(e, t, r) {
        "use strict";
        var n = function(e, t) {
                return "".concat(e, ".").concat(t)
            },
            o = r(2),
            i = o.FieldType.text,
            a = o.FieldType.boolean,
            u = o.FieldType.number,
            c = o.FieldType.dateTime,
            s = o.FieldType.richText,
            l = o.FieldType.url,
            f = [i, s, a, c, o.FieldType.reference, u, l, o.FieldType.stringArray],
            d = function(e, t) {
                var r = e.type,
                    n = f.includes(r),
                    o = !!e.systemField,
                    i = ["_createdDate", "_updatedDate"].includes(t || e.name);
                return (!o || i) && n
            };
        var p = r(18),
            m = r.n(p);

        function h(e, t, r, n, o, i, a) {
            try {
                var u = e[i](a),
                    c = u.value
            } catch (e) {
                return void r(e)
            }
            u.done ? t(c) : Promise.resolve(c).then(n, o)
        }
        var v = function(e) {
            var t = e.httpClient;
            return {
                reportFormEventToAutomationCreator: function() {
                    return function() {
                        var e = function(e) {
                            return function() {
                                var t = this,
                                    r = arguments;
                                return new Promise(function(n, o) {
                                    var i = e.apply(t, r);

                                    function a(e) {
                                        h(i, n, o, a, u, "next", e)
                                    }

                                    function u(e) {
                                        h(i, n, o, a, u, "throw", e)
                                    }
                                    a(void 0)
                                })
                            }
                        }(regeneratorRuntime.mark(function e(r) {
                            var n, o, i, a;
                            return regeneratorRuntime.wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return n = r.detailedEventPayload, o = r.eventUTCTime, i = "/_api/action-triggers-server/v1/report-event", a = {
                                            eventIdentifier: {
                                                eventUniqueId: m.a.v4(),
                                                eventType: "form/form/code",
                                                sourceUniqueId: "675bbcef-18d8-41f5-800e-131ec9e08762"
                                            },
                                            eventUTCTime: o,
                                            detailedEventPayload: n
                                        }, e.next = 5, t.post(i, a);
                                    case 5:
                                    case "end":
                                        return e.stop()
                                }
                            }, e)
                        }));
                        return function(t) {
                            return e.apply(this, arguments)
                        }
                    }()
                }
            }
        };
        r.d(t, "a", function() {
            return n
        }), r.d(t, "b", function() {
            return d
        }), r.d(t, "c", function() {
            return v
        })
    }, function(e, t, r) {
        "use strict";
        e.exports = function(e, t) {
            return t.reduce(function(e, t) {
                return e.chain(function(e) {
                    return t.map(function(t) {
                        return Array.isArray(t) ? e.concat([t]) : e.concat(t)
                    })
                })
            }, e.of([]))
        }
    }, function(e, t, r) {
        var n = r(88),
            o = r(89),
            i = o;
        i.v1 = n, i.v4 = o, e.exports = i
    }, function(e, t, r) {
        "use strict";
        e.exports = {
            CMEditor: {
                dsn: "https://e788f1b6d7b54d3482c54d1e27b95f38@sentry.wixpress.com/165"
            },
            CMMyAccount: {
                dsn: "https://bd7df26433634b41b7e711922156bff7@sentry.wixpress.com/166"
            },
            DBSMEditor: {
                dsn: "https://adc03f08d1814b5a835f586aaba9d8ff@sentry.wixpress.com/159"
            },
            DBSMViewer: {
                dsn: "https://27180ecd50484e4eafe543b40d29866d@sentry.wixpress.com/89"
            },
            UserErrors: {
                dsn: "https://73a0410004ae41b7b60ca1c4b4684996@sentry.wixpress.com/183"
            },
            WixData: {
                dsn: "https://9653fbb3e48143d890dba8a09a5a98c6@sentry.wixpress.com/184"
            }
        }
    }, function(e, t, r) {
        "use strict";
        e.exports.BI_ENDPOINT = "platform", e.exports.BI_CM_ENDPOINT = "platform-cm", e.exports.BI_SANTA_EDITOR_ENDPOINT = "editor", e.exports.BI_VIEWER_ENDPOINT = "platform-viewer", e.exports.BI_ERROR_ENDPOINT = "trg", e.exports.BI_SOURCE = 79, e.exports.BI_CM_SOURCE = 83, e.exports.BI_SANTA_EDITOR_SOURCE = 38
    }, function(e, t, r) {
        "use strict";
        var n = r(0).isPlainObject,
            o = r(23);
        e.exports.addResolver = function() {
            return function(e, t, r) {
                return t in e ? Object.defineProperty(e, t, {
                    value: r,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : e[t] = r, e
            }({}, o, "currentUser")
        }, e.exports.shouldResolve = function(e) {
            return n(e) && "currentUser" === e[o]
        }
    }, function(e, t, r) {
        "use strict";
        var n = r(0).isPlainObject,
            o = r(27).DATA_BINDING,
            i = r(23),
            a = o;
        e.exports.addResolver = function(e) {
            return Object.assign({}, e, function(e, t, r) {
                return t in e ? Object.defineProperty(e, t, {
                    value: r,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : e[t] = r, e
            }({}, i, a))
        }, e.exports.shouldResolve = function(e) {
            return n(e) && e[i] === a
        }
    }, function(e, t, r) {
        "use strict";
        e.exports = "@resolver"
    }, function(e, t, r) {
        "use strict";

        function n(e) {
            "@babel/helpers - typeof";
            return (n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            })(e)
        }
        e.exports.includes = function(e, t) {
            return e.indexOf ? e.indexOf(t) > -1 : !(!e || "object" !== n(e)) && Object.keys(e).some(function(r) {
                return e[r] === t
            })
        }, e.exports.last = function(e) {
            return e[e.length - 1]
        }, e.exports.template = function(e) {
            return function(t) {
                var r = e;
                for (var n in t) t.hasOwnProperty(n) && (r = r.replace(new RegExp("\\${" + n + "}", "g"), t[n]));
                return r
            }
        }
    }, function(e, t, r) {
        "use strict";
        var n = {
            isWEBP: r(9).noWEBP,
            isObjectFitBrowser: !0
        };
        e.exports.getFeature = function(e) {
            return n[e]
        }, e.exports.setFeature = function(e, t) {
            n[e] = t
        }
    }, function(e, t, r) {
        "use strict";
        var n = function(e) {
            var t = e.split("/"),
                r = t[t.length - 3],
                n = t[t.length - 2];
            if (! function(e) {
                    return /^\d+\.\d+\.\d+$/.test(e)
                }(n)) throw Error("Invalid version string ".concat(n));
            return {
                appName: r,
                version: n
            }
        };
        e.exports = function(e) {
            try {
                var t = n(e),
                    r = t.appName,
                    o = t.version;
                return "".concat(r, "@").concat(o)
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
    }, function(e, t, r) {
        "use strict";
        t.__esModule = !0, t.WIX_CODE = "wix-code", t.WIX_CODE_SITE_EXTENSION = "CloudSiteExtension", t.DATA_BINDING = "dataBinding", t.SITE_MEMBERS = "SiteMembers", t.OLD_BLOG = "79f391eb-7dfc-4adf-be6e-64434c4838d9", t.CLOUD_DATA_SCHEMA_NOTIFIER = "f1fbeff1-05c3-4121-bdb5-75e74b6e9e51", t.WIX_CODE_RELEASE_MANAGER = "8c41f3a6-47f7-40be-ad77-02a72cb2ddb3", t.WIX_CODE_SECRETS_MANAGER = "4b10fcce-732d-4be3-9d46-801d271acda9", t.WIX_CODE_SITE_MONITORING = "675bbcef-18d8-41f5-800e-131ec9e08762", t.WIX_ACCESSIBILITY_WIZARD = "9699c03d-5c19-4a7c-a454-e8109a6e43fc", t.WIX_CODE_PLATFORM_VISIBILITY = "8048f115-449b-4dab-b0e6-e09d5ffc8199", t.BUSINESS_DASHBOARD = "a7597ab5-1ed4-458f-a5c1-5884d5e14281", t.DASHBOARD_SETUP = "0750d046-d599-4cfc-9f6b-e9f4af169aa9", t.DASHBOARD_SUGGESTIONS = "cead4297-02ee-4c0f-ae07-461f4ba71b3b", t.DASHBOARD_SALES = "f95c72b1-84de-48ec-a61b-d96d61315ffe", t.WIX_HOTELS = "135aad86-9125-6074-7346-29dc6a3c9bcf", t.WIX_BLOG = "14bcded7-0066-7c35-14d7-466cb3f09103", t.WIX_EVENTS = "140603ad-af8d-84a5-2c80-a0f60cb47351", t.WIX_BOOKINGS = "13d21c63-b5ec-5912-8397-c3a5ddb27a97", t.WIX_FORUM = "14724f35-6794-cd1a-0244-25fd138f9242", t.PRICING_PLANS = "1522827f-c56c-a5c9-2ac9-00f9e6ae12d3", t.WIX_ECOM = "1380b703-ce81-ff05-f115-39571d94dfcd", t.WIX_STORES = "1380b703-ce81-ff05-f115-39571d94dfcd", t.WIX_NEW_STORES = "215238eb-22a5-4c36-9e7b-e7c08025e04e", t.MEMBERS_AREA = "14cc59bc-f0b7-15b8-e1c7-89ce41d0e0c9", t.MEMBERS = "14dbefd2-01b4-fb61-32a7-3abd44da4908", t.META_SITE = "22bef345-3c5b-4c18-b782-74d4085112ff", t.NOTIFICATIONS = "14f25924-5664-31b2-9568-f9c5ed98c9b1", t.WIX_RESERVATIONS = "1475ab65-206b-d79a-856d-fa10bdb479ea", t.WIX_RESTAURANTS_ORDERS = "13e8d036-5516-6104-b456-c8466db39542", t.WIX_RESTAURANTS_MENUS = "13c1402c-27f2-d4ab-7463-ee7c89e07578", t.WIX_CHAT = "14517e1a-3ff0-af98-408e-2bd6953c36a2", t.DEVIANTART_FEED = "7d297b79-baed-46d7-ac58-4bd68dcb70d0", t.INSTAGRAM_FEED = "14635256-b183-1c71-a4d2-f55179b80e8a", t.WIX_GET_SUBSCRIBERS = "1375baa8-8eca-5659-ce9d-455b2009250d", t.WIX_VIDEO = "14409595-f076-4753-8303-9a86f9f71469", t.WIX_PHOTO_ALBUMS = "13ff8629-c1fc-e289-e81f-bc8c8968e9d6", t.WIX_PRO_GALLERY = "14271d6f-ba62-d045-549b-ab972ae1f70e", t.BANDSINTOWN = "1405ef82-0ee0-65fb-88a1-2f172aa3573c", t.WIX_MUSIC = "13bb5d67-1add-e770-a71f-001277e17c57", t.WIX_SITE_SEARCH = "1484cb44-49cd-5b39-9681-75188ab429de", t.WIX_FAQ = "14c92d28-031e-7910-c9a8-a670011e062d", t.WIX_FORMS = "14ce1214-b278-a7e4-1373-00cebd1bef7c", t.WIX_CHALLENGES = "2936472a-a1ed-4ae5-9f71-614313a9f4e7", t.WIX_GROUPS = "148c2287-c669-d849-d153-463c7486a694";
        var n = {};
        t.getAppDependencies = function(e) {
            return n[e] || []
        }
    }, function(e, t, r) {
        "use strict";
        (function(t) {
            var n = r(65),
                o = r(66),
                i = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//,
                a = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\\/]+)?([\S\s]*)/i,
                u = /^[a-zA-Z]:/,
                c = new RegExp("^[\\x09\\x0A\\x0B\\x0C\\x0D\\x20\\xA0\\u1680\\u180E\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200A\\u202F\\u205F\\u3000\\u2028\\u2029\\uFEFF]+");

            function s(e) {
                return (e || "").toString().replace(c, "")
            }
            var l = [
                    ["#", "hash"],
                    ["?", "query"],
                    function(e, t) {
                        return p(t.protocol) ? e.replace(/\\/g, "/") : e
                    },
                    ["/", "pathname"],
                    ["@", "auth", 1],
                    [NaN, "host", void 0, 1, 1],
                    [/:(\d+)$/, "port", void 0, 1],
                    [NaN, "hostname", void 0, 1, 1]
                ],
                f = {
                    hash: 1,
                    query: 1
                };

            function d(e) {
                var r, n = ("undefined" != typeof window ? window : void 0 !== t ? t : "undefined" != typeof self ? self : {}).location || {},
                    o = {},
                    a = typeof(e = e || n);
                if ("blob:" === e.protocol) o = new h(unescape(e.pathname), {});
                else if ("string" === a)
                    for (r in o = new h(e, {}), f) delete o[r];
                else if ("object" === a) {
                    for (r in e) r in f || (o[r] = e[r]);
                    void 0 === o.slashes && (o.slashes = i.test(e.href))
                }
                return o
            }

            function p(e) {
                return "file:" === e || "ftp:" === e || "http:" === e || "https:" === e || "ws:" === e || "wss:" === e
            }

            function m(e, t) {
                e = s(e), t = t || {};
                var r, n = a.exec(e),
                    o = n[1] ? n[1].toLowerCase() : "",
                    i = !!n[2],
                    u = !!n[3],
                    c = 0;
                return i ? u ? (r = n[2] + n[3] + n[4], c = n[2].length + n[3].length) : (r = n[2] + n[4], c = n[2].length) : u ? (r = n[3] + n[4], c = n[3].length) : r = n[4], "file:" === o ? c >= 2 && (r = r.slice(2)) : p(o) ? r = n[4] : o ? i && (r = r.slice(2)) : c >= 2 && p(t.protocol) && (r = n[4]), {
                    protocol: o,
                    slashes: i || p(o),
                    slashesCount: c,
                    rest: r
                }
            }

            function h(e, t, r) {
                if (e = s(e), !(this instanceof h)) return new h(e, t, r);
                var i, a, c, f, v, y, g = l.slice(),
                    b = typeof t,
                    w = this,
                    O = 0;
                for ("object" !== b && "string" !== b && (r = t, t = null), r && "function" != typeof r && (r = o.parse), t = d(t), i = !(a = m(e || "", t)).protocol && !a.slashes, w.slashes = a.slashes || i && t.slashes, w.protocol = a.protocol || t.protocol || "", e = a.rest, ("file:" === a.protocol && (2 !== a.slashesCount || u.test(e)) || !a.slashes && (a.protocol || a.slashesCount < 2 || !p(w.protocol))) && (g[3] = [/(.*)/, "pathname"]); O < g.length; O++) "function" != typeof(f = g[O]) ? (c = f[0], y = f[1], c != c ? w[y] = e : "string" == typeof c ? ~(v = e.indexOf(c)) && ("number" == typeof f[2] ? (w[y] = e.slice(0, v), e = e.slice(v + f[2])) : (w[y] = e.slice(v), e = e.slice(0, v))) : (v = c.exec(e)) && (w[y] = v[1], e = e.slice(0, v.index)), w[y] = w[y] || i && f[3] && t[y] || "", f[4] && (w[y] = w[y].toLowerCase())) : e = f(e, w);
                r && (w.query = r(w.query)), i && t.slashes && "/" !== w.pathname.charAt(0) && ("" !== w.pathname || "" !== t.pathname) && (w.pathname = function(e, t) {
                    if ("" === e) return t;
                    for (var r = (t || "/").split("/").slice(0, -1).concat(e.split("/")), n = r.length, o = r[n - 1], i = !1, a = 0; n--;) "." === r[n] ? r.splice(n, 1) : ".." === r[n] ? (r.splice(n, 1), a++) : a && (0 === n && (i = !0), r.splice(n, 1), a--);
                    return i && r.unshift(""), "." !== o && ".." !== o || r.push(""), r.join("/")
                }(w.pathname, t.pathname)), "/" !== w.pathname.charAt(0) && p(w.protocol) && (w.pathname = "/" + w.pathname), n(w.port, w.protocol) || (w.host = w.hostname, w.port = ""), w.username = w.password = "", w.auth && (f = w.auth.split(":"), w.username = f[0] || "", w.password = f[1] || ""), w.origin = "file:" !== w.protocol && p(w.protocol) && w.host ? w.protocol + "//" + w.host : "null", w.href = w.toString()
            }
            h.prototype = {
                set: function(e, t, r) {
                    var i = this;
                    switch (e) {
                        case "query":
                            "string" == typeof t && t.length && (t = (r || o.parse)(t)), i[e] = t;
                            break;
                        case "port":
                            i[e] = t, n(t, i.protocol) ? t && (i.host = i.hostname + ":" + t) : (i.host = i.hostname, i[e] = "");
                            break;
                        case "hostname":
                            i[e] = t, i.port && (t += ":" + i.port), i.host = t;
                            break;
                        case "host":
                            i[e] = t, /:\d+$/.test(t) ? (t = t.split(":"), i.port = t.pop(), i.hostname = t.join(":")) : (i.hostname = t, i.port = "");
                            break;
                        case "protocol":
                            i.protocol = t.toLowerCase(), i.slashes = !r;
                            break;
                        case "pathname":
                        case "hash":
                            if (t) {
                                var a = "pathname" === e ? "/" : "#";
                                i[e] = t.charAt(0) !== a ? a + t : t
                            } else i[e] = t;
                            break;
                        default:
                            i[e] = t
                    }
                    for (var u = 0; u < l.length; u++) {
                        var c = l[u];
                        c[4] && (i[c[1]] = i[c[1]].toLowerCase())
                    }
                    return i.origin = "file:" !== i.protocol && p(i.protocol) && i.host ? i.protocol + "//" + i.host : "null", i.href = i.toString(), i
                },
                toString: function(e) {
                    e && "function" == typeof e || (e = o.stringify);
                    var t, r = this,
                        n = r.protocol;
                    n && ":" !== n.charAt(n.length - 1) && (n += ":");
                    var i = n + (r.slashes || p(r.protocol) ? "//" : "");
                    return r.username && (i += r.username, r.password && (i += ":" + r.password), i += "@"), i += r.host + r.pathname, (t = "object" == typeof r.query ? e(r.query) : r.query) && (i += "?" !== t.charAt(0) ? "?" + t : t), r.hash && (i += r.hash), i
                }
            }, h.extractProtocol = m, h.location = d, h.trimLeft = s, h.qs = o, e.exports = h
        }).call(this, r(14))
    }, function(e, t, r) {
        "use strict";
        var n = r(0).isPlainObject,
            o = r(23);
        e.exports.addResolver = function(e) {
            return Object.assign({}, e, function(e, t, r) {
                return t in e ? Object.defineProperty(e, t, {
                    value: r,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : e[t] = r, e
            }({}, o, "userInput"))
        }, e.exports.shouldResolve = function(e) {
            return n(e) && "userInput" === e[o]
        }
    }, function(e, t, r) {
        "use strict";
        (function(e, n) {
            var o, i = r(51);
            o = "undefined" != typeof self ? self : "undefined" != typeof window ? window : void 0 !== e ? e : n;
            var a = Object(i.a)(o);
            t.a = a
        }).call(this, r(14), r(90)(e))
    }, function(e, t, r) {
        "use strict";

        function n(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function o(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? n(Object(r), !0).forEach(function(t) {
                    i(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : n(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function i(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }
        var a = r(40),
            u = r(106);
        e.exports = o(o({}, u), a)
    }, function(e, t, r) {
        "use strict";
        var n = r(76),
            o = r(77),
            i = r(78);

        function a(e, t) {
            return t.encode ? t.strict ? n(e) : encodeURIComponent(e) : e
        }

        function u(e) {
            var t = e.indexOf("?");
            return -1 === t ? "" : e.slice(t + 1)
        }

        function c(e, t) {
            var r = function(e) {
                    var t;
                    switch (e.arrayFormat) {
                        case "index":
                            return function(e, r, n) {
                                t = /\[(\d*)\]$/.exec(e), e = e.replace(/\[\d*\]$/, ""), t ? (void 0 === n[e] && (n[e] = {}), n[e][t[1]] = r) : n[e] = r
                            };
                        case "bracket":
                            return function(e, r, n) {
                                t = /(\[\])$/.exec(e), e = e.replace(/\[\]$/, ""), t ? void 0 !== n[e] ? n[e] = [].concat(n[e], r) : n[e] = [r] : n[e] = r
                            };
                        default:
                            return function(e, t, r) {
                                void 0 !== r[e] ? r[e] = [].concat(r[e], t) : r[e] = t
                            }
                    }
                }(t = o({
                    arrayFormat: "none"
                }, t)),
                n = Object.create(null);
            return "string" != typeof e ? n : (e = e.trim().replace(/^[?#&]/, "")) ? (e.split("&").forEach(function(e) {
                var t = e.replace(/\+/g, " ").split("="),
                    o = t.shift(),
                    a = t.length > 0 ? t.join("=") : void 0;
                a = void 0 === a ? null : i(a), r(i(o), a, n)
            }), Object.keys(n).sort().reduce(function(e, t) {
                var r = n[t];
                return Boolean(r) && "object" == typeof r && !Array.isArray(r) ? e[t] = function e(t) {
                    return Array.isArray(t) ? t.sort() : "object" == typeof t ? e(Object.keys(t)).sort(function(e, t) {
                        return Number(e) - Number(t)
                    }).map(function(e) {
                        return t[e]
                    }) : t
                }(r) : e[t] = r, e
            }, Object.create(null))) : n
        }
        t.extract = u, t.parse = c, t.stringify = function(e, t) {
            !1 === (t = o({
                encode: !0,
                strict: !0,
                arrayFormat: "none"
            }, t)).sort && (t.sort = function() {});
            var r = function(e) {
                switch (e.arrayFormat) {
                    case "index":
                        return function(t, r, n) {
                            return null === r ? [a(t, e), "[", n, "]"].join("") : [a(t, e), "[", a(n, e), "]=", a(r, e)].join("")
                        };
                    case "bracket":
                        return function(t, r) {
                            return null === r ? a(t, e) : [a(t, e), "[]=", a(r, e)].join("")
                        };
                    default:
                        return function(t, r) {
                            return null === r ? a(t, e) : [a(t, e), "=", a(r, e)].join("")
                        }
                }
            }(t);
            return e ? Object.keys(e).sort(t.sort).map(function(n) {
                var o = e[n];
                if (void 0 === o) return "";
                if (null === o) return a(n, t);
                if (Array.isArray(o)) {
                    var i = [];
                    return o.slice().forEach(function(e) {
                        void 0 !== e && i.push(r(n, e, i.length))
                    }), i.join("&")
                }
                return a(n, t) + "=" + a(o, t)
            }).filter(function(e) {
                return e.length > 0
            }).join("&") : ""
        }, t.parseUrl = function(e, t) {
            return {
                url: e.split("?")[0] || "",
                query: c(u(e), t)
            }
        }
    }, function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.convertFromCustomFormat = t.convertToCustomFormat = void 0;
        var n = r(79),
            o = r(81),
            i = r(82),
            a = new n.ConvertersComposer(new o.DateConverter, new i.DefaultConverter);
        t.convertToCustomFormat = function(e) {
            return a.convertToCustomFormat(e)
        };
        t.convertFromCustomFormat = function(e) {
            return a.convertFromCustomFormat(e)
        }
    }, function(e, t) {
        var r = "undefined" != typeof crypto && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || "undefined" != typeof msCrypto && "function" == typeof window.msCrypto.getRandomValues && msCrypto.getRandomValues.bind(msCrypto);
        if (r) {
            var n = new Uint8Array(16);
            e.exports = function() {
                return r(n), n
            }
        } else {
            var o = new Array(16);
            e.exports = function() {
                for (var e, t = 0; t < 16; t++) 0 == (3 & t) && (e = 4294967296 * Math.random()), o[t] = e >>> ((3 & t) << 3) & 255;
                return o
            }
        }
    }, function(e, t) {
        for (var r = [], n = 0; n < 256; ++n) r[n] = (n + 256).toString(16).substr(1);
        e.exports = function(e, t) {
            var n = t || 0,
                o = r;
            return [o[e[n++]], o[e[n++]], o[e[n++]], o[e[n++]], "-", o[e[n++]], o[e[n++]], "-", o[e[n++]], o[e[n++]], "-", o[e[n++]], o[e[n++]], "-", o[e[n++]], o[e[n++]], o[e[n++]], o[e[n++]], o[e[n++]], o[e[n++]]].join("")
        }
    }, function(e, t, r) {
        "use strict";
        var n = r(25),
            o = r(9);

        function i(e) {
            var t = n.getFeature("isWEBP"),
                r = new window.Image;
            r.onload = function() {
                t[e] = r.width > 0 && r.height > 0, n.setFeature("isWEBP", t)
            }, r.onerror = function() {
                t[e] = !1, n.setFeature("isWEBP", t)
            }, r.src = "data:image/webp;base64," + {
                lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
                lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
                alpha: "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",
                animation: "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"
            }[e]
        }
        e.exports.checkSupportByUserAgent = function(e, t) {
            var r = t.browser,
                i = t.os;
            if (e) {
                var a, u = parseFloat(r.version),
                    c = parseFloat(i.version),
                    s = new RegExp(/AppleWebKit\/([\d.]+)/),
                    l = null === s.exec(e) ? null : parseFloat(s.exec(e)[1]),
                    f = function(e, t, r, n, o) {
                        var i = !e.phone && !e.tablet && r.chrome && n >= 23,
                            a = e.android && (e.phone || e.tablet) && r.webkit && r.chrome && n >= 25,
                            u = e.android && o < 535 && (e.phone || e.tablet) && t >= 4.2 && r.webkit && !r.safari,
                            c = r.edge && n >= 18,
                            s = !e.firefoxos && r.firefox && !r.webkit && n >= 65;
                        return !!(i || a || u || c || s)
                    }(i, c, r, u, l);
                n.setFeature("isWEBP", ((a = {})[o.webp.LOSSY] = function(e, t, r, n, o) {
                    var i = !e.phone && !e.tablet && r.chrome && n >= 17,
                        a = e.android && (e.phone || e.tablet) && r.webkit && r.chrome && n >= 25,
                        u = e.android && o < 535 && (e.phone || e.tablet) && t >= 4 && r.webkit,
                        c = r.edge && n >= 18,
                        s = !e.firefoxos && r.firefox && !r.webkit && n >= 65;
                    return !!(i || a || u || c || s)
                }(i, c, r, u, l), a[o.webp.LOSSLESS] = f, a[o.webp.ALPHA] = f, a[o.webp.ANIMATION] = function(e, t, r, n) {
                    var o = !e.ios && r.chrome && n >= 32,
                        i = r.edge && n >= 18,
                        a = !e.firefoxos && r.firefox && !r.webkit && n >= 65;
                    return !!(o || i || a)
                }(i, 0, r, u), a))
            }
        }, e.exports.checkSupportByFeatureDetection = function() {
            i(o.webp.LOSSY), i(o.webp.LOSSLESS), i(o.webp.ALPHA), i(o.webp.ANIMATION)
        }, e.exports.isWEBPBrowserSupport = function(e) {
            var t = n.getFeature("isWEBP"),
                r = e === o.fileType.JPG && t[o.webp.LOSSY],
                i = e === o.fileType.PNG && t[o.webp.LOSSLESS],
                a = e === o.fileType.PNG && t[o.webp.ALPHA];
            return r || i && a
        }
    }, function(e, t, r) {
        "use strict";

        function n(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function o(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }
        var i = r(15),
            a = i.isSEOBot,
            u = i.getFileType,
            c = i.getFileName,
            s = i.getFileExtension,
            l = i.getDevicePixelRatio,
            f = i.getUpscaleString,
            d = i.isImageTransformApplicable,
            p = r(100),
            m = p.isMobile,
            h = p.isWEBPBrowserSupport,
            v = r(101),
            y = r(102),
            g = r(9);
        e.exports.getTransform = function(e, t, r, n) {
            var o = a(n),
                i = u(t.id),
                p = c(t.id, t.name),
                m = s(t.id),
                g = !o && h(i),
                b = o ? 1 : l(r),
                w = {
                    fileName: p,
                    fileExtension: m,
                    fileType: i,
                    isWEBPSupport: g,
                    fittingType: e,
                    preferredExtension: g ? "webp" : m,
                    src: {
                        id: t.id,
                        width: t.width,
                        height: t.height,
                        isCropped: !1
                    },
                    focalPoint: {
                        x: t.focalPoint && t.focalPoint.x,
                        y: t.focalPoint && t.focalPoint.y
                    },
                    parts: [],
                    devicePixelRatio: b,
                    quality: 0,
                    upscaleMethod: f(n),
                    progressive: !0,
                    watermark: "",
                    unsharpMask: {},
                    filters: {}
                };
            return d(t.id) && (v.setTransformParts(w, t, r), y.setTransformOptions(w, n)), w
        }, e.exports.getTarget = function(e, t, r) {
            var i = function(e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var r = null != arguments[t] ? arguments[t] : {};
                        t % 2 ? n(Object(r), !0).forEach(function(t) {
                            o(e, t, r[t])
                        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : n(Object(r)).forEach(function(t) {
                            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                        })
                    }
                    return e
                }({}, r),
                a = m();
            switch (e) {
                case g.fittingTypes.LEGACY_BG_FIT_AND_TILE:
                case g.fittingTypes.LEGACY_BG_FIT_AND_TILE_HORIZONTAL:
                case g.fittingTypes.LEGACY_BG_FIT_AND_TILE_VERTICAL:
                case g.fittingTypes.LEGACY_BG_NORMAL:
                    var u = a ? g.MOBILE_MAX_BG_SITE_LEGACY_WIDTH : g.DSKTP_MAX_BG_SITE_LEGACY_WIDTH,
                        c = a ? g.MOBILE_MAX_BG_SITE_LEGACY_HEIGHT : g.DSKTP_MAX_BG_SITE_LEGACY_HEIGHT;
                    i.width = Math.min(u, t.width), i.height = Math.min(c, Math.round(i.width / (t.width / t.height))), i.pixelAspectRatio = 1
            }
            return i
        }
    }, function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = function() {
                return function(e, t) {
                    if (Array.isArray(e)) return e;
                    if (Symbol.iterator in Object(e)) return function(e, t) {
                        var r = [],
                            n = !0,
                            o = !1,
                            i = void 0;
                        try {
                            for (var a, u = e[Symbol.iterator](); !(n = (a = u.next()).done) && (r.push(a.value), !t || r.length !== t); n = !0);
                        } catch (e) {
                            o = !0, i = e
                        } finally {
                            try {
                                !n && u.return && u.return()
                            } finally {
                                if (o) throw i
                            }
                        }
                        return r
                    }(e, t);
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }
            }(),
            o = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            i = function(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }(r(32)),
            a = r(39);
        var u = function(e) {
                return e.ok ? e.json() : e.text().then(function(t) {
                    return Promise.reject(new a.UnsuccessfulResponseException(e.status, t, s(t), c(e)))
                })
            },
            c = function(e) {
                return e.headers.get("x-wix-request-id")
            },
            s = function(e) {
                try {
                    return JSON.parse(e).message
                } catch (t) {
                    return e
                }
            },
            l = function(e) {
                return Promise.reject(new a.FailedRequestException(e))
            },
            f = function(e) {
                return e.reduce(function(e, t) {
                    return Object.assign({}, e, function(e, t, r) {
                        return t in e ? Object.defineProperty(e, t, {
                            value: r,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : e[t] = r, e
                    }({}, t.id, t))
                }, {})
            },
            d = function(e, t) {
                return e.endsWith(t) ? e.substring(0, e.length - t.length) : e
            },
            p = function(e) {
                return e = d(e, "/"), e = d(e, "/v1/schemas")
            },
            m = function() {
                function e(t, r, n, o) {
                    var i = this;
                    ! function(e, t) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    }(this, e), this.signedInstance = r, this.fetch = function(e, r) {
                        var n = (r = r || {}).headers || {};
                        return n.Authorization = n.Authorization || i.signedInstance, r.headers = n, t(e, r).then(u, l)
                    }, this.baseUrl = p(o && o.baseUrl || "https://cloud-data.wix-code.com"), this.gridAppId = n
                }
                return o(e, null, [{
                    key: "FailedRequestException",
                    get: function() {
                        return a.FailedRequestException
                    }
                }, {
                    key: "UnsuccessfulResponseException",
                    get: function() {
                        return a.UnsuccessfulResponseException
                    }
                }]), o(e, [{
                    key: "wrapWithDefaultOptions",
                    value: function(e) {
                        return Object.assign({}, e, {
                            appId: this.gridAppId
                        })
                    }
                }, {
                    key: "formRequestUrl",
                    value: function(e) {
                        return this.baseUrl + "/v1/schemas?" + i.default.stringify(e)
                    }
                }, {
                    key: "get",
                    value: function(e) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {
                                includeDeletedCollections: !1
                            },
                            r = this.wrapWithDefaultOptions({
                                includeDeleted: !0,
                                schemaIds: e
                            });
                        return this.fetch(this.formRequestUrl(r)).then(function(r) {
                            var o = n(r.schemas, 1)[0];
                            return o && o.isDeleted && !t.includeDeletedCollections ? (0, a.rejectWithCollectionDeleted)(e) : o || Promise.reject((0, a.schemaNotFoundError)(e))
                        })
                    }
                }, {
                    key: "bulkGet",
                    value: function(e) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {
                                includeDeletedCollections: !1,
                                referencedCollectionsDepth: 0
                            },
                            r = this.wrapWithDefaultOptions({
                                depth: t.referencedCollectionsDepth || 0,
                                includeDeleted: t.includeDeletedCollections || !1,
                                schemaIds: e
                            });
                        return this.fetch(this.formRequestUrl(r)).then(function(e) {
                            var t = e.schemas;
                            return f(t)
                        })
                    }
                }, {
                    key: "list",
                    value: function() {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
                                includeDeletedCollections: !1
                            },
                            t = this.wrapWithDefaultOptions({
                                schemaIds: [],
                                depth: 0,
                                includeDeleted: e.includeDeletedCollections || !1
                            });
                        return this.fetch(this.formRequestUrl(t)).then(function(e) {
                            var t = e.schemas;
                            return f(t)
                        })
                    }
                }, {
                    key: "save",
                    value: function(e, t) {
                        var r = JSON.stringify(this.wrapWithDefaultOptions({
                            schemaId: e,
                            schema: t
                        }));
                        return this.fetch(this.baseUrl + "/v1/schemas", {
                            method: "POST",
                            body: r
                        }).then(function(e) {
                            return e.schemas
                        })
                    }
                }, {
                    key: "bulkSave",
                    value: function(e) {
                        var t = JSON.stringify(this.wrapWithDefaultOptions({
                            schemas: e
                        }));
                        return this.fetch(this.baseUrl + "/v1/schemas-bulk-save", {
                            method: "POST",
                            body: t
                        }).then(function(e) {
                            return e.schemas
                        })
                    }
                }, {
                    key: "setIsDeletedFlag",
                    value: function(e, t) {
                        var r = JSON.stringify(this.wrapWithDefaultOptions({
                            schemaId: e,
                            partialSchema: {
                                isDeleted: t
                            }
                        }));
                        return this.fetch(this.baseUrl + "/v1/schemas", {
                            method: "PATCH",
                            body: r
                        }).then(function(e) {
                            return e.schemas
                        })
                    }
                }, {
                    key: "remove",
                    value: function(e) {
                        return this.setIsDeletedFlag(e, !0)
                    }
                }, {
                    key: "restore",
                    value: function(e) {
                        return this.setIsDeletedFlag(e, !1)
                    }
                }]), e
            }();
        t.default = m
    }, function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.errorCodes = t.schemaNotFoundError = t.rejectWithCollectionDeleted = t.UnsuccessfulResponseException = t.FailedRequestException = void 0;
        var n = r(108);

        function o(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function a(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var u = function(e) {
                function t(e, r) {
                    o(this, t);
                    var n = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    return Object.setPrototypeOf(n, r.prototype), n.name = r.name, Error.captureStackTrace ? Error.captureStackTrace(n, r) : n.stack = new Error(e).stack, n
                }
                return a(t, Error), t
            }(),
            c = function(e) {
                function t(e) {
                    o(this, t);
                    var r = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, t));
                    return r.reason = e, r.message = e, r
                }
                return a(t, u), t
            }(),
            s = function(e) {
                function t(e, r, n, a) {
                    o(this, t);
                    var u = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, n, t));
                    return u.status = e, u.responseText = r, u.requestId = a, u
                }
                return a(t, u), t
            }();
        t.FailedRequestException = c, t.UnsuccessfulResponseException = s, t.rejectWithCollectionDeleted = function(e) {
            return function(e, t) {
                return Promise.reject((0, n.wixDataError)(e, t))
            }(n.messages.collectionDeleted(e), n.codes.CollectionDeleted)
        }, t.schemaNotFoundError = n.schemaNotFoundError, t.errorCodes = n.codes
    }, function(e, t, r) {
        "use strict";

        function n(e) {
            "@babel/helpers - typeof";
            return (n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            })(e)
        }
        var o = function(e, t) {
            e && "object" === n(e) && (e.errorGroup = t)
        };
        e.exports = {
            markUserError: function(e) {
                return o(e, "User")
            },
            isUserError: function(e) {
                return e && "User" === e.errorGroup
            },
            markAppError: function(e) {
                return o(e, "Error")
            },
            isAppError: function(e) {
                return e && "Error" === e.errorGroup
            },
            markEdmError: function(e) {
                return o(e, "EDM")
            },
            isEdmError: function(e) {
                return e && "EDM" === e.errorGroup
            },
            markError: o,
            isMarked: function(e) {
                return !!e && void 0 !== e.errorGroup
            },
            USER_ERROR_GROUP: "User",
            APP_ERROR_GROUP: "Error",
            EDM_ERROR_GROUP: "EDM",
            UNKNOWN_ERROR_GROUP: "Unknown"
        }
    }, function(e, t, r) {
        "use strict";
        (function(e) {
            r.d(t, "a", function() {
                return x
            });
            r(64);
            var n = r(0),
                o = r(28),
                i = r.n(o),
                a = r(4),
                u = r(8),
                c = r(46),
                s = r(47),
                l = r(48),
                f = r(49),
                d = r(61),
                p = r(58),
                m = r(16),
                h = r(60),
                v = ["routerReturnedData"];

            function y(e, t) {
                if (null == e) return {};
                var r, n, o = function(e, t) {
                    if (null == e) return {};
                    var r, n, o = {},
                        i = Object.keys(e);
                    for (n = 0; n < i.length; n++) r = i[n], t.indexOf(r) >= 0 || (o[r] = e[r]);
                    return o
                }(e, t);
                if (Object.getOwnPropertySymbols) {
                    var i = Object.getOwnPropertySymbols(e);
                    for (n = 0; n < i.length; n++) r = i[n], t.indexOf(r) >= 0 || Object.prototype.propertyIsEnumerable.call(e, r) && (o[r] = e[r])
                }
                return o
            }

            function g(e, t, r) {
                ! function(e, t) {
                    if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object")
                }(e, t), t.set(e, r)
            }

            function b(e, t, r) {
                return t in e ? Object.defineProperty(e, t, {
                    value: r,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : e[t] = r, e
            }

            function w(e, t) {
                return function(e, t) {
                    if (t.get) return t.get.call(e);
                    return t.value
                }(e, I(e, t, "get"))
            }

            function O(e, t, r) {
                return function(e, t, r) {
                    if (t.set) t.set.call(e, r);
                    else {
                        if (!t.writable) throw new TypeError("attempted to set read only private field");
                        t.value = r
                    }
                }(e, I(e, t, "set"), r), r
            }

            function I(e, t, r) {
                if (!t.has(e)) throw new TypeError("attempted to " + r + " private field on non-instance");
                return t.get(e)
            }
            var E = new WeakMap,
                R = new WeakMap,
                T = new WeakMap,
                j = new WeakMap,
                S = new WeakMap,
                P = new WeakMap,
                C = new WeakMap,
                D = new WeakMap,
                x = function t() {
                    var r = this,
                        o = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                        i = o.wixDataSchemasForItTests,
                        p = o.errorReporter,
                        I = void 0 === p ? function(e, t) {
                            return console.error(e, t)
                        } : p,
                        x = o.verboseReporter,
                        k = void 0 === x ? function() {
                            var e;
                            return (e = console).verbose.apply(e, arguments)
                        } : x,
                        N = o.shouldVerbose,
                        M = void 0 === N ? Boolean(!1) : N,
                        F = o.appLogger,
                        L = void 0 === F ? Object(a.c)({
                            global: self,
                            appName: h.a
                        }) : F,
                        U = o.automationsClientCreator,
                        W = void 0 === U ? function(e) {
                            var t = e.httpClient;
                            return Object(m.c)({
                                httpClient: t
                            })
                        } : U,
                        B = o.getElementorySupport,
                        V = void 0 === B ? function() {
                            return e.elementorySupport
                        } : B;
                    return function(e, t) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    }(this, t), b(this, "initAppForPage", function(e, t, o) {
                        var i = e.routerReturnedData,
                            a = y(e, v),
                            p = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {},
                            m = p.bi,
                            h = (m = void 0 === m ? {} : m).pageId,
                            g = m.viewerSessionId,
                            b = m.pageUrl,
                            I = m.metaSiteId,
                            x = m.svSession,
                            k = p.reportTrace,
                            N = void 0 === k ? n.noop : k,
                            M = p.monitoring.createMonitor,
                            F = p.fedOpsLoggerFactory,
                            L = p.biLoggerFactory,
                            U = p.essentials;
                        try {
                            var W = A(a, w(r, j).call(r)),
                                B = W.instance,
                                V = W.gridAppId,
                                G = o.window,
                                q = G.viewMode,
                                H = G.rendering.env,
                                $ = G.warmupData,
                                Y = o.location.baseUrl,
                                z = o.data,
                                X = {
                                    pageId: h,
                                    pageUrl: b,
                                    viewMode: q,
                                    metaSiteId: I,
                                    baseUrl: Y,
                                    instance: B,
                                    gridAppId: V,
                                    userId: x,
                                    sessionId: g,
                                    mode: {
                                        dev: !1,
                                        ssr: "backend" === H,
                                        csr: "backend" !== H
                                    },
                                    env: {
                                        live: Object(u.b)(q),
                                        editor: Object(u.a)(q)
                                    }
                                },
                                Q = new f.a({
                                    experiments: U.experiments,
                                    appState: X
                                });
                            w(r, R).addSessionData(function() {
                                return {
                                    routerReturnedData: i
                                }
                            }), w(r, R).init({
                                appLogger: w(r, R),
                                user: {
                                    id: Object(n.get)(o, ["user", "currentUser", "id"])
                                },
                                inSsr: "backend" === Object(n.get)(o, ["window", "rendering", "env"]),
                                viewMode: q,
                                platformBiParams: {
                                    pageId: h,
                                    viewerSessionId: g
                                },
                                browserUrlGetter: function() {
                                    return Object(n.get)(o, ["location", "url"])
                                },
                                reportTrace: N,
                                createRavenClient: M,
                                fedOpsLoggerFactory: F,
                                biLoggerFactory: L
                            });
                            var Z = Q.fes ? new c.a({
                                    httpClient: U.httpClient,
                                    getRequestParams: function() {
                                        return {
                                            instance: B,
                                            gridAppId: V
                                        }
                                    }
                                }) : new s.a({
                                    wixData: z || self.require("wix-data").default,
                                    wixDataSchemas: w(r, T) || _(X),
                                    wixDataCodeZone: w(r, R).wixDataCodeZone
                                }),
                                J = new l.a({
                                    warmupData: $
                                });
                            return O(r, E, new d.a({
                                appState: X,
                                dataFetcher: Z,
                                dataCache: J,
                                features: Q,
                                appLogger: w(r, R),
                                errorReporter: w(r, S),
                                wixSdk: o,
                                routerReturnedData: i,
                                shouldVerbose: w(r, C),
                                originalVerboseReporter: w(r, P),
                                automationsClientCreator: function() {
                                    return w(r, D).call(r, {
                                        httpClient: U.httpClient
                                    })
                                }
                            })), Promise.resolve()
                        } catch (e) {
                            return w(r, R).error(e), Promise.reject(e)
                        }
                    }), b(this, "createControllers", function(e) {
                        return w(r, R).traceSync(a.e.createControllers(), function() {
                            try {
                                return 0 === e.length ? [] : w(r, E).initializeDatasets({
                                    rawControllerConfigs: e
                                })
                            } catch (e) {
                                return w(r, R).error(e), []
                            }
                        })
                    }), g(this, E, {
                        writable: !0,
                        value: void 0
                    }), g(this, R, {
                        writable: !0,
                        value: void 0
                    }), g(this, T, {
                        writable: !0,
                        value: void 0
                    }), g(this, j, {
                        writable: !0,
                        value: void 0
                    }), g(this, S, {
                        writable: !0,
                        value: void 0
                    }), g(this, P, {
                        writable: !0,
                        value: void 0
                    }), g(this, C, {
                        writable: !0,
                        value: void 0
                    }), g(this, D, {
                        writable: !0,
                        value: void 0
                    }), O(this, R, L), O(this, T, i), O(this, j, V), O(this, S, I), O(this, P, k), O(this, C, M), O(this, D, W), {
                        initAppForPage: this.initAppForPage,
                        createControllers: this.createControllers
                    }
                },
                A = function(e, t) {
                    if (e.instance && e.appData) return {
                        instance: e.instance,
                        gridAppId: e.appData.gridAppId
                    };
                    var r = i()("?".concat(t.queryParameters), !0).query;
                    return {
                        instance: r.instance,
                        gridAppId: r.gridAppId
                    }
                },
                _ = function(e) {
                    var t = e.instance,
                        r = e.gridAppId,
                        n = e.baseUrl,
                        o = e.env.editor,
                        a = i()(n),
                        u = a.protocol,
                        c = a.hostname,
                        s = o ? void 0 : "".concat(u, "//").concat(c, "/_api/cloud-data/v1/schemas");
                    return Object(p.createDataSchemasClientForBrowser)(t, r, {
                        baseUrl: s
                    })
                }
        }).call(this, r(14))
    }, function(e, t, r) {
        "use strict";
        var n = r(0).isError,
            o = r(67),
            i = o.isAppInvolvedWithError,
            a = o.extendConsoleError,
            u = o.addUnhandledRejectionListener,
            c = o.shouldReportException;
        e.exports.registerToUnexpectedErrors = function(e) {
            var t = e.onError,
                r = e.appName,
                o = e.global,
                s = function(e) {
                    c(e, n, i(r)) && t(e)
                },
                l = a(o, function(e) {
                    return s(e)
                }),
                f = function(e) {
                    return s(e.reason)
                };
            return u(o, f),
                function() {
                    l(), o.removeEventListener("unhandledrejection", f)
                }
        }
    }, function(e, t, r) {
        "use strict";
        var n = function(e, t) {
            return function(r) {
                return function() {
                    try {
                        var n = r.apply(void 0, arguments);
                        return function(e) {
                            return e && "function" == typeof e.then
                        }(n) ? n.catch(function(r) {
                            t(r, e)
                        }) : n
                    } catch (r) {
                        t(r, e)
                    }
                }
            }
        };
        e.exports = function(e) {
            var t = e.scopes,
                r = e.errorHandler,
                o = {};
            return t.forEach(function(e) {
                o[e] = n(e, r)
            }), o
        }
    }, function(e, t, r) {
        "use strict";
        var n = r(0).identity,
            o = r(1).Result,
            i = r(73),
            a = r(13).isLocalhost,
            u = function(e) {
                return o.try(e).getOrElse("unknown")
            },
            c = function(e) {
                return o.try(e).fold(function(e) {
                    return e.message
                }, function(e) {
                    return e
                })
            };
        e.exports.configureForViewerWorker = function(e) {
            var t = e.Raven,
                r = e.globalScope,
                o = e.dsn,
                s = e.params,
                l = void 0 === s ? {} : s,
                f = e.appName;
            a() || (i({
                Raven: t,
                appName: f,
                browserUrlGetter: function() {
                    return u(function() {
                        return r["wix-location"].url
                    })
                },
                dsn: o,
                params: l
            }), t.setDataCallback(function(e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : n;
                return e.extra = Object.assign(e.extra || {}, function(e) {
                    return {
                        referrer: c(function() {
                            return e["wix-window"].referrer
                        }),
                        workerUrl: c(function() {
                            return e.location.href
                        })
                    }
                }(r)), e.tags = Object.assign(e.tags || {}, l.tags || {}, function(e) {
                    return {
                        renderMode: u(function() {
                            return e["wix-window"].rendering.env
                        }),
                        viewMode: u(function() {
                            return e["wix-window"].viewMode
                        }),
                        santaVersion: u(function() {
                            return function(e) {
                                var t = e.match(/santa\/([^/]*)/);
                                return t ? t[1] : "unknown"
                            }(e.location.href)
                        })
                    }
                }(r)), t(e)
            }))
        }
    }, function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function o(e) {
            function t() {
                e.apply(this, arguments)
            }
            return t.prototype = Object.create(e.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e, t
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = function(e) {
            function t() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
                ! function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }(this, t);
                var r = n(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                return Object.defineProperty(r, "message", {
                    configurable: !0,
                    enumerable: !1,
                    value: e,
                    writable: !0
                }), Object.defineProperty(r, "name", {
                    configurable: !0,
                    enumerable: !1,
                    value: r.constructor.name,
                    writable: !0
                }), Error.hasOwnProperty("captureStackTrace") ? (Error.captureStackTrace(r, r.constructor), n(r)) : (Object.defineProperty(r, "stack", {
                    configurable: !0,
                    enumerable: !1,
                    value: new Error(e).stack,
                    writable: !0
                }), r)
            }
            return function(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }(t, o(Error)), t
        }();
        t.default = i, e.exports = t.default
    }, function(e, t, r) {
        "use strict";
        r.d(t, "a", function() {
            return g
        });
        var n = r(12),
            o = ["items"];

        function i(e, t) {
            if (null == e) return {};
            var r, n, o = function(e, t) {
                if (null == e) return {};
                var r, n, o = {},
                    i = Object.keys(e);
                for (n = 0; n < i.length; n++) r = i[n], t.indexOf(r) >= 0 || (o[r] = e[r]);
                return o
            }(e, t);
            if (Object.getOwnPropertySymbols) {
                var i = Object.getOwnPropertySymbols(e);
                for (n = 0; n < i.length; n++) r = i[n], t.indexOf(r) >= 0 || Object.prototype.propertyIsEnumerable.call(e, r) && (o[r] = e[r])
            }
            return o
        }

        function a(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function u(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? a(Object(r), !0).forEach(function(t) {
                    c(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : a(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function c(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }

        function s(e, t) {
            return function(e) {
                if (Array.isArray(e)) return e
            }(e) || function(e, t) {
                var r = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                if (null == r) return;
                var n, o, i = [],
                    a = !0,
                    u = !1;
                try {
                    for (r = r.call(e); !(a = (n = r.next()).done) && (i.push(n.value), !t || i.length !== t); a = !0);
                } catch (e) {
                    u = !0, o = e
                } finally {
                    try {
                        a || null == r.return || r.return()
                    } finally {
                        if (u) throw o
                    }
                }
                return i
            }(e, t) || f(e, t) || function() {
                throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }

        function l(e) {
            return function(e) {
                if (Array.isArray(e)) return d(e)
            }(e) || function(e) {
                if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
            }(e) || f(e) || function() {
                throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }

        function f(e, t) {
            if (e) {
                if ("string" == typeof e) return d(e, t);
                var r = Object.prototype.toString.call(e).slice(8, -1);
                return "Object" === r && e.constructor && (r = e.constructor.name), "Map" === r || "Set" === r ? Array.from(e) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? d(e, t) : void 0
            }
        }

        function d(e, t) {
            (null == t || t > e.length) && (t = e.length);
            for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
            return n
        }

        function p(e, t, r, n, o, i, a) {
            try {
                var u = e[i](a),
                    c = u.value
            } catch (e) {
                return void r(e)
            }
            u.done ? t(c) : Promise.resolve(c).then(n, o)
        }

        function m(e) {
            return function() {
                var t = this,
                    r = arguments;
                return new Promise(function(n, o) {
                    var i = e.apply(t, r);

                    function a(e) {
                        p(i, n, o, a, u, "next", e)
                    }

                    function u(e) {
                        p(i, n, o, a, u, "throw", e)
                    }
                    a(void 0)
                })
            }
        }

        function h(e, t) {
            for (var r = 0; r < t.length; r++) {
                var n = t[r];
                n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
            }
        }

        function v(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var y = function e(t) {
                var r = t.message,
                    n = t.code;
                v(this, e);
                var o = new Error(r);
                return o.code = n, o
            },
            g = function() {
                function e(t) {
                    var r = t.getRequestParams,
                        n = t.httpClient;
                    v(this, e), this.getRequestParams = r, this.httpClient = n
                }
                return function(e, t, r) {
                    t && h(e.prototype, t), r && h(e, r)
                }(e, [{
                    key: "_makeRequestTo",
                    value: function() {
                        var e = m(regeneratorRuntime.mark(function e(t, r) {
                            var n, o, i, a;
                            return regeneratorRuntime.wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return n = this.getRequestParams(), o = n.instance, i = n.gridAppId, e.next = 3, this.httpClient.post("/_serverless/data-binding-server/".concat(t), r, {
                                            params: {
                                                gridAppId: i
                                            },
                                            headers: {
                                                Authorization: o,
                                                "Content-Type": "application/json"
                                            }
                                        });
                                    case 3:
                                        return a = e.sent, e.abrupt("return", a.data);
                                    case 5:
                                    case "end":
                                        return e.stop()
                                }
                            }, e, this)
                        }));
                        return function(t, r) {
                            return e.apply(this, arguments)
                        }
                    }()
                }, {
                    key: "fetchBulkData",
                    value: function() {
                        var e = m(regeneratorRuntime.mark(function e(t) {
                            var r, o, i;
                            return regeneratorRuntime.wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return e.next = 2, this._makeRequestTo("fetch-initial-data", t);
                                    case 2:
                                        return r = e.sent, o = r.recordsByCollection, i = r.recordsInfoByDataset, e.abrupt("return", {
                                            recordsInfoByDataset: i.reduce(function(e, t) {
                                                var r = t.itemIds,
                                                    n = void 0 === r ? [] : r,
                                                    o = t.totalCount,
                                                    i = void 0 === o ? 0 : o,
                                                    a = t.error;
                                                return [].concat(l(e), [{
                                                    itemIds: n,
                                                    totalCount: i,
                                                    error: a ? new y(a) : void 0
                                                }])
                                            }, []),
                                            recordsByCollection: Object.entries(o).reduce(function(e, t) {
                                                var r = s(t, 2),
                                                    o = r[0],
                                                    i = r[1];
                                                return u(u({}, e), {}, c({}, o, Object.entries(i).reduce(function(e, t) {
                                                    var r = s(t, 2),
                                                        o = r[0],
                                                        i = r[1];
                                                    return u(u({}, e), {}, c({}, o, Object(n.convertFromCustomFormat)(i)))
                                                }, {})))
                                            }, {})
                                        });
                                    case 6:
                                    case "end":
                                        return e.stop()
                                }
                            }, e, this)
                        }));
                        return function(t) {
                            return e.apply(this, arguments)
                        }
                    }()
                }, {
                    key: "fetchData",
                    value: function() {
                        var e = m(regeneratorRuntime.mark(function e(t) {
                            var r, a, c;
                            return regeneratorRuntime.wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return e.next = 2, this._makeRequestTo("fetch-data", t);
                                    case 2:
                                        return r = e.sent, a = r.items, c = i(r, o), e.abrupt("return", u(u({}, c), {}, {
                                            items: a.map(function(e) {
                                                return Object(n.convertFromCustomFormat)(e)
                                            })
                                        }));
                                    case 6:
                                    case "end":
                                        return e.stop()
                                }
                            }, e, this)
                        }));
                        return function(t) {
                            return e.apply(this, arguments)
                        }
                    }()
                }, {
                    key: "remove",
                    value: function() {
                        var e = m(regeneratorRuntime.mark(function e(t) {
                            return regeneratorRuntime.wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return e.abrupt("return", this._makeRequestTo("remove", t));
                                    case 1:
                                    case "end":
                                        return e.stop()
                                }
                            }, e, this)
                        }));
                        return function(t) {
                            return e.apply(this, arguments)
                        }
                    }()
                }, {
                    key: "save",
                    value: function() {
                        var e = m(regeneratorRuntime.mark(function e(t) {
                            var r, o;
                            return regeneratorRuntime.wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return e.next = 2, this._makeRequestTo("save", t);
                                    case 2:
                                        return r = e.sent, o = r.item, e.abrupt("return", Object(n.convertFromCustomFormat)(o));
                                    case 5:
                                    case "end":
                                        return e.stop()
                                }
                            }, e, this)
                        }));
                        return function(t) {
                            return e.apply(this, arguments)
                        }
                    }()
                }]), e
            }()
    }, function(e, t, r) {
        "use strict";
        r.d(t, "a", function() {
            return S
        });
        var n = r(0),
            o = r(7);

        function i(e) {
            return function(e) {
                if (Array.isArray(e)) return c(e)
            }(e) || function(e) {
                if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
            }(e) || u(e) || function() {
                throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }

        function a(e, t) {
            return function(e) {
                if (Array.isArray(e)) return e
            }(e) || function(e, t) {
                var r = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                if (null == r) return;
                var n, o, i = [],
                    a = !0,
                    u = !1;
                try {
                    for (r = r.call(e); !(a = (n = r.next()).done) && (i.push(n.value), !t || i.length !== t); a = !0);
                } catch (e) {
                    u = !0, o = e
                } finally {
                    try {
                        a || null == r.return || r.return()
                    } finally {
                        if (u) throw o
                    }
                }
                return i
            }(e, t) || u(e, t) || function() {
                throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }

        function u(e, t) {
            if (e) {
                if ("string" == typeof e) return c(e, t);
                var r = Object.prototype.toString.call(e).slice(8, -1);
                return "Object" === r && e.constructor && (r = e.constructor.name), "Map" === r || "Set" === r ? Array.from(e) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? c(e, t) : void 0
            }
        }

        function c(e, t) {
            (null == t || t > e.length) && (t = e.length);
            for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
            return n
        }

        function s(e, t, r, n, o, i, a) {
            try {
                var u = e[i](a),
                    c = u.value
            } catch (e) {
                return void r(e)
            }
            u.done ? t(c) : Promise.resolve(c).then(n, o)
        }

        function l(e) {
            return function() {
                var t = this,
                    r = arguments;
                return new Promise(function(n, o) {
                    var i = e.apply(t, r);

                    function a(e) {
                        s(i, n, o, a, u, "next", e)
                    }

                    function u(e) {
                        s(i, n, o, a, u, "throw", e)
                    }
                    a(void 0)
                })
            }
        }

        function f(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function d(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? f(Object(r), !0).forEach(function(t) {
                    p(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : f(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function p(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }

        function m(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function h(e, t) {
            for (var r = 0; r < t.length; r++) {
                var n = t[r];
                n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
            }
        }

        function v(e, t) {
            g(e, t), t.add(e)
        }

        function y(e, t, r) {
            g(e, t), t.set(e, r)
        }

        function g(e, t) {
            if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object")
        }

        function b(e, t) {
            return function(e, t) {
                if (t.get) return t.get.call(e);
                return t.value
            }(e, I(e, t, "get"))
        }

        function w(e, t, r) {
            if (!t.has(e)) throw new TypeError("attempted to get private field on non-instance");
            return r
        }

        function O(e, t, r) {
            return function(e, t, r) {
                if (t.set) t.set.call(e, r);
                else {
                    if (!t.writable) throw new TypeError("attempted to set read only private field");
                    t.value = r
                }
            }(e, I(e, t, "set"), r), r
        }

        function I(e, t, r) {
            if (!t.has(e)) throw new TypeError("attempted to " + r + " private field on non-instance");
            return t.get(e)
        }
        var E = new WeakMap,
            R = new WeakMap,
            T = new WeakSet,
            j = new WeakSet,
            S = function() {
                function e(t) {
                    var r = t.wixData,
                        n = t.wixDataSchemas,
                        o = t.wixDataCodeZone;
                    m(this, e), v(this, j), v(this, T), y(this, E, {
                        writable: !0,
                        value: void 0
                    }), y(this, R, {
                        writable: !0,
                        value: void 0
                    }), O(this, E, x.reduce(function(e, t) {
                        return e[t] = o(function() {
                            var e = r[t].apply(r, arguments);
                            return e.catch instanceof Function ? e.catch(function(e) {
                                throw "string" == typeof e ? e : new L(e)
                            }) : e
                        }), e
                    }, d({}, r))), O(this, R, A.reduce(function(e, t) {
                        return e[t] = o(function() {
                            return n[t].apply(n, arguments)
                        }), e
                    }, d({}, n)))
                }
                return function(e, t, r) {
                    t && h(e.prototype, t), r && h(e, r)
                }(e, [{
                    key: "fetchBulkData",
                    value: function() {
                        var e = l(regeneratorRuntime.mark(function e(t) {
                            var r, n = this;
                            return regeneratorRuntime.wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return e.next = 2, Promise.all(t.map(function(e) {
                                            var t = e.collectionId,
                                                r = e.filter,
                                                o = e.sort,
                                                i = e.offset,
                                                a = e.length,
                                                u = e.includes,
                                                c = e.uniqueFieldValues;
                                            return n.fetchData({
                                                collectionId: t,
                                                filter: r,
                                                sort: o,
                                                offset: i,
                                                length: a,
                                                includes: u,
                                                uniqueFieldValues: c
                                            }).catch(function(e) {
                                                return {
                                                    error: e
                                                }
                                            })
                                        }));
                                    case 2:
                                        return r = e.sent, e.abrupt("return", w(this, T, P).call(this, t, r));
                                    case 4:
                                    case "end":
                                        return e.stop()
                                }
                            }, e, this)
                        }));
                        return function(t) {
                            return e.apply(this, arguments)
                        }
                    }()
                }, {
                    key: "fetchData",
                    value: function() {
                        var e = l(regeneratorRuntime.mark(function e(t) {
                            var r, n, o, i, u, c, s, l, f, p, m;
                            return regeneratorRuntime.wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return r = t.collectionId, n = t.filter, o = t.sort, i = t.offset, u = t.length, c = t.includes, s = t.uniqueFieldValues, e.next = 3, Promise.all([b(this, E).find(r, n, o, i, u, void 0, c), s ? w(this, j, C).call(this, {
                                            collectionId: r,
                                            fieldKeys: s
                                        }) : {}]);
                                    case 3:
                                        return l = e.sent, f = a(l, 2), p = f[0], m = f[1], e.abrupt("return", d(d({}, p), {}, {
                                            uniqueFieldValues: m
                                        }));
                                    case 8:
                                    case "end":
                                        return e.stop()
                                }
                            }, e, this)
                        }));
                        return function(t) {
                            return e.apply(this, arguments)
                        }
                    }()
                }, {
                    key: "remove",
                    value: function() {
                        var e = l(regeneratorRuntime.mark(function e(t) {
                            var r, n;
                            return regeneratorRuntime.wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return r = t.collectionId, n = t.recordId, e.abrupt("return", b(this, E).remove(r, n));
                                    case 2:
                                    case "end":
                                        return e.stop()
                                }
                            }, e, this)
                        }));
                        return function(t) {
                            return e.apply(this, arguments)
                        }
                    }()
                }, {
                    key: "save",
                    value: function() {
                        var e = l(regeneratorRuntime.mark(function e(t) {
                            var r, n, o;
                            return regeneratorRuntime.wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return r = t.collectionId, n = t.record, o = t.includeReferences, e.abrupt("return", b(this, E).save(r, n, {
                                            includeReferences: o
                                        }));
                                    case 2:
                                    case "end":
                                        return e.stop()
                                }
                            }, e, this)
                        }));
                        return function(t) {
                            return e.apply(this, arguments)
                        }
                    }()
                }, {
                    key: "getSibling",
                    value: function() {
                        var e = l(regeneratorRuntime.mark(function e(t) {
                            var r, n, o, i, u, c, s, l, f, d;
                            return regeneratorRuntime.wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return r = t.collectionName, n = t.filter, o = t.sort, i = t.fieldValues, u = t.sortFields, c = t.directionTowardSibling, s = b(this, E).query(r).setFilterModel(n), e.next = 4, _({
                                            sort: o,
                                            sortFields: u,
                                            fieldValues: i,
                                            baseQuery: s,
                                            directionTowardSibling: c
                                        }).find();
                                    case 4:
                                        return l = e.sent, f = a(l.items, 1), d = f[0], e.abrupt("return", d);
                                    case 8:
                                    case "end":
                                        return e.stop()
                                }
                            }, e, this)
                        }));
                        return function(t) {
                            return e.apply(this, arguments)
                        }
                    }()
                }, {
                    key: "fetchSchemas",
                    value: function(e) {
                        return b(this, R).bulkGet(e, {
                            referencedCollectionsDepth: 1
                        })
                    }
                }, {
                    key: "createSimpleFilter",
                    value: function(e, t) {
                        return b(this, E).filter().eq(e, t).getFilterModel()
                    }
                }]), e
            }();

        function P(e, t) {
            return t.reduce(function(t, r, i) {
                var a = r.items,
                    u = r.totalCount,
                    c = r.uniqueFieldValues,
                    s = r.error;
                if (s) return t.recordsInfoByDataset.push({
                    error: s
                }), t;
                t.recordsInfoByDataset.push({
                    itemIds: a.map(function(e) {
                        return e._id
                    }),
                    totalCount: u
                });
                var l = e[i].collectionId;
                return t.recordsByCollection[l] = a.reduce(function(e, t) {
                    var r = e[t._id];
                    return e[t._id] = Object(n.mergeWith)(r, t, o.f), e
                }, t.recordsByCollection[l] || {}), t.uniqueFieldValuesByCollection[l] = d(d({}, t.uniqueFieldValuesByCollection[l]), c), t
            }, {
                recordsInfoByDataset: [],
                recordsByCollection: {},
                uniqueFieldValuesByCollection: {}
            })
        }

        function C(e) {
            return D.apply(this, arguments)
        }

        function D() {
            return (D = l(regeneratorRuntime.mark(function e(t) {
                var r, n, o, i = this;
                return regeneratorRuntime.wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                        case 0:
                            return r = t.collectionId, n = t.fieldKeys, e.next = 3, Promise.all(n.map(function(e) {
                                return b(i, E).query(r).distinct(e)
                            }));
                        case 3:
                            return o = e.sent, e.abrupt("return", o.reduce(function(e, t, r) {
                                var o = t._items;
                                return e[n[r]] = o, e
                            }, {}));
                        case 5:
                        case "end":
                            return e.stop()
                    }
                }, e)
            }))).apply(this, arguments)
        }
        var x = ["save", "remove", "find", "filter", "query"],
            A = ["list", "bulkGet"],
            _ = function(e) {
                var t = e.sort,
                    r = e.sortFields,
                    n = e.directionTowardSibling,
                    o = e.fieldValues,
                    i = e.baseQuery;
                return k({
                    sort: t,
                    sortFields: r,
                    directionTowardSibling: n,
                    fieldValues: o,
                    baseQuery: i
                })(r.length - 1).reduce(function(e, t) {
                    return e.or(t)
                })
            },
            k = function(e) {
                var t = e.baseQuery,
                    r = e.sortFields,
                    o = e.sort,
                    a = e.directionTowardSibling,
                    u = e.fieldValues;
                return function e(c) {
                    if (-1 === c) return [];
                    var s = r[c];
                    return [Object(n.flow)(N(o, a), M(o[s], a, s, u[s]), F(c, r, u))(t)].concat(i(e(c - 1)))
                }
            },
            N = function(e, t) {
                return function(r) {
                    return Object.entries(e).reduce(function(e, r) {
                        var n = a(r, 2),
                            o = n[0];
                        return n[1] === t ? e.ascending(o) : e.descending(o)
                    }, r)
                }
            },
            M = function(e, t, r, n) {
                return function(o) {
                    return e === t ? o.gt(r, n) : o.lt(r, n)
                }
            },
            F = function(e, t, r) {
                return function(o) {
                    return Object(n.range)(e).reduce(function(e, n) {
                        return e.eq(t[n], r[t[n]])
                    }, o).limit(1)
                }
            },
            L = function e(t) {
                if (m(this, e), !t.stack) {
                    var r = t.message,
                        n = t.code,
                        o = new Error(r);
                    return o.code = n, o
                }
                return t
            }
    }, function(e, t, r) {
        "use strict";

        function n(e, t) {
            for (var r = 0; r < t.length; r++) {
                var n = t[r];
                n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
            }
        }

        function o(e, t, r) {
            ! function(e, t) {
                if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object")
            }(e, t), t.set(e, r)
        }

        function i(e, t) {
            return function(e, t) {
                if (t.get) return t.get.call(e);
                return t.value
            }(e, u(e, t, "get"))
        }

        function a(e, t, r) {
            return function(e, t, r) {
                if (t.set) t.set.call(e, r);
                else {
                    if (!t.writable) throw new TypeError("attempted to set read only private field");
                    t.value = r
                }
            }(e, u(e, t, "set"), r), r
        }

        function u(e, t, r) {
            if (!t.has(e)) throw new TypeError("attempted to " + r + " private field on non-instance");
            return t.get(e)
        }
        r.d(t, "a", function() {
            return s
        });
        var c = new WeakMap,
            s = function() {
                function e(t) {
                    var r = t.warmupData;
                    ! function(e, t) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    }(this, e), o(this, c, {
                        writable: !0,
                        value: void 0
                    }), a(this, c, r)
                }
                return function(e, t, r) {
                    t && n(e.prototype, t), r && n(e, r)
                }(e, [{
                    key: "get",
                    value: function(e) {
                        return i(this, c).get(e)
                    }
                }, {
                    key: "set",
                    value: function(e, t) {
                        i(this, c).set(e, t)
                    }
                }]), e
            }()
    }, function(e, t, r) {
        "use strict";
        r.d(t, "a", function() {
            return n
        });
        var n = function e(t) {
            var r = t.experiments,
                n = t.appState.env;
            return function(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, e), {
                get fes() {
                    return r.enabled("specs.wixDataViewer.EnableFES")
                },
                get warmupData() {
                    return r.enabled("specs.wixDataViewer.UseWarmupData") && n.live
                },
                get dropdownOptionsDistinct() {
                    return r.enabled("specs.wixDataViewer.DropdownDistinctOptions")
                },
                get dropdownOptionsUnique() {
                    return r.enabled("specs.wixDataViewer.DropdownUniqueOptions") || n.editor
                }
            }
        }
    }, function(e, t) {
        e.exports.SCOPE_TYPES = {
            COMPONENT: "COMPONENT_SCOPE",
            GLOBAL: "GLOBAL_SCOPE"
        }
    }, function(e, t, r) {
        "use strict";

        function n(e) {
            var t, r = e.Symbol;
            return "function" == typeof r ? r.observable ? t = r.observable : (t = r("observable"), r.observable = t) : t = "@@observable", t
        }
        r.d(t, "a", function() {
            return n
        })
    }, function(e, t, r) {
        "use strict";
        (function(e) {
            var r = "object" == typeof e && e && e.Object === Object && e;
            t.a = r
        }).call(this, r(14))
    }, function(e, t, r) {
        "use strict";
        e.exports = function(e, t) {
            return function() {
                var r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : e,
                    n = arguments.length > 1 ? arguments[1] : void 0,
                    o = t[n.type];
                return o ? o(r, n) : r
            }
        }
    }, function(e, t, r) {
        "use strict";
        var n = r(91);
        e.exports = {
            createMiddleware: n
        }
    }, function(e, t, r) {
        "use strict";
        e.exports.DATETIME = "datetime"
    }, function(e, t, r) {
        "use strict";
        var n = r(96);
        n.populateGlobalFeatureSupport(), e.exports.getScaleToFitImageURL = n.getScaleToFitImageURL, e.exports.getScaleToFillImageURL = n.getScaleToFillImageURL, e.exports.getCropImageURL = n.getCropImageURL
    }, function(e, t, r) {
        "use strict";
        var n;

        function o(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function i(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? o(Object(r), !0).forEach(function(t) {
                    a(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : o(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function a(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }
        var u = {
                SHORT_DATE: "SHORT_DATE",
                MEDIUM_DATE: "MEDIUM_DATE",
                LONG_DATE: "LONG_DATE",
                FULL_DATE: "FULL_DATE",
                SHORT_DATE_TIME: "SHORT_DATE_TIME",
                LONG_DATE_TIME: "LONG_DATE_TIME",
                FULL_DATE_TIME: "FULL_DATE_TIME",
                MEDIUM_TIME_12: "MEDIUM_TIME_12",
                MEDIUM_TIME_24: "MEDIUM_TIME_24",
                LONG_TIME_12: "LONG_TIME_12",
                LONG_TIME_24: "LONG_TIME_24",
                HOUR_ONLY: "HOUR_ONLY",
                MINUTE_ONLY: "MINUTE_ONLY",
                YEAR_ONLY: "YEAR_ONLY",
                MONTH_ONLY: "MONTH_ONLY",
                SHORT_MONTH_ONLY: "SHORT_MONTH_ONLY",
                DAY_ONLY: "DAY_ONLY"
            },
            c = (a(n = {}, u.SHORT_DATE, {
                day: "numeric",
                month: "numeric",
                year: "2-digit"
            }), a(n, u.MEDIUM_DATE, {
                day: "numeric",
                month: "short",
                year: "numeric"
            }), a(n, u.LONG_DATE, {
                day: "numeric",
                month: "long",
                year: "numeric"
            }), a(n, u.FULL_DATE, {
                day: "numeric",
                month: "long",
                year: "numeric",
                weekday: "long"
            }), a(n, u.SHORT_DATE_TIME, {
                day: "numeric",
                month: "numeric",
                year: "2-digit",
                hour: "numeric",
                minute: "numeric"
            }), a(n, u.LONG_DATE_TIME, {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric"
            }), a(n, u.FULL_DATE_TIME, {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                weekday: "long",
                timeZoneName: "short"
            }), a(n, u.MEDIUM_TIME_12, {
                minute: "numeric",
                hour: "numeric"
            }), a(n, u.MEDIUM_TIME_24, {
                minute: "numeric",
                hour: "numeric",
                hour12: !1
            }), a(n, u.LONG_TIME_12, {
                minute: "numeric",
                hour: "numeric",
                second: "numeric"
            }), a(n, u.LONG_TIME_24, {
                minute: "numeric",
                hour: "numeric",
                second: "numeric",
                hour12: !1
            }), a(n, u.HOUR_ONLY, {
                hour: "numeric"
            }), a(n, u.MINUTE_ONLY, {
                minute: "numeric"
            }), a(n, u.YEAR_ONLY, {
                year: "numeric"
            }), a(n, u.MONTH_ONLY, {
                month: "long"
            }), a(n, u.SHORT_MONTH_ONLY, {
                month: "short"
            }), a(n, u.DAY_ONLY, {
                weekday: "long"
            }), n);
        e.exports = function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                t = e.locale,
                r = e.timeZone;
            if (!t) throw new Error('A "locale" parameter is required for wixFormatting');
            return {
                formatDateTime: function(e, n) {
                    var o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
                        a = o.locale,
                        u = o.timeZone,
                        s = i(i({}, c[n]), {}, {
                            timeZone: u || r
                        });
                    return new Intl.DateTimeFormat(a || t, s).format(e)
                },
                dateFormats: u
            }
        }, e.exports.dateFormats = u
    }, function(e, t, r) {
        e.exports = r(105)
    }, function(e, t) {
        var r = Object.prototype.hasOwnProperty;

        function n(e) {
            return "[Throws: " + (e ? e.message : "?") + "]"
        }

        function o(e) {
            var t = [];
            return function e(o) {
                if (null === o || "object" != typeof o) return o;
                if (-1 !== t.indexOf(o)) return "[Circular]";
                if (t.push(o), "function" == typeof o.toJSON) try {
                    var i = e(o.toJSON());
                    return t.pop(), i
                } catch (e) {
                    return n(e)
                }
                if (Array.isArray(o)) {
                    var a = o.map(e);
                    return t.pop(), a
                }
                var u = Object.keys(o).reduce(function(t, i) {
                    return t[i] = e(function(e, t) {
                        if (r.call(e, t)) try {
                            return e[t]
                        } catch (e) {
                            return n(e)
                        }
                        return e[t]
                    }(o, i)), t
                }, {});
                return t.pop(), u
            }(e)
        }
        e.exports = function(e, t, r) {
            return JSON.stringify(o(e), t, r)
        }, e.exports.ensureProperties = o
    }, function(e, t, r) {
        "use strict";
        r.d(t, "a", function() {
            return n
        });
        var n = "dbsm-viewer-app"
    }, function(e, t, r) {
        "use strict";
        var n = {};
        r.r(n), r.d(n, "collectionName", function() {
            return Oe
        }), r.d(n, "readWriteType", function() {
            return Ie
        }), r.d(n, "filter", function() {
            return Ee
        }), r.d(n, "sort", function() {
            return Re
        }), r.d(n, "includes", function() {
            return Te
        }), r.d(n, "pageSize", function() {
            return je
        }), r.d(n, "deferred", function() {
            return Se
        });
        var o = r(0);

        function i(e, t) {
            return function(e) {
                if (Array.isArray(e)) return e
            }(e) || function(e, t) {
                var r = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                if (null == r) return;
                var n, o, i = [],
                    a = !0,
                    u = !1;
                try {
                    for (r = r.call(e); !(a = (n = r.next()).done) && (i.push(n.value), !t || i.length !== t); a = !0);
                } catch (e) {
                    u = !0, o = e
                } finally {
                    try {
                        a || null == r.return || r.return()
                    } finally {
                        if (u) throw o
                    }
                }
                return i
            }(e, t) || function(e, t) {
                if (!e) return;
                if ("string" == typeof e) return a(e, t);
                var r = Object.prototype.toString.call(e).slice(8, -1);
                "Object" === r && e.constructor && (r = e.constructor.name);
                if ("Map" === r || "Set" === r) return Array.from(e);
                if ("Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return a(e, t)
            }(e, t) || function() {
                throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }

        function a(e, t) {
            (null == t || t > e.length) && (t = e.length);
            for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
            return n
        }

        function u(e, t) {
            for (var r = 0; r < t.length; r++) {
                var n = t[r];
                n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
            }
        }

        function c(e, t, r) {
            ! function(e, t) {
                if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object")
            }(e, t), t.set(e, r)
        }

        function s(e, t) {
            return function(e, t) {
                if (t.get) return t.get.call(e);
                return t.value
            }(e, function(e, t, r) {
                if (!t.has(e)) throw new TypeError("attempted to " + r + " private field on non-instance");
                return t.get(e)
            }(e, t, "get"))
        }
        var l = new WeakMap,
            f = new(function() {
                function e() {
                    ! function(e, t) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    }(this, e), c(this, l, {
                        writable: !0,
                        value: new Proxy({}, {
                            get: function(e, t) {
                                if (e[t]) return e[t];
                                throw new ReferenceError("There is no ".concat(t, " in context. Check if the context has been already set"))
                            }
                        })
                    })
                }
                return function(e, t, r) {
                    t && u(e.prototype, t), r && u(e, r)
                }(e, [{
                    key: "set",
                    value: function(e) {
                        var t = this;
                        Object.entries(e).forEach(function(e) {
                            var r = i(e, 2),
                                n = r[0],
                                o = r[1];
                            return s(t, l)[n] = o
                        })
                    }
                }, {
                    key: "get",
                    value: function() {
                        return s(this, l)
                    }
                }]), e
            }()),
            d = f.get();
        var p = function e() {
                ! function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }(this, e);
                var t = {};
                return t.promise = new Promise(function(e, r) {
                    t.resolve = function() {
                        return e.apply(void 0, arguments), t.promise
                    }, t.reject = function() {
                        return r.apply(void 0, arguments), t.promise
                    }
                }), t
            },
            m = r(4),
            h = r(7),
            v = r(2);

        function y(e, t) {
            return function(e) {
                if (Array.isArray(e)) return e
            }(e) || function(e, t) {
                var r = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                if (null == r) return;
                var n, o, i = [],
                    a = !0,
                    u = !1;
                try {
                    for (r = r.call(e); !(a = (n = r.next()).done) && (i.push(n.value), !t || i.length !== t); a = !0);
                } catch (e) {
                    u = !0, o = e
                } finally {
                    try {
                        a || null == r.return || r.return()
                    } finally {
                        if (u) throw o
                    }
                }
                return i
            }(e, t) || function(e, t) {
                if (!e) return;
                if ("string" == typeof e) return g(e, t);
                var r = Object.prototype.toString.call(e).slice(8, -1);
                "Object" === r && e.constructor && (r = e.constructor.name);
                if ("Map" === r || "Set" === r) return Array.from(e);
                if ("Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return g(e, t)
            }(e, t) || function() {
                throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }

        function g(e, t) {
            (null == t || t > e.length) && (t = e.length);
            for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
            return n
        }

        function b(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function w(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? b(Object(r), !0).forEach(function(t) {
                    O(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : b(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function O(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }

        function I(e, t) {
            for (var r = 0; r < t.length; r++) {
                var n = t[r];
                n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
            }
        }

        function E(e, t, r) {
            ! function(e, t) {
                if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object")
            }(e, t), t.set(e, r)
        }

        function R(e, t, r) {
            return function(e, t, r) {
                if (t.set) t.set.call(e, r);
                else {
                    if (!t.writable) throw new TypeError("attempted to set read only private field");
                    t.value = r
                }
            }(e, j(e, t, "set"), r), r
        }

        function T(e, t) {
            return function(e, t) {
                if (t.get) return t.get.call(e);
                return t.value
            }(e, j(e, t, "get"))
        }

        function j(e, t, r) {
            if (!t.has(e)) throw new TypeError("attempted to " + r + " private field on non-instance");
            return t.get(e)
        }
        var S = new WeakMap,
            P = new WeakMap,
            C = new WeakMap,
            D = new WeakMap,
            x = function() {
                function e() {
                    ! function(e, t) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    }(this, e), E(this, S, {
                        writable: !0,
                        value: {}
                    }), E(this, P, {
                        writable: !0,
                        value: {}
                    }), E(this, C, {
                        writable: !0,
                        value: {}
                    }), E(this, D, {
                        writable: !0,
                        value: {}
                    })
                }
                return function(e, t, r) {
                    t && I(e.prototype, t), r && I(e, r)
                }(e, [{
                    key: "getData",
                    value: function(e) {
                        var t = this,
                            r = e.datasetId,
                            n = e.collectionId,
                            o = e.includes,
                            i = T(this, S)[r];
                        return i ? {
                            totalCount: i.totalCount,
                            items: i.itemIds.map(function(e) {
                                return A(T(t, P)[n][e], t.getSchema(n), o)
                            })
                        } : null
                    }
                }, {
                    key: "getRecord",
                    value: function(e) {
                        var t = e.collectionId,
                            r = e.recordId,
                            n = e.includes;
                        return Object(o.get)(T(this, P), [t, r], null) ? A(T(this, P)[t][r], this.getSchema(t), n) : N()
                    }
                }, {
                    key: "updateCollectionData",
                    value: function(e) {
                        var t = e.collectionId,
                            r = e.data,
                            n = T(this, P)[t],
                            o = T(this, C)[t],
                            i = r.items,
                            a = r.uniqueFieldValues;
                        T(this, P)[t] = _(i, n), T(this, C)[t] = k(a, o)
                    }
                }, {
                    key: "getSchema",
                    value: function(e) {
                        return T(this, D)[e]
                    }
                }, {
                    key: "updateStore",
                    value: function(e) {
                        var t = e.recordsByCollection,
                            r = void 0 === t ? {} : t,
                            n = e.recordsInfoByDataset,
                            o = void 0 === n ? {} : n,
                            i = e.uniqueFieldValuesByCollection,
                            a = void 0 === i ? {} : i;
                        R(this, S, w(w({}, T(this, S)), o));
                        for (var u = 0, c = Object.entries(r); u < c.length; u++) {
                            var s = y(c[u], 2),
                                l = s[0],
                                f = s[1];
                            T(this, P)[l] = w(w({}, T(this, P)[l]), f)
                        }
                        for (var d = 0, p = Object.entries(a); d < p.length; d++) {
                            var m = y(p[d], 2),
                                h = m[0],
                                v = m[1];
                            T(this, C)[h] = w(w({}, T(this, C)[h]), v)
                        }
                    }
                }, {
                    key: "getStore",
                    value: function() {
                        return {
                            recordsInfoByDataset: T(this, S),
                            recordsByCollection: T(this, P),
                            uniqueFieldValuesByCollection: T(this, C)
                        }
                    }
                }, {
                    key: "hasDataset",
                    value: function(e) {
                        return Boolean(T(this, S)[e])
                    }
                }, {
                    key: "setUniqueFieldValues",
                    value: function(e) {
                        var t = e.collectionId,
                            r = e.fieldKey,
                            n = e.data;
                        T(this, C)[t] = w(w({}, T(this, C)[t]), {}, O({}, r, n))
                    }
                }, {
                    key: "getUniqueFieldValues",
                    value: function(e) {
                        var t, r = e.collectionId,
                            n = e.fieldKey;
                        return null === (t = T(this, C)[r]) || void 0 === t ? void 0 : t[n]
                    }
                }, {
                    key: "updateSchemas",
                    value: function(e) {
                        for (var t = 0, r = Object.entries(e); t < r.length; t++) {
                            var n = y(r[t], 2),
                                o = n[0],
                                i = n[1];
                            T(this, D)[o] = w(w({}, T(this, D)[o]), i)
                        }
                    }
                }, {
                    key: "getSchemas",
                    value: function() {
                        return T(this, D)
                    }
                }]), e
            }(),
            A = function(e, t, r) {
                return Object.entries(e).reduce(function(e, n) {
                    var o = y(n, 2),
                        i = o[0],
                        a = o[1];
                    return function(e, t) {
                        var r, n;
                        return (null === t || void 0 === t ? void 0 : null === (r = t.fields) || void 0 === r ? void 0 : null === (n = r[e]) || void 0 === n ? void 0 : n.type) === v.FieldType.reference
                    }(i, t) && function(e, t) {
                        return !e || !e.includes(t)
                    }(r, i) && Boolean(null === a || void 0 === a ? void 0 : a._id) ? e[i] = a._id : e[i] = a, e
                }, {})
            },
            _ = function(e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                return e.reduce(function(e, t) {
                    var r = e[t._id];
                    return e[t._id] = r ? Object(o.mergeWith)(r, t, h.f) : t, e
                }, t)
            },
            k = function() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                return w(w({}, arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}), e)
            },
            N = function() {
                return {
                    totalCount: 0,
                    items: []
                }
            };

        function M(e, t, r, n, o, i, a) {
            try {
                var u = e[i](a),
                    c = u.value
            } catch (e) {
                return void r(e)
            }
            u.done ? t(c) : Promise.resolve(c).then(n, o)
        }

        function F(e) {
            return function() {
                var t = this,
                    r = arguments;
                return new Promise(function(n, o) {
                    var i = e.apply(t, r);

                    function a(e) {
                        M(i, n, o, a, u, "next", e)
                    }

                    function u(e) {
                        M(i, n, o, a, u, "throw", e)
                    }
                    a(void 0)
                })
            }
        }

        function L(e, t) {
            return function(e) {
                if (Array.isArray(e)) return e
            }(e) || function(e, t) {
                var r = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                if (null == r) return;
                var n, o, i = [],
                    a = !0,
                    u = !1;
                try {
                    for (r = r.call(e); !(a = (n = r.next()).done) && (i.push(n.value), !t || i.length !== t); a = !0);
                } catch (e) {
                    u = !0, o = e
                } finally {
                    try {
                        a || null == r.return || r.return()
                    } finally {
                        if (u) throw o
                    }
                }
                return i
            }(e, t) || function(e, t) {
                if (!e) return;
                if ("string" == typeof e) return U(e, t);
                var r = Object.prototype.toString.call(e).slice(8, -1);
                "Object" === r && e.constructor && (r = e.constructor.name);
                if ("Map" === r || "Set" === r) return Array.from(e);
                if ("Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return U(e, t)
            }(e, t) || function() {
                throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }

        function U(e, t) {
            (null == t || t > e.length) && (t = e.length);
            for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
            return n
        }

        function W(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function B(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? W(Object(r), !0).forEach(function(t) {
                    V(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : W(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function V(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }

        function G(e, t) {
            for (var r = 0; r < t.length; r++) {
                var n = t[r];
                n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
            }
        }

        function q(e, t) {
            $(e, t), t.add(e)
        }

        function H(e, t, r) {
            $(e, t), t.set(e, r)
        }

        function $(e, t) {
            if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object")
        }

        function Y(e, t, r) {
            if (!t.has(e)) throw new TypeError("attempted to get private field on non-instance");
            return r
        }

        function z(e, t) {
            return function(e, t) {
                if (t.get) return t.get.call(e);
                return t.value
            }(e, Q(e, t, "get"))
        }

        function X(e, t, r) {
            return function(e, t, r) {
                if (t.set) t.set.call(e, r);
                else {
                    if (!t.writable) throw new TypeError("attempted to set read only private field");
                    t.value = r
                }
            }(e, Q(e, t, "set"), r), r
        }

        function Q(e, t, r) {
            if (!t.has(e)) throw new TypeError("attempted to " + r + " private field on non-instance");
            return t.get(e)
        }
        var Z = new WeakMap,
            J = new WeakMap,
            K = new WeakMap,
            ee = new WeakMap,
            te = new WeakMap,
            re = new WeakSet,
            ne = new WeakSet;

        function oe(e) {
            return ie.apply(this, arguments)
        }

        function ie() {
            return (ie = F(regeneratorRuntime.mark(function e(t) {
                var r, n, o, i, a, u = this;
                return regeneratorRuntime.wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                        case 0:
                            return e.next = 2, this.appLogger.traceAsync(m.e.fetchPrimaryInitialData(), function() {
                                return z(u, Z).fetchBulkData(t)
                            });
                        case 2:
                            return r = e.sent, n = r.recordsByCollection, o = r.recordsInfoByDataset, i = r.uniqueFieldValuesByCollection, a = o.reduce(function(e, r, n) {
                                var o = r.itemIds,
                                    i = void 0 === o ? [] : o,
                                    a = r.totalCount,
                                    c = void 0 === a ? 0 : a,
                                    s = r.error,
                                    l = t[n].datasetId;
                                return s && u.errorReporter("Failed to load data for dataset ".concat(l), s), e[l] = {
                                    itemIds: i,
                                    totalCount: c
                                }, e
                            }, {}), e.abrupt("return", {
                                recordsByCollection: n,
                                recordsInfoByDataset: a,
                                uniqueFieldValuesByCollection: i
                            });
                        case 8:
                        case "end":
                            return e.stop()
                    }
                }, e, this)
            }))).apply(this, arguments)
        }

        function ae(e) {
            return ue.apply(this, arguments)
        }

        function ue() {
            return (ue = F(regeneratorRuntime.mark(function e(t) {
                var r, n;
                return regeneratorRuntime.wrap(function(e) {
                    for (;;) switch (e.prev = e.next) {
                        case 0:
                            if (!t.length) {
                                e.next = 10;
                                break
                            }
                            return e.next = 3, Promise.all(t);
                        case 3:
                            return r = e.sent, e.next = 6, Y(this, re, oe).call(this, r);
                        case 6:
                            return n = e.sent, e.next = 9, z(this, te);
                        case 9:
                            z(this, J).updateStore(n);
                        case 10:
                        case "end":
                            return e.stop()
                    }
                }, e, this)
            }))).apply(this, arguments)
        }
        var ce = function() {
                function e(t) {
                    var r = t.appLogger,
                        n = t.errorReporter;
                    ! function(e, t) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    }(this, e), q(this, ne), q(this, re), H(this, Z, {
                        writable: !0,
                        value: void 0
                    }), H(this, J, {
                        writable: !0,
                        value: void 0
                    }), H(this, K, {
                        writable: !0,
                        value: void 0
                    }), H(this, ee, {
                        writable: !0,
                        value: void 0
                    }), H(this, te, {
                        writable: !0,
                        value: void 0
                    });
                    var o = d.dataFetcher;
                    X(this, Z, o), X(this, J, new x), X(this, K, {}), X(this, ee, Promise.resolve()), this.errorReporter = n, this.appLogger = r
                }
                return function(e, t, r) {
                    t && G(e.prototype, t), r && G(e, r)
                }(e, [{
                    key: "createBulkRequest",
                    value: function(e) {
                        var t = this;
                        X(this, K, e.reduce(function(e, r) {
                            var n = r.id;
                            return r.refresh || !z(t, J).hasDataset(n) ? B(B({}, e), {}, V({}, n, new p)) : e
                        }, {}));
                        var r = Object.entries(z(this, K)).map(function(e) {
                            return L(e, 2)[1].promise
                        });
                        X(this, ee, Y(this, ne, ae).call(this, r).then(function() {
                            return X(t, K, {})
                        }))
                    }
                }, {
                    key: "getDataFromBulk",
                    value: function() {
                        var e = F(regeneratorRuntime.mark(function e(t) {
                            var r, n, o, i, a, u, c;
                            return regeneratorRuntime.wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        if (r = t.datasetId, n = t.collectionId, o = t.filter, i = t.sort, a = t.length, u = t.includes, c = t.uniqueFieldValues, !z(this, K)[r]) {
                                            e.next = 5;
                                            break
                                        }
                                        return z(this, K)[r].resolve({
                                            datasetId: r,
                                            collectionId: n,
                                            filter: o,
                                            sort: i,
                                            offset: 0,
                                            length: a,
                                            includes: u,
                                            uniqueFieldValues: c
                                        }), e.next = 5, z(this, ee);
                                    case 5:
                                        return e.abrupt("return", z(this, J).getData({
                                            datasetId: r,
                                            collectionId: n,
                                            includes: u
                                        }) || this.getData({
                                            collectionId: n,
                                            filter: o,
                                            sort: i,
                                            offset: 0,
                                            length: a,
                                            includes: u,
                                            uniqueFieldValues: c
                                        }));
                                    case 6:
                                    case "end":
                                        return e.stop()
                                }
                            }, e, this)
                        }));
                        return function(t) {
                            return e.apply(this, arguments)
                        }
                    }()
                }, {
                    key: "getData",
                    value: function() {
                        var e = F(regeneratorRuntime.mark(function e(t) {
                            var r, n, o, i, a, u, c, s, l, f = this;
                            return regeneratorRuntime.wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return r = t.collectionId, n = t.filter, o = t.sort, i = t.offset, a = t.length, u = t.includes, c = t.uniqueFieldValues, s = c ? c.filter(function(e) {
                                            return !f.getUniqueFieldValues({
                                                collectionId: r,
                                                fieldKey: e
                                            })
                                        }) : null, e.next = 4, z(this, Z).fetchData({
                                            collectionId: r,
                                            filter: n,
                                            sort: o,
                                            offset: i,
                                            length: a,
                                            includes: u,
                                            uniqueFieldValues: s
                                        });
                                    case 4:
                                        return l = e.sent, e.next = 7, z(this, te);
                                    case 7:
                                        return z(this, J).updateCollectionData({
                                            collectionId: r,
                                            data: l
                                        }), e.abrupt("return", l);
                                    case 9:
                                    case "end":
                                        return e.stop()
                                }
                            }, e, this)
                        }));
                        return function(t) {
                            return e.apply(this, arguments)
                        }
                    }()
                }, {
                    key: "remove",
                    value: function() {
                        var e = F(regeneratorRuntime.mark(function e(t) {
                            var r, n;
                            return regeneratorRuntime.wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return r = t.collectionId, n = t.recordId, e.abrupt("return", z(this, Z).remove({
                                            collectionId: r,
                                            recordId: n
                                        }));
                                    case 2:
                                    case "end":
                                        return e.stop()
                                }
                            }, e, this)
                        }));
                        return function(t) {
                            return e.apply(this, arguments)
                        }
                    }()
                }, {
                    key: "save",
                    value: function() {
                        var e = F(regeneratorRuntime.mark(function e(t) {
                            var r, n, o;
                            return regeneratorRuntime.wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return r = t.collectionId, n = t.record, o = t.includeReferences, e.abrupt("return", z(this, Z).save({
                                            collectionId: r,
                                            record: n,
                                            includeReferences: o
                                        }));
                                    case 2:
                                    case "end":
                                        return e.stop()
                                }
                            }, e, this)
                        }));
                        return function(t) {
                            return e.apply(this, arguments)
                        }
                    }()
                }, {
                    key: "getSibling",
                    value: function() {
                        var e = F(regeneratorRuntime.mark(function e(t) {
                            return regeneratorRuntime.wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return e.next = 2, z(this, Z).getSibling(t);
                                    case 2:
                                        return e.abrupt("return", e.sent);
                                    case 3:
                                    case "end":
                                        return e.stop()
                                }
                            }, e, this)
                        }));
                        return function(t) {
                            return e.apply(this, arguments)
                        }
                    }()
                }, {
                    key: "loadSchemas",
                    value: function() {
                        var e = F(regeneratorRuntime.mark(function e(t) {
                            var r, n, o, i = arguments;
                            return regeneratorRuntime.wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return r = i.length > 1 && void 0 !== i[1] ? i[1] : {}, n = t.filter(function(e) {
                                            return !r[e]
                                        }), X(this, te, n.length ? z(this, Z).fetchSchemas(n) : Promise.resolve({})), e.next = 5, z(this, te);
                                    case 5:
                                        return o = e.sent, z(this, J).updateSchemas(B(B({}, r), o)), e.abrupt("return", z(this, J).getSchemas());
                                    case 8:
                                    case "end":
                                        return e.stop()
                                }
                            }, e, this)
                        }));
                        return function(t) {
                            return e.apply(this, arguments)
                        }
                    }()
                }, {
                    key: "getRecord",
                    value: function(e) {
                        var t = e.collectionId,
                            r = e.recordId,
                            n = e.includes;
                        return z(this, J).getRecord({
                            collectionId: t,
                            recordId: r,
                            includes: n
                        })
                    }
                }, {
                    key: "getSchema",
                    value: function(e) {
                        return z(this, J).getSchema(e)
                    }
                }, {
                    key: "hasSchema",
                    value: function(e) {
                        return Boolean(this.getSchema(e))
                    }
                }, {
                    key: "getReferencedSchemas",
                    value: function(e) {
                        var t = this.getSchema(e),
                            r = z(this, J).getSchemas();
                        return Object(h.c)(t).reduce(function(e, t) {
                            return B(B({}, e), {}, V({}, t, r[t]))
                        }, {})
                    }
                }, {
                    key: "setCollectionData",
                    value: function(e) {
                        var t = e.collectionId,
                            r = e.data;
                        r && z(this, J).updateCollectionData({
                            collectionId: t,
                            data: r
                        })
                    }
                }, {
                    key: "setStore",
                    value: function(e) {
                        e && z(this, J).updateStore(e)
                    }
                }, {
                    key: "getStore",
                    value: function() {
                        return z(this, J).getStore()
                    }
                }, {
                    key: "setUniqueFieldValues",
                    value: function(e) {
                        var t = e.collectionId,
                            r = e.fieldKey,
                            n = e.data;
                        return z(this, J).setUniqueFieldValues({
                            collectionId: t,
                            fieldKey: r,
                            data: n
                        })
                    }
                }, {
                    key: "getUniqueFieldValues",
                    value: function(e) {
                        var t = e.collectionId,
                            r = e.fieldKey;
                        return z(this, J).getUniqueFieldValues({
                            collectionId: t,
                            fieldKey: r
                        })
                    }
                }, {
                    key: "createSimpleFilter",
                    value: function(e, t) {
                        return z(this, Z).createSimpleFilter(e, t)
                    }
                }]), e
            }(),
            se = r(12),
            le = "PRIMARY",
            fe = "mediaGalleryRole",
            de = "ratingsDisplayRole",
            pe = "gridRole",
            me = "uploadButtonRole",
            he = "paginationRole",
            ve = "progressBarRole",
            ye = "signatureInputRole",
            ge = "richContentRole",
            be = "READ_WRITE",
            we = "WRITE",
            Oe = null,
            Ie = "READ",
            Ee = null,
            Re = null,
            Te = null,
            je = 12,
            Se = !1,
            Pe = r(1),
            Ce = r(17),
            De = r.n(Ce),
            xe = function e(t, r) {
                var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [];
                return t(r) ? [{
                    path: Object(o.clone)(n),
                    filterExpression: r
                }] : function(e) {
                    return !Array.isArray(e) && !Object(o.isPlainObject)(e)
                }(r) ? [] : Object(o.flatMap)(r, function(r, o) {
                    return e(t, r, n.concat(o))
                })
            },
            Ae = function(e) {
                return function(t) {
                    return t.reduce(function(e, t) {
                        return function(e, t, r) {
                            return Object(o.set)(e, t, r)
                        }(e, t.path, t.filterExpression)
                    }, Object(o.cloneDeep)(e))
                }
            },
            _e = function(e, t, r) {
                return function(e, t) {
                    return De()(Pe.Maybe, t.map(function(t) {
                        var r = t.path,
                            n = t.filterExpression;
                        return e(n).map(function(e) {
                            return {
                                path: r,
                                filterExpression: e
                            }
                        })
                    }))
                }(t, xe(e, r)).map(Ae(r))
            },
            ke = function(e) {
                return function() {
                    return Pe.Maybe.fromNullable(e.user.currentUser).map(function(e) {
                        var t = e.id;
                        return e.loggedIn ? t : null
                    })
                }
            },
            Ne = function(e) {
                return function(t) {
                    var r = t.filterId;
                    return Pe.Maybe.fromNullable(e[r]).chain(function(e) {
                        var t = e.controllerApi,
                            r = e.fieldName;
                        return Pe.Maybe.fromNullable(t.getCurrentItem()).map(function(e) {
                            var t = e[r];
                            return void 0 === t ? null : t
                        })
                    })
                }
            };

        function Me(e, t) {
            return function(e) {
                if (Array.isArray(e)) return e
            }(e) || function(e, t) {
                var r = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                if (null == r) return;
                var n, o, i = [],
                    a = !0,
                    u = !1;
                try {
                    for (r = r.call(e); !(a = (n = r.next()).done) && (i.push(n.value), !t || i.length !== t); a = !0);
                } catch (e) {
                    u = !0, o = e
                } finally {
                    try {
                        a || null == r.return || r.return()
                    } finally {
                        if (u) throw o
                    }
                }
                return i
            }(e, t) || function(e, t) {
                if (!e) return;
                if ("string" == typeof e) return Fe(e, t);
                var r = Object.prototype.toString.call(e).slice(8, -1);
                "Object" === r && e.constructor && (r = e.constructor.name);
                if ("Map" === r || "Set" === r) return Array.from(e);
                if ("Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Fe(e, t)
            }(e, t) || function() {
                throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }

        function Fe(e, t) {
            (null == t || t > e.length) && (t = e.length);
            for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
            return n
        }
        var Le = function(e) {
                return We(e).chain(function(e) {
                    var t = Me(e, 2),
                        r = t[0],
                        n = t[1];
                    return "$not" === r && Object(o.isArray)(n) ? Ue({
                        positive: !1,
                        filterExpression: n[0]
                    }) : Pe.Maybe.Nothing()
                }).orElse(function() {
                    return Ue({
                        positive: !0,
                        filterExpression: e
                    })
                })
            },
            Ue = function(e) {
                var t = e.positive,
                    r = e.filterExpression;
                return We(r).chain(function(e) {
                    var r = Me(e, 2),
                        n = r[0],
                        o = r[1];
                    return We(o).map(function(e) {
                        var r = Me(e, 2),
                            o = r[0],
                            i = r[1];
                        return {
                            field: n,
                            condition: o,
                            value: i,
                            positive: t
                        }
                    })
                })
            },
            We = function(e) {
                if (!Object(o.isPlainObject)(e)) return Pe.Maybe.Nothing();
                var t = Object(o.entries)(e)[0];
                return Pe.Maybe.fromNullable(t)
            },
            Be = v.FieldType.stringArray,
            Ve = v.FieldType.number,
            Ge = r(5),
            qe = r.n(Ge),
            He = qe.a.Checkbox,
            $e = qe.a.Dropdown,
            Ye = function(e) {
                switch (e.type) {
                    case He:
                        return "checked";
                    default:
                        return "value"
                }
            };

        function ze(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }
        var Xe = function(e) {
                var t = e.getConnectedComponents,
                    r = e.getFieldType;
                return function(e) {
                    var n = t();
                    if (!n) return Pe.Maybe.Nothing();
                    var i = n.filter(function(e) {
                        return "filterInputRole" === e.role
                    }).map(function(e) {
                        return e.component
                    });
                    return Le(e).map(function(e) {
                        var t = e.field,
                            n = e.condition,
                            a = e.value,
                            u = e.positive,
                            c = function(e, t) {
                                return e.map(function(e) {
                                    return e === Ve && "string" == typeof t && /^[+-]?(?:\d+\.?\d*|\d*\.?\d+)$/.test(t.trim()) ? Number(t) : e === Be && 0 === Object(o.get)(t, "length", 0) ? null : t
                                }).getOrElse(t)
                            }(r(t), function(e, t) {
                                var r = e.filterId,
                                    n = t.find(function(e) {
                                        return e.connectionConfig.filters[r]
                                    });
                                if (n) return n[Ye(n)]
                            }(a, i));
                        if (!c && 0 !== c) return {
                            $and: []
                        };
                        var s = ze({}, t, ze({}, n, c));
                        return u ? s : {
                            $not: [s]
                        }
                    })
                }
            },
            Qe = r(21),
            Ze = r(22),
            Je = r(29),
            Ke = function(e) {
                return Object(Qe.shouldResolve)(e) || Object(Ze.shouldResolve)(e) || et(e)
            },
            et = function(e) {
                return Le(e).map(function(e) {
                    var t = e.value;
                    return Object(Je.shouldResolve)(t)
                }).getOrElse(!1)
            },
            tt = function(e) {
                return xe(Ze.shouldResolve, e)
            },
            rt = function(e) {
                return !Object(o.isEmpty)(xe(Je.shouldResolve, e))
            },
            nt = function(e) {
                return tt(e).length > 0
            },
            ot = function(e) {
                return rt(e) || function(e) {
                    return !Object(o.isEmpty)(xe(Qe.shouldResolve, e))
                }(e) || nt(e)
            };

        function it(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function at(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? it(Object(r), !0).forEach(function(t) {
                    ut(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : it(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function ut(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }
        var ct = we,
            st = ["dropdownOptionsRole"],
            lt = ["dropdownRole"],
            ft = function(e, t, r) {
                var n = e.dataset,
                    o = (n = void 0 === n ? {} : n).readWriteType,
                    i = n.deferred,
                    a = n.filter,
                    u = n.collectionName,
                    c = o === ct,
                    s = r.some(function(e) {
                        return "detailsDatasetRole" === e.role
                    }),
                    l = "router_dataset" === t,
                    f = Boolean(i) && !(s || l || c),
                    d = a && ot(a);
                return {
                    sequenceType: function(e) {
                        var t = e.collectionId,
                            r = e.datasetHasDynamicFilter,
                            n = e.datasetIsDeferred,
                            o = e.datasetIsRouter,
                            i = e.datasetIsWriteOnly;
                        return t ? r || n || o || i ? "REGULAR" : le : "UNCONFIGURED"
                    }({
                        collectionId: u,
                        datasetHasDynamicFilter: d,
                        datasetIsDeferred: f,
                        datasetIsRouter: l,
                        datasetIsWriteOnly: c
                    }),
                    datasetIsWriteOnly: c,
                    datasetIsMaster: s,
                    datasetIsRouter: l,
                    datasetIsDeferred: f,
                    datasetHasDynamicFilter: d
                }
            },
            dt = function(e, t) {
                return at(at(at({}, n), e), d.features.dropdownOptionsDistinct ? function(e) {
                    var t = e.reduce(function(e, t) {
                        var r, n, o = t.config,
                            i = t.role,
                            a = t.compId,
                            u = null === o || void 0 === o ? void 0 : null === (r = o.properties) || void 0 === r ? void 0 : null === (n = r.value) || void 0 === n ? void 0 : n.fieldName;
                        if (!u) return e;
                        var c = "".concat(a, "-").concat(u);
                        return lt.includes(i) ? (e.set(c, null), e) : (st.includes(i) && !e.has(c) && e.set(c, u), e)
                    }, new Map);
                    return {
                        uniqueFieldValues: Object(o.compact)(Array.from(t.values()))
                    }
                }(t) : {})
            },
            pt = function(e, t) {
                var r = Object(o.values)({
                    DATASET: "dataset",
                    ROUTER_DATASET: "router_dataset"
                });
                return e.map(function(e) {
                    var n = e.type;
                    if (!Object(o.includes)(r, n)) throw new Error("type of controller MUST be one of ".concat(r, " but is ").concat(n));
                    var i = e.config,
                        a = e.connections,
                        u = "router_dataset" === n ? function(e, t) {
                            return Object(o.merge)({}, t, e)
                        }(null === t || void 0 === t ? void 0 : t.config, i) : i,
                        c = Object(o.defaultsDeep)({}, u, {
                            dataset: dt(u.dataset, a),
                            datasetStaticConfig: ft(u, n, a)
                        });
                    return at(at({}, e), {}, {
                        config: c
                    })
                })
            },
            mt = /[^{}]+(?=\})/g,
            ht = /\{[^{}]+\}/g,
            vt = /[^\dA-Za-z]/g,
            yt = function(e) {
                return e.replace(/(\/{2,})/g, "/").replace(/^\//, "")
            },
            gt = function(e, t, r) {
                return "/" + yt(t).replace(ht, function(t) {
                    var n = t.substring(1, t.length - 1),
                        o = r ? String(e[n]).toLowerCase() : e[n];
                    return encodeURIComponent("".concat(o).replace(/ /g, "-"))
                })
            },
            bt = r(8),
            wt = function(e, t) {
                var r = function(e) {
                    return e.id ? "#".concat(e.id) : e.type
                }(e);
                return t ? "#".concat(t, ".").concat(r) : r
            },
            Ot = function(e, t) {
                var r = new Set([]);
                return function(n, o) {
                    if (!t) return {
                        logBinding: function() {},
                        logValue: function() {}
                    };
                    return {
                        logBinding: function(t) {
                            var i = t.component,
                                a = t.bindingDescription,
                                u = wt(i, o),
                                c = function(e, t, r) {
                                    return JSON.stringify({
                                        compPresentation: e,
                                        collectionName: t,
                                        bindingDescription: r
                                    })
                                }(u, n, a);
                            if (!r.has(c)) {
                                r.add(c);
                                var s = function(e, t, r) {
                                    return r ? "[Dataset - Connected] '".concat(t, "' collection to element '").concat(e, "':") : "[Dataset - Connected] '".concat(t, "' collection to element '").concat(e, "'")
                                }(u, n, a);
                                Pe.Maybe.fromNullable(a).fold(function() {
                                    return e(s)
                                }, function() {
                                    return e(s, a)
                                })
                            }
                        },
                        logValue: function(t) {
                            var r = t.component,
                                i = t.valueDescription,
                                a = function(e, t, r) {
                                    return "[Dataset - Populated] '".concat(t, "' collection into element '").concat(e, "':")
                                }(wt(r, o), n);
                            e(a, i)
                        }
                    }
                }
            },
            It = r(3),
            Et = r(18),
            Rt = r.n(Et),
            Tt = Symbol("isPristine");

        function jt(e) {
            return function(e) {
                if (Array.isArray(e)) return St(e)
            }(e) || function(e) {
                if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
            }(e) || function(e, t) {
                if (!e) return;
                if ("string" == typeof e) return St(e, t);
                var r = Object.prototype.toString.call(e).slice(8, -1);
                "Object" === r && e.constructor && (r = e.constructor.name);
                if ("Map" === r || "Set" === r) return Array.from(e);
                if ("Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return St(e, t)
            }(e) || function() {
                throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }

        function St(e, t) {
            (null == t || t > e.length) && (t = e.length);
            for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
            return n
        }

        function Pt(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function Ct(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? Pt(Object(r), !0).forEach(function(t) {
                    Dt(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Pt(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function Dt(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }
        var xt = function(e) {
                return e._id
            },
            At = function(e, t) {
                return Ct(Ct({}, e), {}, Dt({
                    _id: t || Rt.a.v4()
                }, Tt, !0))
            },
            _t = function(e, t) {
                return e && t && e._id === t._id
            },
            kt = function(e) {
                return Object(o.omit)(e, [Tt])
            },
            Nt = function(e) {
                for (var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++) r[n - 1] = arguments[n];
                return Object.assign.apply(Object, [{}, e].concat(jt(r.map(function(e) {
                    return Object(o.omit)(e, ["_id"])
                }))))
            },
            Mt = {
                chain: function(e) {
                    return function(t) {
                        return e.matchWith({
                            Empty: function() {
                                return e
                            },
                            Results: function(e) {
                                var r = e.items,
                                    n = e.totalCount,
                                    o = e.offset;
                                return t({
                                    items: r,
                                    totalCount: n,
                                    offset: o
                                })
                            }
                        })
                    }
                },
                map: function(e) {
                    return function(t) {
                        return e.matchWith({
                            Empty: function() {
                                return e
                            },
                            Results: function(e) {
                                var r = e.items,
                                    n = e.totalCount,
                                    o = e.offset,
                                    i = t({
                                        items: r,
                                        totalCount: n,
                                        offset: o
                                    }),
                                    a = i.items,
                                    u = void 0 === a ? r : a,
                                    c = i.totalCount,
                                    s = void 0 === c ? n : c,
                                    l = i.offset,
                                    f = void 0 === l ? o : l;
                                return Ft.Results(u, s, f)
                            }
                        })
                    }
                },
                filter: function(e) {
                    return function(t) {
                        return e.matchWith({
                            Empty: function() {
                                return e
                            },
                            Results: function(r) {
                                var n = r.items,
                                    o = r.totalCount,
                                    i = r.offset;
                                return t({
                                    items: n,
                                    totalCount: o,
                                    offset: i
                                }) ? e : Ft.Empty()
                            }
                        })
                    }
                },
                orElse: function(e) {
                    return function(t) {
                        return e.matchWith({
                            Empty: function() {
                                return t()
                            },
                            Results: function() {
                                return e
                            }
                        })
                    }
                },
                get: function(e) {
                    return function() {
                        return e.matchWith({
                            Empty: function() {
                                return {
                                    items: [],
                                    totalCount: 0,
                                    offset: 0
                                }
                            },
                            Results: function(e) {
                                return e
                            }
                        })
                    }
                },
                of: function() {
                    return Lt
                }
            },
            Ft = Object(Pe.union)("QueryResults", {
                Empty: function() {
                    return {}
                },
                Results: function(e, t) {
                    return {
                        items: e,
                        totalCount: t,
                        offset: arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0
                    }
                }
            }, Mt);

        function Lt(e) {
            var t = e.items,
                r = e.totalCount,
                n = e.offset;
            return r > 0 && Array.isArray(t) ? Ft.Results(t, r, n) : Ft.Empty()
        }
        var Ut = {
            Empty: Ft.Empty,
            Results: Ft.Results,
            fromWixDataQueryResults: function(e, t) {
                return e ? this.of({
                    items: e.items,
                    totalCount: e.totalCount,
                    offset: t
                }) : Ft.Empty()
            },
            of: Lt
        };

        function Wt(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function Bt(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? Wt(Object(r), !0).forEach(function(t) {
                    Vt(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Wt(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function Vt(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }
        var Gt = function(e) {
                return function(t) {
                    return Bt(Bt({}, t), e)
                }
            },
            qt = function(e, t) {
                return function(r) {
                    return t(e(r))(r)
                }
            };

        function Ht(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function $t(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? Ht(Object(r), !0).forEach(function(t) {
                    Yt(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Ht(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function Yt(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }
        var zt = function(e) {
                return Gt({
                    records: e
                })
            },
            Xt = function(e) {
                return function(t) {
                    return $t($t({}, t), {}, {
                        numMatchingRecords: e(t.numMatchingRecords)
                    })
                }
            },
            Qt = function(e) {
                return function(t) {
                    return $t($t({}, t), {}, {
                        numMatchingRecords: e + er(t)
                    })
                }
            },
            Zt = function(e) {
                return $t($t({}, e), {}, {
                    numSeedRecords: e.records.length
                })
            },
            Jt = function(e) {
                return e.matchWith({
                    Empty: function() {
                        return Qt(0)
                    },
                    Results: function(e) {
                        var t = e.items,
                            r = e.totalCount;
                        e.offset;
                        return Object(o.flow)(zt(t.map(function(e) {
                            return xt(e)
                        })), Qt(r), Zt)
                    }
                })
            },
            Kt = function(e) {
                return function(t) {
                    return $t($t({}, t), {}, {
                        newRecordMarkers: e(t.newRecordMarkers)
                    })
                }
            },
            er = function(e, t) {
                return e.newRecordMarkers.filter(function(e) {
                    return null == t || e <= t
                }).length
            },
            tr = function(e) {
                return e.matchWith({
                    Empty: function() {
                        return Qt(0)
                    },
                    Results: function(e) {
                        var t = e.items,
                            r = e.totalCount,
                            n = e.offset;
                        return Object(o.flow)(Qt(r), t.length > 0 ? rr(n, t) : function(e) {
                            return e
                        })
                    }
                })
            },
            rr = function(e, t) {
                var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
                    n = r.overwrite,
                    o = void 0 === n || n,
                    i = r.fixIndex,
                    a = void 0 === i || i;
                return qt(function(r) {
                    var n = e + (a ? er(r, e) : 0),
                        i = Math.max(0, n - r.records.length),
                        u = n + (o ? t.length : 0);
                    return r.records.slice(0, n).concat(new Array(i)).concat(t.map(function(e) {
                        return xt(e)
                    })).concat(r.records.slice(u))
                }, zt)
            },
            nr = function(e, t) {
                return rr(e, [t], {
                    fixIndex: !1
                })
            },
            or = function(e) {
                return qt(function(t) {
                    return t.records.filter(function(t) {
                        return t !== e
                    })
                }, zt)
            },
            ir = function(e, t) {
                return t.records.indexOf(e)
            },
            ar = function(e) {
                return function(t) {
                    return t.records.includes(e)
                }
            };

        function ur(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function cr(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? ur(Object(r), !0).forEach(function(t) {
                    sr(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ur(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function sr(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }

        function lr(e) {
            return function(e) {
                if (Array.isArray(e)) return fr(e)
            }(e) || function(e) {
                if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
            }(e) || function(e, t) {
                if (!e) return;
                if ("string" == typeof e) return fr(e, t);
                var r = Object.prototype.toString.call(e).slice(8, -1);
                "Object" === r && e.constructor && (r = e.constructor.name);
                if ("Map" === r || "Set" === r) return Array.from(e);
                if ("Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return fr(e, t)
            }(e) || function() {
                throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }

        function fr(e, t) {
            (null == t || t > e.length) && (t = e.length);
            for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
            return n
        }
        var dr = function(e, t, r) {
                return function(n) {
                    return Object.assign.apply(Object, [{}, e(n)].concat(lr(r.map(function(e) {
                        return sr({}, t(e), e)
                    }))))
                }
            },
            pr = function(e, t, r) {
                return function(n) {
                    return cr(cr({}, e(n)), {}, sr({}, t, r(e(n)[t])))
                }
            },
            mr = function(e, t) {
                return function(r) {
                    return Object.assign.apply(Object, [{}].concat(lr(Object.keys(e(r)).filter(function(e) {
                        return e !== t
                    }).map(function(t) {
                        return sr({}, t, e(r)[t])
                    }))))
                }
            },
            hr = function(e) {
                return Gt({
                    records: e
                })
            },
            vr = function(e) {
                return Gt({
                    drafts: e
                })
            },
            yr = Object(o.curry)(function(e, t, r) {
                return Gt({
                    scopes: cr(cr({}, r.scopes), {}, sr({}, e, t))
                })(r)
            }),
            gr = function(e) {
                return function(t) {
                    return t.scopes[e]
                }
            },
            br = function(e) {
                return qt(dr(function(e) {
                    return e.records
                }, xt, e), hr)
            },
            wr = function(e) {
                return br([e])
            },
            Or = function(e) {
                return function(e) {
                    return qt(dr(function(e) {
                        return e.drafts
                    }, xt, e), vr)
                }([e])
            },
            Ir = function(e) {
                return qt(mr(function(e) {
                    return e.records
                }, e), hr)
            },
            Er = function(e) {
                return qt(mr(function(e) {
                    return e.drafts
                }, xt(e)), vr)
            },
            Rr = function() {
                return vr({})
            },
            Tr = function(e) {
                return e.matchWith({
                    Empty: function() {
                        return function(e) {
                            return e
                        }
                    },
                    Results: function(e) {
                        var t = e.items;
                        e.totalCount, e.offset;
                        return t.length > 0 ? br(t) : function(e) {
                            return e
                        }
                    }
                })
            },
            jr = function(e, t) {
                return qt(pr(function(e) {
                    return e.drafts
                }, e, function(e) {
                    return cr(cr({}, function(e) {
                        return Ct(Ct({}, e), {}, Dt({}, Tt, !1))
                    }(e)), t)
                }), vr)
            },
            Sr = function(e, t) {
                return Object(o.isPlainObject)(t.records[e]) ? Nt(t.records[e], t.drafts[e]) : Object(o.isPlainObject)(t.drafts[e]) ? Nt(t.drafts[e]) : null
            },
            Pr = function(e) {
                return {
                    records: e.records,
                    drafts: {},
                    scopes: Object(o.mapValues)(e.scopes, function(e) {
                        var t = e.records,
                            r = e.numMatchingRecords,
                            n = (e.numSeedRecords, e.newRecordMarkers),
                            o = t.filter(function(e, t) {
                                return !n.includes(t)
                            });
                        return {
                            records: o,
                            numMatchingRecords: r - n.length,
                            numSeedRecords: o.length,
                            newRecordMarkers: []
                        }
                    })
                }
            },
            Cr = Object(o.curry)(function(e, t, r) {
                return Object.keys(r.scopes).filter(function(e) {
                    return t(r.scopes[e], e)
                }).map(function(t) {
                    return e(r.scopes[t], t)
                })
            }),
            Dr = Object(o.curry)(function(e, t, r, n) {
                var o = arguments.length > 4 && void 0 !== arguments[4] && arguments[4],
                    i = gr(e)(n),
                    a = r - t,
                    u = i.records.slice(t, r).reduce(function(e, t) {
                        var r = Sr(t, n);
                        return null != r ? e.concat(kt(r)) : e
                    }, []);
                return Ut.of({
                    items: u,
                    totalCount: i.numMatchingRecords || 0,
                    offset: t
                }).filter(function(e) {
                    var t = e.items;
                    return o || t.length >= a
                })
            }),
            xr = Object(o.curry)(function(e, t) {
                return qt(Object(o.flow)(gr(e), t), yr(e))
            });

        function Ar(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function _r(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }
        var kr = function(e) {
                return _r({}, e, function(e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var r = null != arguments[t] ? arguments[t] : {};
                        t % 2 ? Ar(Object(r), !0).forEach(function(t) {
                            _r(e, t, r[t])
                        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Ar(Object(r)).forEach(function(t) {
                            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                        })
                    }
                    return e
                }({}, {
                    records: {},
                    drafts: {},
                    scopes: {}
                }))
            },
            Nr = Object(o.curry)(function(e, t) {
                return Gt(_r({}, e, t))
            }),
            Mr = function(e) {
                return function(t) {
                    return t[e]
                }
            },
            Fr = Object(o.curry)(function(e, t) {
                return qt(Object(o.flow)(Mr(e), t), Nr(e))
            }),
            Lr = ["items"],
            Ur = ["items"],
            Wr = ["items"];

        function Br(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function Vr(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? Br(Object(r), !0).forEach(function(t) {
                    $r(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Br(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function Gr(e, t) {
            if (null == e) return {};
            var r, n, o = function(e, t) {
                if (null == e) return {};
                var r, n, o = {},
                    i = Object.keys(e);
                for (n = 0; n < i.length; n++) r = i[n], t.indexOf(r) >= 0 || (o[r] = e[r]);
                return o
            }(e, t);
            if (Object.getOwnPropertySymbols) {
                var i = Object.getOwnPropertySymbols(e);
                for (n = 0; n < i.length; n++) r = i[n], t.indexOf(r) >= 0 || Object.prototype.propertyIsEnumerable.call(e, r) && (o[r] = e[r])
            }
            return o
        }

        function qr(e) {
            return function(e) {
                if (Array.isArray(e)) return Zr(e)
            }(e) || function(e) {
                if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
            }(e) || Qr(e) || function() {
                throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }

        function Hr(e) {
            "@babel/helpers - typeof";
            return (Hr = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            })(e)
        }

        function $r(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }

        function Yr(e, t, r, n, o, i, a) {
            try {
                var u = e[i](a),
                    c = u.value
            } catch (e) {
                return void r(e)
            }
            u.done ? t(c) : Promise.resolve(c).then(n, o)
        }

        function zr(e) {
            return function() {
                var t = this,
                    r = arguments;
                return new Promise(function(n, o) {
                    var i = e.apply(t, r);

                    function a(e) {
                        Yr(i, n, o, a, u, "next", e)
                    }

                    function u(e) {
                        Yr(i, n, o, a, u, "throw", e)
                    }
                    a(void 0)
                })
            }
        }

        function Xr(e, t) {
            return function(e) {
                if (Array.isArray(e)) return e
            }(e) || function(e, t) {
                var r = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                if (null == r) return;
                var n, o, i = [],
                    a = !0,
                    u = !1;
                try {
                    for (r = r.call(e); !(a = (n = r.next()).done) && (i.push(n.value), !t || i.length !== t); a = !0);
                } catch (e) {
                    u = !0, o = e
                } finally {
                    try {
                        a || null == r.return || r.return()
                    } finally {
                        if (u) throw o
                    }
                }
                return i
            }(e, t) || Qr(e, t) || function() {
                throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }

        function Qr(e, t) {
            if (e) {
                if ("string" == typeof e) return Zr(e, t);
                var r = Object.prototype.toString.call(e).slice(8, -1);
                return "Object" === r && e.constructor && (r = e.constructor.name), "Map" === r || "Set" === r ? Array.from(e) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Zr(e, t) : void 0
            }
        }

        function Zr(e, t) {
            (null == t || t > e.length) && (t = e.length);
            for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
            return n
        }
        var Jr = ["setFieldsValues", "newRecord"],
            Kr = function(e) {
                return e === we
            },
            en = function(e) {
                return Xr(e, 1)[0].datasetId
            },
            tn = function(e, t) {
                var r = Xr(e, 1)[0],
                    n = Xr(t, 1)[0];
                return Object(o.every)(r, function(e, t) {
                    return "filter" === t ? function(e, t) {
                        return JSON.stringify(e) === JSON.stringify(t)
                    }(e, n[t]) : e === n[t]
                })
            },
            rn = function(e) {
                var t = e.primaryDatasetId,
                    r = e.recordStoreCache,
                    n = e.refreshStoreCache,
                    i = e.warmupStore,
                    a = e.dataProvider,
                    u = e.mainCollectionName,
                    c = e.includes,
                    s = e.uniqueFieldValues,
                    l = e.readWriteType,
                    f = e.logger,
                    d = function() {
                        return r[t]
                    },
                    p = function(e) {
                        r[t] = e
                    };
                (Object(o.isEmpty)(d()) || n || Kr(l)) && p(Object(o.isEmpty)(i) ? kr(u) : function(e) {
                    return Object(o.mapValues)(e, Pr)
                }(i));
                var v = [],
                    y = function(e, t, r) {
                        var n = new Map;
                        return function() {
                            for (var o = arguments.length, i = new Array(o), a = 0; a < o; a++) i[a] = arguments[a];
                            var u = t(i),
                                c = n.get(u);
                            if (c && r(i, c.args)) return c.result;
                            var s = e.apply(this, i);
                            return n.set(u, {
                                args: i,
                                result: s
                            }), s
                        }
                    }(function(e) {
                        var r = e.pageSize,
                            n = e.sort,
                            i = e.filter,
                            y = e.datasetId,
                            g = e.allowWixDataAccess,
                            b = e.referencedCollectionName,
                            w = e.fixedRecordId,
                            O = null != b ? b : u,
                            I = JSON.stringify({
                                filter: i,
                                sort: n
                            }),
                            E = Mr(O),
                            R = Fr(O),
                            T = Object(o.flow)(E, gr(I)),
                            j = xr(I),
                            S = function() {
                                return a.getSchema(O)
                            },
                            P = function(e) {
                                return e - e % r
                            },
                            C = Object(o.memoize)(function(e, t) {
                                return g ? f.traceAsync(m.e.findRecords({
                                    collectionName: O,
                                    filter: i,
                                    sort: n,
                                    offset: e,
                                    length: t
                                }), function() {
                                    return a.getData({
                                        collectionId: O,
                                        filter: i,
                                        sort: n,
                                        offset: e,
                                        length: t,
                                        includes: null != b ? void 0 : c,
                                        uniqueFieldValues: s
                                    }).then(function(t) {
                                        return Ut.fromWixDataQueryResults(t, e)
                                    })
                                }) : Promise.resolve(Ut.Empty())
                            }),
                            D = function(e, t, n) {
                                var i = P(t),
                                    a = function(e, t) {
                                        return Math.ceil((P(e) + (t - P(e))) / r) * r
                                    }(t, n),
                                    u = Object(h.e)(S()) || 1e3,
                                    c = function(e, t, r) {
                                        var n = e.records.slice(t, r),
                                            o = n.findIndex(f),
                                            i = function(e, t) {
                                                if (t.length > 0)
                                                    for (var r = t.length - 1; r >= 0; r -= 1)
                                                        if (e(t[r])) return r;
                                                return -1
                                            }(f, n),
                                            a = d(o, t),
                                            u = d(i, r),
                                            c = er(e, a),
                                            s = a - c,
                                            l = u - c - s;
                                        return 0 === l ? Pe.Maybe.Nothing() : Pe.Maybe.Just({
                                            from: s,
                                            length: l
                                        });

                                        function f(e) {
                                            return "string" != typeof e
                                        }

                                        function d(t, r) {
                                            return -1 === t ? Math.max(e.records.length, r) : o + r
                                        }
                                    }(e, i, a).map(function(e) {
                                        var t = e.from,
                                            r = e.length;
                                        return r <= u ? [{
                                            from: t,
                                            length: r
                                        }] : Object(o.flatten)(Object(o.times)(Math.ceil(r / u), function(e) {
                                            return [{
                                                from: t + e * u,
                                                length: Math.min(u, r - e * u)
                                            }]
                                        }))
                                    });
                                return Promise.all(c.getOrElse([]).map(function(e) {
                                    var t = e.from,
                                        r = e.length;
                                    return C(t, r)
                                }))
                            },
                            x = function(e, t, r) {
                                return De()(Pe.Result, v.map(function(n) {
                                    return Pe.Result.try(function() {
                                        return n(null != e ? kt(e) : null, null != t ? kt(t) : null, r)
                                    })
                                }))
                            },
                            A = function(e, t, r) {
                                var n = T(d()).records[r],
                                    i = Sr(n, E(d()));
                                if (null == i) return t();
                                for (var a = arguments.length, u = new Array(a > 3 ? a - 3 : 0), c = 3; c < a; c++) u[c - 3] = arguments[c];
                                return e.apply(void 0, [{
                                    update: function() {
                                        p(o.flow.apply(void 0, arguments)(d()))
                                    },
                                    notifyIfChanged: function(e) {
                                        var t = Sr(n, E(d()));
                                        return Object(o.isEqual)(i, t) ? Pe.Result.Ok([]) : x(i, t, e)
                                    }
                                }, i, r].concat(u))
                            },
                            _ = function(e, t) {
                                return function(r) {
                                    for (var n = arguments.length, o = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++) o[i - 1] = arguments[i];
                                    return A.apply(void 0, [e, t, r].concat(o))
                                }
                            },
                            k = function(e, t) {
                                return function() {
                                    var r = zr(regeneratorRuntime.mark(function r(n) {
                                        var o, i, a, u = arguments;
                                        return regeneratorRuntime.wrap(function(r) {
                                            for (;;) switch (r.prev = r.next) {
                                                case 0:
                                                    for (o = u.length, i = new Array(o > 1 ? o - 1 : 0), a = 1; a < o; a++) i[a - 1] = u[a];
                                                    return r.abrupt("return", A.apply(void 0, [e, t, n].concat(i)));
                                                case 2:
                                                case "end":
                                                    return r.stop()
                                            }
                                        }, r)
                                    }));
                                    return function(e) {
                                        return r.apply(this, arguments)
                                    }
                                }()
                            },
                            N = Object(m.b)(f, function(e) {
                                var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [];
                                return {
                                    category: "recordStore",
                                    level: "info",
                                    message: "".concat(e, "(").concat(Jr.includes(e) ? "..".concat(t.length, " arguments..") : t.map(function(e) {
                                        return JSON.stringify(e)
                                    }).join(", "), ") (").concat(y, ")"),
                                    data: {
                                        scope: I
                                    }
                                }
                            }, function(e) {
                                var t = function e(t) {
                                    return Object.keys(t).filter(function(e) {
                                        return e.startsWith("_")
                                    }).reduce(function(r, n) {
                                        return Object.assign(r, $r({}, n, Object(o.isPlainObject)(t[n]) ? e(t[n]) : t[n]))
                                    }, {})
                                };
                                return Ut.Results.hasInstance(e) ? e.map(function(e) {
                                    return {
                                        items: e.items.map(function(e) {
                                            return t(e)
                                        })
                                    }
                                }) : "object" === Hr(e) && e ? t(e) : e
                            }),
                            M = N.withBreadcrumbs,
                            F = N.withBreadcrumbsAsync,
                            L = function(e) {
                                return e && ! function(e, t) {
                                    return !!t.records[e]
                                }(xt(e), E(d()))
                            },
                            U = {
                                getRecords: F("getRecords", function() {
                                    var e = zr(regeneratorRuntime.mark(function e(t, r) {
                                        var n, i, a;
                                        return regeneratorRuntime.wrap(function(e) {
                                            for (;;) switch (e.prev = e.next) {
                                                case 0:
                                                    return n = T(d()).numMatchingRecords, i = "number" == typeof n ? Math.min(t + r, n) : t + r, a = Dr(I, t, i), e.abrupt("return", a(E(d()), Kr(l) || 0 === n).orElse(zr(regeneratorRuntime.mark(function e() {
                                                        var r, n, u, c;
                                                        return regeneratorRuntime.wrap(function(e) {
                                                            for (;;) switch (e.prev = e.next) {
                                                                case 0:
                                                                    return e.next = 2, D(T(d()), t, i);
                                                                case 2:
                                                                    return r = e.sent, n = function(e, t) {
                                                                        return Object.keys(e.records).filter(function(r) {
                                                                            return Object(o.isPlainObject)(t.records[r]) && t.records[r]._updatedDate > e.records[r]._updatedDate
                                                                        }).forEach(function(r) {
                                                                            return x(e.records[r], t.records[r])
                                                                        })
                                                                    }, u = R(o.flow.apply(void 0, qr(r.map(function(e) {
                                                                        return Object(o.flow)(Tr(e), j(tr(e)))
                                                                    })))), c = d(), p(u(d())), n(E(c), E(d())), e.abrupt("return", a(E(d()), !0));
                                                                case 9:
                                                                case "end":
                                                                    return e.stop()
                                                            }
                                                        }, e)
                                                    }))));
                                                case 4:
                                                case "end":
                                                    return e.stop()
                                            }
                                        }, e)
                                    }));
                                    return function(t, r) {
                                        return e.apply(this, arguments)
                                    }
                                }()),
                                getRecordsLimitedByMaxPageSize: function(e, t) {
                                    var r = Math.min(t, Object(h.e)(S()) || t);
                                    return U.getRecords(e, r)
                                },
                                seed: F("seed", function() {
                                    return 0 === T(d()).numSeedRecords ? (w ? a.getData({
                                        collectionId: O,
                                        filter: i,
                                        sort: n,
                                        offset: 0,
                                        length: r,
                                        includes: null != b ? void 0 : c,
                                        uniqueFieldValues: s
                                    }) : a.getDataFromBulk({
                                        datasetId: t,
                                        collectionId: O,
                                        filter: i,
                                        sort: n,
                                        length: r,
                                        includes: c,
                                        uniqueFieldValues: s
                                    })).then(function(e) {
                                        var t = Ut.fromWixDataQueryResults(e, 0),
                                            r = R(Object(o.flow)(Tr(t), j(Jt(t))));
                                        p(r(d()))
                                    }) : Promise.resolve()
                                }),
                                getTheStore: d,
                                getSeedRecords: M("getSeedRecords", function() {
                                    return Dr(I, 0, T(d()).numSeedRecords, E(d()), !0)
                                }),
                                getMatchingRecordCount: M("getMatchingRecordCount", function() {
                                    return T(d()).numMatchingRecords || 0
                                }),
                                getRecordById: M("getRecordById", function(e) {
                                    return Pe.Maybe.fromNullable(E(d()).records[e])
                                }),
                                removeRecord: F("removeRecord", k(function() {
                                    var e = zr(regeneratorRuntime.mark(function e(t, r, n) {
                                        var i, u, c, s, l;
                                        return regeneratorRuntime.wrap(function(e) {
                                            for (;;) switch (e.prev = e.next) {
                                                case 0:
                                                    if (i = t.update, u = t.notifyIfChanged, c = xt(r), L(r) || !c) {
                                                        e.next = 5;
                                                        break
                                                    }
                                                    return e.next = 5, a.remove({
                                                        collectionId: O,
                                                        recordId: c
                                                    });
                                                case 5:
                                                    return C.cache.clear(), s = function(e) {
                                                        return function(t) {
                                                            return t.filter(function(t) {
                                                                return t !== e
                                                            })
                                                        }
                                                    }, l = Cr(function(e, t) {
                                                        return xr(t, Object(o.flow)(or(c), Xt(function(e) {
                                                            return null != e ? e - 1 : null
                                                        }), Kt(s(ir(c, e)))))
                                                    }, ar(c), E(d())), i(R(o.flow.apply(void 0, [Object(o.flow)(Er(r), Ir(c))].concat(qr(l))))), e.abrupt("return", u());
                                                case 10:
                                                case "end":
                                                    return e.stop()
                                            }
                                        }, e)
                                    }));
                                    return function(t, r, n) {
                                        return e.apply(this, arguments)
                                    }
                                }(), function() {
                                    return Promise.resolve(Pe.Result.Error("cannot remove record: index not found"))
                                })),
                                reset: M("reset", function() {
                                    C.cache.clear(), p(R(Object(o.flow)(yr(I, {
                                        records: [],
                                        numMatchingRecords: null,
                                        numSeedRecords: 0,
                                        newRecordMarkers: []
                                    }), Rr()))(d()))
                                }),
                                newRecord: M("newRecord", function(e, t) {
                                    var r = At(t),
                                        n = R(Object(o.flow)(Or(r), j(Object(o.flow)(Xt(function(e) {
                                            return e + 1
                                        }), function(e) {
                                            return Gt({
                                                newRecordMarkers: e
                                            })
                                        }([e]), function(e, t) {
                                            return rr(e, [t], {
                                                overwrite: !1,
                                                fixIndex: !1
                                            })
                                        }(e, r)))));
                                    return p(n(d())), x(null, r), kt(r)
                                }),
                                saveRecord: F("saveRecord", k(function() {
                                    var e = zr(regeneratorRuntime.mark(function e(t, r, n) {
                                        var i, u, c, s;
                                        return regeneratorRuntime.wrap(function(e) {
                                            for (;;) switch (e.prev = e.next) {
                                                case 0:
                                                    return i = t.update, u = t.notifyIfChanged, e.next = 3, a.save({
                                                        collectionId: O,
                                                        record: kt(r),
                                                        includeReferences: !0
                                                    });
                                                case 3:
                                                    return c = e.sent, s = function(e) {
                                                        return e.filter(function(e) {
                                                            return e !== n
                                                        })
                                                    }, i(R(Object(o.flow)(wr(c), Er(r), j(Object(o.flow)(nr(n, c), Kt(s)))))), u(), e.abrupt("return", kt(c));
                                                case 8:
                                                case "end":
                                                    return e.stop()
                                            }
                                        }, e)
                                    }));
                                    return function(t, r, n) {
                                        return e.apply(this, arguments)
                                    }
                                }(), function() {
                                    return Promise.reject(new Error("cannot save record: index not found"))
                                })),
                                setFieldsValues: M("setFieldsValues", _(function(e, t, r, n, o) {
                                    var i = e.update,
                                        a = e.notifyIfChanged;
                                    return Object.keys(n).length && i(R(jr(xt(t), n))), a(o)
                                }, function() {
                                    return Pe.Result.Error("cannot update field values: index not found")
                                })),
                                isPristine: M("isPristine", _(function(e, t) {
                                    return function(e) {
                                        return "boolean" != typeof e[Tt] || e[Tt]
                                    }(t)
                                }, function() {
                                    return !0
                                })),
                                hasDraft: M("hasDraft", _(function(e, t) {
                                    return function(e) {
                                        return "boolean" == typeof e[Tt]
                                    }(t)
                                }, function() {
                                    return !1
                                })),
                                isNewRecord: M("isNewRecord", _(function(e, t) {
                                    return L(t)
                                }, function() {
                                    return !0
                                })),
                                clearDrafts: M("clearDrafts", function() {
                                    p(R(Rr())(d()))
                                }),
                                resetDraft: M("resetDraft", _(function(e, t, r, n) {
                                    var o = e.update,
                                        i = e.notifyIfChanged;
                                    return o(R(L(t) ? function(e, t) {
                                        return qt(pr(function(e) {
                                            return e.drafts
                                        }, xt(e), function(e) {
                                            return At(t, e._id)
                                        }), vr)
                                    }(t, n) : Er(t))), i()
                                }, function() {
                                    return Pe.Result.Error("cannot reset draft: index not found")
                                })),
                                hasSeedData: M("hasSeedData", function() {
                                    return T(d()).numSeedRecords > 0
                                }),
                                getUniqueFieldValues: M("getUniqueFieldValues", function(e) {
                                    return a.getUniqueFieldValues({
                                        collectionId: O,
                                        fieldKey: e
                                    })
                                })
                            };
                        if (E(d()) || p(Nr(O, {
                                records: {},
                                drafts: {},
                                scopes: {}
                            })(d())), !E(d()).scopes[I]) {
                            var W = [];
                            if (w) {
                                var B = a.getRecord({
                                        collectionId: O,
                                        recordId: w,
                                        includes: c
                                    }) || Sr(w, E(d())),
                                    V = B ? [B] : [],
                                    G = Ut.fromWixDataQueryResults({
                                        items: V,
                                        totalCount: V.length
                                    }, 0),
                                    q = G.matchWith({
                                        Empty: Pe.Maybe.Nothing,
                                        Results: Object(o.flow)(Ut.of, Pe.Maybe.Just)
                                    });
                                Object(o.some)(V, L) && W.push(Tr(G)), q.fold(function() {
                                    W.push(yr(I, {
                                        records: [],
                                        numMatchingRecords: null,
                                        numSeedRecords: 0,
                                        newRecordMarkers: []
                                    }))
                                }, function(e) {
                                    W.push(yr(I, Jt(e)({
                                        records: [],
                                        numMatchingRecords: null,
                                        numSeedRecords: 0,
                                        newRecordMarkers: []
                                    })))
                                })
                            } else W.push(yr(I, {
                                records: [],
                                numMatchingRecords: null,
                                numSeedRecords: 0,
                                newRecordMarkers: []
                            }));
                            p(R(o.flow.apply(void 0, W))(d()))
                        }
                        return U.externalApi = {
                            getRecords: function() {
                                var e = zr(regeneratorRuntime.mark(function e(t, r) {
                                    return regeneratorRuntime.wrap(function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                return e.next = 2, U.getRecords(t, r);
                                            case 2:
                                                return e.abrupt("return", e.sent.map(function(e) {
                                                    var t = e.items,
                                                        r = Gr(e, Lr);
                                                    return Vr({
                                                        items: Object(o.cloneDeep)(t)
                                                    }, r)
                                                }));
                                            case 3:
                                            case "end":
                                                return e.stop()
                                        }
                                    }, e)
                                }));
                                return function(t, r) {
                                    return e.apply(this, arguments)
                                }
                            }(),
                            getSeedRecords: function() {
                                return U.getSeedRecords().map(function(e) {
                                    var t = e.items,
                                        r = Gr(e, Ur);
                                    return Vr({
                                        items: Object(o.cloneDeep)(t)
                                    }, r)
                                })
                            },
                            getRecordsLimitedByMaxPageSize: function() {
                                var e = zr(regeneratorRuntime.mark(function e(t, r) {
                                    return regeneratorRuntime.wrap(function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                return e.next = 2, U.getRecordsLimitedByMaxPageSize(t, r);
                                            case 2:
                                                return e.abrupt("return", e.sent.map(function(e) {
                                                    var t = e.items,
                                                        r = Gr(e, Wr);
                                                    return Vr({
                                                        items: Object(o.cloneDeep)(t)
                                                    }, r)
                                                }));
                                            case 3:
                                            case "end":
                                                return e.stop()
                                        }
                                    }, e)
                                }));
                                return function(t, r) {
                                    return e.apply(this, arguments)
                                }
                            }()
                        }, U
                    }, en, tn);
                return y.onChange = function(e) {
                    return function(t) {
                        return e.push(t),
                            function() {
                                var r = e.indexOf(t);
                                r >= 0 && e.splice(r, 1)
                            }
                    }
                }(v), y
            },
            nn = function(e) {
                var t = {};
                return {
                    setController: function(r, n) {
                        var o = r.compId,
                            i = r.itemId;
                        e.trace(It.a.Breadcrumb({
                            level: "info",
                            category: "scopeStore",
                            message: "adding scope",
                            data: {
                                componentId: o,
                                itemId: i
                            }
                        })), t[o] = t[o] || {}, t[o][i] = n
                    },
                    getController: function(e) {
                        var r = e.compId,
                            n = e.itemId,
                            o = t[r];
                        return o && o[n]
                    },
                    removeController: function(r) {
                        var n = r.compId,
                            i = r.itemId;
                        e.trace(It.a.Breadcrumb({
                            level: "info",
                            category: "scopeStore",
                            message: "removing scope",
                            data: {
                                componentId: n,
                                itemId: i
                            }
                        }));
                        var a = t[n];
                        Object(o.get)(a, i) && (a[i].dispose(), Object(o.unset)(a, i))
                    },
                    getAll: function() {
                        return Object.values(t).reduce(function(e, t) {
                            return e.concat(Object.values(t))
                        }, [])
                    }
                }
            },
            on = r(50),
            an = r(52),
            un = "object" == typeof self && self && self.Object === Object && self,
            cn = (an.a || un || Function("return this")()).Symbol,
            sn = Object.prototype,
            ln = sn.hasOwnProperty,
            fn = sn.toString,
            dn = cn ? cn.toStringTag : void 0;
        var pn = function(e) {
                var t = ln.call(e, dn),
                    r = e[dn];
                try {
                    e[dn] = void 0;
                    var n = !0
                } catch (e) {}
                var o = fn.call(e);
                return n && (t ? e[dn] = r : delete e[dn]), o
            },
            mn = Object.prototype.toString;
        var hn = function(e) {
                return mn.call(e)
            },
            vn = "[object Null]",
            yn = "[object Undefined]",
            gn = cn ? cn.toStringTag : void 0;
        var bn = function(e) {
            return null == e ? void 0 === e ? yn : vn : gn && gn in Object(e) ? pn(e) : hn(e)
        };
        var wn = function(e, t) {
            return function(r) {
                return e(t(r))
            }
        }(Object.getPrototypeOf, Object);
        var On = function(e) {
                return null != e && "object" == typeof e
            },
            In = "[object Object]",
            En = Function.prototype,
            Rn = Object.prototype,
            Tn = En.toString,
            jn = Rn.hasOwnProperty,
            Sn = Tn.call(Object);
        var Pn = function(e) {
                if (!On(e) || bn(e) != In) return !1;
                var t = wn(e);
                if (null === t) return !0;
                var r = jn.call(t, "constructor") && t.constructor;
                return "function" == typeof r && r instanceof r && Tn.call(r) == Sn
            },
            Cn = r(30),
            Dn = {
                INIT: "@@redux/INIT"
            };

        function xn(e, t, r) {
            var n;
            if ("function" == typeof t && void 0 === r && (r = t, t = void 0), void 0 !== r) {
                if ("function" != typeof r) throw new Error("Expected the enhancer to be a function.");
                return r(xn)(e, t)
            }
            if ("function" != typeof e) throw new Error("Expected the reducer to be a function.");
            var o = e,
                i = t,
                a = [],
                u = a,
                c = !1;

            function s() {
                u === a && (u = a.slice())
            }

            function l() {
                return i
            }

            function f(e) {
                if ("function" != typeof e) throw new Error("Expected listener to be a function.");
                var t = !0;
                return s(), u.push(e),
                    function() {
                        if (t) {
                            t = !1, s();
                            var r = u.indexOf(e);
                            u.splice(r, 1)
                        }
                    }
            }

            function d(e) {
                if (!Pn(e)) throw new Error("Actions must be plain objects. Use custom middleware for async actions.");
                if (void 0 === e.type) throw new Error('Actions may not have an undefined "type" property. Have you misspelled a constant?');
                if (c) throw new Error("Reducers may not dispatch actions.");
                try {
                    c = !0, i = o(i, e)
                } finally {
                    c = !1
                }
                for (var t = a = u, r = 0; r < t.length; r++) {
                    (0, t[r])()
                }
                return e
            }
            return d({
                type: Dn.INIT
            }), (n = {
                dispatch: d,
                subscribe: f,
                getState: l,
                replaceReducer: function(e) {
                    if ("function" != typeof e) throw new Error("Expected the nextReducer to be a function.");
                    o = e, d({
                        type: Dn.INIT
                    })
                }
            })[Cn.a] = function() {
                var e, t = f;
                return (e = {
                    subscribe: function(e) {
                        if ("object" != typeof e) throw new TypeError("Expected the observer to be an object.");

                        function r() {
                            e.next && e.next(l())
                        }
                        return r(), {
                            unsubscribe: t(r)
                        }
                    }
                })[Cn.a] = function() {
                    return this
                }, e
            }, n
        }

        function An(e, t) {
            var r = t && t.type;
            return "Given action " + (r && '"' + r.toString() + '"' || "an action") + ', reducer "' + e + '" returned undefined. To ignore an action, you must explicitly return the previous state. If you want this reducer to hold no value, you can return null instead of undefined.'
        }
        var _n = Object.assign || function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = arguments[t];
                for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n])
            }
            return e
        };

        function kn() {
            for (var e = arguments.length, t = Array(e), r = 0; r < e; r++) t[r] = arguments[r];
            return function(e) {
                return function(r, n, o) {
                    var i, a = e(r, n, o),
                        u = a.dispatch,
                        c = {
                            getState: a.getState,
                            dispatch: function(e) {
                                return u(e)
                            }
                        };
                    return i = t.map(function(e) {
                        return e(c)
                    }), u = function() {
                        for (var e = arguments.length, t = Array(e), r = 0; r < e; r++) t[r] = arguments[r];
                        return 0 === t.length ? function(e) {
                            return e
                        } : 1 === t.length ? t[0] : t.reduce(function(e, t) {
                            return function() {
                                return e(t.apply(void 0, arguments))
                            }
                        })
                    }.apply(void 0, i)(a.dispatch), _n({}, a, {
                        dispatch: u
                    })
                }
            }
        }
        var Nn = "SET_CURRENT_RECORD",
            Mn = "UPDATE_FIELDS",
            Fn = "REFRESH_CURRENT_RECORD",
            Ln = "REFRESH_CURRENT_VIEW",
            Un = "INCREMENT_NUM_PAGES_TO_SHOW",
            Wn = "SET_DEFAULT_RECORD",
            Bn = "GO_TO_INDEX",
            Vn = "GO_TO_NEXT_PAGE",
            Gn = "GO_TO_PREVIOUS_PAGE",
            qn = "LOAD_PAGE",
            Hn = "GET_RECORD_BY_INDEX_RESULT",
            $n = "CURRENT_VIEW_UPDATED",
            Yn = "REVERT_CHANGES",
            zn = "RECORD_REVERTED",
            Xn = "SAVE_RECORD",
            Qn = "SAVE_RECORD_RESULT",
            Zn = "REMOVE_CURRENT_RECORD",
            Jn = "REMOVE_CURRENT_RECORD_RESULT",
            Kn = "NEW_RECORD",
            eo = "NEW_RECORD_RESULT",
            to = "REFRESH",
            ro = {
                INIT: "INIT",
                SET_PAGINATION_DATA: "SET_PAGINATION_DATA"
            },
            no = ro,
            oo = function(e) {
                var t = e.controllerConfig,
                    r = void 0 === t ? {} : t,
                    n = e.connections,
                    o = void 0 === n ? [] : n,
                    i = e.isScoped,
                    a = void 0 !== i && i,
                    u = e.datasetType;
                return {
                    type: ro.INIT,
                    datasetConfig: r.dataset || {},
                    connections: o,
                    isScoped: a,
                    datasetType: u
                }
            },
            io = function(e) {
                return {
                    type: ro.SET_PAGINATION_DATA,
                    paginationData: e
                }
            },
            ao = "SET_FILTER",
            uo = "SET_SORT",
            co = "SET_IS_DATASET_READY",
            so = "SET_FIXED_FILTER_ITEM",
            lo = [{
                type: Ge.AddressInput,
                role: "addressInputRole"
            }, {
                type: Ge.RatingsInput,
                role: "ratingsInputRole"
            }, {
                type: Ge.TextInput,
                role: "textInputRole"
            }, {
                type: Ge.TextBox,
                role: "textAreaRole"
            }, {
                type: Ge.RichTextBox,
                role: "richTextBoxRole"
            }, {
                type: Ge.Checkbox,
                role: "checkboxRole"
            }, {
                type: Ge.DatePicker,
                role: "datepickerRole"
            }, {
                type: Ge.RadioButtonGroup,
                role: "radioGroupRole"
            }, {
                type: Ge.Dropdown,
                role: "dropdownRole"
            }, {
                type: Ge.UploadButton,
                role: me
            }, {
                type: Ge.ToggleSwitch,
                role: "toggleSwitchRole"
            }, {
                type: Ge.Slider,
                role: "sliderRole"
            }, {
                type: Ge.TimePicker,
                role: "timePickerRole"
            }, {
                type: Ge.CheckboxGroup,
                role: "checkboxGroupRole"
            }, {
                type: Ge.SelectionTags,
                role: "selectionTagsRole"
            }, {
                type: Ge.SignatureInput,
                role: ye
            }],
            fo = (lo.map(function(e) {
                return e.type
            }), lo.map(function(e) {
                return e.role
            })),
            po = function(e) {
                return e.some(function(e) {
                    return function(e) {
                        return fo.includes(e)
                    }(Object(o.get)(e, "role"))
                })
            },
            mo = function(e, t) {
                return function(e) {
                    return [we, be].includes(e)
                }(e) && function(e) {
                    return e.some(function(e) {
                        return "save" === Object(o.get)(e, "config.events.onClick.action")
                    })
                }(t) && po(t)
            },
            ho = function() {
                return (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}).readWriteType
            },
            vo = function() {
                return (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}).pageSize
            },
            yo = ho;

        function go(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function bo(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? go(Object(r), !0).forEach(function(t) {
                    wo(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : go(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function wo(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }
        var Oo = function(e) {
                var t = e.error,
                    r = e.payload;
                return t ? Pe.Result.Error(r) : Pe.Result.Ok(r)
            },
            Io = {
                currentRecord: {
                    index: void 0,
                    data: void 0,
                    fieldsToUpdate: void 0,
                    updateSource: void 0
                },
                lastSavedRecord: {
                    index: void 0,
                    data: void 0
                },
                desiredIndex: void 0,
                refreshCurrentRecord: !1,
                removeCurrentRecord: !1,
                newRecordIndex: null,
                refreshCurrentView: !1,
                refreshController: !1,
                revertChanges: !1,
                saveRecord: !1,
                defaultRecord: void 0,
                isForm: void 0,
                page: {
                    numPagesToShow: 1,
                    offset: 0,
                    size: je
                },
                schema: void 0
            },
            Eo = function(e) {
                return function(e, t) {
                    return Object(o.inRange)(e, Po(t).offset, Po(t).offset + Po(t).size)
                }(Co(e), e)
            },
            Ro = function(e, t, r, n) {
                var o = bo(bo({}, e), {}, {
                    currentRecord: {
                        index: t,
                        data: r,
                        updateSource: n
                    },
                    desiredIndex: t,
                    refreshCurrentRecord: !1,
                    refreshController: !1
                });
                return Eo(o) ? o : bo(bo({}, o), {}, {
                    page: bo(bo({}, o.page), {}, {
                        offset: Math.floor(o.currentRecord.index / o.page.size) * o.page.size,
                        numPagesToShow: 1
                    })
                })
            },
            To = function(e) {
                return e.page.size
            },
            jo = function(e) {
                return e.page.numPagesToShow
            },
            So = function(e) {
                return e.currentRecord.data
            },
            Po = function(e) {
                return e.page
            },
            Co = function(e) {
                return e.currentRecord.index
            },
            Do = {
                reducer: function() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : Io,
                        t = arguments.length > 1 ? arguments[1] : void 0;
                    switch (t.type) {
                        case Nn:
                            var r = t.recordIndex,
                                n = t.record,
                                o = t.updateSource;
                            return Ro(e, r, n, o);
                        case Kn:
                            return bo(bo({}, e), {}, {
                                newRecordIndex: t.atIndex
                            });
                        case eo:
                            return Oo(t).fold(function() {
                                return bo(bo({}, e), {}, {
                                    newRecordIndex: null
                                })
                            }, function(t) {
                                return bo(bo({}, Ro(e, e.newRecordIndex, t)), {}, {
                                    newRecordIndex: null
                                })
                            });
                        case Mn:
                            var i = t.fieldsToUpdate,
                                a = t.updateSource;
                            return bo(bo({}, e), {}, {
                                currentRecord: bo(bo({}, e.currentRecord), {}, {
                                    fieldsToUpdate: i,
                                    updateSource: a
                                })
                            });
                        case Bn:
                            return bo(bo({}, e), {}, {
                                desiredIndex: t.index
                            });
                        case Hn:
                            return Oo(t).fold(function() {
                                return bo(bo({}, e), {}, {
                                    desiredIndex: e.currentRecord.index,
                                    refreshCurrentRecord: !1,
                                    refreshController: !1
                                })
                            }, function(t) {
                                return t.matchWith({
                                    Record: function(t) {
                                        var r = t.index,
                                            n = t.record;
                                        return Ro(e, r, n)
                                    },
                                    InvalidIndex: function() {
                                        return bo(bo({}, e), {}, {
                                            desiredIndex: e.currentRecord.index,
                                            refreshCurrentRecord: !1
                                        })
                                    },
                                    NoRecord: function() {
                                        return Ro(e, null, null)
                                    }
                                })
                            });
                        case Fn:
                            return bo(bo({}, e), {}, {
                                refreshCurrentRecord: !0
                            });
                        case Zn:
                            return bo(bo({}, e), {}, {
                                removeCurrentRecord: !0
                            });
                        case Jn:
                            return Oo(t).fold(function() {
                                return bo(bo({}, e), {}, {
                                    removeCurrentRecord: !1
                                })
                            }, function() {
                                return bo(bo({}, e), {}, {
                                    removeCurrentRecord: !1,
                                    refreshCurrentRecord: !0
                                })
                            });
                        case Ln:
                            return bo(bo({}, e), {}, {
                                refreshCurrentView: !0
                            });
                        case $n:
                            return bo(bo({}, e), {}, {
                                refreshCurrentView: !1
                            });
                        case Yn:
                            return bo(bo({}, e), {}, {
                                revertChanges: !0
                            });
                        case zn:
                            return bo(bo({}, e), {}, {
                                revertChanges: !1
                            });
                        case Wn:
                            var u = t.record;
                            return bo(bo({}, e), {}, {
                                defaultRecord: u
                            });
                        case no.INIT:
                            var c = t.datasetConfig,
                                s = t.connections,
                                l = vo(c),
                                f = yo(c);
                            return bo(bo({}, e), {}, {
                                isForm: mo(f, s),
                                page: bo(bo({}, e.page), {}, {
                                    size: l || e.page.size
                                })
                            });
                        case no.SET_PAGINATION_DATA:
                            var d = bo(bo({}, e), {}, {
                                page: bo(bo({}, e.page), t.paginationData)
                            });
                            return Eo(d) ? d : bo(bo({}, d), {}, {
                                desiredIndex: d.page.offset
                            });
                        case Vn:
                            var p = Po(e),
                                m = To(e),
                                h = p.offset + m,
                                v = bo(bo({}, e), {}, {
                                    page: bo(bo({}, e.page), {}, {
                                        numPagesToShow: 1,
                                        offset: h
                                    })
                                });
                            return Eo(v) ? v : bo(bo({}, v), {}, {
                                desiredIndex: v.page.offset
                            });
                        case Gn:
                            var y = Po(e),
                                g = Math.max(0, y.offset - y.size),
                                b = bo(bo({}, e), {}, {
                                    page: bo(bo({}, e.page), {}, {
                                        numPagesToShow: 1,
                                        offset: g
                                    })
                                });
                            return Eo(b) ? b : bo(bo({}, b), {}, {
                                desiredIndex: b.page.offset
                            });
                        case qn:
                            var w = Po(e).size,
                                O = bo(bo({}, e), {}, {
                                    page: bo(bo({}, e.page), {}, {
                                        numPagesToShow: 1,
                                        offset: w * (t.pageNumber - 1)
                                    })
                                });
                            return Eo(O) ? O : bo(bo({}, O), {}, {
                                desiredIndex: O.page.offset
                            });
                        case Un:
                            return bo(bo({}, e), {}, {
                                page: bo(bo({}, e.page), {}, {
                                    numPagesToShow: e.page.numPagesToShow + 1
                                })
                            });
                        case Xn:
                            return bo(bo({}, e), {}, {
                                saveRecord: !0,
                                lastSavedRecord: {
                                    index: void 0,
                                    data: void 0
                                }
                            });
                        case Qn:
                            return Oo(t).fold(function() {
                                return bo(bo({}, e), {}, {
                                    saveRecord: !1
                                })
                            }, function(t) {
                                return bo(bo({}, e), {}, {
                                    saveRecord: !1,
                                    lastSavedRecord: {
                                        index: e.currentRecord.index,
                                        data: t
                                    }
                                })
                            });
                        case ao:
                        case uo:
                        case to:
                            return bo(bo({}, e), {}, {
                                refreshController: !0
                            });
                        default:
                            return e
                    }
                },
                getCurrentPageSize: To,
                getNumberOfPagesToShow: jo,
                getPaginationData: Po,
                getCurrentPage: function(e) {
                    return e.page.offset / To(e) + jo(e)
                },
                hasCurrentRecord: function(e) {
                    return !!So(e)
                },
                selectDefaultDraft: function(e) {
                    return bo({}, e.defaultRecord)
                },
                selectCurrentRecord: So,
                selectCurrentRecordIndex: Co,
                selectDesiredRecordIndex: function(e) {
                    return e.desiredIndex
                },
                selectFieldsToUpdate: function(e) {
                    return e.currentRecord.fieldsToUpdate
                },
                selectLastSavedRecord: function(e) {
                    return e.lastSavedRecord.data
                },
                selectLastSavedRecordIndex: function(e) {
                    return e.lastSavedRecord.index
                },
                selectRefreshCurrentRecord: function(e) {
                    return e.refreshCurrentRecord
                },
                selectRemoveCurrentRecord: function(e) {
                    return e.removeCurrentRecord
                },
                selectRefreshController: function(e) {
                    return e.refreshController
                },
                selectRefreshCurrentView: function(e) {
                    return e.refreshCurrentView
                },
                selectRevertChanges: function(e) {
                    return e.revertChanges
                },
                selectSaveRecord: function(e) {
                    return e.saveRecord
                },
                selectUpdateSource: function(e) {
                    return e.currentRecord.updateSource
                },
                selectNewRecordIndex: function(e) {
                    return e.newRecordIndex
                },
                isDuringSave: function(e) {
                    return e.saveRecord
                },
                isForm: function(e) {
                    return e.isForm
                }
            };

        function xo(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function Ao(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? xo(Object(r), !0).forEach(function(t) {
                    _o(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : xo(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function _o(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }
        var ko = we,
            No = ["collectionName", "readWriteType", "includes", "preloadData"],
            Mo = ["filter", "sort", "pageSize"],
            Fo = function(e) {
                return Object(o.pick)(e, No)
            },
            Lo = function(e) {
                return Object(o.pick)(e, Mo)
            },
            Uo = function(e, t) {
                return Ao(Ao({}, e), {}, {
                    transientData: Ao(Ao({}, e.transientData), t)
                })
            },
            Wo = {
                canonicalData: Fo(n),
                canonicalCalculatedData: {},
                transientData: Ao({
                    isDatasetReady: !1,
                    allowWixDataAccess: void 0
                }, Lo(n))
            },
            Bo = {
                reducer: function() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : Wo,
                        t = arguments.length > 1 ? arguments[1] : void 0;
                    switch (t.type) {
                        case no.INIT:
                            var r = Object(o.get)(t, ["datasetConfig", "preloadData"], !0),
                                n = t.datasetConfig,
                                i = t.connections,
                                a = t.isScoped,
                                u = t.datasetType;
                            return Ao(Ao({}, e), {}, {
                                canonicalData: Ao(Ao({}, e.canonicalData), Fo(t.datasetConfig)),
                                canonicalCalculatedData: function(e) {
                                    var t = e.datasetConfig,
                                        r = e.connections,
                                        n = e.isScoped,
                                        o = "router_dataset" === e.datasetType,
                                        i = r.some(function(e) {
                                            return "detailsDatasetRole" === e.role
                                        }),
                                        a = n,
                                        u = !n,
                                        c = t.readWriteType === ko;
                                    return {
                                        datasetIsRouter: o,
                                        datasetIsMaster: i,
                                        datasetIsVirtual: a,
                                        datasetIsReal: u,
                                        datasetIsDeferred: Boolean(t.deferred) && !(a || i || o || c),
                                        dynamicPageNavComponentsShouldBeLinked: o && u
                                    }
                                }({
                                    datasetConfig: n,
                                    connections: i,
                                    isScoped: a,
                                    datasetType: u
                                }),
                                transientData: Ao(Ao(Ao({}, e.transientData), Lo(t.datasetConfig)), {}, {
                                    allowWixDataAccess: r
                                })
                            });
                        case ao:
                            var c = t.filter;
                            return Uo(e, {
                                filter: c,
                                allowWixDataAccess: !0
                            });
                        case uo:
                            var s = t.sort;
                            return Uo(e, {
                                sort: s
                            });
                        case co:
                            var l = t.isDatasetReady;
                            return Uo(e, {
                                isDatasetReady: l
                            });
                        case so:
                            var f = t.fixedFilterItem;
                            return Uo(e, {
                                fixedFilterItem: f
                            });
                        case to:
                            return Uo(e, {
                                allowWixDataAccess: !0
                            });
                        default:
                            return e
                    }
                },
                isWriteOnly: function(e) {
                    return Object(o.get)(e, ["canonicalData", "readWriteType"]) === we
                },
                isReadOnly: function(e) {
                    return "READ" === Object(o.get)(e, ["canonicalData", "readWriteType"])
                },
                getReadWriteMode: function(e) {
                    return Object(o.get)(e, ["canonicalData", "readWriteType"])
                },
                isDatasetReady: function(e) {
                    return Object(o.get)(e, ["transientData", "isDatasetReady"])
                },
                isDatasetConfigured: function(e) {
                    return !!Object(o.get)(e, ["canonicalData", "collectionName"])
                },
                isDatasetRouter: function(e) {
                    return e.canonicalCalculatedData.datasetIsRouter
                },
                isDatasetMaster: function(e) {
                    return e.canonicalCalculatedData.datasetIsMaster
                },
                isDatasetVirtual: function(e) {
                    return e.canonicalCalculatedData.datasetIsVirtual
                },
                isDatasetReal: function(e) {
                    return e.canonicalCalculatedData.datasetIsReal
                },
                isDatasetDeferred: function(e) {
                    return e.canonicalCalculatedData.datasetIsDeferred
                },
                shouldLinkDynamicPageNavComponents: function(e) {
                    return e.canonicalCalculatedData.dynamicPageNavComponentsShouldBeLinked
                },
                getPageSize: function(e) {
                    return Object(o.get)(e, ["transientData", "pageSize"])
                },
                getFixedFilterItem: function(e) {
                    return Object(o.get)(e, ["transientData", "fixedFilterItem"])
                },
                getFilter: function(e) {
                    return Object(o.get)(e, ["transientData", "filter"])
                },
                getSort: function(e) {
                    return Object(o.get)(e, ["transientData", "sort"])
                },
                getIncludes: function(e) {
                    return Object(o.get)(e, ["canonicalData", "includes"]) || []
                },
                getCollectionName: function(e) {
                    return Object(o.get)(e, ["canonicalData", "collectionName"])
                },
                getPreloadData: function(e) {
                    return Object(o.get)(e, ["canonicalData", "preloadData"], !0)
                },
                shouldAllowWixDataAccess: function(e) {
                    return Object(o.get)(e, ["transientData", "allowWixDataAccess"])
                }
            },
            Vo = r(53),
            Go = r.n(Vo),
            qo = "RESOLVE_DEPENDENCIES",
            Ho = "SET_DEPENDENCIES",
            $o = "PERFORM_HANDSHAKES",
            Yo = "RESOLVE_MISSING_DEPENDENCIES";

        function zo(e, t) {
            for (var r = 0; r < t.length; r++) {
                var n = t[r];
                n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
            }
        }
        var Xo = Pe.Maybe.Nothing(),
            Qo = "UNKNOWN",
            Zo = "PERFORMED_HANDSHAKE",
            Jo = "READY",
            Ko = "MISSING",
            ei = function(e, t) {
                var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
                return e.reduce(function(e, r) {
                    return e[r] = t, e
                }, r)
            },
            ti = {
                reducer: Go()(Xo, new(function(e, t, r, n) {
                    function o() {
                        ! function(e, t) {
                            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                        }(this, o)
                    }
                    return function(e, t, r) {
                        t && zo(e.prototype, t), r && zo(e, r)
                    }(o, [{
                        key: Ho,
                        value: function(e, t) {
                            return Pe.Maybe.Just(ei(t.dependenciesIds, Qo))
                        }
                    }, {
                        key: qo,
                        value: function(e, t) {
                            return e.map(function(e) {
                                return ei(t.dependenciesIds, Jo, e)
                            })
                        }
                    }, {
                        key: $o,
                        value: function(e, t) {
                            return e.map(function(e) {
                                return ei(t.dependenciesIds, Zo, e)
                            })
                        }
                    }, {
                        key: Yo,
                        value: function(e) {
                            return e.map(function(e) {
                                return Object.keys(e).reduce(function(e, t) {
                                    return e[t] = e[t] === Qo ? Ko : e[t], e
                                }, e)
                            })
                        }
                    }]), o
                }())),
                areDependenciesResolved: function(e) {
                    return e.map(function(e) {
                        return Object(o.every)(Object(o.values)(e), function(e) {
                            return e === Ko || e === Jo
                        })
                    }).getOrElse(!1)
                }
            },
            ri = "NEXT_DYNAMIC_PAGE_URL_RESULT",
            ni = "PREVIOUS_DYNAMIC_PAGE_URL_RESULT",
            oi = "INITIALIZE",
            ii = Object(Pe.union)("DynamicPageUrlLoadState", {
                Empty: function() {},
                Loading: function() {},
                Loaded: function(e) {
                    if (!e) throw new Error("url must exist");
                    return {
                        url: e
                    }
                }
            }, {
                hasUrl: function(e) {
                    return function() {
                        return e.matchWith({
                            Empty: function() {
                                return !1
                            },
                            Loading: function() {
                                return !1
                            },
                            Loaded: function() {
                                return !0
                            }
                        })
                    }
                },
                shouldLoadUrl: function(e) {
                    return function() {
                        return e.matchWith({
                            Empty: function() {
                                return !1
                            },
                            Loading: function() {
                                return !0
                            },
                            Loaded: function() {
                                return !1
                            }
                        })
                    }
                }
            });
        ii.fromUrl = function(e) {
            return e ? ii.Loaded(e) : ii.Empty()
        };
        var ai = ii;
        ii.fromUrl;

        function ui(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function ci(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? ui(Object(r), !0).forEach(function(t) {
                    si(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ui(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function si(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }
        var li = {
                nextDynamicPageUrl: ai.Empty(),
                previousDynamicPageUrl: ai.Empty()
            },
            fi = function(e) {
                var t = function(e) {
                        var t = e.filter(function(e) {
                            return !!Object(o.get)(e, "config.events.onClick.action")
                        });
                        return new Set(t.map(function(e) {
                            return Object(o.get)(e, "config.events.onClick.action")
                        }))
                    }(e),
                    r = function(e) {
                        return e ? ai.Loading() : ai.Empty()
                    };
                return {
                    nextDynamicPageUrl: r(t.has("nextDynamicPage")),
                    previousDynamicPageUrl: r(t.has("previousDynamicPage"))
                }
            },
            di = {
                reducer: function() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : li,
                        t = arguments.length > 1 ? arguments[1] : void 0;
                    switch (t.type) {
                        case oi:
                            return ci(ci({}, e), fi(t.connections));
                        case ri:
                            return ci(ci({}, e), {}, {
                                nextDynamicPageUrl: ai.fromUrl(t.payload)
                            });
                        case ni:
                            return ci(ci({}, e), {}, {
                                previousDynamicPageUrl: ai.fromUrl(t.payload)
                            });
                        default:
                            return e
                    }
                },
                selectNextDynamicPageUrl: function(e) {
                    return e.nextDynamicPageUrl
                },
                selectPreviousDynamicPageUrl: function(e) {
                    return e.previousDynamicPageUrl
                }
            },
            pi = function(e) {
                for (var t = Object.keys(e), r = {}, n = 0; n < t.length; n++) {
                    var o = t[n];
                    "function" == typeof e[o] && (r[o] = e[o])
                }
                var i = Object.keys(r),
                    a = void 0;
                try {
                    ! function(e) {
                        Object.keys(e).forEach(function(t) {
                            var r = e[t];
                            if (void 0 === r(void 0, {
                                    type: Dn.INIT
                                })) throw new Error('Reducer "' + t + "\" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.");
                            if (void 0 === r(void 0, {
                                    type: "@@redux/PROBE_UNKNOWN_ACTION_" + Math.random().toString(36).substring(7).split("").join(".")
                                })) throw new Error('Reducer "' + t + "\" returned undefined when probed with a random type. Don't try to handle " + Dn.INIT + ' or other actions in "redux/*" namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.')
                        })
                    }(r)
                } catch (e) {
                    a = e
                }
                return function() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                        t = arguments[1];
                    if (a) throw a;
                    for (var n = !1, o = {}, u = 0; u < i.length; u++) {
                        var c = i[u],
                            s = r[c],
                            l = e[c],
                            f = s(l, t);
                        if (void 0 === f) {
                            var d = An(c, t);
                            throw new Error(d)
                        }
                        o[c] = f, n = n || f !== l
                    }
                    return n ? o : e
                }
            }({
                records: Do.reducer,
                config: Bo.reducer,
                dependencyResolution: ti.reducer,
                dynamicPages: di.reducer
            }),
            mi = function(e) {
                return Bo.shouldAllowWixDataAccess(e.config)
            },
            hi = function(e) {
                return ti.areDependenciesResolved(e.dependencyResolution)
            },
            vi = function(e) {
                return Bo.getCollectionName(e.config)
            },
            yi = function(e) {
                return Do.getCurrentPageSize(e.records)
            },
            gi = function(e, t) {
                return Math.ceil(t / yi(e))
            },
            bi = function(e) {
                return Bo.getFilter(e.config)
            },
            wi = function(e) {
                return Bo.getSort(e.config)
            },
            Oi = function(e) {
                return Do.getPaginationData(e.records)
            },
            Ii = function(e) {
                return Bo.getReadWriteMode(e.config)
            },
            Ei = function(e) {
                return Do.hasCurrentRecord(e.records)
            },
            Ri = function(e) {
                return Bo.isDatasetConfigured(e.config)
            },
            Ti = function(e) {
                return Bo.isDatasetReady(e.config)
            },
            ji = function(e) {
                return Bo.isReadOnly(e.config)
            },
            Si = function(e) {
                return Bo.isWriteOnly(e.config)
            },
            Pi = function(e) {
                return Ei(e) && !ji(e)
            },
            Ci = function(e) {
                return {
                    datasetIsRouter: function(e) {
                        return Bo.isDatasetRouter(e.config)
                    }(e),
                    datasetIsMaster: function(e) {
                        return Bo.isDatasetMaster(e.config)
                    }(e),
                    datasetIsVirtual: function(e) {
                        return Bo.isDatasetVirtual(e.config)
                    }(e),
                    datasetIsReal: function(e) {
                        return Bo.isDatasetReal(e.config)
                    }(e),
                    datasetIsDeferred: function(e) {
                        return Bo.isDatasetDeferred(e.config)
                    }(e),
                    datasetIsWriteOnly: Si(e),
                    datasetCollectionName: vi(e),
                    dynamicPageNavComponentsShouldBeLinked: function(e) {
                        return Bo.shouldLinkDynamicPageNavComponents(e.config)
                    }(e)
                }
            },
            Di = function(e) {
                return Do.selectCurrentRecord(e.records)
            },
            xi = function(e) {
                return Do.selectCurrentRecordIndex(e.records)
            },
            Ai = function(e) {
                return Do.selectDefaultDraft(e.records)
            },
            _i = function(e) {
                return Do.selectDesiredRecordIndex(e.records)
            },
            ki = function(e) {
                return Do.selectFieldsToUpdate(e.records)
            },
            Ni = function(e) {
                return Do.selectLastSavedRecord(e.records)
            },
            Mi = function(e) {
                return Do.selectUpdateSource(e.records)
            },
            Fi = function(e) {
                return Do.selectNewRecordIndex(e.records)
            },
            Li = function(e) {
                return di.selectNextDynamicPageUrl(e.dynamicPages)
            },
            Ui = function(e) {
                return di.selectPreviousDynamicPageUrl(e.dynamicPages)
            },
            Wi = function(e) {
                return Do.selectRefreshController(e.records)
            },
            Bi = function(e) {
                return Do.selectRefreshCurrentRecord(e.records)
            },
            Vi = function(e) {
                return Do.selectRefreshCurrentView(e.records)
            },
            Gi = function(e) {
                return Do.selectRemoveCurrentRecord(e.records)
            },
            qi = function(e) {
                return Do.selectRevertChanges(e.records)
            },
            Hi = function(e) {
                return Do.selectSaveRecord(e.records)
            };

        function $i(e, t, r, n, o, i, a) {
            try {
                var u = e[i](a),
                    c = u.value
            } catch (e) {
                return void r(e)
            }
            u.done ? t(c) : Promise.resolve(c).then(n, o)
        }
        var Yi = Object(Pe.union)("GoToIndexResult", {
                Record: function(e, t) {
                    return {
                        index: e,
                        record: t
                    }
                },
                InvalidIndex: function() {
                    return {}
                },
                NoRecord: function() {
                    return {}
                }
            }),
            zi = function(e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                return {
                    type: Bn,
                    index: e,
                    suppressRefreshView: t
                }
            },
            Xi = function(e, t) {
                return {
                    type: Mn,
                    fieldsToUpdate: e,
                    updateSource: t
                }
            },
            Qi = function(e) {
                return {
                    type: Kn,
                    atIndex: e
                }
            },
            Zi = function() {
                return {
                    type: to
                }
            },
            Ji = function() {
                var e = function(e) {
                    return function() {
                        var t = this,
                            r = arguments;
                        return new Promise(function(n, o) {
                            var i = e.apply(t, r);

                            function a(e) {
                                $i(i, n, o, a, u, "next", e)
                            }

                            function u(e) {
                                $i(i, n, o, a, u, "throw", e)
                            }
                            a(void 0)
                        })
                    }
                }(regeneratorRuntime.mark(function e(t, r, n, o) {
                    var i;
                    return regeneratorRuntime.wrap(function(e) {
                        for (;;) switch (e.prev = e.next) {
                            case 0:
                                return e.next = 2, t(o).fold(function() {
                                    return Ut.Empty()
                                }, function(e) {
                                    return e.externalApi.getRecordsLimitedByMaxPageSize(r, n)
                                });
                            case 2:
                                return i = e.sent, e.abrupt("return", i.get());
                            case 4:
                            case "end":
                                return e.stop()
                        }
                    }, e)
                }));
                return function(t, r, n, o) {
                    return e.apply(this, arguments)
                }
            }(),
            Ki = function(e, t) {
                var r = yi(t) * function(e) {
                        return Do.getNumberOfPagesToShow(e.records)
                    }(t),
                    n = Oi(t).offset;
                return Ji(e, n, r)
            },
            ea = {
                doFetch: Ji,
                fetchCurrentPage: Ki,
                flushDraft: function() {
                    return {
                        type: Xn
                    }
                },
                goToRecordByIndexResult: function(e, t) {
                    return {
                        type: Hn,
                        error: e,
                        payload: t
                    }
                },
                incrementNumOfPagesToShow: function() {
                    return {
                        type: Un
                    }
                },
                initWriteOnly: function(e) {
                    return e ? zi(0) : Qi(0)
                },
                loadPage: function(e) {
                    return {
                        type: qn,
                        pageNumber: e
                    }
                },
                newRecord: Qi,
                newRecordResult: function(e, t) {
                    return {
                        type: eo,
                        error: e,
                        payload: t
                    }
                },
                nextPage: function() {
                    return {
                        type: Vn
                    }
                },
                previousPage: function() {
                    return {
                        type: Gn
                    }
                },
                reInitWriteOnly: function() {
                    return Qi(0)
                },
                refresh: Zi,
                refreshCurrentRecord: function() {
                    return {
                        type: Fn
                    }
                },
                refreshCurrentView: function() {
                    return {
                        type: Ln
                    }
                },
                refreshResult: function(e, t) {
                    return {
                        type: Hn,
                        error: e,
                        payload: t
                    }
                },
                remove: function() {
                    return {
                        type: Zn
                    }
                },
                removeCurrentRecordResult: function(e, t) {
                    return {
                        type: Jn,
                        error: e,
                        payload: t
                    }
                },
                revert: function() {
                    return {
                        type: Yn
                    }
                },
                revertResult: function(e, t) {
                    return {
                        type: zn,
                        error: e,
                        payload: t
                    }
                },
                saveRecordResult: function(e, t) {
                    return {
                        type: Qn,
                        error: e,
                        payload: t
                    }
                },
                setCurrentIndex: zi,
                setCurrentRecord: function(e, t, r) {
                    return {
                        type: Nn,
                        record: e,
                        recordIndex: t,
                        updateSource: r
                    }
                },
                setDefaultRecord: function(e) {
                    return {
                        type: Wn,
                        record: e
                    }
                },
                updateCurrentViewResult: function(e, t) {
                    return {
                        type: $n,
                        error: e,
                        payload: t
                    }
                },
                updateFields: Xi,
                GoToIndexResult: Yi
            },
            ta = function(e) {
                return {
                    type: oi,
                    connections: e
                }
            },
            ra = function(e) {
                return {
                    type: ao,
                    filter: e
                }
            },
            na = function(e) {
                return {
                    type: uo,
                    sort: e
                }
            },
            oa = function(e) {
                return {
                    type: co,
                    isDatasetReady: e
                }
            },
            ia = function(e, t) {
                return "".concat(e, " (").concat(t, ")")
            },
            aa = r(54),
            ua = r.n(aa),
            ca = function(e, t) {
                var r = ua.a.createMiddleware(),
                    n = r.middleware,
                    i = r.subscribe,
                    a = r.onIdle;
                return {
                    store: xn(pi, void 0, kn(n, function(e, t) {
                        return function(r) {
                            return function(r) {
                                return function(n) {
                                    return e.trace(It.a.Breadcrumb({
                                        category: "redux",
                                        message: ia(n.type, t),
                                        data: Object(o.omit)(n, "type", "record")
                                    })), r(n)
                                }
                            }
                        }
                    }(e, t))),
                    subscribe: i,
                    onIdle: a
                }
            };

        function sa(e) {
            "@babel/helpers - typeof";
            return (sa = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            })(e)
        }

        function la(e, t) {
            return (la = Object.setPrototypeOf || function(e, t) {
                return e.__proto__ = t, e
            })(e, t)
        }

        function fa(e) {
            var t = function() {
                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0
                } catch (e) {
                    return !1
                }
            }();
            return function() {
                var r, n = da(e);
                if (t) {
                    var o = da(this).constructor;
                    r = Reflect.construct(n, arguments, o)
                } else r = n.apply(this, arguments);
                return function(e, t) {
                    if (t && ("object" === sa(t) || "function" == typeof t)) return t;
                    if (void 0 !== t) throw new TypeError("Derived constructors may only return object or undefined");
                    return function(e) {
                        if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        return e
                    }(e)
                }(this, r)
            }
        }

        function da(e) {
            return (da = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                return e.__proto__ || Object.getPrototypeOf(e)
            })(e)
        }
        var pa, ma = "DatasetError",
            ha = function(e) {
                ! function(e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                    e.prototype = Object.create(t && t.prototype, {
                        constructor: {
                            value: e,
                            writable: !0,
                            configurable: !0
                        }
                    }), t && la(e, t)
                }(r, m["a"]);
                var t = fa(r);

                function r(e, n) {
                    var o;
                    return function(e, t) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    }(this, r), (o = t.call(this, n)).name = ma, o.code = e, o
                }
                return r
            }(),
            va = function(e, t, r) {
                var n = r.controllerApi,
                    i = r.controllerConfig,
                    a = r.controllerConfigured,
                    u = r.connectionConfig;
                if ("detailsDatasetRole" === r.role) {
                    var c = function(e) {
                            var t = e.controllerApi,
                                r = e.connectionConfig;
                            return Object(o.mapValues)(r.filters, function(e) {
                                return {
                                    fieldName: e.fieldName,
                                    controllerApi: t
                                }
                            })
                        }({
                            controllerApi: n,
                            connectionConfig: u
                        }),
                        s = Object.keys(c);
                    a && (e.add(c), t(function(e) {
                        return {
                            type: $o,
                            dependenciesIds: e
                        }
                    }(s)));
                    try {
                        var l = n.onReady(function() {
                            t(function(e) {
                                return {
                                    type: qo,
                                    dependenciesIds: e
                                }
                            }(s));
                            var r = ho(i.dataset);
                            if (r !== we) {
                                var o = n.onCurrentIndexChanged(function() {
                                    return t(ea.refresh())
                                });
                                e.saveHandle(o)
                            }
                            if ("READ" !== r) {
                                var a = n.onItemValuesChanged(function() {
                                    return t(ea.refresh())
                                });
                                e.saveHandle(a)
                            }
                        });
                        e.saveHandle(l)
                    } catch (e) {
                        console.error(new ha("DS_EMPTY_URL_FIELD", "The dataset cannot filter by the dynamic dataset because the field used to build this page's URL is empty"))
                    }
                }
            };

        function ya(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }
        var ga = we,
            ba = be,
            wa = (ya(pa = {}, "READ", "read-only"), ya(pa, ga, "write-only"), ya(pa, ba, "read-write"), pa),
            Oa = function(e, t) {
                if (function(e) {
                        return Do.isDuringSave(e.records)
                    }(e())) throw new ha("OPERATION_NOT_ALLOWED", "Operation (".concat(t, ") not allowed during save"))
            },
            Ia = function(e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
                    r = arguments.length > 2 ? arguments[2] : void 0,
                    n = arguments.length > 3 ? arguments[3] : void 0,
                    i = !(arguments.length > 4 && void 0 !== arguments[4]) || arguments[4];
                ! function(e, t, r) {
                    if (!Ri(e())) throw new ha("OPERATION_NOT_ALLOWED", "Operation (".concat(t, "router_dataset" === r ? ") is not allowed because the field used to build this page's URL is empty" : ") not allowed on an unconfigured dataset"))
                }(e, t, n),
                function(e, t) {
                    var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [],
                        n = Ii(e());
                    if (!Object(o.includes)(r, n)) throw new ha("OPERATION_NOT_ALLOWED", "Operation (".concat(t, ") not allowed on ").concat(wa[n], " dataset"))
                }(e, t, r), i || Oa(e, t)
            },
            Ea = function(e) {
                if (!Object(o.isInteger)(e)) throw new ha("PARAMETER_NOT_ALLOWED", "Parameter (".concat(e, ") must be a number"))
            },
            Ra = function(e, t) {
                if (!Object(o.isNumber)(t)) throw new ha("DS_INVALID_ARGUMENT", "Parameter (".concat(e, ") must be a number"))
            },
            Ta = function(e, t) {
                if (!Object(o.isInteger)(t) || t < 1) throw new ha("DS_INVALID_ARGUMENT", "Parameter (".concat(e, ") must be a positive integer number"))
            },
            ja = function(e, t) {
                if (Ta("pageNumber", e), e > t) throw new ha("NO_SUCH_PAGE", "Page ".concat(e, " does not exist"))
            },
            Sa = function(e, t) {
                if (!Object(o.isFunction)(t)) throw new ha("DS_INVALID_ARGUMENT", "The callback passed to (".concat(e, ") must be a function"))
            },
            Pa = function(e) {
                if (!e || !Object(o.isFunction)(e._build)) throw new ha("DS_INVALID_ARGUMENT", "The given filter object is invalid")
            },
            Ca = function(e) {
                if (!e || !Object(o.isFunction)(e._build)) throw new ha("DS_INVALID_ARGUMENT", "The given sort object is invalid")
            },
            Da = function(e, t) {
                if (!Ti(e())) throw new ha("DS_NOT_LOADED", "The dataset didn't load yet. You need to call ".concat(t, " inside the onReady for the dataset."))
            },
            xa = function(e) {
                if (null == xi(e())) throw new ha("DS_NO_CURRENT_ITEM", "There is no current item")
            },
            Aa = function(e, t) {
                if (e) throw new ha("OPERATION_NOT_ALLOWED", 'The "'.concat(t, '" function cannot be called on the dataset because the dataset was selected using a repeated item scope selector.\nRead more about repeated item scope selectors: http://wix.to/94BuAAs/$w.Repeater.html#repeated-item-scope'))
            };

        function _a(e, t, r, n, o, i, a) {
            try {
                var u = e[i](a),
                    c = u.value
            } catch (e) {
                return void r(e)
            }
            u.done ? t(c) : Promise.resolve(c).then(n, o)
        }

        function ka(e) {
            return function() {
                var t = this,
                    r = arguments;
                return new Promise(function(n, o) {
                    var i = e.apply(t, r);

                    function a(e) {
                        _a(i, n, o, a, u, "next", e)
                    }

                    function u(e) {
                        _a(i, n, o, a, u, "throw", e)
                    }
                    a(void 0)
                })
            }
        }
        var Na = function(e) {
            var t = e.datasetType,
                r = e.siblingDynamicPageUrlGetter,
                n = {
                    getNextDynamicPage: function() {
                        return ka(regeneratorRuntime.mark(function e() {
                            return regeneratorRuntime.wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return e.abrupt("return", null != r ? r.getNextDynamicPageUrl() : null);
                                    case 1:
                                    case "end":
                                        return e.stop()
                                }
                            }, e)
                        }))()
                    },
                    getPreviousDynamicPage: function() {
                        return ka(regeneratorRuntime.mark(function e() {
                            return regeneratorRuntime.wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return e.abrupt("return", r ? r.getPreviousDynamicPageUrl() : null);
                                    case 1:
                                    case "end":
                                        return e.stop()
                                }
                            }, e)
                        }))()
                    }
                };
            return Object(o.mapValues)(n, function(e, r) {
                return function() {
                    return function(e, t) {
                        if ("router_dataset" !== e) throw new ha("OPERATION_NOT_ALLOWED", '"'.concat(t, '" function on the dataset is not allowed. "').concat(t, '" can only be called on a Dynamic Page Dataset.'))
                    }(t, r), e.apply(void 0, arguments)
                }
            })
        };

        function Ma(e, t, r) {
            var n = Object(o.isUndefined)(r) ? ["[wix-dataset.".concat(t, "] returned")] : ["[wix-dataset.".concat(t, "] returned with ("), JSON.stringify(r), ")"];
            e.apply(void 0, n)
        }
        var Fa = o.noop,
            La = ["onReady", "onError", "onBeforeSave", "onAfterSave", "onCurrentIndexChanged", "onItemValuesChanged"],
            Ua = new Map([
                ["new", "add"]
            ]),
            Wa = function(e, t, r) {
                return function() {
                    for (var n = arguments.length, o = new Array(n), i = 0; i < n; i++) o[i] = arguments[i];
                    if (La.includes(r)) return e("[".concat(r, " callback registered] on wix-dataset")), t.apply(void 0, o);
                    ! function(e, t, r) {
                        var n = 0 === r.length ? ["[wix-dataset.".concat(t, "] called")] : ["[wix-dataset.".concat(t, "] called with ("), JSON.stringify(r), ")"];
                        e.apply(void 0, n)
                    }(e, r, o),
                    function(e, t) {
                        if (Ua.has(t)) {
                            var r = Ua.get(t),
                                n = r ? "; use [wix-dataset.".concat(r, "] instead") : "";
                            e("[wix-dataset.".concat(t, "] is deprecated").concat(n))
                        }
                    }(e, r);
                    var a = t.apply(void 0, o);
                    return function(e) {
                        return e && "function" == typeof e.then
                    }(a) ? a.then(function(t) {
                        return Ma(e, r, t), t
                    }) : (Ma(e, r, a), a)
                }
            },
            Ba = function(e, t) {
                for (var r = arguments.length, n = new Array(r > 2 ? r - 2 : 0), i = 2; i < r; i++) n[i - 2] = arguments[i];
                if (Object(o.isEmpty)(n)) e("[".concat(t, " event] triggered on wix-dataset"));
                else {
                    var a = n.map(function(e) {
                        return Object(o.isError)(e) ? e.toString() : e
                    });
                    e("[".concat(t, " event] triggered on wix-dataset with ("), JSON.stringify(a), ")")
                }
            };

        function Va(e, t, r, n, o, i, a) {
            try {
                var u = e[i](a),
                    c = u.value
            } catch (e) {
                return void r(e)
            }
            u.done ? t(c) : Promise.resolve(c).then(n, o)
        }

        function Ga(e) {
            return function() {
                var t = this,
                    r = arguments;
                return new Promise(function(n, o) {
                    var i = e.apply(t, r);

                    function a(e) {
                        Va(i, n, o, a, u, "next", e)
                    }

                    function u(e) {
                        Va(i, n, o, a, u, "throw", e)
                    }
                    a(void 0)
                })
            }
        }
        var qa = we,
            Ha = be,
            $a = function(e) {
                var t = e.store,
                    r = t.dispatch,
                    n = t.getState,
                    i = e.recordStore,
                    a = e.logger,
                    u = e.eventListeners,
                    c = u.fireEvent,
                    s = u.register,
                    l = e.handshakes,
                    f = e.controllerStore,
                    d = e.errorReporter,
                    p = e.verboseReporter,
                    h = e.datasetId,
                    v = e.datasetType,
                    y = (e.isForUser, e.isFixedItem),
                    g = e.siblingDynamicPageUrlGetter,
                    b = e.dependenciesManager,
                    w = e.onIdle,
                    O = e.getConnectedComponentIds,
                    I = Object(m.b)(a, function(e, t) {
                        return {
                            category: "datasetAPI",
                            level: "info",
                            message: "".concat(e, "-").concat(h)
                        }
                    }, function(e) {}).withBreadcrumbs,
                    E = function(e) {
                        return function(t) {
                            return I(e, t)
                        }
                    },
                    R = function(e, t) {
                        c("datasetError", e, t)
                    },
                    T = function() {
                        return xi(n())
                    },
                    j = function() {
                        return i().fold(function() {
                            return null
                        }, function(e) {
                            return e.getMatchingRecordCount()
                        })
                    },
                    S = function() {
                        var e = Ga(regeneratorRuntime.mark(function e() {
                            var t;
                            return regeneratorRuntime.wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return e.prev = 0, e.next = 3, r(ea.flushDraft());
                                    case 3:
                                        return t = Ni(n()) || Di(n()), e.abrupt("return", Object(o.cloneDeep)(t));
                                    case 7:
                                        throw e.prev = 7, e.t0 = e.catch(0), R("save", e.t0), e.t0;
                                    case 11:
                                    case "end":
                                        return e.stop()
                                }
                            }, e, null, [
                                [0, 7]
                            ])
                        }));
                        return function() {
                            return e.apply(this, arguments)
                        }
                    }(),
                    P = function() {
                        var e = Ga(regeneratorRuntime.mark(function e(t, o) {
                            var i, a, u;
                            return regeneratorRuntime.wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return Da(n, o), Ia(n, o, [qa, Ha], v, !1), t && Ra("atIndex", t), e.prev = 3, e.next = 6, S();
                                    case 6:
                                        if (i = T(), a = null != t ? t : null == i ? 0 : i + 1, u = j(), !(a < 0 || null != u && a > u)) {
                                            e.next = 11;
                                            break
                                        }
                                        throw new ha("DS_INDEX_OUT_OF_RANGE", "Invalid index");
                                    case 11:
                                        return e.next = 13, r(ea.newRecord(a));
                                    case 13:
                                        e.next = 19;
                                        break;
                                    case 15:
                                        throw e.prev = 15, e.t0 = e.catch(3), R(o, e.t0), e.t0;
                                    case 19:
                                    case "end":
                                        return e.stop()
                                }
                            }, e, null, [
                                [3, 15]
                            ])
                        }));
                        return function(t, r) {
                            return e.apply(this, arguments)
                        }
                    }();
                return function(e) {
                    var t = e ? a.userCodeZone : o.identity,
                        u = {
                            isIdle: function() {
                                return Ga(regeneratorRuntime.mark(function e() {
                                    return regeneratorRuntime.wrap(function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                return e.next = 2, new Promise(function(e) {
                                                    var t = w(function() {
                                                        t(), e()
                                                    })
                                                });
                                            case 2:
                                            case "end":
                                                return e.stop()
                                        }
                                    }, e)
                                }))()
                            },
                            onBeforeSave: function(e) {
                                return Sa("onBeforeSave", e), Ia(n, "onBeforeSave", [qa, Ha], v, !1), s("beforeSave", t(e))
                            },
                            onAfterSave: function(e) {
                                return Sa("onAfterSave", e), Ia(n, "onAfterSave", [qa, Ha], v, !1), s("afterSave", t(e))
                            },
                            save: function() {
                                return Ga(regeneratorRuntime.mark(function e() {
                                    var t;
                                    return regeneratorRuntime.wrap(function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                return Ia(n, "save", [qa, Ha], v, !1), e.next = 3, S();
                                            case 3:
                                                if (t = e.sent, !Si(n())) {
                                                    e.next = 7;
                                                    break
                                                }
                                                return e.next = 7, r(ea.reInitWriteOnly());
                                            case 7:
                                                return e.abrupt("return", t);
                                            case 8:
                                            case "end":
                                                return e.stop()
                                        }
                                    }, e)
                                }))()
                            },
                            getItems: function(e, t) {
                                return Ga(regeneratorRuntime.mark(function r() {
                                    return regeneratorRuntime.wrap(function(r) {
                                        for (;;) switch (r.prev = r.next) {
                                            case 0:
                                                return Ia(n, "getItems", ["READ", Ha], v, !1), Ra("fromIndex", e), Ra("numberOfItems", t), r.prev = 3, r.next = 6, ea.doFetch(i, e, t);
                                            case 6:
                                                return r.abrupt("return", r.sent);
                                            case 9:
                                                throw r.prev = 9, r.t0 = r.catch(3), R("getItems", r.t0), r.t0;
                                            case 13:
                                            case "end":
                                                return r.stop()
                                        }
                                    }, r, null, [
                                        [3, 9]
                                    ])
                                }))()
                            },
                            getTotalCount: function() {
                                return Ia(n, "getTotalCount", ["READ", Ha], v, !1), j()
                            },
                            getCurrentItem: function() {
                                Ia(n, "getCurrentItem", ["READ", qa, Ha], v);
                                var e = Di(n());
                                return e ? Object(o.cloneDeep)(e) : null
                            },
                            getCurrentItemIndex: function() {
                                Ia(n, "getCurrentItemIndex", ["READ", Ha], v);
                                var e = xi(n());
                                return void 0 === e ? null : e
                            },
                            setCurrentItemIndex: function(e) {
                                return Ga(regeneratorRuntime.mark(function t() {
                                    return regeneratorRuntime.wrap(function(t) {
                                        for (;;) switch (t.prev = t.next) {
                                            case 0:
                                                return Aa(y, "setCurrentItemIndex"), Ia(n, "setCurrentItemIndex", ["READ", Ha], v, !1), Ea(e), t.next = 5, new Promise(function(e) {
                                                    return I.onReady(e)
                                                });
                                            case 5:
                                                if (t.prev = 5, ji(n())) {
                                                    t.next = 9;
                                                    break
                                                }
                                                return t.next = 9, S();
                                            case 9:
                                                return t.next = 11, r(ea.setCurrentIndex(e));
                                            case 11:
                                                t.next = 17;
                                                break;
                                            case 13:
                                                throw t.prev = 13, t.t0 = t.catch(5), R("setCurrentItemIndex", t.t0), t.t0;
                                            case 17:
                                            case "end":
                                                return t.stop()
                                        }
                                    }, t, null, [
                                        [5, 13]
                                    ])
                                }))()
                            },
                            setFieldValue: function(e, t) {
                                Da(n, "setFieldValue"), Ia(n, "setFieldValue", [qa, Ha], v), xa(n), r(ea.updateFields(function(e, t, r) {
                                    return t in e ? Object.defineProperty(e, t, {
                                        value: r,
                                        enumerable: !0,
                                        configurable: !0,
                                        writable: !0
                                    }) : e[t] = r, e
                                }({}, e, Object(o.cloneDeep)(t))))
                            },
                            setFieldValues: function(e) {
                                Da(n, "setFieldValues"), Ia(n, "setFieldValues", [qa, Ha], v), xa(n), r(ea.updateFields(Object(o.mapValues)(e, o.cloneDeep)))
                            },
                            next: function() {
                                return Ga(regeneratorRuntime.mark(function e() {
                                    return regeneratorRuntime.wrap(function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                if (Aa(y, "next"), Da(n, "next"), Ia(n, "next", ["READ", Ha], v, !1), e.prev = 3, ji(n())) {
                                                    e.next = 7;
                                                    break
                                                }
                                                return e.next = 7, S();
                                            case 7:
                                                if (I.hasNext()) {
                                                    e.next = 9;
                                                    break
                                                }
                                                throw new ha("NO_SUCH_ITEM", "There are no more items in the dataset");
                                            case 9:
                                                return e.next = 11, r(ea.setCurrentIndex(T() + 1));
                                            case 11:
                                                return e.abrupt("return", I.getCurrentItem());
                                            case 14:
                                                throw e.prev = 14, e.t0 = e.catch(3), R("next", e.t0), e.t0;
                                            case 18:
                                            case "end":
                                                return e.stop()
                                        }
                                    }, e, null, [
                                        [3, 14]
                                    ])
                                }))()
                            },
                            previous: function() {
                                return Ga(regeneratorRuntime.mark(function e() {
                                    return regeneratorRuntime.wrap(function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                if (Aa(y, "previous"), Da(n, "previous"), Ia(n, "previous", ["READ", Ha], v, !1), e.prev = 3, ji(n())) {
                                                    e.next = 7;
                                                    break
                                                }
                                                return e.next = 7, S();
                                            case 7:
                                                if (I.hasPrevious()) {
                                                    e.next = 9;
                                                    break
                                                }
                                                throw new ha("NO_SUCH_ITEM", "This is the first item in the dataset");
                                            case 9:
                                                return e.next = 11, r(ea.setCurrentIndex(T() - 1));
                                            case 11:
                                                return e.abrupt("return", I.getCurrentItem());
                                            case 14:
                                                throw e.prev = 14, e.t0 = e.catch(3), R("previous", e.t0), e.t0;
                                            case 18:
                                            case "end":
                                                return e.stop()
                                        }
                                    }, e, null, [
                                        [3, 14]
                                    ])
                                }))()
                            },
                            hasNext: function() {
                                Ia(n, "hasNext", ["READ", Ha], v);
                                var e = xi(n()),
                                    t = j();
                                return null != e && null != t && e < t - 1
                            },
                            hasPrevious: function() {
                                Ia(n, "hasPrevious", ["READ", Ha], v);
                                var e = xi(n());
                                return null != e && e > 0
                            },
                            new: function(e) {
                                return Ga(regeneratorRuntime.mark(function t() {
                                    return regeneratorRuntime.wrap(function(t) {
                                        for (;;) switch (t.prev = t.next) {
                                            case 0:
                                                return t.abrupt("return", P(e, "new"));
                                            case 1:
                                            case "end":
                                                return t.stop()
                                        }
                                    }, t)
                                }))()
                            },
                            add: function(e) {
                                return Ga(regeneratorRuntime.mark(function t() {
                                    return regeneratorRuntime.wrap(function(t) {
                                        for (;;) switch (t.prev = t.next) {
                                            case 0:
                                                return t.abrupt("return", P(e, "add"));
                                            case 1:
                                            case "end":
                                                return t.stop()
                                        }
                                    }, t)
                                }))()
                            },
                            remove: function() {
                                return Ga(regeneratorRuntime.mark(function e() {
                                    return regeneratorRuntime.wrap(function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                if (Da(n, "remove"), Ia(n, "remove", [Ha], v, !1), e.prev = 2, null != T()) {
                                                    e.next = 6;
                                                    break
                                                }
                                                throw new ha("DS_INDEX_OUT_OF_RANGE", "Invalid index");
                                            case 6:
                                                return e.next = 8, r(ea.remove());
                                            case 8:
                                                e.next = 14;
                                                break;
                                            case 10:
                                                throw e.prev = 10, e.t0 = e.catch(2), R("remove", e.t0), e.t0;
                                            case 14:
                                            case "end":
                                                return e.stop()
                                        }
                                    }, e, null, [
                                        [2, 10]
                                    ])
                                }))()
                            },
                            revert: function() {
                                return Ga(regeneratorRuntime.mark(function e() {
                                    return regeneratorRuntime.wrap(function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                return Da(n, "revert"), Ia(n, "revert", [qa, Ha], v, !1), xa(n), e.abrupt("return", r(ea.revert()));
                                            case 4:
                                            case "end":
                                                return e.stop()
                                        }
                                    }, e)
                                }))()
                            },
                            refresh: function() {
                                return Ga(regeneratorRuntime.mark(function e() {
                                    return regeneratorRuntime.wrap(function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                return Da(n, "refresh"), Ia(n, "refresh", ["READ", qa, Ha], v, !1), e.prev = 2, e.next = 5, r(ea.refresh());
                                            case 5:
                                                e.next = 11;
                                                break;
                                            case 7:
                                                throw e.prev = 7, e.t0 = e.catch(2), R("refresh", e.t0), e.t0;
                                            case 11:
                                            case "end":
                                                return e.stop()
                                        }
                                    }, e, null, [
                                        [2, 7]
                                    ])
                                }))()
                            },
                            onCurrentIndexChanged: function(e) {
                                return Sa("onCurrentIndexChanged", e), Ia(n, "onCurrentIndexChanged", [Ha, "READ"], v, !1), s("currentIndexChanged", t(e))
                            },
                            onItemValuesChanged: function(e) {
                                return Sa("onItemValuesChanged", e), Ia(n, "onItemValuesChanged", [Ha, qa], v, !1), s("itemValuesChanged", t(e))
                            },
                            onError: function(e) {
                                return Sa("onError", e), Ia(n, "onError", [Ha, "READ", qa], v, !1), s("datasetError", t(e))
                            },
                            onReady: function(e) {
                                return Sa("onReady", e), Ia(n, "onReady", ["READ", qa, Ha], v, !1), Ti(n()) ? (Promise.resolve(t(e)()).catch(Object(m.d)("onReady", d)), o.noop) : s("datasetReady", t(e))
                            },
                            setSort: function(e) {
                                return Ga(regeneratorRuntime.mark(function i() {
                                    var a;
                                    return regeneratorRuntime.wrap(function(i) {
                                        for (;;) switch (i.prev = i.next) {
                                            case 0:
                                                return Aa(y, "setSort"), Ia(n, "setSort", ["READ", Ha], v, !1), Ca(e), i.prev = 3, i.next = 6, new Promise(function(e) {
                                                    return I.onReady(e)
                                                });
                                            case 6:
                                                if (ji(n())) {
                                                    i.next = 9;
                                                    break
                                                }
                                                return i.next = 9, S();
                                            case 9:
                                                return a = t(function() {
                                                    return e._build()
                                                }), i.next = 12, r(na(Object(o.cloneDeep)(a())));
                                            case 12:
                                                i.next = 18;
                                                break;
                                            case 14:
                                                throw i.prev = 14, i.t0 = i.catch(3), R("setSort", i.t0), i.t0;
                                            case 18:
                                            case "end":
                                                return i.stop()
                                        }
                                    }, i, null, [
                                        [3, 14]
                                    ])
                                }))()
                            },
                            setFilter: function(e) {
                                return Ga(regeneratorRuntime.mark(function i() {
                                    var a;
                                    return regeneratorRuntime.wrap(function(i) {
                                        for (;;) switch (i.prev = i.next) {
                                            case 0:
                                                return Aa(y, "setFilter"), Ia(n, "setFilter", ["READ", Ha], v, !1), Pa(e), i.prev = 3, i.next = 6, new Promise(function(e) {
                                                    return I.onReady(e)
                                                });
                                            case 6:
                                                if (ji(n())) {
                                                    i.next = 9;
                                                    break
                                                }
                                                return i.next = 9, S();
                                            case 9:
                                                return a = t(function() {
                                                    return e._build()
                                                }), i.next = 12, r(ra(Object(o.cloneDeep)(a())));
                                            case 12:
                                                i.next = 18;
                                                break;
                                            case 14:
                                                throw i.prev = 14, i.t0 = i.catch(3), R("setFilter", i.t0), i.t0;
                                            case 18:
                                            case "end":
                                                return i.stop()
                                        }
                                    }, i, null, [
                                        [3, 14]
                                    ])
                                }))()
                            },
                            loadMore: function() {
                                var e = Ga(regeneratorRuntime.mark(function e() {
                                    return regeneratorRuntime.wrap(function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                return Aa(y, "loadMore"), Da(n, "loadMore"), Ia(n, "loadMore", ["READ", Ha], v, !1), e.next = 5, r(ea.incrementNumOfPagesToShow());
                                            case 5:
                                            case "end":
                                                return e.stop()
                                        }
                                    }, e)
                                }));
                                return function() {
                                    return e.apply(this, arguments)
                                }
                            }(),
                            nextPage: function() {
                                return Ga(regeneratorRuntime.mark(function e() {
                                    var t, o;
                                    return regeneratorRuntime.wrap(function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                if (Aa(y, "nextPage"), Da(n, "nextPage"), Ia(n, "nextPage", ["READ", Ha], v, !1), e.prev = 3, ji(n())) {
                                                    e.next = 7;
                                                    break
                                                }
                                                return e.next = 7, S();
                                            case 7:
                                                if (I.hasNextPage()) {
                                                    e.next = 9;
                                                    break
                                                }
                                                throw new ha("NO_SUCH_PAGE", "There are no more pages in the dataset");
                                            case 9:
                                                return e.next = 11, r(ea.nextPage());
                                            case 11:
                                                return e.next = 13, ea.fetchCurrentPage(i, n());
                                            case 13:
                                                return t = e.sent, o = t.items, e.abrupt("return", o);
                                            case 18:
                                                throw e.prev = 18, e.t0 = e.catch(3), R("nextPage", e.t0), e.t0;
                                            case 22:
                                            case "end":
                                                return e.stop()
                                        }
                                    }, e, null, [
                                        [3, 18]
                                    ])
                                }))()
                            },
                            previousPage: function() {
                                return Ga(regeneratorRuntime.mark(function e() {
                                    var t, o;
                                    return regeneratorRuntime.wrap(function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                if (Aa(y, "previousPage"), Da(n, "previousPage"), Ia(n, "previousPage", ["READ", Ha], v, !1), e.prev = 3, ji(n())) {
                                                    e.next = 7;
                                                    break
                                                }
                                                return e.next = 7, S();
                                            case 7:
                                                if (I.hasPreviousPage()) {
                                                    e.next = 9;
                                                    break
                                                }
                                                throw new ha("NO_SUCH_PAGE", "This is the first page in the dataset");
                                            case 9:
                                                return e.next = 11, r(ea.previousPage());
                                            case 11:
                                                return e.next = 13, ea.fetchCurrentPage(i, n());
                                            case 13:
                                                return t = e.sent, o = t.items, e.abrupt("return", o);
                                            case 18:
                                                throw e.prev = 18, e.t0 = e.catch(3), R("previousPage", e.t0), e.t0;
                                            case 22:
                                            case "end":
                                                return e.stop()
                                        }
                                    }, e, null, [
                                        [3, 18]
                                    ])
                                }))()
                            },
                            hasNextPage: function() {
                                Ia(n, "hasNextPage", ["READ", Ha], v);
                                var e = n();
                                return Oi(e).offset + yi(e) < j()
                            },
                            hasPreviousPage: function() {
                                return Ia(n, "hasPreviousPage", ["READ", Ha], v), Oi(n()).offset > 0
                            },
                            getTotalPageCount: function() {
                                return Ia(n, "getTotalPageCount", ["READ", Ha], v), gi(n(), j())
                            },
                            getCurrentPageIndex: function() {
                                return Ia(n, "getCurrentPageIndex", ["READ", Ha], v), void 0 === T() ? null : function(e) {
                                    return Do.getCurrentPage(e.records)
                                }(n())
                            },
                            loadPage: function(e) {
                                return Ga(regeneratorRuntime.mark(function t() {
                                    var o, a;
                                    return regeneratorRuntime.wrap(function(t) {
                                        for (;;) switch (t.prev = t.next) {
                                            case 0:
                                                if (Ia(n, "loadPage", ["READ", Ha], v, !1), Aa(y, "loadPage"), Da(n, "loadPage"), ja(e, I.getTotalPageCount()), t.prev = 4, ji(n())) {
                                                    t.next = 8;
                                                    break
                                                }
                                                return t.next = 8, S();
                                            case 8:
                                                return t.next = 10, r(ea.loadPage(e));
                                            case 10:
                                                return t.next = 12, ea.fetchCurrentPage(i, n());
                                            case 12:
                                                return o = t.sent, a = o.items, t.abrupt("return", a);
                                            case 17:
                                                throw t.prev = 17, t.t0 = t.catch(4), R("loadPage", t.t0), t.t0;
                                            case 21:
                                            case "end":
                                                return t.stop()
                                        }
                                    }, t, null, [
                                        [4, 17]
                                    ])
                                }))()
                            },
                            handshake: function(e) {
                                Ia(n, "handshake", ["READ", Ha, qa], v, !1),
                                    function(e) {
                                        if (!(e && e.controllerApi && e.role && e.connectionConfig)) throw new Error("Handshake info is invalid")
                                    }(e), l.push(e), va(b, r, e)
                            },
                            inScope: function(e, t) {
                                Ia(n, "inScope", ["READ", qa, Ha], v, !1);
                                var r = f.getController({
                                    compId: e,
                                    itemId: t
                                });
                                return r ? r.staticExports : I
                            },
                            isConnectedToComponent: function(e) {
                                return Ia(n, "isConnectedToComponent", ["READ", qa, Ha], v, !1), O().includes(e)
                            },
                            getPageSize: function() {
                                return Ia(n, "getPageSize", ["READ", Ha], v), Oi(n()).size
                            },
                            setPageSize: function(e) {
                                return Ga(regeneratorRuntime.mark(function t() {
                                    return regeneratorRuntime.wrap(function(t) {
                                        for (;;) switch (t.prev = t.next) {
                                            case 0:
                                                return Ia(n, "setPageSize", ["READ", Ha], v, !1), Ta("size", e), t.next = 4, new Promise(function(e) {
                                                    return I.onReady(e)
                                                });
                                            case 4:
                                                if (t.prev = 4, ji(n())) {
                                                    t.next = 8;
                                                    break
                                                }
                                                return t.next = 8, S();
                                            case 8:
                                                return t.next = 10, r(io({
                                                    size: e
                                                }));
                                            case 10:
                                                t.next = 16;
                                                break;
                                            case 12:
                                                throw t.prev = 12, t.t0 = t.catch(4), R("setPageSize", t.t0), t.t0;
                                            case 16:
                                            case "end":
                                                return t.stop()
                                        }
                                    }, t, null, [
                                        [4, 12]
                                    ])
                                }))()
                            }
                        },
                        c = Na({
                            datasetType: v,
                            siblingDynamicPageUrlGetter: g
                        }),
                        h = Object.assign(u, c),
                        I = {},
                        C = {},
                        D = function(e) {
                            return e !== Fa
                        }(p);
                    for (var x in h) I[x] = D ? Wa(p, h[x], x) : h[x], C[x] = Object(o.flow)(a.applicationCodeZone, E(x))(I[x]);
                    return C
                }
            },
            Ya = function() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : o.noop,
                    t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : o.noop,
                    r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : o.noop,
                    n = !1,
                    i = {},
                    a = function(e) {
                        return i[e] ? i[e] : i[e] = []
                    },
                    u = function(e) {
                        for (var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++) r[n - 1] = arguments[n];
                        return Promise.all(a(e).map(function(e) {
                            try {
                                return Promise.resolve(e.apply(void 0, r))
                            } catch (e) {
                                return Promise.reject(e)
                            }
                        }))
                    };
                return {
                    register: function(e, t) {
                        return n ? o.noop : (a(e).push(t), function() {
                            Object(o.remove)(a(e), function(e) {
                                return e === t
                            })
                        })
                    },
                    executeHooks: u,
                    fireEvent: function(n) {
                        for (var o = arguments.length, i = new Array(o > 1 ? o - 1 : 0), a = 1; a < o; a++) i[a - 1] = arguments[a];
                        Ba.apply(void 0, [r, n].concat(i)), e.apply(void 0, [n].concat(i)), u.apply(void 0, [n].concat(i)).catch(Object(m.d)(n, t))
                    },
                    dispose: function() {
                        n = !0, i = {}
                    }
                }
            },
            za = function(e) {
                return "onChange" in e && ("value" in e || "checked" in e)
            },
            Xa = ["siteButtonRole", "imageButtonRole", "stylableButtonRole"],
            Qa = ["dropdownOptionsRole", "filterInputRole", "selectionTagsOptionsRole"],
            Za = function(e, t) {
                var r = Object(o.uniqBy)(e.filter(function(e) {
                    return e.component.enabled
                }), function(e) {
                    return e.compId
                });
                return {
                    inputCacs: function(e) {
                        return e.filter(function(e) {
                            var t = e.role,
                                r = e.component;
                            return !Qa.includes(t) && za(r)
                        })
                    }(r),
                    linkedCacs: function(e, t) {
                        return e.filter(function(e) {
                            var t = e.role;
                            return Object(o.includes)(Xa, t)
                        }).filter(function(e) {
                            var r = e.connectionConfig;
                            return Object(o.includes)(t, Object(o.get)(r, "events.onClick.action"))
                        })
                    }(r, t)
                }
            },
            Ja = function(e, t, r, n, o) {
                e.enabled !== r && (r ? e.enable() : e.disable(), n.trace(It.a.Breadcrumb({
                    category: "components",
                    message: ia("".concat(t, " changed to ").concat(r ? "enabled" : "disabled"), o)
                })))
            },
            Ka = function(e, t, r, n, i) {
                var a = e.getState,
                    u = e.subscribe,
                    c = function() {
                        return i().fold(function() {
                            return 0
                        }, function(e) {
                            return e.getMatchingRecordCount()
                        })
                    },
                    s = function(e) {
                        var t = Oi(e),
                            r = t.offset;
                        return t.size * t.numPagesToShow + r < c()
                    },
                    l = {
                        new: function(e) {
                            return !ji(e)
                        },
                        save: Pi,
                        revert: Pi,
                        remove: Pi,
                        next: function(e) {
                            return Ei(e) && xi(e) < c() - 1
                        },
                        previous: function(e) {
                            return Ei(e) && xi(e) > 0
                        },
                        nextPage: s,
                        previousPage: function(e) {
                            return Oi(e).offset > 0
                        },
                        nextDynamicPage: function(e) {
                            return Li(e).hasUrl()
                        },
                        previousDynamicPage: function(e) {
                            return Ui(e).hasUrl()
                        },
                        loadMore: s
                    },
                    f = Object.keys(l),
                    d = Za(t, f),
                    p = d.inputCacs,
                    m = d.linkedCacs;
                return p.length + m.length ? u(function(e) {
                    var t = e.getState,
                        r = e.inputCacs,
                        n = e.linkedCacs,
                        o = e.datasetId,
                        i = e.logger,
                        a = e.shouldEnableLinkedComponent;
                    return function() {
                        var e = t();
                        if (Ti(e)) {
                            var u = Pi(e);
                            r.forEach(function(e) {
                                var t = e.component,
                                    r = e.compId;
                                Ja(t, r, u, i, o)
                            }), n.forEach(function(t) {
                                var r = t.component,
                                    n = t.compId,
                                    u = r.connectionConfig.events.onClick.action,
                                    c = a(u, e);
                                Ja(r, n, c, i, o)
                            })
                        }
                    }
                }({
                    getState: a,
                    inputCacs: p,
                    linkedCacs: m,
                    datasetId: n,
                    logger: r,
                    shouldEnableLinkedComponent: function(e, t) {
                        return l[e](t)
                    }
                })) : o.noop
            },
            eu = function(e, t, r, n, o) {
                return Ka(e, t, r, n, o)
            };
        var tu = function(e) {
                var t = e.dispatch,
                    r = e.recordStore,
                    n = e.componentAdapterContexts;
                return function() {
                    var e = {
                            fetchRecordById: function(e, t) {
                                return r(t).fold(function() {
                                    return Pe.Maybe.Nothing()
                                }, function(t) {
                                    return t.getRecordById(e)
                                })
                            },
                            fetchAll: function(e) {
                                return Ji(r, 0, 1e3, e)
                            },
                            fetchCurrentItems: function(e) {
                                return Ki(r, e).catch(function() {
                                    return Ut.Empty().get()
                                })
                            },
                            fetchOne: function() {
                                return Ji(r, 0, 1)
                            },
                            fetch: function(e, t, n) {
                                return Ji(r, e, t, n)
                            },
                            getTotalItemsCount: function(e) {
                                return r(e).map(function(e) {
                                    return e.getMatchingRecordCount()
                                }).getOrElse(0)
                            },
                            getInitialData: function() {
                                return r().fold(function() {
                                    return Ut.Empty()
                                }, function(e) {
                                    return e.externalApi.getSeedRecords()
                                })
                            },
                            setCurrentIndex: function(e, r) {
                                return t(zi(e, r))
                            },
                            setFieldInCurrentRecordAndSynchronize: function(e, r, n) {
                                t(Xi(function(e, t, r) {
                                    return t in e ? Object.defineProperty(e, t, {
                                        value: r,
                                        enumerable: !0,
                                        configurable: !0,
                                        writable: !0
                                    }) : e[t] = r, e
                                }({}, e, Object(o.cloneDeep)(r)), n))
                            },
                            refresh: function() {
                                return t(Zi())
                            },
                            resetUserInputFilters: function() {
                                n.filter(function(e) {
                                    return "filterInputRole" === e.role
                                }).length && (n.forEach(function(e) {
                                    var t = i(e);
                                    t.resetUserFilter && t.resetUserFilter(e)
                                }), e.refresh())
                            },
                            isCurrentRecordNew: function(e) {
                                return r().fold(function() {
                                    return !1
                                }, function(t) {
                                    return t.isNewRecord(xi(e))
                                })
                            },
                            isCurrentRecordPristine: function(e) {
                                return r().fold(function() {
                                    return !1
                                }, function(t) {
                                    return t.isPristine(xi(e))
                                })
                            },
                            getUniqueFieldValues: function(e) {
                                return r().fold(function() {
                                    return !1
                                }, function(t) {
                                    return t.getUniqueFieldValues(e)
                                })
                            }
                        },
                        i = function(e) {
                            return e.api
                        },
                        a = {
                            isValidContext: function(e) {
                                return i(e).isValidContext(e)
                            },
                            hideComponent: function(e) {
                                n.map(function(t) {
                                    return i(t).hideComponent(t, e)
                                })
                            },
                            showComponent: function(e) {
                                n.map(function(t) {
                                    return i(t).showComponent(t, e)
                                })
                            },
                            clearComponent: function() {
                                n.map(function(e) {
                                    return i(e).clearComponent(e)
                                })
                            },
                            bindToComponent: function() {
                                n.map(function(t) {
                                    return i(t).bindToComponent(t, e, a)
                                })
                            },
                            currentRecordModified: function() {
                                var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
                                    r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
                                return n.filter(function(e) {
                                    return !r || e.compId !== r
                                }).map(function(r) {
                                    return i(r).currentRecordModified(r, e, t, a)
                                })
                            },
                            recordSetLoaded: function() {
                                return n.map(function(t) {
                                    return i(t).recordSetLoaded(t, e, a)
                                })
                            },
                            currentViewChanged: function() {
                                return n.map(function(t) {
                                    return i(t).currentViewChanged(t, e, a)
                                })
                            },
                            currentIndexChanged: function() {
                                return n.map(function(t) {
                                    return i(t).currentIndexChanged(t, e, a)
                                })
                            }
                        };
                    return a
                }
            },
            ru = v.FieldType.richText,
            nu = {
                $text: function(e) {
                    return e.map(function(e) {
                        return e === ru ? "html" : "text"
                    }).getOrElse("text")
                }
            },
            ou = function(e, t, r) {
                var n = e.connectionConfig;
                return Pe.Maybe.fromNullable(Object(o.get)(n, "properties")).map(function(e) {
                    return Object(o.mapKeys)(n.properties, function(e, t) {
                        return Object(o.startsWith)(t, "$") ? function(e, t, r) {
                            return Pe.Maybe.fromNullable(nu[e]).map(function(e) {
                                return e(r(t.fieldName))
                            }).getOrElse(e)
                        }(t, e, r) : t
                    })
                }).map(function(e) {
                    return Object(o.assign)({}, n, {
                        properties: e
                    })
                }).getOrElse(n)
            },
            iu = {
                properties: {},
                events: {}
            },
            au = function(e) {
                var t = e.getFieldType,
                    r = e.role,
                    n = e.compId,
                    i = e.component,
                    a = e.$w,
                    u = e.api,
                    c = Pe.Maybe.fromNullable(i.connectionConfig).filter(o.isPlainObject).map(function(e) {
                        return ou({
                            connectionConfig: e
                        }, 0, t)
                    }).getOrElse(iu);
                return "pageRole" === r && (i = a("Document")), {
                    role: r,
                    compId: n,
                    connectionConfig: c,
                    component: i,
                    api: u
                }
            },
            uu = "PRIMARY",
            cu = "DETAILS",
            su = "OTHER",
            lu = function(e, t, r) {
                return r.some(function(t) {
                    return t.compId === e
                }) ? uu : Object.values(t).some(function(t) {
                    return t.controllerApi && t.controllerApi.isConnectedToComponent && t.controllerApi.isConnectedToComponent(e)
                }) ? cu : su
            },
            fu = qe.a.Repeater,
            du = function e(t) {
                var r = Pe.Maybe.fromNullable(t).chain(function(e) {
                    var t = e.parent;
                    return Pe.Maybe.fromNullable(t)
                });
                return r.filter(function(e) {
                    return function(e) {
                        return [fu].includes(e)
                    }(e.type)
                }).orElse(function() {
                    return r.chain(function(t) {
                        return e(t)
                    })
                })
            },
            pu = r(10),
            mu = function(e) {
                return function(t) {
                    return Object(o.get)(t, e)
                }
            },
            hu = function(e, t) {
                return Object(pu.isFieldFromReferencedCollection)(t) ? function(e) {
                    return function(t) {
                        return Pe.Maybe.fromNullable(Object(o.get)(t, Object(pu.getReferenceFieldName)(e)))
                    }
                }(t)(e).map(function(e) {
                    return function(t) {
                        return Pe.Maybe.fromNullable(t).chain(function(e) {
                            return Object(o.isObject)(e) ? Pe.Maybe.Just(e) : Pe.Maybe.Nothing()
                        }).map(function(t) {
                            return mu(Object(pu.getFieldFromReferencedCollectionName)(e))(t)
                        }).getOrElse(void 0)
                    }
                }(t)).getOrElse(void 0) : mu(t)(e)
            },
            vu = function(e, t, r, n) {
                return e[t](n(r))
            },
            yu = function(e) {
                var t = e.updatedFields,
                    r = e.fieldName;
                return function(e) {
                    return 0 === e.length
                }(t) || function(e, t) {
                    return Object(o.includes)(t, Object(pu.isFieldFromReferencedCollection)(e) ? Object(pu.getReferenceFieldName)(e) : e)
                }(r, t)
            },
            gu = function(e) {
                return Object(o.isObject)(e) && Object(o.has)(e, "_id")
            },
            bu = function(e) {
                var t = e.component,
                    r = e.fieldType,
                    n = e.propPath,
                    i = e.value,
                    a = e.modeIsLivePreview,
                    u = function(e, t) {
                        return "reference" === t && gu(e)
                    }(i, r) ? i._id : i;
                ! function(e) {
                    return e.type === qe.a.SignatureInput
                }(t) ? a && function(e) {
                    return void 0 === e || "" === e || Array.isArray(e) && 0 === e.length
                }(u) || function(e, t, r) {
                    var n = t.split("."),
                        i = n.slice(0, -1),
                        a = n.slice(-1);
                    (i.length > 0 ? Object(o.get)(e, i) : e)[a] = r
                }(t, n, u): u || t.clear()
            },
            wu = function(e) {
                var t = e.properties,
                    r = e.events,
                    n = e.behaviors,
                    i = {};
                return Object(o.forEach)(t, function(e, t) {
                    var r = e.fieldName;
                    i[t] = r
                }), Object(o.forEach)(r, function(e, t) {
                    var r = e.action;
                    i[t] = r
                }), Object(o.forEach)(n, function(e) {
                    var t = e.type;
                    i.text = t
                }), i
            },
            Ou = v.FieldType.mediaGallery,
            Iu = r(55),
            Eu = r.n(Iu),
            Ru = function(e, t, r) {
                var n = r.format,
                    i = r.wixSdk;
                return n ? function(e, t, r) {
                    var n = r.format;
                    r.wixSdk;
                    switch (n.type) {
                        case Eu.a.DATETIME:
                            return Object(o.isDate)(e) ? t ? t.formatDateTime(e, n.params.dateFormat) : "" : e;
                        default:
                            return e
                    }
                }(e, t, {
                    format: n,
                    wixSdk: i
                }) : e
            },
            Tu = function(e) {
                return null == e || "function" != typeof e.toString ? "" : Array.isArray(e) ? e.join(", ") : e.toString()
            },
            ju = r(56),
            Su = r.n(ju);

        function Pu(e, t) {
            return function(e) {
                if (Array.isArray(e)) return e
            }(e) || function(e, t) {
                var r = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                if (null == r) return;
                var n, o, i = [],
                    a = !0,
                    u = !1;
                try {
                    for (r = r.call(e); !(a = (n = r.next()).done) && (i.push(n.value), !t || i.length !== t); a = !0);
                } catch (e) {
                    u = !0, o = e
                } finally {
                    try {
                        a || null == r.return || r.return()
                    } finally {
                        if (u) throw o
                    }
                }
                return i
            }(e, t) || function(e, t) {
                if (!e) return;
                if ("string" == typeof e) return Cu(e, t);
                var r = Object.prototype.toString.call(e).slice(8, -1);
                "Object" === r && e.constructor && (r = e.constructor.name);
                if ("Map" === r || "Set" === r) return Array.from(e);
                if ("Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Cu(e, t)
            }(e, t) || function() {
                throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }

        function Cu(e, t) {
            (null == t || t > e.length) && (t = e.length);
            for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
            return n
        }
        var Du = function(e) {
                return /^\d{2}:\d{2}:\d{2}\.\d{3}$/.test(e)
            },
            xu = function(e) {
                return e instanceof Date && !isNaN(e)
            },
            Au = function(e) {
                var t = e.time,
                    r = e.date,
                    n = Pu(t.split(":"), 2),
                    o = n[0],
                    i = n[1];
                return r.setHours(o), r.setMinutes(i), r.setSeconds(0), r.setMilliseconds(0), r
            },
            _u = function(e) {
                return "".concat(e.toTimeString().split(" ")[0], ".000")
            },
            ku = function(e) {
                var t = new Date(e);
                return xu(t) ? t : function(e) {
                    var t = new Date;
                    return t.setHours(0), t.setMinutes(0), t.setSeconds(0), t.setMilliseconds(0), t
                }()
            },
            Nu = v.FieldType.mediaGallery,
            Mu = v.FieldType.address,
            Fu = function(e, t) {
                var r = t.fieldType,
                    n = t.role,
                    i = t.componentIsInput,
                    a = t.propPath,
                    u = t.mediaItemUtils,
                    c = [{
                        converter: function(e) {
                            return e.formatted
                        },
                        condition: e && r === Mu
                    }, {
                        converter: Tu,
                        condition: !i && ![de, fe, ve, ge].includes(n)
                    }, {
                        converter: function(e) {
                            return function(e) {
                                var t = e.value,
                                    r = e.mediaItemUtils,
                                    n = r.parseMediaItemUri(t);
                                if (n.error) return t;
                                switch (n.type) {
                                    case r.types.IMAGE:
                                        return Su.a.getScaleToFillImageURL(n.mediaId, n.width, n.height, n.width, n.height, {
                                            name: n.title
                                        });
                                    case r.types.VIDEO:
                                        return "https://video.wixstatic.com/video/".concat(n.mediaId, "/file");
                                    case r.types.AUDIO:
                                        return "https://static.wixstatic.com/mp3/".concat(n.mediaId);
                                    default:
                                        return t
                                }
                            }({
                                value: e,
                                mediaItemUtils: u
                            })
                        },
                        condition: "link" === a && "googleMapRole" !== n
                    }, {
                        converter: function() {
                            return []
                        },
                        condition: !e && r === Nu
                    }, {
                        converter: _u,
                        condition: "timePickerRole" === n && xu(e)
                    }].reduce(function(e, t) {
                        var r = t.converter;
                        return t.condition && e.push(r), e
                    }, []);
                return Object(o.flow)(c)(e)
            };

        function Lu(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function Uu(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? Lu(Object(r), !0).forEach(function(t) {
                    Wu(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Lu(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function Wu(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }
        var Bu = function(e) {
                var t = function(e) {
                    var t = 0;
                    if (void 0 === e || 0 === e.length) return t;
                    for (var r = 0; r < e.length; r++) t = (t << 5) - t + e.charCodeAt(r), t |= 0;
                    return t *= Math.sign(t), t = Math.sqrt(t), t = Math.floor(1e6 * (t - Math.floor(t)))
                }(e);
                return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e, r) {
                    var n = Math.ceil(t / (r + 1)) % 16;
                    return ("x" === e ? n : 3 & n | 8).toString(16)
                })
            },
            Vu = function(e) {
                return void 0 === e && (e = ""), e ? e.toString().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-\.]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "") : ""
            };

        function Gu(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function qu(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? Gu(Object(r), !0).forEach(function(t) {
                    Hu(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Gu(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function Hu(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }
        var $u = function(e, t) {
                switch (typeof e) {
                    case "object":
                        return {
                            type: "wix",
                            data: e
                        };
                    case "string":
                        return {
                            type: "web",
                            url: e,
                            target: t
                        };
                    default:
                        return {
                            target: "_blank",
                            type: "none"
                        }
                }
            },
            Yu = function(e) {
                void 0 === e && (e = {});
                var t = {
                    link: e.url
                };
                return e.url && (t.target = e.target), t
            },
            zu = function(e) {
                return null !== /^(wix:)?(image|video)(:\/\/)/.exec(e)
            },
            Xu = function(e) {
                return zu(e) ? e.split("/")[3] : e
            },
            Qu = function(e) {
                try {
                    return zu(e) ? e.split("/")[4].split("#").slice(0, -1).join("#") : "_.jpg"
                } catch (e) {
                    return "_.jpg"
                }
            },
            Zu = function(e) {
                var t = {},
                    r = !1;
                try {
                    var n = /\/\d*_\d*\//.exec(e);
                    if (n && n[0] && n[0].length > 0) {
                        var o = n[0].replace(/\//g, "").split("_").map(function(e) {
                                return Number(e)
                            }),
                            i = o[0],
                            a = o[1];
                        i > 0 && a > 0 && (r = !0, t = {
                            originWidth: i,
                            originHeight: a
                        })
                    }
                } catch (e) {
                    r = !1
                }
                if (!r) try {
                    var u = /wm_(.*)\//.exec(e);
                    if (u && u[0] && u[0].length > 0) {
                        var c = u[1];
                        c.length > 0 && (t.watermark = c)
                    }
                } catch (e) {
                    r = !1
                }
                if (!r) try {
                    e.split("#").pop().split("&").map(function(e) {
                        return e.split("=")
                    }).forEach(function(e) {
                        t[e[0]] = isNaN(Number(e[1])) ? String(e[1]) : Number(e[1])
                    })
                } catch (e) {
                    r = !1
                }
                return t
            },
            Ju = function(e, t) {
                return void 0 === t && (t = 0),
                    function(e) {
                        return !!(e.src || e.type && e.html)
                    }(e) ? function(e, t) {
                        var r = Zu(e.src);
                        r.width = e.width || r.originWidth || r.originalWidth || r.posterWidth || 1, r.height = e.height || r.originHeight || r.originalHeight || r.posterHeight || 1;
                        var n = e.settings && e.settings.focalPoint,
                            o = r.watermark,
                            i = e.imageToken || e.token || r.token,
                            a = (e.type || "image").toLowerCase(),
                            u = qu({
                                itemId: Vu(e.slug) || (Vu(e.title || e.id) || Bu(e.src || e.html || t)) + "_" + t,
                                mediaUrl: Xu(e.src),
                                metaData: Object.assign({
                                    type: a,
                                    alt: e.alt || "",
                                    title: e.title || "",
                                    description: e.description || "",
                                    name: Qu(e.src),
                                    fileName: Qu(e.src),
                                    link: $u(e.link, e.target),
                                    width: r.width,
                                    height: r.height,
                                    sourceName: "private"
                                }, n ? {
                                    focalPoint: n
                                } : {}, o ? {
                                    watermarkStr: o
                                } : {}),
                                orderIndex: t
                            }, i && {
                                token: i
                            });
                        if ("text" === a) {
                            var c = e.style;
                            u.metaData.height = r.height || 500, u.metaData.width = r.width || 500 * c.layoutRatio, u.metaData.textStyle = {
                                width: u.metaData.width,
                                height: u.metaData.height,
                                backgroundColor: c.fillColor
                            }, u.metaData.html = u.editorHtml = e.html
                        }
                        if ("video" === a) {
                            var s = {};
                            e.thumbnail && (s = Zu(e.thumbnail));
                            var l = function(e) {
                                return null !== /^.*\.(jpeg|jpg|webp|png|jpe)$/.exec(e)
                            }(Xu(e.thumbnail)) ? Xu(e.thumbnail) : r.posterUri;
                            u.metaData.posters = [{
                                url: l,
                                width: s.width || r.width,
                                height: s.height || r.height
                            }], u.isExternal = 0 === e.src.indexOf("http"), u.isExternal || zu(e.src) ? (u.metaData.source = e.src.indexOf("youtube.com") > 0 ? "youtube" : e.src.indexOf("vimeo.com") > 0 ? "vimeo" : "wix", u.metaData.videoUrl = e.src) : u.metaData.qualities = [{
                                width: r.width,
                                height: r.height,
                                quality: r.height + "p",
                                formats: [zu(e.src) ? "wix" : e.src.split(/#|\?/)[0].split(".").pop().trim()]
                            }]
                        }
                        return u
                    }(e, t) : function(e, t) {
                        return {
                            itemId: Bu(t + "_" + (e.uri || e.alt || t)),
                            mediaUrl: e.uri || "",
                            metaData: {
                                height: e.height || 1,
                                lastModified: Date.now(),
                                link: $u(e.link, e.target),
                                title: e.title || "",
                                description: e.description || "",
                                alt: e.alt || "",
                                sourceName: "private",
                                tags: [],
                                width: e.width || 1
                            },
                            orderIndex: t
                        }
                    }(e, t)
            },
            Ku = function(e) {
                void 0 === e && (e = {});
                var t = e.metaData || e.metadata || {},
                    r = Yu(t.link) || {},
                    n = qu({
                        type: t.type || "image",
                        slug: e.itemId
                    }, r),
                    o = n.type.toLowerCase();
                if ("text" === o) {
                    var i = t.testStyle || {};
                    Object.assign(n, {
                        html: t.html,
                        style: {
                            width: i.width,
                            height: i.height,
                            bgColor: i.backgroundColor
                        }
                    })
                } else Object.assign(n, {
                    title: t.title,
                    description: t.description,
                    alt: t.alt
                }), "image" === o ? Object.assign(n, qu(qu({
                    src: function(e, t) {
                        return "wix:image://v1/" + (e || Vu(t.name)) + "/" + Vu(t.fileName || t.name) + "#originWidth=" + t.width + "&originHeight=" + t.height
                    }(e.mediaUrl, t),
                    settings: Object.assign({}, t.focalPoint ? {
                        focalPoint: t.focalPoint
                    } : {})
                }, "imageToken" in e && {
                    imageToken: e.imageToken
                }), "token" in e && {
                    token: e.token
                })) : "video" === o && Object.assign(n, {
                    src: function(e, t) {
                        return "wix:video://v1/" + (e || Vu(t.name)) + "/" + Vu(t.fileName || t.name) + "#posterUri=" + t.posters[0].url + "&posterWidth=" + t.width + "&posterHeight=" + t.height
                    }(e.mediaUrl, t),
                    thumbnail: t.posters[0].url
                });
                return n
            },
            ec = function(e, t) {
                return void 0 === e && (e = {}), void 0 === t && (t = !0), t ? Ku(e) : function(e) {
                    var t = e.metaData || e.metadata || {},
                        r = Yu(t.link) || {};
                    return qu({
                        uri: e.mediaUrl,
                        description: t.description,
                        alt: t.alt,
                        title: t.title,
                        height: t.height,
                        width: t.width
                    }, r)
                }(e)
            };

        function tc(e) {
            return function(e) {
                if (Array.isArray(e)) return rc(e)
            }(e) || function(e) {
                if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
            }(e) || function(e, t) {
                if (!e) return;
                if ("string" == typeof e) return rc(e, t);
                var r = Object.prototype.toString.call(e).slice(8, -1);
                "Object" === r && e.constructor && (r = e.constructor.name);
                if ("Map" === r || "Set" === r) return Array.from(e);
                if ("Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return rc(e, t)
            }(e) || function() {
                throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }

        function rc(e, t) {
            (null == t || t > e.length) && (t = e.length);
            for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
            return n
        }

        function nc(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function oc(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? nc(Object(r), !0).forEach(function(t) {
                    ic(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : nc(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function ic(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }
        var ac = v.FieldType.mediaGallery,
            uc = v.FieldType.documentArray,
            cc = function(e) {
                var t = e.value,
                    r = e.currentValue,
                    n = void 0 === r ? [] : r,
                    o = e.fieldType,
                    i = e.mediaItemUtils;
                switch (o) {
                    case ac:
                        return [].concat(tc(n), tc(t.map(function(e) {
                            var t = e.fileUrl,
                                r = e.url;
                            return function(e) {
                                var t = e.uploadedFileUrl,
                                    r = e.mediaItemUtils,
                                    n = r.parseMediaItemUri(t),
                                    o = r.createMediaItemUri(n).item,
                                    i = Ju(oc(oc({}, n), {}, {
                                        src: o
                                    }));
                                return ec(i)
                            }({
                                uploadedFileUrl: t || r,
                                mediaItemUtils: i
                            })
                        })));
                    case uc:
                        return [].concat(tc(n), tc(t.map(function(e) {
                            var t = e.fileUrl,
                                r = e.url;
                            return t || r
                        })));
                    default:
                        return t[0].fileUrl || t[0].url
                }
            },
            sc = v.FieldType.reference,
            lc = v.FieldType.dateTime,
            fc = function(e) {
                var t = e.value,
                    r = e.currentValue,
                    n = e.fieldType,
                    i = e.fieldName,
                    a = e.role,
                    u = e.utils,
                    c = (u = void 0 === u ? {} : u).referenceFetcher,
                    s = u.mediaItemUtils,
                    l = [{
                        converter: function(e) {
                            return c(e, i)
                        },
                        condition: n === sc
                    }, {
                        converter: function(e) {
                            return function(e, t) {
                                var r = {},
                                    n = {};
                                if (Du(e)) r.time = e, r.date = new Date;
                                else {
                                    var o = ku(e);
                                    r.date = o, r.time = _u(o)
                                }
                                return Du(t) ? n.time = t : n.date = ku(t), Au(Uu(Uu({}, r), n))
                            }(r, e)
                        },
                        condition: n === lc
                    }, {
                        converter: function(e) {
                            return cc({
                                value: e,
                                currentValue: r,
                                fieldType: n,
                                mediaItemUtils: s
                            })
                        },
                        condition: a === me
                    }].reduce(function(e, t) {
                        var r = t.converter;
                        return t.condition && e.push(r), e
                    }, []);
                return Object(o.flow)(l)(t)
            },
            dc = function(e) {
                var t = e.value,
                    r = e.role,
                    n = e.fieldType,
                    i = e.propPath,
                    a = e.componentIsInput,
                    u = e.format,
                    c = e.utils,
                    s = (c = void 0 === c ? {} : c).formatter,
                    l = c.mediaItemUtils;
                return Object(o.flow)([function(e) {
                    return Ru(e, s, {
                        format: u
                    })
                }, function(e) {
                    return Fu(e, {
                        fieldType: n,
                        role: r,
                        componentIsInput: a,
                        propPath: i,
                        mediaItemUtils: l
                    })
                }])(t)
            },
            pc = {
                isValidContext: function() {
                    return !0
                },
                hideComponent: function(e) {
                    var t = e.component,
                        r = (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}).rememberInitiallyHidden,
                        n = void 0 !== r && r;
                    "function" == typeof t.hide && (t.hidden ? n && (this.initiallyHidden = !0) : t.hide())
                },
                showComponent: function(e) {
                    var t = e.component,
                        r = (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}).ignoreInitiallyHidden,
                        n = void 0 !== r && r;
                    !t.hidden || n && this.initiallyHidden || t.show()
                },
                clearComponent: function() {},
                bindToComponent: function() {},
                currentRecordModified: function() {},
                recordSetLoaded: function() {},
                currentViewChanged: function() {},
                currentIndexChanged: function() {}
            };

        function mc(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function hc(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? mc(Object(r), !0).forEach(function(t) {
                    vc(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : mc(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function vc(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }

        function yc(e, t, r, n, o, i, a) {
            try {
                var u = e[i](a),
                    c = u.value
            } catch (e) {
                return void r(e)
            }
            u.done ? t(c) : Promise.resolve(c).then(n, o)
        }
        var gc = v.FieldType.url,
            bc = function(e) {
                var t = e.getState,
                    r = e.datasetApi,
                    n = e.wixSdk,
                    i = e.errorReporter,
                    a = e.platformAPIs,
                    u = e.eventListeners.register,
                    c = e.getFieldType,
                    s = e.databindingVerboseReporter,
                    l = e.wixFormatter,
                    f = e.modeIsLivePreview,
                    d = function(e, t) {
                        return e.fieldName ? t[e.fieldName] : e.linkObject ? a.links.toUrl(e.linkObject) : void 0
                    },
                    p = function(e) {
                        return e.matchWith({
                            Empty: function() {},
                            Loading: function() {},
                            Loaded: function(e) {
                                var t = e.url;
                                n.location.to(t)
                            }
                        })
                    },
                    m = function(e, a, u) {
                        Object(o.forEach)(e, function(e, o) {
                            var c = e.action,
                                s = e.postAction;
                            a[o](function(e) {
                                return function() {
                                    var t = this,
                                        r = arguments;
                                    return new Promise(function(n, o) {
                                        var i = e.apply(t, r);

                                        function a(e) {
                                            yc(i, n, o, a, u, "next", e)
                                        }

                                        function u(e) {
                                            yc(i, n, o, a, u, "throw", e)
                                        }
                                        a(void 0)
                                    })
                                }
                            }(regeneratorRuntime.mark(function e() {
                                var o, a;
                                return regeneratorRuntime.wrap(function(e) {
                                    for (;;) switch (e.prev = e.next) {
                                        case 0:
                                            if (e.prev = 0, "nextDynamicPage" !== c) {
                                                e.next = 4;
                                                break
                                            }
                                            return p(Li(t())), e.abrupt("return");
                                        case 4:
                                            if ("previousDynamicPage" !== c) {
                                                e.next = 7;
                                                break
                                            }
                                            return p(Ui(t())), e.abrupt("return");
                                        case 7:
                                            if ("resetUserFilter" !== c) {
                                                e.next = 10;
                                                break
                                            }
                                            return u.resetUserInputFilters(), e.abrupt("return");
                                        case 10:
                                            return e.next = 12, Promise.resolve(r[c]());
                                        case 12:
                                            o = e.sent, s && s.navigate && (a = d(s.navigate, o), n.location.to(a)), e.next = 19;
                                            break;
                                        case 16:
                                            e.prev = 16, e.t0 = e.catch(0), i("".concat(c, " operation failed:"), e.t0);
                                        case 19:
                                        case "end":
                                            return e.stop()
                                    }
                                }, e, null, [
                                    [0, 16]
                                ])
                            })))
                        })
                    },
                    h = function(e, r) {
                        var n = e.connectionConfig.properties,
                            u = e.component,
                            d = e.role,
                            p = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [],
                            m = Di(t());
                        if (m) {
                            var h = {};
                            Object(o.forEach)(n, function(e, t) {
                                var r = e.fieldName,
                                    n = e.format;
                                try {
                                    var s = c(r).getOrElse(""),
                                        v = dc({
                                            value: hu(m, r),
                                            role: d,
                                            fieldType: s,
                                            propPath: t,
                                            format: n,
                                            utils: {
                                                formatter: l,
                                                mediaItemUtils: a.mediaItemUtils
                                            }
                                        });
                                    h[t] = v, yu({
                                        updatedFields: p,
                                        fieldName: r
                                    }) && (bu({
                                        component: u,
                                        propPath: t,
                                        value: v,
                                        fieldType: s,
                                        modeIsLivePreview: f
                                    }), s === gc && "textRole" === d && function(e) {
                                        var t = e.text;
                                        e.text = "<a href=".concat(t, ' target="_blank" style="text-decoration: underline">').concat(t, "</a>");
                                        var r = e.html;
                                        e.text = "", e.html = Object(o.unescape)(r)
                                    }(u))
                                } catch (e) {
                                    i("Failed setting ".concat(t, ":"), e)
                                }
                            }), s.logValue({
                                component: u,
                                valueDescription: h
                            })
                        }
                    };
                return hc(hc({}, pc), {}, {
                    isValidContext: function(e) {
                        var t = e.connectionConfig;
                        return Object(o.values)(t).find(function(e) {
                            return !Object(o.isEmpty)(e)
                        })
                    },
                    clearComponent: function(e) {
                        var t = e.component,
                            r = e.connectionConfig.properties;
                        Object(o.forEach)(r, function(e, r) {
                            var n = e.fieldName,
                                o = c(n).getOrElse("");
                            bu({
                                component: t,
                                propPath: r,
                                value: function(e) {
                                    return e === Ou ? [] : void 0
                                }(o),
                                fieldType: o
                            })
                        })
                    },
                    bindToComponent: function(e, t) {
                        var r = e.connectionConfig,
                            n = e.component,
                            i = r.events,
                            a = r.behaviors;
                        i && m(i, n, t), a && function(e, t) {
                            Object(o.forEach)(e, function(e) {
                                var r = !1;
                                switch (e.type) {
                                    case "saveSuccessFeedback":
                                        u("beforeSave", function() {
                                            return t.hide()
                                        }), u("afterSave", function() {
                                            t.show(), r = !0
                                        }), u("currentIndexChanged", function() {
                                            r ? r = !1 : t.hide()
                                        }), u("itemValuesChanged", function() {
                                            return t.hide()
                                        });
                                        break;
                                    case "saveFailureFeedback":
                                        u("beforeSave", function() {
                                            return t.hide()
                                        }), u("currentIndexChanged", function() {
                                            return t.hide()
                                        }), u("datasetError", function(e) {
                                            "save" === e && t.show()
                                        })
                                }
                            })
                        }(a, n), s.logBinding({
                            component: n,
                            bindingDescription: wu(r)
                        })
                    },
                    currentRecordModified: function(e, t, r) {
                        h(e, t, r)
                    },
                    recordSetLoaded: function(e, t) {
                        h(e, t);
                        var r = e.connectionConfig.behaviors;
                        r && function(e, t) {
                            Object(o.forEach)(e, function(e) {
                                "saveSuccessFeedback" === e.type && t.hide()
                            })
                        }(r, e.component)
                    },
                    currentViewChanged: function(e, t) {
                        h(e, t)
                    },
                    currentIndexChanged: function(e, t) {
                        h(e, t)
                    }
                })
            };

        function wc(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function Oc(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? wc(Object(r), !0).forEach(function(t) {
                    Ic(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : wc(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function Ic(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }
        var Ec = function(e) {
            var t = e.getState,
                r = e.errorReporter,
                n = e.getFieldType,
                i = e.applicationCodeZone,
                a = e.databindingVerboseReporter,
                u = e.modeIsLivePreview,
                c = function(e, i) {
                    var c = e.connectionConfig.properties,
                        s = e.component,
                        l = e.role,
                        f = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [],
                        d = Di(t());
                    if (d) {
                        var p = {};
                        Object(o.forEach)(c, function(e, t) {
                            var o = e.fieldName;
                            try {
                                var i = n(o).getOrElse(""),
                                    a = dc({
                                        value: hu(d, o),
                                        role: l,
                                        componentIsInput: !0
                                    });
                                p[t] = a, yu({
                                    updatedFields: f,
                                    fieldName: o
                                }) && bu({
                                    component: s,
                                    propPath: t,
                                    value: a,
                                    fieldType: i,
                                    modeIsLivePreview: u
                                })
                            } catch (e) {
                                r("Failed setting ".concat(t, ":"), e)
                            }
                        }), a.logValue({
                            component: s,
                            valueDescription: p
                        })
                    }
                },
                s = function(e, r) {
                    var n = e.component,
                        o = r.isCurrentRecordPristine(t()),
                        i = r.isCurrentRecordNew(t());
                    o && i && n.resetValidityIndication && n.resetValidityIndication()
                };
            return Oc(Oc({}, pc), {}, {
                isValidContext: function(e) {
                    var t = e.connectionConfig;
                    return Object(o.values)(t).find(function(e) {
                        return !Object(o.isEmpty)(e)
                    })
                },
                clearComponent: function(e) {
                    var t = e.component,
                        r = e.connectionConfig.properties;
                    Object(o.forEach)(r, function(e, r) {
                        var o = e.fieldName,
                            i = n(o).getOrElse("");
                        bu({
                            component: t,
                            propPath: r,
                            value: void 0,
                            fieldType: i
                        })
                    })
                },
                bindToComponent: function(e, r) {
                    var o = e.connectionConfig,
                        u = e.component,
                        c = e.compId,
                        s = o.properties,
                        l = o.filters;
                    ! function(e) {
                        var r = e.component,
                            o = e.properties,
                            a = e.actions,
                            u = e.compId;
                        vu(r, "onChange", function(e) {
                            var r = o.checked ? "checked" : "value",
                                i = o[r].fieldName,
                                c = Di(t()),
                                s = fc({
                                    value: e.target[r],
                                    currentValue: c[i],
                                    fieldType: n(i).getOrElse(""),
                                    fieldName: i,
                                    utils: {
                                        referenceFetcher: function(e, t) {
                                            return a.fetchRecordById(e, t).getOrElse(e)
                                        }
                                    }
                                });
                            a.setFieldInCurrentRecordAndSynchronize(i, s, u)
                        }, i)
                    }({
                        component: u,
                        properties: s,
                        actions: r,
                        compId: c
                    }), l && vu(u, "onChange", function(e) {
                        return function() {
                            e.refresh()
                        }
                    }(r), i), a.logBinding({
                        component: u,
                        bindingDescription: wu(o)
                    })
                },
                currentRecordModified: function(e, t, r) {
                    c(e, t, r), s(e, t)
                },
                recordSetLoaded: function(e, t) {
                    c(e, t), s(e, t)
                },
                currentViewChanged: function(e, t) {
                    c(e, t), s(e, t)
                },
                currentIndexChanged: function(e, t) {
                    c(e, t), s(e, t)
                }
            })
        };

        function Rc(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function Tc(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? Rc(Object(r), !0).forEach(function(t) {
                    jc(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Rc(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function jc(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }

        function Sc(e, t, r, n, o, i, a) {
            try {
                var u = e[i](a),
                    c = u.value
            } catch (e) {
                return void r(e)
            }
            u.done ? t(c) : Promise.resolve(c).then(n, o)
        }

        function Pc(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function Cc(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? Pc(Object(r), !0).forEach(function(t) {
                    Dc(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Pc(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function Dc(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }

        function xc(e, t, r, n, o, i, a) {
            try {
                var u = e[i](a),
                    c = u.value
            } catch (e) {
                return void r(e)
            }
            u.done ? t(c) : Promise.resolve(c).then(n, o)
        }

        function Ac(e) {
            return function() {
                var t = this,
                    r = arguments;
                return new Promise(function(n, o) {
                    var i = e.apply(t, r);

                    function a(e) {
                        xc(i, n, o, a, u, "next", e)
                    }

                    function u(e) {
                        xc(i, n, o, a, u, "throw", e)
                    }
                    a(void 0)
                })
            }
        }
        var _c = function(e) {
            e.getState;
            var t = e.getFieldType,
                r = e.getSchema,
                n = e.databindingVerboseReporter,
                i = d.features,
                a = function(e, t, r) {
                    var n = r(hu(e, t));
                    return {
                        value: n,
                        label: n || ""
                    }
                },
                u = function(e, t, r) {
                    return {
                        value: r(e._id),
                        label: r(e[t])
                    }
                },
                c = function() {
                    var e = Ac(regeneratorRuntime.mark(function e(n, c, s) {
                        var l, f, d, p;
                        return regeneratorRuntime.wrap(function(e) {
                            for (;;) switch (e.prev = e.next) {
                                case 0:
                                    if (!t(n).map(function(e) {
                                            return "reference" === e
                                        }).getOrElse(!1)) {
                                        e.next = 5;
                                        break
                                    }
                                    return e.abrupt("return", r().chain(function(e) {
                                        var t = Object(h.a)(n, e);
                                        return r(t).map(h.d).map(function() {
                                            var e = Ac(regeneratorRuntime.mark(function e(t) {
                                                var r, i, a;
                                                return regeneratorRuntime.wrap(function(e) {
                                                    for (;;) switch (e.prev = e.next) {
                                                        case 0:
                                                            return e.next = 2, c.fetchAll(n);
                                                        case 2:
                                                            return r = e.sent, i = r.items, a = Object(o.orderBy)(i.map(function(e) {
                                                                return u(e, t, s)
                                                            }), [function(e) {
                                                                return e.label.toLowerCase()
                                                            }]), e.abrupt("return", a);
                                                        case 6:
                                                        case "end":
                                                            return e.stop()
                                                    }
                                                }, e)
                                            }));
                                            return function(t) {
                                                return e.apply(this, arguments)
                                            }
                                        }())
                                    }).getOrElse(Promise.resolve([])));
                                case 5:
                                    if (!i.dropdownOptionsDistinct) {
                                        e.next = 11;
                                        break
                                    }
                                    if (!(l = c.getUniqueFieldValues(n))) {
                                        e.next = 9;
                                        break
                                    }
                                    return e.abrupt("return", l.map(function(e) {
                                        var t = s(e);
                                        return {
                                            value: t,
                                            label: t || ""
                                        }
                                    }));
                                case 9:
                                    e.next = 17;
                                    break;
                                case 11:
                                    return e.next = 13, c.fetchAll();
                                case 13:
                                    return f = e.sent, d = f.items, p = d.map(function(e) {
                                        return a(e, n, s)
                                    }), e.abrupt("return", i.dropdownOptionsUnique ? Object(o.uniqBy)(p, "value") : p);
                                case 17:
                                case "end":
                                    return e.stop()
                            }
                        }, e)
                    }));
                    return function(t, r, n) {
                        return e.apply(this, arguments)
                    }
                }(),
                s = function(e) {
                    var t = e[0];
                    return 1 === e.length && "" === t.label && "" === t.value ? [] : e
                },
                l = function() {
                    var e = Ac(regeneratorRuntime.mark(function e(t, r, n) {
                        return regeneratorRuntime.wrap(function(e) {
                            for (;;) switch (e.prev = e.next) {
                                case 0:
                                    return e.t0 = s, e.next = 3, c(t, r, n);
                                case 3:
                                    return e.t1 = e.sent, e.abrupt("return", (0, e.t0)(e.t1));
                                case 5:
                                case "end":
                                    return e.stop()
                            }
                        }, e)
                    }));
                    return function(t, r, n) {
                        return e.apply(this, arguments)
                    }
                }(),
                f = function() {
                    var e = Ac(regeneratorRuntime.mark(function e(t, r) {
                        var o, i, a, u, c;
                        return regeneratorRuntime.wrap(function(e) {
                            for (;;) switch (e.prev = e.next) {
                                case 0:
                                    if (o = t.connectionConfig.properties, i = t.component, a = t.role, u = i, !o.value || !o.value.fieldName) {
                                        e.next = 8;
                                        break
                                    }
                                    return e.next = 5, l(o.value.fieldName, r, function(e) {
                                        return dc({
                                            value: e,
                                            role: a
                                        })
                                    });
                                case 5:
                                    c = e.sent, n.logValue({
                                        component: i,
                                        valueDescription: {
                                            options: c
                                        }
                                    }), u.options = c;
                                case 8:
                                case "end":
                                    return e.stop()
                            }
                        }, e)
                    }));
                    return function(t, r) {
                        return e.apply(this, arguments)
                    }
                }();
            return Cc(Cc({}, pc), {}, {
                clearComponent: function(e) {
                    e.component.options = []
                },
                isValidContext: function(e) {
                    var t = e.connectionConfig.properties;
                    return !Object(o.isEmpty)(t)
                },
                bindToComponent: function(e) {
                    ! function(e, t) {
                        var r = t.properties,
                            i = {};
                        Object(o.forEach)(r, function(e) {
                            var t = e.fieldName;
                            i.options = t
                        }), n.logBinding({
                            component: e,
                            bindingDescription: i
                        })
                    }(e.component, e.connectionConfig)
                },
                currentRecordModified: f,
                recordSetLoaded: f
            })
        };

        function kc(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function Nc(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? kc(Object(r), !0).forEach(function(t) {
                    Mc(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : kc(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function Mc(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }

        function Fc(e, t, r, n, o, i, a) {
            try {
                var u = e[i](a),
                    c = u.value
            } catch (e) {
                return void r(e)
            }
            u.done ? t(c) : Promise.resolve(c).then(n, o)
        }
        var Lc = function(e) {
            var t = e.databindingVerboseReporter,
                r = e.modeIsLivePreview,
                n = function() {
                    var e = function(e) {
                        return function() {
                            var t = this,
                                r = arguments;
                            return new Promise(function(n, o) {
                                var i = e.apply(t, r);

                                function a(e) {
                                    Fc(i, n, o, a, u, "next", e)
                                }

                                function u(e) {
                                    Fc(i, n, o, a, u, "throw", e)
                                }
                                a(void 0)
                            })
                        }
                    }(regeneratorRuntime.mark(function e(n, o) {
                        var i, a, u, c, s, l;
                        return regeneratorRuntime.wrap(function(e) {
                            for (;;) switch (e.prev = e.next) {
                                case 0:
                                    return i = n.connectionConfig.properties.options.fieldName, a = n.component, u = n.role, e.next = 3, o.fetchAll();
                                case 3:
                                    if (c = e.sent, s = c.items, l = s.reduce(function(e, t) {
                                            var r = dc({
                                                value: t[i],
                                                role: u
                                            });
                                            return r && e.push({
                                                value: r,
                                                label: r
                                            }), e
                                        }, []), !r || 0 !== l.length) {
                                        e.next = 8;
                                        break
                                    }
                                    return e.abrupt("return");
                                case 8:
                                    a.options = l, t.logValue({
                                        component: a,
                                        valueDescription: {
                                            options: l
                                        }
                                    });
                                case 10:
                                case "end":
                                    return e.stop()
                            }
                        }, e)
                    }));
                    return function(t, r) {
                        return e.apply(this, arguments)
                    }
                }();
            return Nc(Nc({}, pc), {}, {
                isValidContext: function(e) {
                    var t = e.connectionConfig.properties,
                        r = void 0 === t ? {} : t;
                    return Boolean(Object.keys(r).length)
                },
                clearComponent: function(e) {
                    e.component.options = []
                },
                bindToComponent: function(e) {
                    var r = e.component,
                        n = e.connectionConfig.properties.options.fieldName;
                    t.logBinding({
                        component: r,
                        bindingDescription: {
                            options: n
                        }
                    })
                },
                currentRecordModified: n,
                recordSetLoaded: n
            })
        };

        function Uc(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function Wc(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? Uc(Object(r), !0).forEach(function(t) {
                    Bc(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Uc(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function Bc(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }

        function Vc(e, t, r, n, o, i, a) {
            try {
                var u = e[i](a),
                    c = u.value
            } catch (e) {
                return void r(e)
            }
            u.done ? t(c) : Promise.resolve(c).then(n, o)
        }

        function Gc(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function qc(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? Gc(Object(r), !0).forEach(function(t) {
                    Hc(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Gc(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function Hc(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }
        var $c = function(e) {
                return Object(o.get)(e, "properties.value.fieldName")
            },
            Yc = "undefined" != typeof performance,
            zc = {
                mark: Yc ? function() {
                    for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++) t[r] = arguments[r];
                    return o.invoke.apply(void 0, [performance, "mark"].concat(t))
                } : function() {},
                measure: Yc ? function() {
                    for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++) t[r] = arguments[r];
                    return o.invoke.apply(void 0, [performance, "measure"].concat(t))
                } : function() {}
            };

        function Xc(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function Qc(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? Xc(Object(r), !0).forEach(function(t) {
                    Zc(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Xc(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function Zc(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }

        function Jc(e, t, r, n, o, i, a) {
            try {
                var u = e[i](a),
                    c = u.value
            } catch (e) {
                return void r(e)
            }
            u.done ? t(c) : Promise.resolve(c).then(n, o)
        }

        function Kc(e) {
            return function() {
                var t = this,
                    r = arguments;
                return new Promise(function(n, o) {
                    var i = e.apply(t, r);

                    function a(e) {
                        Jc(i, n, o, a, u, "next", e)
                    }

                    function u(e) {
                        Jc(i, n, o, a, u, "throw", e)
                    }
                    a(void 0)
                })
            }
        }
        var es = function(e) {
            var t = e.appLogger,
                r = e.getState,
                n = e.controllerFactory,
                o = e.controllerStore,
                i = e.applicationCodeZone,
                a = e.databindingVerboseReporter,
                u = e.modeIsLivePreview,
                c = [],
                s = function(e) {
                    return function() {
                        var n = Kc(regeneratorRuntime.mark(function n(o, i) {
                            var s;
                            return regeneratorRuntime.wrap(function(n) {
                                for (;;) switch (n.prev = n.next) {
                                    case 0:
                                        return s = o.component, n.abrupt("return", t.traceAsync(e, Kc(regeneratorRuntime.mark(function e() {
                                            var n, o;
                                            return regeneratorRuntime.wrap(function(e) {
                                                for (;;) switch (e.prev = e.next) {
                                                    case 0:
                                                        return e.next = 2, i.fetchCurrentItems(r());
                                                    case 2:
                                                        if (n = e.sent, o = n.items, !u || 0 !== o.length) {
                                                            e.next = 6;
                                                            break
                                                        }
                                                        return e.abrupt("return");
                                                    case 6:
                                                        return a.logValue({
                                                            component: s,
                                                            valueDescription: {
                                                                data: o
                                                            }
                                                        }), t.traceSync(m.e.repeaterSetData(), function() {
                                                            zc.mark("repeater.refreshView.beforeSetDataItems"), s.data = o
                                                        }), e.next = 10, Promise.all(c);
                                                    case 10:
                                                        zc.measure("repeater.refreshView.renderItemsTime", "repeater.refreshView.beforeSetDataItems"), c.splice(0);
                                                    case 12:
                                                    case "end":
                                                        return e.stop()
                                                }
                                            }, e)
                                        }))));
                                    case 2:
                                    case "end":
                                        return n.stop()
                                }
                            }, n)
                        }));
                        return function(e, t) {
                            return n.apply(this, arguments)
                        }
                    }()
                };
            return Qc(Qc({}, pc), {}, {
                clearComponent: function(e) {
                    e.component.data = []
                },
                bindToComponent: function(e, r, u) {
                    var s = e.component,
                        l = e.compId,
                        f = s.id;
                    vu(s, "onItemReady", function(e, r) {
                        return function(i, a, u) {
                            t.traceSync(m.e.repeaterItemReady(u), function() {
                                var t = {
                                        compId: e,
                                        itemId: a._id
                                    },
                                    u = n.createFixedItemController({
                                        scopeInfo: t,
                                        fixedItem: a,
                                        parentId: r,
                                        scoped$w: i.scoped
                                    });
                                o.setController(t, u);
                                var s = u.pageReady();
                                c.push(s)
                            })
                        }
                    }(l, f), i), vu(s, "onItemRemoved", function(e) {
                        return function(t) {
                            var r = {
                                compId: e,
                                itemId: t._id
                            };
                            o.removeController(r)
                        }
                    }(l), i), a.logBinding({
                        component: s
                    })
                },
                currentRecordModified: function(e, t, n) {
                    var o = e.component,
                        i = Di(r());
                    if (o.data && o.data.length > 0) {
                        var a = o.data.map(function(e) {
                            return e._id === i._id ? i : e
                        });
                        o.data = a
                    }
                },
                recordSetLoaded: s(m.e.repeaterRecordSetLoaded()),
                currentViewChanged: s(m.e.repeaterCurrentViewChanged())
            })
        };

        function ts(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function rs(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? ts(Object(r), !0).forEach(function(t) {
                    ns(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ts(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function ns(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }
        var os = function(e) {
            var t = e.controllerFactory,
                r = e.controllerStore,
                n = e.applicationCodeZone;
            return rs(rs({}, pc), {}, {
                bindToComponent: function(e, o, i) {
                    var a = e.connectionConfig,
                        u = (a.properties, a.events, a.filters, e.component),
                        c = e.compId;
                    vu(u, "onItemReady", function(e) {
                        return function(n, o, i) {
                            var a = {
                                    compId: e,
                                    itemId: o._id
                                },
                                u = t.createDetailsController({
                                    scopeInfo: a,
                                    scoped$w: n.scoped
                                });
                            r.setController(a, u), u.pageReady()
                        }
                    }(c), n), vu(u, "onItemRemoved", function(e) {
                        return function(t) {
                            var n = {
                                compId: e,
                                itemId: t._id
                            };
                            r.removeController(n)
                        }
                    }(c), n)
                }
            })
        };

        function is(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function as(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? is(Object(r), !0).forEach(function(t) {
                    us(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : is(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function us(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }

        function cs(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function ss(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? cs(Object(r), !0).forEach(function(t) {
                    fs(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : cs(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function ls(e, t, r, n, o, i, a) {
            try {
                var u = e[i](a),
                    c = u.value
            } catch (e) {
                return void r(e)
            }
            u.done ? t(c) : Promise.resolve(c).then(n, o)
        }

        function fs(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }

        function ds(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function ps(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? ds(Object(r), !0).forEach(function(t) {
                    ms(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ds(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function ms(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }
        var hs;

        function vs(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }
        var ys = (vs(hs = {}, pe, function(e) {
                var t = e.datasetApi,
                    r = e.applicationCodeZone,
                    n = e.databindingVerboseReporter,
                    i = e.getState,
                    a = e.modeIsLivePreview,
                    u = function(e, t) {
                        return function() {
                            var r = function(e) {
                                return function() {
                                    var t = this,
                                        r = arguments;
                                    return new Promise(function(n, o) {
                                        var i = e.apply(t, r);

                                        function a(e) {
                                            Sc(i, n, o, a, u, "next", e)
                                        }

                                        function u(e) {
                                            Sc(i, n, o, a, u, "throw", e)
                                        }
                                        a(void 0)
                                    })
                                }
                            }(regeneratorRuntime.mark(function r(n, o) {
                                var i, a, u;
                                return regeneratorRuntime.wrap(function(r) {
                                    for (;;) switch (r.prev = r.next) {
                                        case 0:
                                            return r.next = 2, e(n, o - n);
                                        case 2:
                                            return i = r.sent, a = i.items, u = i.totalCount, t(a), r.abrupt("return", {
                                                pageRows: a,
                                                totalRowsCount: u
                                            });
                                        case 7:
                                        case "end":
                                            return r.stop()
                                    }
                                }, r)
                            }));
                            return function(e, t) {
                                return r.apply(this, arguments)
                            }
                        }()
                    };
                return Tc(Tc({}, pc), {}, {
                    clearComponent: function(e) {
                        var t = e.component;
                        t.rows = [], t.dataFetcher = void 0
                    },
                    bindToComponent: function(e, c) {
                        var s = e.component;
                        c.getInitialData().chain(function(e) {
                            var t = e.items;
                            s.rows = t
                        });
                        var l = function(e) {
                                return function(t) {
                                    var r = [],
                                        i = e.columns;
                                    Object(o.forEach)(t, function(e) {
                                        var t = {};
                                        Object(o.forEach)(i, function(r) {
                                            t[r.label] = Object(o.get)(e, r.dataPath)
                                        }), r.push(t)
                                    }), n.logValue({
                                        component: e,
                                        valueDescription: r
                                    })
                                }
                            }(s),
                            f = Di(i());
                        a && !f || (s.dataFetcher = u(c.fetch, l)), vu(s, "onCellSelect", function(e) {
                                var r = e.cellRowIndex;
                                t.setCurrentItemIndex(r)
                            }, r), vu(s, "onRowSelect", function(e) {
                                var r = e.rowIndex;
                                t.setCurrentItemIndex(r)
                            }, r),
                            function(e) {
                                var t = {};
                                e.columns.forEach(function(e) {
                                    var r = e.label,
                                        n = e.dataPath,
                                        o = e.linkPath;
                                    (n || o) && (t[r] = Object.assign(n ? {
                                        dataPath: n
                                    } : {}, o ? {
                                        linkPath: o
                                    } : {}))
                                }), n.logBinding({
                                    component: e,
                                    bindingDescription: t
                                })
                            }(s)
                    },
                    currentRecordModified: function(e, t, r) {
                        e.component.refresh()
                    },
                    recordSetLoaded: function(e, t) {
                        e.component.refresh()
                    },
                    currentViewChanged: function(e, t) {
                        e.component.refresh()
                    }
                })
            }), vs(hs, "dropdownOptionsRole", _c), vs(hs, "galleryRole", function(e) {
                var t = e.getState,
                    r = (e.wixSdk, e.getFieldType),
                    n = e.applicationCodeZone,
                    i = e.databindingVerboseReporter,
                    a = e.platformAPIs,
                    u = e.wixFormatter,
                    c = e.modeIsLivePreview,
                    s = function(e, t, n, i) {
                        return Object(o.forEach)(n || [], function(n, o) {
                            var c = n.fieldName,
                                s = n.format,
                                l = dc({
                                    value: hu(t, c),
                                    role: i,
                                    fieldType: r(c).getOrElse(""),
                                    propPath: o,
                                    format: s,
                                    utils: {
                                        formatter: u,
                                        mediaItemUtils: a.mediaItemUtils
                                    }
                                });
                            e[o] = l
                        })
                    },
                    l = function(e) {
                        try {
                            e.galleryCapabilities.hasCurrentItem && (e.currentIndex = xi(t()))
                        } catch (e) {}
                    },
                    f = function() {
                        var e = function(e) {
                            return function() {
                                var t = this,
                                    r = arguments;
                                return new Promise(function(n, o) {
                                    var i = e.apply(t, r);

                                    function a(e) {
                                        Vc(i, n, o, a, u, "next", e)
                                    }

                                    function u(e) {
                                        Vc(i, n, o, a, u, "throw", e)
                                    }
                                    a(void 0)
                                })
                            }
                        }(regeneratorRuntime.mark(function e(r, n) {
                            var o, a, u, f, d, p, m;
                            return regeneratorRuntime.wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return o = r.connectionConfig.properties, a = r.component, u = r.role, e.next = 3, n.fetchCurrentItems(t());
                                    case 3:
                                        if (f = e.sent, d = f.items, e.prev = 5, p = d.map(function(e) {
                                                var t = {};
                                                return s(t, e, o, u), t
                                            }), m = p.every(function(e) {
                                                return !e.src
                                            }), !c || !m) {
                                            e.next = 10;
                                            break
                                        }
                                        return e.abrupt("return");
                                    case 10:
                                        i.logValue({
                                            component: a,
                                            valueDescription: p
                                        }), a.items = p, e.next = 18;
                                        break;
                                    case 14:
                                        if (e.prev = 14, e.t0 = e.catch(5), "URIError" === e.t0.name) {
                                            e.next = 18;
                                            break
                                        }
                                        throw e.t0;
                                    case 18:
                                        l(a);
                                    case 19:
                                    case "end":
                                        return e.stop()
                                }
                            }, e, null, [
                                [5, 14]
                            ])
                        }));
                        return function(t, r) {
                            return e.apply(this, arguments)
                        }
                    }();
                return Wc(Wc({}, pc), {}, {
                    clearComponent: function(e) {
                        e.component.items = []
                    },
                    isValidContext: function(e) {
                        var t = e.connectionConfig.properties;
                        return !Object(o.isEmpty)(t)
                    },
                    bindToComponent: function(e, t) {
                        var r = e.connectionConfig.properties,
                            a = e.component;
                        Object(o.has)(r, "link") && (a.clickAction = "link"), Object(o.get)(a, ["galleryCapabilities", "hasCurrentItem"]) && vu(a, "onCurrentItemChanged", function() {
                                t.setCurrentIndex(a.currentIndex)
                            }, n),
                            function(e, t) {
                                var r = {};
                                Object(o.forEach)(t, function(e, t) {
                                    var n = e.fieldName;
                                    r[t] = n
                                }), i.logBinding({
                                    component: e,
                                    bindingDescription: r
                                })
                            }(a, r)
                    },
                    currentRecordModified: function(e, r, n) {
                        var o = e.connectionConfig.properties,
                            i = e.component,
                            a = e.role,
                            u = Di(t()),
                            c = xi(t()),
                            f = i.items || [],
                            d = f[c];
                        d && s(d, u, o, a), i.items = f, l(i)
                    },
                    recordSetLoaded: f,
                    currentViewChanged: f,
                    currentIndexChanged: function(e, t) {
                        var r = e.component;
                        l(r)
                    }
                })
            }), vs(hs, me, function(e) {
                var t = e.getState,
                    r = e.datasetApi,
                    n = e.errorReporter,
                    i = e.getFieldType,
                    a = e.applicationCodeZone,
                    u = e.databindingVerboseReporter,
                    c = e.platformAPIs.mediaItemUtils,
                    s = e.appLogger,
                    l = {},
                    f = function(e) {
                        e.reset && e.reset()
                    },
                    d = function(e, r) {
                        var n = e.component,
                            i = e.connectionConfig,
                            a = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
                            u = Di(t()),
                            c = $c(i),
                            s = r.isCurrentRecordNew(t()),
                            l = Object(o.isEmpty)(hu(u, c));
                        (r.isCurrentRecordPristine(t()) || a) && f(n), !l || s && !a || n.updateValidityIndication()
                    };
                return qc(qc({}, pc), {}, {
                    clearComponent: function(e) {
                        var t = e.component;
                        f(t)
                    },
                    isValidContext: function(e) {
                        var t = e.connectionConfig;
                        return Object(o.values)(t).find(function(e) {
                            return !Object(o.isEmpty)(e)
                        })
                    },
                    bindToComponent: function(e, f) {
                        var d = e.connectionConfig,
                            p = e.component,
                            m = e.compId,
                            h = e.role;
                        if (!ji(t())) {
                            var v = $c(d),
                                y = i(v).getOrElse("");
                            vu(p, "onChange", function() {
                                l[m] = !0
                            }, a), r.onBeforeSave(function() {
                                if (l[m] && p.value.length) return function(e) {
                                    return "function" != typeof e.uploadFiles ? (s.error("uploadFiles API method is not supported by Platform"), e.startUpload()) : e.uploadFiles()
                                }(p).then(function(e) {
                                    l[m] = !1;
                                    var r = Di(t()),
                                        n = fc({
                                            value: Array.isArray(e) ? e : [e],
                                            currentValue: hu(r, v),
                                            fieldType: y,
                                            fieldName: v,
                                            role: h,
                                            utils: {
                                                mediaItemUtils: c
                                            }
                                        });
                                    f.setFieldInCurrentRecordAndSynchronize(v, n, m)
                                }, function(e) {
                                    var t = p.value,
                                        r = Array.isArray(t) && 1 === t.length ? t[0].name : "unknown";
                                    throw n("The ".concat(r, " file failed to upload. Please try again later."), e), e
                                })
                            }), i(v).map(function(e) {
                                switch (e) {
                                    case "image":
                                        p.fileType = "Image";
                                        break;
                                    case "document":
                                        p.fileType = "Document"
                                }
                            });
                            var g = d.properties;
                            Object(o.forEach)(g, function(e, t) {
                                var r = e.fieldName;
                                u.logBinding({
                                    component: p,
                                    bindingDescription: Hc({}, t, r)
                                })
                            })
                        }
                    },
                    currentRecordModified: function(e, t, r) {
                        var n = e.component,
                            i = e.connectionConfig,
                            a = e.compId,
                            u = $c(i),
                            c = Object(o.includes)(r, u);
                        c && (l[a] = !1), d({
                            component: n,
                            connectionConfig: i
                        }, t, c)
                    },
                    recordSetLoaded: function(e, t) {
                        d(e, t)
                    },
                    currentViewChanged: function(e, t) {
                        d(e, t)
                    },
                    currentIndexChanged: function(e, t) {
                        d(e, t)
                    }
                })
            }), vs(hs, "detailsDatasetRole", function() {
                return {
                    isValidContext: function() {
                        return !1
                    }
                }
            }), vs(hs, "repeaterRole", es), vs(hs, he, function(e) {
                var t = e.getState,
                    r = e.applicationCodeZone,
                    n = e.databindingVerboseReporter,
                    o = function(e, t) {
                        return t * (e - 1)
                    },
                    i = function(e, r) {
                        var n = e.component,
                            o = function(e) {
                                return Do.getCurrentPage(e.records)
                            }(t()),
                            i = gi(t(), r.getTotalItemsCount());
                        n.currentPage = o, i < 1 ? n.disable() : (n.enable(), n.totalPages = i)
                    };
                return as(as({}, pc), {}, {
                    bindToComponent: function(e, i) {
                        var a = e.component;
                        vu(a, "onChange", function(e) {
                            var r = e.target.currentPage,
                                n = Oi(t()),
                                a = gi(t(), i.getTotalItemsCount());
                            r < 1 ? i.setCurrentIndex(0) : r > a ? i.setCurrentIndex(o(a, n.size)) : i.setCurrentIndex(o(r, n.size))
                        }, r), n.logBinding({
                            component: a
                        })
                    },
                    recordSetLoaded: i,
                    currentViewChanged: i
                })
            }), vs(hs, "detailsRepeaterRole", os), vs(hs, "filterInputRole", function(e) {
                var t = e.applicationCodeZone;
                return ps(ps({}, pc), {}, {
                    bindToComponent: function(e, r) {
                        var n = e.component;
                        "function" == typeof n.onChange && vu(n, "onChange", r.refresh, t)
                    },
                    resetUserFilter: function(e) {
                        var t = e.component;
                        t[Ye(t)] = function(e) {
                            switch (e.type) {
                                case He:
                                    return !1;
                                case $e:
                                    return "";
                                default:
                                    return null
                            }
                        }(t)
                    }
                })
            }), vs(hs, "googleMapRole", function(e) {
                var t = e.getState,
                    r = (e.wixSdk, e.errorReporter),
                    n = e.getFieldType,
                    i = e.databindingVerboseReporter,
                    a = e.wixFormatter,
                    u = function(e) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [],
                            r = arguments.length > 2 ? arguments[2] : void 0;
                        return Object(o.reduce)(t, function(t, i, u) {
                            var c = i.fieldName,
                                s = i.format,
                                l = hu(e, c);
                            if ("address" === u) return Object.assign(t, {
                                address: Object(o.get)(l, "formatted"),
                                location: Object(o.get)(l, "location")
                            });
                            if ("link" === u && Object(o.isEmpty)(l)) return t;
                            var f = dc({
                                value: hu(e, c),
                                role: r,
                                fieldType: n(c).getOrElse(""),
                                propPath: u,
                                format: s,
                                utils: {
                                    formatter: a
                                }
                            });
                            return Object.assign(t, fs({}, u, f))
                        }, {})
                    },
                    c = function() {
                        var e = function(e) {
                            return function() {
                                var t = this,
                                    r = arguments;
                                return new Promise(function(n, o) {
                                    var i = e.apply(t, r);

                                    function a(e) {
                                        ls(i, n, o, a, u, "next", e)
                                    }

                                    function u(e) {
                                        ls(i, n, o, a, u, "throw", e)
                                    }
                                    a(void 0)
                                })
                            }
                        }(regeneratorRuntime.mark(function e(n, o) {
                            var i, a, c, s, l;
                            return regeneratorRuntime.wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return i = n.connectionConfig.properties, a = n.component, c = n.role, e.prev = 1, e.next = 4, o.fetchCurrentItems(t());
                                    case 4:
                                        s = e.sent, l = s.items, a.markers = l.map(function(e) {
                                            return u(e, i, c)
                                        }), e.next = 12;
                                        break;
                                    case 9:
                                        e.prev = 9, e.t0 = e.catch(1), r("Failed setting markers:", e.t0);
                                    case 12:
                                    case "end":
                                        return e.stop()
                                }
                            }, e, null, [
                                [1, 9]
                            ])
                        }));
                        return function(t, r) {
                            return e.apply(this, arguments)
                        }
                    }();
                return ss(ss({}, pc), {}, {
                    clearComponent: function(e) {
                        e.component.markers = []
                    },
                    isValidContext: function(e) {
                        var t = e.connectionConfig;
                        return Object(o.values)(t).find(function(e) {
                            return !Object(o.isEmpty)(e)
                        })
                    },
                    bindToComponent: function(e) {
                        var t = e.connectionConfig;
                        ! function(e, t) {
                            var r = t.properties,
                                n = {};
                            Object(o.forEach)(r, function(e, t) {
                                var r = e.fieldName;
                                n[t] = r
                            }), i.logBinding({
                                component: e,
                                bindingDescription: n
                            })
                        }(e.component, t)
                    },
                    currentRecordModified: function(e) {
                        var r = e.component,
                            n = e.role,
                            i = e.connectionConfig.properties,
                            a = Di(t()),
                            c = xi(t());
                        r.markers[c] = u(a, i, n), r.setCenter(Object(o.get)(r, ["markers", c, "location"]))
                    },
                    recordSetLoaded: c,
                    currentViewChanged: c,
                    currentIndexChanged: function(e) {
                        ! function(e) {
                            var r = e.component,
                                n = xi(t());
                            r.setCenter(Object(o.get)(r, ["markers", n, "location"]))
                        }(e)
                    }
                })
            }), vs(hs, "selectionTagsOptionsRole", Lc), hs),
            gs = function(e) {
                var t = e.role,
                    r = e.adapterParams,
                    n = e.component;
                return function(e, t) {
                    return ys[e] || t && Ec || bc
                }(t, za(n))(r)
            },
            bs = function(e) {
                var t = e.connectedComponents,
                    r = e.adapterApi,
                    n = e.getFieldType,
                    o = e.ignoreItemsInRepeater,
                    i = e.$w,
                    a = e.dependencies,
                    u = e.adapterParams,
                    c = [];
                return t.forEach(function(e) {
                    var s = e.component,
                        l = e.role,
                        f = e.compId;
                    if (o && du(s).map(function(e) {
                            return lu(e.uniqueId, a, t)
                        }).map(function(e) {
                            return e === uu || e === cu
                        }).getOrElse(!1)) return;
                    var d = au({
                        getFieldType: n,
                        role: l,
                        compId: f,
                        component: s,
                        $w: i,
                        api: gs({
                            role: l,
                            adapterParams: u,
                            component: s
                        })
                    });
                    r().isValidContext(d) && c.push(d)
                }), c
            },
            ws = function(e, t, r, n) {
                var i = [];
                return e.forEach(function(t) {
                    var n = t.component;
                    du(n).chain(function(t) {
                        lu(t.uniqueId, r, e) === cu && i.push(t)
                    })
                }), Object(o.uniqBy)(i, "uniqueId").map(function(e) {
                    return au({
                        getFieldType: t,
                        role: "detailsRepeaterRole",
                        component: e,
                        compId: e.uniqueId,
                        api: gs({
                            role: "detailsRepeaterRole",
                            adapterParams: n,
                            component: e
                        })
                    })
                })
            },
            Os = function(e) {
                return e.bindToComponent(), Promise.all(e.recordSetLoaded())
            },
            Is = r(57),
            Es = r.n(Is),
            Rs = function(e, t) {
                return [pe, he].includes(e) || t && t.properties && Object.keys(t.properties).length > 0
            },
            Ts = be,
            js = "READ",
            Ss = function(e, t, r, n, o, i, a) {
                if (!o) {
                    var u = vi(t);
                    if (u) {
                        var c = Ii(t);
                        !!Di(t) && [Ts, js].includes(c) && r.find(function(e) {
                            var t = e.role,
                                r = e.config;
                            return Rs(t, r)
                        }) && e({
                            evid: Object(bt.a)(a.window.viewMode) ? 153 : 152,
                            ds_id: i,
                            ds_type: n,
                            mode: c,
                            collection_name: u,
                            viewmode: a.window.viewMode,
                            page_url: a.location.url.split("?")[0]
                        }), mo(Ii(t), r) && e({
                            evid: Object(bt.a)(a.window.viewMode) ? 157 : 156,
                            ds_id: i,
                            ds_type: n,
                            mode: c,
                            collection_name: u,
                            viewmode: a.window.viewMode,
                            page_url: a.location.url.split("?")[0]
                        })
                    }
                }
            },
            Ps = r(16);

        function Cs(e) {
            "@babel/helpers - typeof";
            return (Cs = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            })(e)
        }
        var Ds = qe.a.UploadButton,
            xs = function(e, t) {
                var r = e.component,
                    n = e.connectionConfig;
                return r.type === Ds ? function(e, t, r) {
                    if (e.validity.valid) return !0;
                    if (Object(o.some)(Object(o.values)(Object(o.omit)(e.validity, ["valid", "valueMissing"])), function(e) {
                            return e
                        })) return !1;
                    var n = Object(o.get)(r, "properties.value.fieldName");
                    return !Object(o.isEmpty)(t[n])
                }(r, t, n) : "object" !== Cs(r.validity) || r.validity.valid
            };

        function As(e, t, r, n, o, i, a) {
            try {
                var u = e[i](a),
                    c = u.value
            } catch (e) {
                return void r(e)
            }
            u.done ? t(c) : Promise.resolve(c).then(n, o)
        }

        function _s(e) {
            return function() {
                var t = this,
                    r = arguments;
                return new Promise(function(n, o) {
                    var i = e.apply(t, r);

                    function a(e) {
                        As(i, n, o, a, u, "next", e)
                    }

                    function u(e) {
                        As(i, n, o, a, u, "throw", e)
                    }
                    a(void 0)
                })
            }
        }
        var ks = function(e) {
            return Object(o.isEqual)(!1, e)
        };

        function Ns(e, t) {
            return Object(o.mapValues)(t, function(t, r) {
                return e(r).map(function(e) {
                    return function(e, t) {
                        switch (e) {
                            case "number":
                                return Number(t);
                            case "boolean":
                                if ("string" == typeof t) return "true" === t.toLowerCase() || "1" === t.toLowerCase();
                                break;
                            case "text":
                                if (null != t && "function" == typeof t.toString) return t.toString()
                        }
                        return t
                    }(e, t)
                }).getOrElse(t)
            })
        }
        var Ms = function(e, t, r, n, i, a, u, c, s, l, f, d) {
                var p = ["setFieldsInCurrentRecord"],
                    h = Object(m.b)(i, function(e, t) {
                        return {
                            category: "effects",
                            level: "info",
                            message: "".concat(e, "(").concat(p.includes(e) ? "..".concat(t.length, " arguments..") : t.map(JSON.stringify), ") (").concat(a, ")"),
                            data: {}
                        }
                    }, function(e) {
                        return e
                    }),
                    v = h.withBreadcrumbs,
                    y = h.withBreadcrumbsAsync;

                function g(e, r) {
                    t().currentRecordModified(r, e)
                }

                function b(e) {
                    var t = u.filter(function(t) {
                        return !xs(t, e)
                    });
                    if (t.forEach(function(e) {
                            return e.component.updateValidityIndication()
                        }), t.length) throw new ha("DS_VALIDATION_ERROR", "Some of the elements validation failed")
                }

                function w(e) {
                    return c(s).fold(function() {}, function() {
                        var t = _s(regeneratorRuntime.mark(function t(r) {
                            var n, u, s;
                            return regeneratorRuntime.wrap(function(t) {
                                for (;;) switch (t.prev = t.next) {
                                    case 0:
                                        return t.prev = 0, n = Object(o.pickBy)(r.fields, function(e, t) {
                                            return Object(Ps.b)(e, t) && !O(e)
                                        }), u = {
                                            "form-id": {
                                                value: a,
                                                keyName: ""
                                            }
                                        }, Object(o.forEach)(n, function(t, r) {
                                            var n = Object(Ps.a)(a, r),
                                                o = t.displayName,
                                                i = t.index;
                                            I({
                                                record: e,
                                                fieldData: t,
                                                fieldName: r,
                                                getSchema: c
                                            }).fold(function() {}, function(e) {
                                                var t = e.value,
                                                    r = e.type;
                                                u["field:".concat(n)] = {
                                                    value: t,
                                                    keyName: o,
                                                    index: i,
                                                    valueType: r
                                                }
                                            })
                                        }), s = hu(e, "_updatedDate"), t.next = 7, l({
                                            eventUTCTime: s,
                                            detailedEventPayload: u
                                        });
                                    case 7:
                                        t.next = 12;
                                        break;
                                    case 9:
                                        t.prev = 9, t.t0 = t.catch(0), t.t0.message.includes("Network request failed") ? i.info("automations integration - Network request failed on sendAutomationEvent") : i.error(t.t0);
                                    case 12:
                                    case "end":
                                        return t.stop()
                                }
                            }, t, null, [
                                [0, 9]
                            ])
                        }));
                        return function(e) {
                            return t.apply(this, arguments)
                        }
                    }())
                }

                function O(e) {
                    return !!e.isDeleted
                }

                function I(e) {
                    var t = e.record,
                        r = e.fieldData,
                        n = e.fieldName,
                        o = e.getSchema;
                    return "reference" === r.type ? o(r.referencedCollection).map(function(e) {
                        var r = hu(t[n], e.displayField);
                        return {
                            value: Tu(r),
                            type: e.fields[e.displayField].type
                        }
                    }) : Pe.Maybe.Just({
                        value: Tu(hu(t, n)),
                        type: r.type
                    })
                }

                function E(e) {
                    for (var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++) r[n - 1] = arguments[n];
                    return i.userCodeZone(f).apply(void 0, [e].concat(r))
                }

                function R() {
                    return Promise.all(t().recordSetLoaded())
                }
                return {
                    goToRecordByIndex: function(t, r, n) {
                        return {
                            run: y("goToRecordByIndex", function() {
                                return e().fold(function(e) {
                                    throw new ha("DS_OPERATION_FAILED", e)
                                }, function() {
                                    var e = _s(regeneratorRuntime.mark(function e(o) {
                                        var i, a, u;
                                        return regeneratorRuntime.wrap(function(e) {
                                            for (;;) switch (e.prev = e.next) {
                                                case 0:
                                                    if (i = o.getMatchingRecordCount(), a = Math.max(Math.min(r, i - 1), 0), t === a && !n) {
                                                        e.next = 9;
                                                        break
                                                    }
                                                    return e.next = 5, o.getRecords(a, 1);
                                                case 5:
                                                    return u = e.sent, e.abrupt("return", u.matchWith({
                                                        Empty: function() {
                                                            return ea.GoToIndexResult.NoRecord()
                                                        },
                                                        Results: function(e) {
                                                            var t = e.items;
                                                            return ea.GoToIndexResult.Record(a, t[0])
                                                        }
                                                    }));
                                                case 9:
                                                    return e.abrupt("return", ea.GoToIndexResult.InvalidIndex());
                                                case 10:
                                                case "end":
                                                    return e.stop()
                                            }
                                        }, e)
                                    }));
                                    return function(t) {
                                        return e.apply(this, arguments)
                                    }
                                }())
                            }),
                            isQueued: !0,
                            resultActionCreator: ea.goToRecordByIndexResult
                        }
                    },
                    setFieldsInCurrentRecord: function(t, n, o) {
                        return {
                            run: v("setFieldsInCurrentRecord", function() {
                                var i = Ns(r, t);
                                return e().fold(function(e) {
                                    throw new ha("DS_OPERATION_FAILED", e)
                                }, function(e) {
                                    return e.setFieldsValues(n, i, o).fold(function(e) {
                                        throw e
                                    }, function(e) {})
                                })
                            }),
                            isQueued: !1
                        }
                    },
                    revertChanges: function(t, r) {
                        return {
                            run: v("revertChanges", function() {
                                e().chain(function(e) {
                                    return e.resetDraft(t, r)
                                }), g()
                            }),
                            isQueued: !1,
                            resultActionCreator: ea.revertResult
                        }
                    },
                    saveRecord: function(t, r, i) {
                        return {
                            run: y("saveRecord", function() {
                                var a = _s(regeneratorRuntime.mark(function a() {
                                    return regeneratorRuntime.wrap(function(a) {
                                        for (;;) switch (a.prev = a.next) {
                                            case 0:
                                                return a.next = 2, Ba(d, "beforeSave"), n("beforeSave").then(function(e) {
                                                    return e.some(ks)
                                                }).catch(function(e) {
                                                    return {
                                                        error: e
                                                    }
                                                }).then(function(e) {
                                                    if (e) throw new ha("DS_OPERATION_CANCELLED", "Operation cancelled by user code. ".concat(Object(o.isBoolean)(e) ? "" : e.error))
                                                });
                                            case 2:
                                                return a.abrupt("return", e().fold(function() {
                                                    return !1
                                                }, function() {
                                                    var e = _s(regeneratorRuntime.mark(function e(n) {
                                                        var o;
                                                        return regeneratorRuntime.wrap(function(e) {
                                                            for (;;) switch (e.prev = e.next) {
                                                                case 0:
                                                                    if (!n.hasDraft(t)) {
                                                                        e.next = 10;
                                                                        break
                                                                    }
                                                                    return b(r), e.next = 4, n.saveRecord(t);
                                                                case 4:
                                                                    if (o = e.sent, E("afterSave", r, o), !i) {
                                                                        e.next = 9;
                                                                        break
                                                                    }
                                                                    return e.next = 9, w(o);
                                                                case 9:
                                                                    return e.abrupt("return", o);
                                                                case 10:
                                                                case "end":
                                                                    return e.stop()
                                                            }
                                                        }, e)
                                                    }));
                                                    return function(t) {
                                                        return e.apply(this, arguments)
                                                    }
                                                }()));
                                            case 3:
                                            case "end":
                                                return a.stop()
                                        }
                                    }, a)
                                }));
                                return function() {
                                    return a.apply(this, arguments)
                                }
                            }()),
                            isQueued: !0,
                            resultActionCreator: ea.saveRecordResult
                        }
                    },
                    removeCurrentRecord: function(t) {
                        return {
                            run: y("removeCurrentRecord", function() {
                                return function(t) {
                                    return e().fold(function(e) {
                                        throw new ha("DS_OPERATION_FAILED", e)
                                    }, function(e) {
                                        return e.removeRecord(t)
                                    })
                                }(t)
                            }),
                            isQueued: !0,
                            resultActionCreator: ea.removeCurrentRecordResult
                        }
                    },
                    newRecord: function(t, r) {
                        return {
                            run: v("newRecord", function() {
                                return function(t, r) {
                                    return e().fold(function(e) {
                                        throw new ha("DS_OPERATION_FAILED", e)
                                    }, function(e) {
                                        return e.newRecord(t, r)
                                    })
                                }(t, r)
                            }),
                            isQueued: !0,
                            resultActionCreator: ea.newRecordResult
                        }
                    },
                    fireEvent: function(e) {
                        for (var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++) r[n - 1] = arguments[n];
                        return {
                            run: v("fireEvent", function() {
                                return E.apply(void 0, [e].concat(r))
                            }),
                            isQueued: !1
                        }
                    },
                    notifyIndexChange: function(e) {
                        return {
                            run: v("notifyIndexChange", function() {
                                t().currentIndexChanged(), E("currentIndexChanged", e)
                            }),
                            isQueued: !1
                        }
                    },
                    notifyRecordSetLoaded: function() {
                        return {
                            run: y("notifyRecordSetLoaded", R),
                            isQueued: !0
                        }
                    },
                    updateCurrentView: function(e) {
                        return {
                            run: y("updateCurrentView", function() {
                                return Promise.all(t().currentViewChanged())
                            }),
                            isQueued: !0,
                            resultActionCreator: ea.updateCurrentViewResult
                        }
                    },
                    refresh: function(t, r, n) {
                        return {
                            run: y("refresh", function() {
                                var t = _s(regeneratorRuntime.mark(function t() {
                                    return regeneratorRuntime.wrap(function(t) {
                                        for (;;) switch (t.prev = t.next) {
                                            case 0:
                                                return t.abrupt("return", e().fold(function(e) {
                                                    throw new ha("DS_OPERATION_FAILED", e)
                                                }, function() {
                                                    var e = _s(regeneratorRuntime.mark(function e(t) {
                                                        return regeneratorRuntime.wrap(function(e) {
                                                            for (;;) switch (e.prev = e.next) {
                                                                case 0:
                                                                    return t.reset(), e.abrupt("return", n ? ea.GoToIndexResult.Record(0, t.newRecord(0, r)) : t.getRecords(0, 1).then(function(e) {
                                                                        return e.matchWith({
                                                                            Empty: function() {
                                                                                return ea.GoToIndexResult.NoRecord()
                                                                            },
                                                                            Results: function(e) {
                                                                                var t = e.items;
                                                                                return ea.GoToIndexResult.Record(0, t[0])
                                                                            }
                                                                        })
                                                                    }));
                                                                case 2:
                                                                case "end":
                                                                    return e.stop()
                                                            }
                                                        }, e)
                                                    }));
                                                    return function(t) {
                                                        return e.apply(this, arguments)
                                                    }
                                                }()));
                                            case 1:
                                            case "end":
                                                return t.stop()
                                        }
                                    }, t)
                                }));
                                return function() {
                                    return t.apply(this, arguments)
                                }
                            }()),
                            isQueued: !0,
                            resultActionCreator: ea.refreshResult
                        }
                    },
                    updateComponents: function(e, t) {
                        return {
                            run: v("updateComponents", function() {
                                g(e, t)
                            }),
                            isQueued: !1
                        }
                    }
                }
            },
            Fs = function(e, t, r, n, i, a, u, c, s, l, f, d) {
                var p = Ms(e, t, r, n, i, a, u, c, s, l, f, d),
                    m = function(e) {
                        e.from;
                        var t = e.to,
                            r = e.hasChangedToTrue,
                            n = xi(t),
                            o = Di(t);
                        if (r(Hi)) return p.saveRecord(n, o, function(e) {
                            return Do.isForm(e.records)
                        }(t))
                    };
                return function(e) {
                    return Object(o.flatten)([function(e) {
                        var t = e.from,
                            r = e.to,
                            n = e.hasChanged,
                            o = e.hasChangedToFalse,
                            i = e.hasChangedToTrue,
                            a = e.hasChangedToMatch,
                            u = xi(r),
                            c = xi(t),
                            s = _i(r),
                            l = Bi(r),
                            f = [];
                        return (a(_i, function(e) {
                            return e >= 0 && e !== u
                        }) || i(Bi)) && f.push(p.goToRecordByIndex(c, s, l)), (n(xi) && c >= 0 || o(Wi) && 0 === u) && f.push(p.notifyIndexChange(u)), f
                    }, function(e) {
                        var t = e.from,
                            r = e.to,
                            n = e.hasChanged,
                            i = e.hasChangedToMatch,
                            a = e.hasChangedToTrue,
                            u = xi(r),
                            c = Di(r),
                            s = Di(t),
                            l = [];
                        if (_t(s, c)) {
                            if (!Object(o.isEqual)(s, c)) {
                                var f = Object.keys(c).filter(function(e) {
                                    return !Object(o.isEqual)(c[e], s[e])
                                });
                                l.push(p.updateComponents(Mi(r), f)), l.push(p.fireEvent("itemValuesChanged", Object(o.cloneDeep)(s), Object(o.cloneDeep)(c)))
                            }
                        } else null == s || null == c || n(xi) || l.push(p.updateComponents());
                        var d = ki(r);
                        return i(ki, function(e) {
                            return null != e
                        }) && l.push(p.setFieldsInCurrentRecord(d, u, Mi(r))), a(qi) && l.push(p.revertChanges(u, Ai(r))), a(Gi) && l.push(p.removeCurrentRecord(u)), l
                    }, function(e) {
                        var t = e.to,
                            r = e.hasChanged,
                            n = e.hasChangedToFalse,
                            o = e.hasChangedToTrue,
                            i = [];
                        return r(yi) && i.push(p.refresh(xi(t), Ai(t), Si(t))), r(Oi) && i.push(p.notifyRecordSetLoaded()), o(Wi) && i.push(p.refresh(xi(t), Ai(t), Si(t))), n(Wi) && i.push(p.notifyRecordSetLoaded()), o(Vi) && i.push(p.updateCurrentView()), i
                    }, m, function(e) {
                        e.from;
                        var t = e.to,
                            r = [];
                        return (0, e.hasChangedToNotNull)(Fi) && r.push(p.newRecord(Fi(t), Ai(t))), r
                    }].map(function(t) {
                        return t(e)
                    }))
                }
            },
            Ls = function(e) {
                return Li(e).shouldLoadUrl()
            },
            Us = function(e) {
                return Ui(e).shouldLoadUrl()
            },
            Ws = function(e) {
                var t = {
                        run: e.getNextDynamicPageUrl,
                        isQueued: !0,
                        resultActionCreator: function(e, t) {
                            return {
                                type: ri,
                                error: e,
                                payload: t
                            }
                        }
                    },
                    r = {
                        run: e.getPreviousDynamicPageUrl,
                        isQueued: !0,
                        resultActionCreator: function(e, t) {
                            return {
                                type: ni,
                                error: e,
                                payload: t
                            }
                        }
                    };
                return function(e) {
                    return Object(o.flatten)([function(e) {
                        var n = e.hasChangedToTrue,
                            o = [];
                        return n(Ls) && o.push(t), n(Us) && o.push(r), o
                    }].map(function(t) {
                        return t(e)
                    }))
                }
            };

        function Bs(e, t, r, n, o, i, a) {
            try {
                var u = e[i](a),
                    c = u.value
            } catch (e) {
                return void r(e)
            }
            u.done ? t(c) : Promise.resolve(c).then(n, o)
        }
        var Vs = function() {
                var e = function(e) {
                    return function() {
                        var t = this,
                            r = arguments;
                        return new Promise(function(n, o) {
                            var i = e.apply(t, r);

                            function a(e) {
                                Bs(i, n, o, a, u, "next", e)
                            }

                            function u(e) {
                                Bs(i, n, o, a, u, "throw", e)
                            }
                            a(void 0)
                        })
                    }
                }(regeneratorRuntime.mark(function e(t) {
                    var r, n, o, i, a, u, c, s, l, f, d, p;
                    return regeneratorRuntime.wrap(function(e) {
                        for (;;) switch (e.prev = e.next) {
                            case 0:
                                if (r = t.dataProvider, n = t.collectionName, o = t.directionTowardSibling, i = t.useLowerCaseDynamicPageUrl, a = t.dynamicPagesData, u = (a = void 0 === a ? {} : a).dynamicUrl, c = a.userDefinedFilter, s = a.dynamicUrlPatternFieldsValues, l = a.sort, f = a.sortFields, d = a.patternFields, null != u && d.length) {
                                    e.next = 5;
                                    break
                                }
                                return e.abrupt("return", null);
                            case 5:
                                return e.next = 7, r.getSibling({
                                    collectionName: n,
                                    sort: l,
                                    sortFields: f,
                                    directionTowardSibling: o,
                                    fieldValues: s,
                                    filter: c
                                });
                            case 7:
                                return p = e.sent, e.abrupt("return", p && gt(p, u, i));
                            case 9:
                            case "end":
                                return e.stop()
                        }
                    }, e)
                }));
                return function(t) {
                    return e.apply(this, arguments)
                }
            }(),
            Gs = function(e, t) {
                try {
                    return qs(e(t))
                } catch (e) {
                    return Hs(e)
                }
            },
            qs = function e(t) {
                return {
                    value: t,
                    then: function(e) {
                        return Gs(e, t)
                    },
                    catch: function() {
                        return e(t)
                    }
                }
            },
            Hs = function e(t) {
                return {
                    error: t,
                    then: function() {
                        return e(t)
                    },
                    catch: function(e) {
                        return Gs(e, t)
                    }
                }
            },
            $s = {
                resolve: qs,
                reject: Hs
            },
            Ys = function(e) {
                var t = e.recordStore,
                    r = e.errorReporter,
                    n = e.appLogger;
                return t().fold(function() {
                    return Promise.resolve(Pe.Maybe.Nothing())
                }, function(e) {
                    return e.hasSeedData() ? function(e) {
                        return e.getSeedRecords().matchWith({
                            Empty: function() {
                                return $s.resolve(Pe.Maybe.Nothing())
                            },
                            Results: function(e) {
                                var t = e.items;
                                return $s.resolve(Pe.Maybe.Just(t[0]))
                            }
                        })
                    }(e) : n.traceAsync(m.e.pageReadyGetData(), function() {
                        return function(e) {
                            return e.seed().then(function() {
                                return e.getRecords(0, 1).then(function(e) {
                                    return e.chain(function(e) {
                                        var t = e.items;
                                        return Pe.Maybe.Just(t[0])
                                    })
                                })
                            }).catch(function(e) {
                                return r("Failed to load initial data", e), Pe.Maybe.Nothing()
                            })
                        }(e)
                    })
                })
            };

        function zs(e, t, r, n, o, i, a) {
            try {
                var u = e[i](a),
                    c = u.value
            } catch (e) {
                return void r(e)
            }
            u.done ? t(c) : Promise.resolve(c).then(n, o)
        }
        var Xs = function(e, t) {
                return e.dispatch(function(e) {
                        return {
                            type: Ho,
                            dependenciesIds: e
                        }
                    }(t)),
                    function(e) {
                        return new Promise(function(t) {
                            if (hi(e.getState())) t();
                            else var r = e.subscribe(function() {
                                hi(e.getState()) && (r(), t())
                            })
                        })
                    }(e)
            },
            Qs = function(e, t) {
                return Xs(e, function(e) {
                    return tt(e).map(function(e) {
                        return e.filterExpression.filterId
                    })
                }(t))
            },
            Zs = function(e) {
                e.hasPrefetchedData;
                var t = e.shouldFetchInitialData,
                    r = e.recordStore,
                    n = e.errorReporter,
                    o = e.appLogger,
                    i = e.store,
                    a = e.filter,
                    u = e.datasetIsDeferred,
                    c = e.modeIsSSR,
                    s = function() {
                        return t ? Ys({
                            recordStore: r,
                            errorReporter: n,
                            appLogger: o
                        }) : Promise.resolve(Pe.Maybe.Nothing())
                    },
                    l = nt(a) && Qs(i, a),
                    f = u && function(e) {
                        var t = new p,
                            r = t.promise,
                            n = t.resolve;
                        return e || queueMicrotask(n), r
                    }(c),
                    d = rt(a) && function() {
                        var e = new p;
                        return {
                            waitingForUserInput: e.promise,
                            resolveUserInputDependency: e.resolve
                        }
                    }(),
                    m = d.waitingForUserInput,
                    h = d.resolveUserInputDependency,
                    v = [l, f, m].filter(function(e) {
                        return Boolean(e)
                    });
                return {
                    fetchingInitialData: v.length ? Promise.all(v).then(s) : s(),
                    resolveUserInputDependency: function() {
                        return h && h()
                    },
                    resolveControllerDependencies: function() {
                        var e = function(e) {
                            return function() {
                                var t = this,
                                    r = arguments;
                                return new Promise(function(n, o) {
                                    var i = e.apply(t, r);

                                    function a(e) {
                                        zs(i, n, o, a, u, "next", e)
                                    }

                                    function u(e) {
                                        zs(i, n, o, a, u, "throw", e)
                                    }
                                    a(void 0)
                                })
                            }
                        }(regeneratorRuntime.mark(function e() {
                            return regeneratorRuntime.wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return i.dispatch({
                                            type: Yo
                                        }), e.next = 3, l;
                                    case 3:
                                    case "end":
                                        return e.stop()
                                }
                            }, e)
                        }));
                        return function() {
                            return e.apply(this, arguments)
                        }
                    }()
                }
            },
            Js = function(e) {
                var t = ["value", "checked"];
                return e.reduce(function(e, r) {
                    var n = r.component,
                        i = r.connectionConfig.properties;
                    return t.forEach(function(t) {
                        Object(o.has)(i, t) && function(e, t, r) {
                            var n = r[t];
                            Du(n) && xu(e) ? r[t] = Au({
                                time: n,
                                date: e
                            }) : xu(n) && Du(e) ? r[t] = Au({
                                time: e,
                                date: n
                            }) : r[t] = e
                        }(n[t], i[t].fieldName, e)
                    }), e
                }, {})
            };

        function Ks(e, t) {
            var r = "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
            if (!r) {
                if (Array.isArray(e) || (r = function(e, t) {
                        if (!e) return;
                        if ("string" == typeof e) return el(e, t);
                        var r = Object.prototype.toString.call(e).slice(8, -1);
                        "Object" === r && e.constructor && (r = e.constructor.name);
                        if ("Map" === r || "Set" === r) return Array.from(e);
                        if ("Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return el(e, t)
                    }(e)) || t && e && "number" == typeof e.length) {
                    r && (e = r);
                    var n = 0,
                        o = function() {};
                    return {
                        s: o,
                        n: function() {
                            return n >= e.length ? {
                                done: !0
                            } : {
                                done: !1,
                                value: e[n++]
                            }
                        },
                        e: function(e) {
                            throw e
                        },
                        f: o
                    }
                }
                throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }
            var i, a = !0,
                u = !1;
            return {
                s: function() {
                    r = r.call(e)
                },
                n: function() {
                    var e = r.next();
                    return a = e.done, e
                },
                e: function(e) {
                    u = !0, i = e
                },
                f: function() {
                    try {
                        a || null == r.return || r.return()
                    } finally {
                        if (u) throw i
                    }
                }
            }
        }

        function el(e, t) {
            (null == t || t > e.length) && (t = e.length);
            for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
            return n
        }
        var tl = function(e) {
            var t = e.connectedComponents,
                r = e.updatedCompIds,
                n = e.datasetIsReal;
            if (r.length && n) {
                var o, i = [],
                    a = Ks(t);
                try {
                    for (a.s(); !(o = a.n()).done;) {
                        var u = o.value,
                            c = u.role,
                            s = u.compId;
                        if (r.includes(s)) {
                            if ("filterInputRole" === c) return t;
                            i.push(u)
                        }
                    }
                } catch (e) {
                    a.e(e)
                } finally {
                    a.f()
                }
                return i
            }
            return t
        };

        function rl(e) {
            return function(e) {
                if (Array.isArray(e)) return nl(e)
            }(e) || function(e) {
                if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
            }(e) || function(e, t) {
                if (!e) return;
                if ("string" == typeof e) return nl(e, t);
                var r = Object.prototype.toString.call(e).slice(8, -1);
                "Object" === r && e.constructor && (r = e.constructor.name);
                if ("Map" === r || "Set" === r) return Array.from(e);
                if ("Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return nl(e, t)
            }(e) || function() {
                throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }

        function nl(e, t) {
            (null == t || t > e.length) && (t = e.length);
            for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
            return n
        }

        function ol(e, t, r, n, o, i, a) {
            try {
                var u = e[i](a),
                    c = u.value
            } catch (e) {
                return void r(e)
            }
            u.done ? t(c) : Promise.resolve(c).then(n, o)
        }

        function il(e) {
            return function() {
                var t = this,
                    r = arguments;
                return new Promise(function(n, o) {
                    var i = e.apply(t, r);

                    function a(e) {
                        ol(i, n, o, a, u, "next", e)
                    }

                    function u(e) {
                        ol(i, n, o, a, u, "throw", e)
                    }
                    a(void 0)
                })
            }
        }

        function al(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }
        var ul = function(e, t, r, n) {
            return function(r, i, a) {
                if (function(e, t) {
                        return Object(o.isNull)(e) && Object(o.isNull)(t)
                    }(r, i)) n.error(new Error("onChangeHandler invoked with illegal arguments"), {
                    extra: {
                        arguments: {
                            before: r,
                            after: i,
                            componentIdToExclude: a
                        }
                    }
                });
                else if (function(e, t) {
                        return Object(o.isNull)(e)
                    }(r)) t(ea.refreshCurrentView()).catch(function() {});
                else {
                    var u = Di(e());
                    if (function(e, t) {
                            return Object(o.isNull)(t)
                        }(0, i)) return _t(r, u) && t(ea.refreshCurrentRecord()).catch(function() {}), void t(ea.refreshCurrentView()).catch(function() {});
                    if (function(e, t) {
                            return _t(e, t)
                        }(r, u)) {
                        var c = xi(e());
                        t(ea.setCurrentRecord(i, c, a)).catch(function() {})
                    }
                }
            }
        };

        function cl(e) {
            return Promise.all(e.getAll().map(function(e) {
                return new Promise(function(t) {
                    e.staticExports.onReady(t)
                })
            }))
        }
        var sl = function(e, t, r) {
                var n = Object(o.mapValues)(Object(o.groupBy)(e, function(e) {
                    return e.component.id
                }), function(e) {
                    return e.map(function(e) {
                        return e.role
                    }).join()
                });
                return t.addSessionData(function() {
                    return al({}, r, {
                        components: n
                    })
                })
            },
            ll = function(e, t) {
                return function(r, n, i) {
                    var a = i.$w,
                        u = i.controllerConfig,
                        c = i.datasetType,
                        s = i.connections,
                        l = i.dataProvider,
                        f = i.wixSdk,
                        d = i.firePlatformEvent,
                        p = i.errorReporter,
                        v = i.verboseReporter,
                        y = i.dynamicPagesData,
                        g = i.appLogger,
                        b = i.datasetId,
                        w = i.fixedRecordId,
                        O = i.handshakes,
                        I = void 0 === O ? [] : O,
                        E = i.recordStoreService,
                        R = i.reportFormEventToAutomation,
                        T = i.instantiateDatabindingVerboseReporter,
                        j = i.parentId,
                        S = i.platformAPIs,
                        P = i.updatedCompIds,
                        C = i.markControllerAsRendered,
                        D = i.markDatasetDataFetched,
                        x = i.renderingRegularControllers,
                        A = i.modeIsLivePreview,
                        _ = i.modeIsSSR,
                        k = i.useLowerCaseDynamicPageUrl,
                        N = i.schemasLoading,
                        M = "thunderbolt" === Object(o.get)(S, ["bi", "viewerName"]),
                        F = f.site.regionalSettings || f.window.browserLocale,
                        L = function() {
                            var e;
                            return {
                                findConnectedComponents: function(e, t) {
                                    var r = [];
                                    return e.forEach(function(e) {
                                        var n = t("@" + e);
                                        n && n.forEach(function(t) {
                                            return t && r.push({
                                                role: e,
                                                component: t,
                                                compId: t.uniqueId
                                            })
                                        })
                                    }), r
                                },
                                setConnectedComponents: function(t) {
                                    return e = t
                                },
                                resolveHandshakes: function(e) {
                                    var t = e.datasetApi,
                                        r = e.components,
                                        n = e.controllerConfig,
                                        o = e.controllerConfigured;
                                    return r.filter(function(e) {
                                        return "detailsDatasetRole" === e.role
                                    }).map(function(e) {
                                        var r = e.component;
                                        return e.role, {
                                            controller: r,
                                            handshakeInfo: {
                                                controllerApi: t,
                                                controllerConfig: n,
                                                controllerConfigured: o,
                                                connectionConfig: r.connectionConfig,
                                                role: "detailsDatasetRole"
                                            }
                                        }
                                    })
                                },
                                getConnectedComponents: function() {
                                    return e
                                },
                                getConnectedComponentIds: function() {
                                    return e && e.map(function(e) {
                                        return e.compId
                                    })
                                }
                            }
                        }(),
                        U = L.findConnectedComponents,
                        W = L.setConnectedComponents,
                        B = L.resolveHandshakes,
                        V = L.getConnectedComponents,
                        G = L.getConnectedComponentIds,
                        q = [],
                        H = Ya(d, p, v),
                        $ = H.fireEvent;
                    q.push(H.dispose);
                    var Y = ca(g, b),
                        z = Y.store,
                        X = Y.subscribe,
                        Q = Y.onIdle;
                    q.push(g.addSessionData(function() {
                        return al({}, b, {
                            datasetType: c,
                            state: z.getState(),
                            connections: s
                        })
                    })), z.dispatch(oo({
                        controllerConfig: u,
                        connections: s,
                        isScoped: r,
                        datasetType: c
                    }));
                    var Z = Ci(z.getState()),
                        J = Z.datasetIsVirtual,
                        K = Z.datasetIsReal,
                        ee = Z.datasetIsDeferred,
                        te = Z.datasetIsWriteOnly,
                        re = Z.datasetCollectionName,
                        ne = Z.dynamicPageNavComponentsShouldBeLinked;
                    q.push(g.addSessionData(function() {
                        return {
                            scopes: t.getAll()
                        }
                    }));
                    var oe = function() {
                        var e = {},
                            t = [];
                        return {
                            get: function() {
                                return e
                            },
                            add: function(t) {
                                return Object.assign(e, t)
                            },
                            saveHandle: function(e) {
                                return t.push(e)
                            },
                            unsubscribe: function() {
                                t.forEach(function(e) {
                                    return e()
                                }), t = []
                            }
                        }
                    }();
                    q.push(oe.unsubscribe);
                    var ie = bi(z.getState()),
                        ae = function() {
                            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : re;
                            return Pe.Maybe.fromNullable(l.getSchema(e))
                        },
                        ue = function(e) {
                            var t = ae(re),
                                r = l.getReferencedSchemas(re);
                            return t.chain(function(t) {
                                return Pe.Maybe.fromNullable(Object(h.b)(t, r)(e))
                            })
                        },
                        ce = function(e) {
                            return function(t) {
                                return _e(Ke, function(t) {
                                    return Object(Qe.shouldResolve)(t) ? e.currentUser() : Object(Ze.shouldResolve)(t) ? e.dataBinding(t) : et(t) ? e.userInput(t) : void 0
                                }, t)
                            }
                        }(function(e, t, r, n) {
                            return {
                                dataBinding: Ne(e),
                                currentUser: ke(t),
                                userInput: Xe({
                                    getConnectedComponents: r,
                                    getFieldType: n
                                })
                            }
                        }(oe.get(), f, V, ue)),
                        se = function(e) {
                            var t = e.recordStoreService,
                                r = e.getFilter,
                                n = e.getSort,
                                o = e.getPageSize,
                                i = (e.prefetchedData, e.datasetId),
                                a = e.filterResolver,
                                u = e.getSchema,
                                c = e.shouldAllowWixDataAccess,
                                s = e.fixedRecordId;
                            return function(e) {
                                var l = o(),
                                    f = c();
                                return t.chain(function(t) {
                                    if (e) return Pe.Result.fromMaybe(u().map(function(t) {
                                        return Object(h.a)(e, t)
                                    }), "cannot resolve referenced collection name for field ".concat(e)).map(function(e) {
                                        return t({
                                            pageSize: l,
                                            sort: null,
                                            filter: null,
                                            allowWixDataAccess: f,
                                            datasetId: i,
                                            referencedCollectionName: e,
                                            fixedRecordId: s
                                        })
                                    });
                                    var o = r();
                                    return Pe.Result.fromMaybe(a(o).map(function(e) {
                                        return t({
                                            pageSize: l,
                                            sort: n(),
                                            filter: e,
                                            allowWixDataAccess: f,
                                            datasetId: i,
                                            referencedCollectionName: null,
                                            fixedRecordId: s
                                        })
                                    }), "could not resolve dynamic filter")
                                })
                            }
                        }({
                            recordStoreService: E,
                            getFilter: Object(o.flow)(function(e) {
                                return z.getState()
                            }, bi),
                            getSort: Object(o.flow)(function(e) {
                                return z.getState()
                            }, wi),
                            getPageSize: Object(o.flow)(function(e) {
                                return z.getState()
                            }, yi),
                            shouldAllowWixDataAccess: Object(o.flow)(function(e) {
                                return z.getState()
                            }, mi),
                            datasetId: b,
                            filterResolver: ce,
                            getSchema: ae,
                            fixedRecordId: w
                        }),
                        le = ne ? function(e) {
                            var t = e.dataProvider,
                                r = e.dynamicPagesData,
                                n = e.collectionName,
                                o = e.useLowerCaseDynamicPageUrl;
                            return {
                                getNextDynamicPageUrl: function() {
                                    return Vs({
                                        dataProvider: t,
                                        dynamicPagesData: r,
                                        collectionName: n,
                                        directionTowardSibling: "asc",
                                        useLowerCaseDynamicPageUrl: o
                                    })
                                },
                                getPreviousDynamicPageUrl: function() {
                                    return Vs({
                                        dataProvider: t,
                                        dynamicPagesData: r,
                                        collectionName: n,
                                        directionTowardSibling: "desc",
                                        useLowerCaseDynamicPageUrl: o
                                    })
                                }
                            }
                        }({
                            dataProvider: l,
                            dynamicPagesData: y,
                            collectionName: re,
                            useLowerCaseDynamicPageUrl: k
                        }) : null;
                    ne && (X(Ws(le)), z.dispatch(ta(s)));
                    var fe = $a({
                            store: z,
                            recordStore: se,
                            logger: g,
                            eventListeners: H,
                            handshakes: I,
                            controllerStore: t,
                            errorReporter: p,
                            verboseReporter: v,
                            datasetId: b,
                            datasetType: c,
                            isFixedItem: n,
                            siblingDynamicPageUrlGetter: le,
                            dependenciesManager: oe,
                            onIdle: Q,
                            getConnectedComponentIds: G
                        }),
                        de = Object(o.uniq)(s.map(function(e) {
                            return e.role
                        })),
                        pe = fe(!1),
                        he = [],
                        ve = T(re, j),
                        ge = {
                            getState: z.getState,
                            datasetApi: pe,
                            wixSdk: f,
                            errorReporter: p,
                            platformAPIs: S,
                            eventListeners: H,
                            roles: de,
                            getFieldType: ue,
                            getSchema: ae,
                            appLogger: g,
                            applicationCodeZone: g.applicationCodeZone,
                            controllerFactory: e,
                            controllerStore: t,
                            databindingVerboseReporter: ve,
                            parentId: j,
                            modeIsLivePreview: A,
                            wixFormatter: _ && !M || !F ? null : Es()({
                                locale: F
                            })
                        },
                        be = tu({
                            dispatch: z.dispatch,
                            recordStore: se,
                            componentAdapterContexts: he
                        });
                    q.push(E.map(function(e) {
                        return e.onChange(ul(z.getState, z.dispatch, 0, g))
                    }).getOrElse(function() {}));
                    var we = Zs({
                            shouldFetchInitialData: u && !te,
                            recordStore: se,
                            errorReporter: p,
                            appLogger: g,
                            store: z,
                            filter: ie,
                            datasetIsDeferred: ee,
                            modeIsSSR: _
                        }),
                        Oe = we.fetchingInitialData,
                        Ie = we.resolveUserInputDependency,
                        Ee = we.resolveControllerDependencies;
                    Oe.then(function() {
                        D(), se().fold(function() {
                            return null
                        }, function(e) {
                            ! function(e) {
                                e.map(function(e) {
                                    return z.dispatch(ea.setCurrentRecord(e, 0))
                                })
                            }(function(e) {
                                return e.getSeedRecords().matchWith({
                                    Empty: function() {
                                        return Pe.Maybe.Nothing()
                                    },
                                    Results: function(e) {
                                        var t = e.items;
                                        return Pe.Maybe.Just(t[0])
                                    }
                                })
                            }(e))
                        })
                    }).then(function() {
                        return ee ? x : Promise.resolve(Pe.Maybe.Nothing())
                    }), I.forEach(function(e) {
                        return va(oe, z.dispatch, e)
                    });
                    var Re = function() {
                            var e = xi(z.getState());
                            return se().fold(function() {
                                return !1
                            }, function(t) {
                                return t.isPristine(e)
                            }) && !te
                        },
                        Te = function() {
                            var e = il(regeneratorRuntime.mark(function e() {
                                var r, n, o, i;
                                return regeneratorRuntime.wrap(function(e) {
                                    for (;;) switch (e.prev = e.next) {
                                        case 0:
                                            if (f.user.onLogin(function() {
                                                    Re() && pe.refresh()
                                                }), W(tl({
                                                    connectedComponents: U(de, a),
                                                    updatedCompIds: P,
                                                    datasetIsReal: K
                                                })), B({
                                                    datasetApi: pe,
                                                    components: V(),
                                                    controllerConfig: u,
                                                    controllerConfigured: Ri(z.getState())
                                                }).forEach(function(e) {
                                                    var t = e.controller,
                                                        r = e.handshakeInfo;
                                                    return t.handshake(r)
                                                }), !nt(ie)) {
                                                e.next = 7;
                                                break
                                            }
                                            return e.next = 7, Ee();
                                        case 7:
                                            if (r = oe.get(), !K) {
                                                e.next = 11;
                                                break
                                            }
                                            return e.next = 11, N;
                                        case 11:
                                            if (Ie(), l.hasSchema(u.dataset.collectionName)) {
                                                e.next = 15;
                                                break
                                            }
                                            return Oe.then(function() {
                                                C(), z.dispatch(oa(!0)), $("datasetReady")
                                            }), e.abrupt("return", Promise.resolve());
                                        case 15:
                                            if (he.push.apply(he, rl(bs({
                                                    connectedComponents: V(),
                                                    $w: a,
                                                    adapterApi: be,
                                                    getFieldType: ue,
                                                    ignoreItemsInRepeater: K,
                                                    dependencies: r,
                                                    adapterParams: ge
                                                }))), K && (n = ws(V(), ue, r, ge), he.push.apply(he, rl(n))), X(Fs(se, be, ue, H.executeHooks, g, b, he, ae, re, R, $, v)), q.push(sl(he, g, b)), q.push(eu(z, he, g, b, se)), o = Js(he.filter(function(e) {
                                                    var t = e.role;
                                                    return ![me, ye].includes(t)
                                                })), z.dispatch(ea.setDefaultRecord(o)), !Ri(z.getState()) || !te) {
                                                e.next = 25;
                                                break
                                            }
                                            return e.next = 25, z.dispatch(ea.initWriteOnly(J));
                                        case 25:
                                            if (ee && (be().hideComponent({
                                                    rememberInitiallyHidden: !0
                                                }), _ && be().clearComponent()), i = Oe.then(il(regeneratorRuntime.mark(function e() {
                                                    return regeneratorRuntime.wrap(function(e) {
                                                        for (;;) switch (e.prev = e.next) {
                                                            case 0:
                                                                try {
                                                                    Ss(g.bi, z.getState(), s, c, J, b, f)
                                                                } catch (e) {
                                                                    g.error(e)
                                                                }
                                                                return e.next = 3, Os(be());
                                                            case 3:
                                                                if (!K) {
                                                                    e.next = 6;
                                                                    break
                                                                }
                                                                return e.next = 6, cl(t);
                                                            case 6:
                                                                ee && be().showComponent({
                                                                    ignoreInitiallyHidden: !0
                                                                }), z.dispatch(oa(!0)), $("datasetReady");
                                                            case 9:
                                                            case "end":
                                                                return e.stop()
                                                        }
                                                    }, e)
                                                }))), !ee) {
                                                e.next = 32;
                                                break
                                            }
                                            return C(), e.abrupt("return", Promise.resolve());
                                        case 32:
                                            return i.then(C), e.abrupt("return", i);
                                        case 34:
                                        case "end":
                                            return e.stop()
                                    }
                                }, e)
                            }));
                            return function() {
                                return e.apply(this, arguments)
                            }
                        }(),
                        je = fe(!0),
                        Se = J ? Te : function() {
                            return g.traceAsync(m.e.pageReady(), Te)
                        };
                    return {
                        pageReady: g.applicationCodeZone(Se),
                        exports: function(e) {
                            switch (e.type) {
                                case on.SCOPE_TYPES.COMPONENT:
                                    return je.inScope(e.compId, e.additionalData.itemId);
                                default:
                                    return je
                            }
                        },
                        staticExports: je,
                        dispose: function() {
                            he.splice(0), q.forEach(function(e) {
                                return e()
                            })
                        }
                    }
                }
            };

        function fl(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function dl(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? fl(Object(r), !0).forEach(function(t) {
                    pl(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : fl(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function pl(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }
        var ml = function(e, t) {
                return [e, "componentId", t.compId, "itemId", t.itemId].join("_")
            },
            hl = function(e, t) {
                var r = nn(e),
                    n = {
                        createPrimaryController: function() {
                            return a
                        },
                        createDetailsController: function(e) {
                            var r = e.scopeInfo,
                                n = e.scoped$w;
                            return i(!0, !1, dl(dl({}, t), {}, {
                                firePlatformEvent: o.noop,
                                datasetId: ml(t.datasetId, r),
                                handshakes: function(e, t) {
                                    var r = t.compId,
                                        n = t.itemId;
                                    if (e) return e.map(function(e) {
                                        return dl(dl({}, e), {}, {
                                            controllerApi: e.controllerApi.inScope(r, n)
                                        })
                                    })
                                }(t.handshakes, r),
                                $w: n
                            }))
                        },
                        createFixedItemController: function(e) {
                            var r = e.scopeInfo,
                                n = e.fixedItem,
                                a = e.parentId,
                                u = e.scoped$w,
                                c = t.dataProvider,
                                s = t.controllerConfig,
                                l = t.dynamicPagesData,
                                f = Object(o.cloneDeep)(s),
                                d = {
                                    items: [n],
                                    totalCount: 1
                                };
                            f.dataset.filter = c.createSimpleFilter("_id", n._id);
                            var p = s.dataset.collectionName;
                            return c.setCollectionData({
                                collectionId: p,
                                data: d
                            }), i(!0, !0, dl(dl({}, t), {}, {
                                controllerConfig: f,
                                firePlatformEvent: o.noop,
                                dynamicPagesData: l,
                                datasetId: ml(t.datasetId, r),
                                fixedRecordId: r.itemId,
                                parentId: a,
                                $w: u
                            }))
                        }
                    },
                    i = ll(n, r),
                    a = i(!1, !1, t);
                return n
            };

        function vl(e, t) {
            for (var r = 0; r < t.length; r++) {
                var n = t[r];
                n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
            }
        }

        function yl(e, t, r) {
            ! function(e, t) {
                if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object")
            }(e, t), t.set(e, r)
        }

        function gl(e, t, r) {
            return function(e, t, r) {
                if (t.set) t.set.call(e, r);
                else {
                    if (!t.writable) throw new TypeError("attempted to set read only private field");
                    t.value = r
                }
            }(e, bl(e, t, "set"), r), r
        }

        function bl(e, t, r) {
            if (!t.has(e)) throw new TypeError("attempted to " + r + " private field on non-instance");
            return t.get(e)
        }
        var wl = new WeakMap,
            Ol = function() {
                function e() {
                    ! function(e, t) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    }(this, e), yl(this, wl, {
                        writable: !0,
                        value: void 0
                    }), gl(this, wl, new Map)
                }
                return function(e, t, r) {
                    t && vl(e.prototype, t), r && vl(e, r)
                }(e, [{
                    key: "datasetConfigs",
                    get: function() {
                        return function(e, t) {
                            return function(e, t) {
                                return t.get ? t.get.call(e) : t.value
                            }(e, bl(e, t, "get"))
                        }(this, wl)
                    }
                }]), e
            }();

        function Il(e, t) {
            return function(e) {
                if (Array.isArray(e)) return e
            }(e) || function(e, t) {
                var r = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                if (null == r) return;
                var n, o, i = [],
                    a = !0,
                    u = !1;
                try {
                    for (r = r.call(e); !(a = (n = r.next()).done) && (i.push(n.value), !t || i.length !== t); a = !0);
                } catch (e) {
                    u = !0, o = e
                } finally {
                    try {
                        a || null == r.return || r.return()
                    } finally {
                        if (u) throw o
                    }
                }
                return i
            }(e, t) || Rl(e, t) || function() {
                throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }

        function El(e) {
            return function(e) {
                if (Array.isArray(e)) return Tl(e)
            }(e) || function(e) {
                if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
            }(e) || Rl(e) || function() {
                throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }

        function Rl(e, t) {
            if (e) {
                if ("string" == typeof e) return Tl(e, t);
                var r = Object.prototype.toString.call(e).slice(8, -1);
                return "Object" === r && e.constructor && (r = e.constructor.name), "Map" === r || "Set" === r ? Array.from(e) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Tl(e, t) : void 0
            }
        }

        function Tl(e, t) {
            (null == t || t > e.length) && (t = e.length);
            for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
            return n
        }

        function jl(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                })), r.push.apply(r, n)
            }
            return r
        }

        function Sl(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? jl(Object(r), !0).forEach(function(t) {
                    Pl(e, t, r[t])
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : jl(Object(r)).forEach(function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                })
            }
            return e
        }

        function Pl(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }

        function Cl(e, t) {
            for (var r = 0; r < t.length; r++) {
                var n = t[r];
                n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
            }
        }

        function Dl(e, t) {
            Al(e, t), t.add(e)
        }

        function xl(e, t, r) {
            Al(e, t), t.set(e, r)
        }

        function Al(e, t) {
            if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object")
        }

        function _l(e, t, r) {
            if (!t.has(e)) throw new TypeError("attempted to get private field on non-instance");
            return r
        }

        function kl(e, t) {
            return function(e, t) {
                if (t.get) return t.get.call(e);
                return t.value
            }(e, Ml(e, t, "get"))
        }

        function Nl(e, t, r) {
            return function(e, t, r) {
                if (t.set) t.set.call(e, r);
                else {
                    if (!t.writable) throw new TypeError("attempted to set read only private field");
                    t.value = r
                }
            }(e, Ml(e, t, "set"), r), r
        }

        function Ml(e, t, r) {
            if (!t.has(e)) throw new TypeError("attempted to " + r + " private field on non-instance");
            return t.get(e)
        }
        r.d(t, "a", function() {
            return Zl
        });
        var Fl = new WeakMap,
            Ll = new WeakMap,
            Ul = new WeakMap,
            Wl = new WeakMap,
            Bl = new WeakMap,
            Vl = new WeakMap,
            Gl = new WeakMap,
            ql = new WeakMap,
            Hl = new WeakMap,
            $l = new WeakMap,
            Yl = new WeakMap,
            zl = new WeakMap,
            Xl = new WeakSet,
            Ql = new WeakSet,
            Zl = function() {
                function e(t) {
                    var r = t.appState,
                        n = t.dataFetcher,
                        i = t.dataCache,
                        a = t.features,
                        u = t.appLogger,
                        c = t.errorReporter,
                        s = t.wixSdk,
                        l = t.routerReturnedData,
                        d = t.shouldVerbose,
                        p = t.originalVerboseReporter,
                        m = t.automationsClientCreator;
                    ! function(e, t) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    }(this, e), Dl(this, Ql), Dl(this, Xl), xl(this, Fl, {
                        writable: !0,
                        value: void 0
                    }), xl(this, Ll, {
                        writable: !0,
                        value: void 0
                    }), xl(this, Ul, {
                        writable: !0,
                        value: void 0
                    }), xl(this, Wl, {
                        writable: !0,
                        value: void 0
                    }), xl(this, Bl, {
                        writable: !0,
                        value: void 0
                    }), xl(this, Vl, {
                        writable: !0,
                        value: void 0
                    }), xl(this, Gl, {
                        writable: !0,
                        value: void 0
                    }), xl(this, ql, {
                        writable: !0,
                        value: void 0
                    }), xl(this, Hl, {
                        writable: !0,
                        value: void 0
                    }), xl(this, $l, {
                        writable: !0,
                        value: void 0
                    }), xl(this, Yl, {
                        writable: !0,
                        value: void 0
                    }), xl(this, zl, {
                        writable: !0,
                        value: void 0
                    }), f.set({
                        appState: r,
                        features: a,
                        dataFetcher: n
                    }), Nl(this, Wl, new Ol), Nl(this, Fl, new ce({
                        appLogger: u,
                        errorReporter: c
                    })), Nl(this, Ll, i), Nl(this, Ul, a);
                    var h = ef(s);
                    Nl(this, Bl, s), Nl(this, Vl, u), Nl(this, Gl, c), Nl(this, Yl, d), Nl(this, ql, d && Object(bt.d)(h) ? p : o.noop), Nl(this, Hl, l), Nl(this, $l, m()), Nl(this, zl, {})
                }
                return function(e, t, r) {
                    t && Cl(e.prototype, t), r && Cl(e, r)
                }(e, [{
                    key: "initializeDatasets",
                    value: function(e) {
                        var t, r = this,
                            n = e.rawControllerConfigs,
                            i = d.appState.mode,
                            a = i.csr,
                            u = i.ssr,
                            c = pt(n, kl(this, Hl)),
                            s = _l(this, Xl, Jl).call(this, c),
                            l = ef(kl(this, Bl)),
                            f = kl(this, Hl) ? rf(kl(this, Hl), se.convertFromCustomFormat, c) : {},
                            m = f.routerData,
                            h = f.dynamicPagesData,
                            v = kl(this, Ul).warmupData,
                            y = kl(this, $l).reportFormEventToAutomationCreator({
                                isPreview: Object(bt.a)(l)
                            }),
                            g = Ot(kl(this, ql), kl(this, Yl)),
                            b = [],
                            w = [],
                            O = new p,
                            I = O.resolve,
                            E = O.promise,
                            R = v && a ? kl(this, Ll).get("schemas") : void 0,
                            T = kl(this, Fl).loadSchemas(tf(c, kl(this, Hl)), Sl(Sl({}, R), null === (t = kl(this, Hl)) || void 0 === t ? void 0 : t.schemas)).then(function(e) {
                                return v && u && kl(r, Ll).set("schemas", e)
                            }),
                            j = a && v && ff(kl(this, Ll).get("dataStore"));
                        j && kl(this, Fl).setStore(j), kl(this, Fl).setStore(m), kl(this, Fl).createBulkRequest(_l(this, Ql, Kl).call(this, c, s));
                        var S = c.map(function(e) {
                            var t = e.type,
                                n = e.config,
                                i = e.connections,
                                a = e.$w,
                                c = e.compId,
                                s = e.livePreviewOptions,
                                f = (s = void 0 === s ? {} : s).shouldFetchData,
                                d = s.compsIdsToReset,
                                m = void 0 === d ? [] : d,
                                v = e.platformAPIs,
                                O = e.wixCodeApi,
                                I = n.datasetStaticConfig,
                                R = I.datasetIsRouter,
                                S = I.datasetIsDeferred;
                            kl(r, Vl).trace(It.a.Breadcrumb({
                                level: "info",
                                category: "createControllers",
                                message: "warmup data contents",
                                data: {
                                    datasetId: c,
                                    datasetType: t,
                                    env: Object(o.get)(O, ["window", "rendering", "env"]),
                                    warmupData: Boolean(j)
                                }
                            }));
                            var P = function(e) {
                                    var t = e.primaryDatasetId,
                                        r = e.recordStoreCache,
                                        n = e.refreshStoreCache,
                                        i = e.dataProvider,
                                        a = e.warmupStore,
                                        u = e.controllerConfig,
                                        c = e.logger;
                                    return Pe.Result.fromNullable(u, "missing controller configuration").chain(function(e) {
                                        var t = e.dataset;
                                        return Pe.Result.fromNullable(t, "controller configuration is missing dataset object")
                                    }).chain(function(e) {
                                        var t = e.collectionName;
                                        return Pe.Result.fromNullable(t, "dataset is not connected to a collection")
                                    }).map(function(e) {
                                        var s = Object(o.get)(u, ["dataset", "includes"]),
                                            l = Object(o.get)(u, ["dataset", "readWriteType"]),
                                            f = Object(o.get)(u, ["dataset", "uniqueFieldValues"]);
                                        return rn({
                                            primaryDatasetId: t,
                                            recordStoreCache: r,
                                            refreshStoreCache: n,
                                            warmupStore: a,
                                            dataProvider: i,
                                            mainCollectionName: e,
                                            includes: s,
                                            uniqueFieldValues: f,
                                            readWriteType: l,
                                            logger: c
                                        })
                                    })
                                }({
                                    primaryDatasetId: c,
                                    recordStoreCache: kl(r, zl),
                                    refreshStoreCache: f,
                                    warmupStore: void 0,
                                    dataProvider: kl(r, Fl),
                                    controllerConfig: n,
                                    logger: kl(r, Vl)
                                }),
                                C = new p,
                                D = C.promise,
                                x = C.resolve;
                            R || S || b.push(D);
                            var A = new p,
                                _ = A.promise,
                                k = A.resolve;
                            w.push(_);
                            var N = hl(kl(r, Vl), {
                                    $w: a,
                                    controllerConfig: n,
                                    datasetType: t,
                                    connections: i,
                                    recordStoreService: P,
                                    dataProvider: kl(r, Fl),
                                    firePlatformEvent: kl(r, Vl).userCodeZone(a.fireEvent),
                                    wixSdk: O,
                                    errorReporter: kl(r, Gl),
                                    verboseReporter: kl(r, ql),
                                    instantiateDatabindingVerboseReporter: g,
                                    dynamicPagesData: R ? h : void 0,
                                    appLogger: kl(r, Vl),
                                    datasetId: c,
                                    handshakes: [],
                                    schemasLoading: T,
                                    reportFormEventToAutomation: y,
                                    platformAPIs: v,
                                    updatedCompIds: m,
                                    markControllerAsRendered: k,
                                    markDatasetDataFetched: x,
                                    renderingRegularControllers: E,
                                    modeIsLivePreview: Object(bt.c)(l),
                                    modeIsSSR: u,
                                    useLowerCaseDynamicPageUrl: Object(o.get)(kl(r, Hl), ["config", "dataset", "lowercase"])
                                }),
                                M = cf(N.createPrimaryController());
                            return Promise.resolve(M)
                        });
                        return u && v && b.length && Promise.all(b).then(function() {
                            kl(r, Ll).set("dataStore", lf(kl(r, Fl).getStore()))
                        }), Promise.all(w).then(I), S
                    }
                }]), e
            }();

        function Jl(e) {
            var t = this;
            return e.reduce(function(e, r) {
                var n = r.compId,
                    i = r.config.dataset,
                    a = kl(t, Wl).datasetConfigs.get(n);
                return a && !Object(o.isEqual)(a, i) && e.push(n), kl(t, Wl).datasetConfigs.set(n, i), e
            }, [])
        }

        function Kl(e, t) {
            return e.reduce(function(e, r) {
                var n = r.compId,
                    o = r.config.datasetStaticConfig.sequenceType,
                    i = r.livePreviewOptions,
                    a = (i = void 0 === i ? {} : i).shouldFetchData;
                return o === le ? [].concat(El(e), [{
                    id: n,
                    refresh: a || t.includes(n)
                }]) : e
            }, [])
        }
        var ef = function(e) {
                return Object(o.get)(e, ["window", "viewMode"])
            },
            tf = function(e, t) {
                var r = e.reduce(function(e, t) {
                    var r = t.config.dataset.collectionName;
                    return r ? e.add(r) : e
                }, new Set);
                if (null !== t && void 0 !== t && t.schemas)
                    for (var n = 0, o = Object.keys(t.schemas); n < o.length; n++) {
                        var i = o[n];
                        r.add(i)
                    }
                return El(r)
            },
            rf = function(e, t, r) {
                var n = Object(o.find)(r, {
                        type: "router_dataset"
                    }),
                    i = n && n.compId;
                if (!i) return {};
                var a = Object(o.get)(n, "config.dataset.collectionName"),
                    u = e.dynamicUrl,
                    c = e.userDefinedFilter,
                    s = e.items,
                    l = void 0 === s ? [] : s,
                    f = e.totalCount,
                    d = e.config,
                    p = t(l),
                    m = p[0],
                    h = Object(o.get)(d, "dataset.sort", []) || [],
                    v = u && m ? function(e) {
                        return {
                            fields: (e = yt(e)).match(mt) || [],
                            nonFields: e.replace(mt, "").split(vt).filter(function(e) {
                                return !!e
                            })
                        }
                    }(u).fields : [],
                    y = nf(h),
                    g = Object(o.difference)(v, y),
                    b = of ([].concat(El(h), El(af(g)))),
                    w = [].concat(El(y), El(g)),
                    O = uf(u, m, w, v);
                return {
                    routerData: {
                        recordsInfoByDataset: Pl({}, i, {
                            itemIds: p.map(function(e) {
                                return e._id
                            }),
                            totalCount: f
                        }),
                        recordsByCollection: Pl({}, a, p.reduce(function(e, t) {
                            return Sl(Sl({}, e), {}, Pl({}, t._id, t))
                        }, {}))
                    },
                    dynamicPagesData: {
                        dynamicUrl: u,
                        userDefinedFilter: c,
                        dynamicUrlPatternFieldsValues: O,
                        sort: b,
                        sortFields: w,
                        patternFields: v
                    }
                }
            },
            nf = function(e) {
                return Object(o.flatten)(e.map(function(e) {
                    return Object.keys(e).map(function(e) {
                        return e
                    })
                }))
            },
            of = function(e) {
                return e.reduce(function(e, t) {
                    return Object.assign(e, t)
                }, {})
            },
            af = function(e) {
                return e.map(function(e) {
                    return Pl({}, e, "asc")
                })
            },
            uf = function(e, t, r, n) {
                var i = n.concat(r);
                return n.length ? Object(o.pick)(t, i) : null
            },
            cf = function(e) {
                return {
                    pageReady: e.pageReady,
                    exports: e.exports,
                    dispose: e.dispose
                }
            },
            sf = function(e) {
                return function(t) {
                    if (t) return Sl(Sl({}, t), {}, {
                        recordsByCollection: Object.entries(t.recordsByCollection).reduce(function(t, r) {
                            var n = Il(r, 2),
                                o = n[0],
                                i = n[1];
                            return t[o] = e(i), t
                        }, {})
                    })
                }
            },
            lf = sf(se.convertToCustomFormat),
            ff = sf(se.convertFromCustomFormat)
    }, function(e, t, r) {
        e.exports = r(63)
    }, function(e, t, r) {
        "use strict";
        r.r(t), r.d(t, "initAppForPage", function() {
            return o
        }), r.d(t, "createControllers", function() {
            return i
        });
        var n = new(r(41).a),
            o = n.initAppForPage,
            i = n.createControllers
    }, function(e, t, r) {
        "use strict";
        "function" != typeof self.queueMicrotask && (self.queueMicrotask = function(e) {
            Promise.resolve().then(e).catch(function(e) {
                return setTimeout(function() {
                    throw e
                })
            })
        })
    }, function(e, t, r) {
        "use strict";
        e.exports = function(e, t) {
            if (t = t.split(":")[0], !(e = +e)) return !1;
            switch (t) {
                case "http":
                case "ws":
                    return 80 !== e;
                case "https":
                case "wss":
                    return 443 !== e;
                case "ftp":
                    return 21 !== e;
                case "gopher":
                    return 70 !== e;
                case "file":
                    return !1
            }
            return 0 !== e
        }
    }, function(e, t, r) {
        "use strict";
        var n, o = Object.prototype.hasOwnProperty;

        function i(e) {
            try {
                return decodeURIComponent(e.replace(/\+/g, " "))
            } catch (e) {
                return null
            }
        }

        function a(e) {
            try {
                return encodeURIComponent(e)
            } catch (e) {
                return null
            }
        }
        t.stringify = function(e, t) {
            t = t || "";
            var r, i, u = [];
            for (i in "string" != typeof t && (t = "?"), e)
                if (o.call(e, i)) {
                    if ((r = e[i]) || null !== r && r !== n && !isNaN(r) || (r = ""), i = a(i), r = a(r), null === i || null === r) continue;
                    u.push(i + "=" + r)
                }
            return u.length ? t + u.join("&") : ""
        }, t.parse = function(e) {
            for (var t, r = /([^=?#&]+)=?([^&]*)/g, n = {}; t = r.exec(e);) {
                var o = i(t[1]),
                    a = i(t[2]);
                null === o || null === a || o in n || (n[o] = a)
            }
            return n
        }
    }, function(e, t, r) {
        var n = r(0).invoke,
            o = console.error;
        e.exports.isAppInvolvedWithError = function(e) {
            return function(t) {
                return t.stack && t.stack.toString().includes(e)
            }
        }, e.exports.addUnhandledRejectionListener = function(e, t) {
            return n(e, "addEventListener", "unhandledrejection", t)
        }, e.exports.extendConsoleError = function(e, t) {
            var r = e.console,
                n = r.error.bind(r);
            return r.error = function() {
                    try {
                        t.apply(void 0, arguments)
                    } catch (e) {
                        n(e)
                    }
                    n.apply(void 0, arguments)
                },
                function() {
                    r.error = o
                }
        }, e.exports.shouldReportException = function(e) {
            for (var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++) r[n - 1] = arguments[n];
            return r.reduce(function(t, r) {
                return t && r(e)
            }, !0)
        }
    }, function(e, t) {
        var r = Symbol.for("union-type-any-symbol"),
            n = function(e, t, n, o) {
                var i = Symbol("[".concat(e, ":").concat(t, "]")),
                    a = function() {
                        var e = n.apply(void 0, arguments),
                            a = function(e, t, r) {
                                return t in e ? Object.defineProperty(e, t, {
                                    value: r,
                                    enumerable: !0,
                                    configurable: !0,
                                    writable: !0
                                }) : e[t] = r, e
                            }({
                                matchWith: function(e) {
                                    return function(t) {
                                        for (var n = Object.keys(t), o = 0, i = n; o < i.length; o++) {
                                            var a = i[o];
                                            if (a === e.name) return t[a](e.payload)
                                        }
                                        if (t[r]) return t[r]();
                                        throw new Error('Variant "'.concat(e.name, '" not covered in pattern with keys [').concat(n, "].\nThis could mean you did not include all variants in your Union's matchWith function."))
                                    }
                                }({
                                    name: t,
                                    payload: e
                                }),
                                toString: function() {
                                    return t
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
            o = function(e, t) {
                var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
                return Object.keys(t).reduce(function(o, i) {
                    return o[i] = n(e, i, t[i], r), o
                }, {})
            };
        o.any = r, e.exports = o
    }, function(e, t, r) {
        "use strict";
        var n = function e(t) {
                return {
                    map: function(r) {
                        return e(r(t))
                    },
                    chain: function(e) {
                        return e(t)
                    },
                    fold: function(e, r) {
                        return r(t)
                    },
                    getOrElse: function() {
                        return t
                    },
                    merge: function() {
                        return t
                    }
                }
            },
            o = function e(t) {
                return {
                    map: function() {
                        return e(t)
                    },
                    chain: function() {
                        return e(t)
                    },
                    fold: function(e) {
                        return e(t)
                    },
                    getOrElse: function(e) {
                        return e
                    },
                    merge: function() {
                        return t
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
                fromNullable: function(e, t) {
                    return null != e ? n(e) : o(t)
                },
                fromMaybe: function(e, t) {
                    return e.fold(function() {
                        return o(t)
                    }, function(e) {
                        return n(e)
                    })
                },
                of: function(e) {
                    return n(e)
                }
            };
        e.exports = i
    }, function(e, t, r) {
        "use strict";
        var n = function e(t) {
                return {
                    map: function(r) {
                        return e(r(t))
                    },
                    chain: function(e) {
                        return e(t)
                    },
                    fold: function(e, r) {
                        return r(t)
                    },
                    getOrElse: function() {
                        return t
                    },
                    orElse: function() {
                        return e(t)
                    },
                    filter: function(r) {
                        return r(t) ? e(t) : o()
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
    }, function(e, t, r) {
        "use strict";
        var n = r(1),
            o = n.union,
            i = n.Result,
            a = r(0).pull,
            u = r(0).merge,
            c = r(0).uniqueId,
            s = r(0).isFunction,
            l = r(0).isObject,
            f = o("LogEvent", {
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
            d = o("TracePosition", {
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
            p = function(e) {
                return function(e) {
                    return e && Array.isArray(e) && 0 !== e.length ? e.reduce(function(e, t) {
                        return e.chain(function() {
                            return s(t) ? e : i.Error("`handlerCreators` must be an array of functions.")
                        })
                    }, i.Ok(e)) : i.Error("`handlerCreators` is missing or empty, the logger needs at least one handler to work.")
                }(e).map(function(e) {
                    return e.map(function(e) {
                        return e()
                    })
                }).chain(function(e) {
                    return function(e) {
                        return e.reduce(function(e, t) {
                            return e.chain(function() {
                                return l(t) ? s(t.init) ? s(t.log) ? e : i.Error("Handler must have a log function.") : i.Error("Handler must have an init function.") : i.Error("Handler must be an object.")
                            })
                        }, i.Ok(e))
                    }(e)
                }).fold(function(e) {
                    throw new Error(e)
                }, function(e) {
                    return e
                })
            },
            m = function(e, t) {
                e.forEach(function(e) {
                    return e.log(t)
                })
            };
        e.exports = {
            create: function() {
                var e = (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}).handlerCreators,
                    t = p(e),
                    r = function() {
                        var e = [];
                        return {
                            register: function(t) {
                                return e.push(t),
                                    function() {
                                        a(e, t)
                                    }
                            },
                            getCallbacks: function() {
                                return e.slice()
                            }
                        }
                    }(),
                    n = (new Map, function() {
                        return r.getCallbacks().reduce(function(e, t) {
                            return u(e, function(e) {
                                return i.try(e).fold(function(e) {
                                    return {
                                        sessionDataError: e.stack
                                    }
                                }, function(e) {
                                    return e
                                })
                            }(t))
                        }, {})
                    });
                return {
                    addSessionData: r.register,
                    init: function(e) {
                        t.forEach(function(t) {
                            return t.init(e)
                        })
                    },
                    bi: function(e) {
                        return function(t) {
                            var r = f.BI({
                                biEvent: t
                            });
                            m(e, r)
                        }
                    }(t),
                    info: function(e, t) {
                        return function(r, n) {
                            var o = f.Info({
                                message: r,
                                options: n,
                                sessionData: t()
                            });
                            m(e, o)
                        }
                    }(t, n),
                    warn: function(e, t) {
                        return function(r, n) {
                            var o = f.Warn({
                                message: r,
                                options: n,
                                sessionData: t()
                            });
                            m(e, o)
                        }
                    }(t, n),
                    error: function(e, t) {
                        return function(r, n) {
                            var o = f.Error({
                                error: r,
                                options: n,
                                sessionData: t()
                            });
                            m(e, o)
                        }
                    }(t, n),
                    trace: function(e) {
                        return function(t) {
                            var r = d.None(),
                                n = f.Trace({
                                    position: r,
                                    payload: t
                                });
                            m(e, n)
                        }
                    }(t),
                    traceSync: function(e) {
                        return function(t, r) {
                            var n = Date.now(),
                                o = c();
                            m(e, f.Trace({
                                position: d.Start({
                                    traceId: o
                                }),
                                payload: t
                            }));
                            try {
                                var a = r(),
                                    u = Date.now() - n;
                                return m(e, f.Trace({
                                    position: d.End({
                                        traceId: o,
                                        durationMs: u,
                                        result: i.Ok()
                                    }),
                                    payload: t
                                })), a
                            } catch (r) {
                                var s = Date.now() - n;
                                throw m(e, f.Trace({
                                    position: d.End({
                                        traceId: o,
                                        durationMs: s,
                                        result: i.Error(r)
                                    }),
                                    payload: t
                                })), r
                            }
                        }
                    }(t),
                    traceAsync: function(e) {
                        return function(t, r) {
                            var n = Date.now(),
                                o = c();
                            return m(e, f.Trace({
                                position: d.Start({
                                    traceId: o
                                }),
                                payload: t
                            })), r().then(function(r) {
                                var a = Date.now() - n;
                                return m(e, f.Trace({
                                    position: d.End({
                                        traceId: o,
                                        durationMs: a,
                                        result: i.Ok()
                                    }),
                                    payload: t
                                })), r
                            }).catch(function(r) {
                                var a = Date.now() - n;
                                return m(e, f.Trace({
                                    position: d.End({
                                        traceId: o,
                                        durationMs: a,
                                        result: i.Error(r)
                                    }),
                                    payload: t
                                })), Promise.reject(r)
                            })
                        }
                    }(t)
                }
            },
            matchAny: o.any
        }
    }, function(e, t, r) {
        "use strict";

        function n(e, t) {
            return function(e) {
                if (Array.isArray(e)) return e
            }(e) || function(e, t) {
                var r = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                if (null == r) return;
                var n, o, i = [],
                    a = !0,
                    u = !1;
                try {
                    for (r = r.call(e); !(a = (n = r.next()).done) && (i.push(n.value), !t || i.length !== t); a = !0);
                } catch (e) {
                    u = !0, o = e
                } finally {
                    try {
                        a || null == r.return || r.return()
                    } finally {
                        if (u) throw o
                    }
                }
                return i
            }(e, t) || function(e, t) {
                if (!e) return;
                if ("string" == typeof e) return o(e, t);
                var r = Object.prototype.toString.call(e).slice(8, -1);
                "Object" === r && e.constructor && (r = e.constructor.name);
                if ("Map" === r || "Set" === r) return Array.from(e);
                if ("Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return o(e, t)
            }(e, t) || function() {
                throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }

        function o(e, t) {
            (null == t || t > e.length) && (t = e.length);
            for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
            return n
        }
        var i = r(0).noop,
            a = r(0).isError,
            u = r(1).union;
        e.exports.consoleHandlerCreator = function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                t = e.shouldLog,
                r = e.ignoredErrorMessages,
                o = (void 0 === r ? [] : r).slice(),
                c = function(e, t) {
                    (function(e) {
                        return o.some(function(t) {
                            return e === t
                        })
                    })(e) || console.error(t)
                };
            return {
                setIgnoredErrorMessages: function(e) {
                    o = e.slice()
                },
                consoleHandler: function() {
                    return {
                        init: function() {},
                        log: function(e) {
                            e.matchWith(function(e, t, r) {
                                return t in e ? Object.defineProperty(e, t, {
                                    value: r,
                                    enumerable: !0,
                                    configurable: !0,
                                    writable: !0
                                }) : e[t] = r, e
                            }({
                                Warn: function(e) {
                                    var r = e.message;
                                    if (t()) {
                                        var o = n(a(r) ? [r, r.message] : [new Error(r), r], 2),
                                            i = o[0],
                                            u = o[1];
                                        c(u, i.stack)
                                    }
                                },
                                Error: function(e) {
                                    var r = e.error;
                                    if (t()) {
                                        var n = r.message ? r.message : r,
                                            o = r.stack ? r.stack : r;
                                        c(n, o)
                                    }
                                }
                            }, u.any, i))
                        }
                    }
                }
            }
        }
    }, function(e, t, r) {
        "use strict";
        var n = r(0).identity,
            o = r(74),
            i = r(26),
            a = r(13).getAppUrl,
            u = r(75);
        e.exports = function(e) {
            var t = e.Raven,
                r = e.appName,
                c = e.browserUrlGetter,
                s = e.dsn,
                l = e.params,
                f = a(r),
                d = i(f);
            t.config(s, Object.assign({}, o, {
                captureUnhandledRejections: !1,
                autoBreadcrumbs: {
                    dom: !1
                }
            })), t.setRelease(l.release || d), t.setShouldSendCallback(l.shouldSendCallback || u), t.setDataCallback(function(e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : n;
                return e.request = Object.assign(e.request || {}, {
                    url: c()
                }), t(e)
            });
            return function() {
                t.setDataCallback(n)
            }
        }
    }, function(e, t, r) {
        "use strict";
        e.exports = {
            maxUrlLength: 1e3
        }
    }, function(e, t, r) {
        "use strict";
        var n = r(32),
            o = n.extract,
            i = n.parse,
            a = r(0).get,
            u = r(0).includes,
            c = r(0).identity,
            s = r(1),
            l = s.Result,
            f = s.Maybe,
            d = ["ReactSource", "EditorSource", "experiments", "petri_ovr", "WixCodeRuntimeSource", "js-wixcode-sdk-override", "debug"],
            p = function(e) {
                return f.fromNullable(e).chain(function(e) {
                    return l.try(function() {
                        return i(o(e))
                    })
                }).map(function(e) {
                    return function(e) {
                        return "true" === e.forceReportSentry
                    }(e) || function(e) {
                        return Object.keys(e).every(function(e) {
                            return !u(d, e)
                        })
                    }(e)
                }).getOrElse(!0)
            },
            m = [function(e) {
                return function(e) {
                    return [a(e, ["request", "headers", "Referer"]), a(e, ["request", "url"])]
                }(e).every(p)
            }];
        e.exports = function(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : c;
            return m.concat(t).every(function(t) {
                return t(e)
            })
        }
    }, function(e, t, r) {
        "use strict";
        e.exports = function(e) {
            return encodeURIComponent(e).replace(/[!'()*]/g, function(e) {
                return "%" + e.charCodeAt(0).toString(16).toUpperCase()
            })
        }
    }, function(e, t, r) {
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
                for (var t = {}, r = 0; r < 10; r++) t["_" + String.fromCharCode(r)] = r;
                if ("0123456789" !== Object.getOwnPropertyNames(t).map(function(e) {
                        return t[e]
                    }).join("")) return !1;
                var n = {};
                return "abcdefghijklmnopqrst".split("").forEach(function(e) {
                    n[e] = e
                }), "abcdefghijklmnopqrst" === Object.keys(Object.assign({}, n)).join("")
            } catch (e) {
                return !1
            }
        }() ? Object.assign : function(e, t) {
            for (var r, a, u = function(e) {
                    if (null === e || void 0 === e) throw new TypeError("Object.assign cannot be called with null or undefined");
                    return Object(e)
                }(e), c = 1; c < arguments.length; c++) {
                for (var s in r = Object(arguments[c])) o.call(r, s) && (u[s] = r[s]);
                if (n) {
                    a = n(r);
                    for (var l = 0; l < a.length; l++) i.call(r, a[l]) && (u[a[l]] = r[a[l]])
                }
            }
            return u
        }
    }, function(e, t, r) {
        "use strict";
        var n = new RegExp("%[a-f0-9]{2}", "gi"),
            o = new RegExp("(%[a-f0-9]{2})+", "gi");

        function i(e, t) {
            try {
                return decodeURIComponent(e.join(""))
            } catch (e) {}
            if (1 === e.length) return e;
            t = t || 1;
            var r = e.slice(0, t),
                n = e.slice(t);
            return Array.prototype.concat.call([], i(r), i(n))
        }

        function a(e) {
            try {
                return decodeURIComponent(e)
            } catch (o) {
                for (var t = e.match(n), r = 1; r < t.length; r++) t = (e = i(t, r).join("")).match(n);
                return e
            }
        }
        e.exports = function(e) {
            if ("string" != typeof e) throw new TypeError("Expected `encodedURI` to be of type `string`, got `" + typeof e + "`");
            try {
                return e = e.replace(/\+/g, " "), decodeURIComponent(e)
            } catch (t) {
                return function(e) {
                    for (var t = {
                            "%FE%FF": "��",
                            "%FF%FE": "��"
                        }, r = o.exec(e); r;) {
                        try {
                            t[r[0]] = decodeURIComponent(r[0])
                        } catch (e) {
                            var n = a(r[0]);
                            n !== r[0] && (t[r[0]] = n)
                        }
                        r = o.exec(e)
                    }
                    t["%C2"] = "�";
                    for (var i = Object.keys(t), u = 0; u < i.length; u++) {
                        var c = i[u];
                        e = e.replace(new RegExp(c, "g"), t[c])
                    }
                    return e
                }(e)
            }
        }
    }, function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.ConvertersComposer = void 0;
        var n = r(80),
            o = function(e) {
                return null !== e && "object" == typeof e
            },
            i = function() {
                function e() {
                    for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
                    this._converters = e
                }
                return e.prototype.convertToCustomFormat = function(e, t, r) {
                    var n;
                    if (void 0 === t && (t = new Set), void 0 === r && (r = !1), o(e)) {
                        if (t.has(e)) throw new TypeError("Converting circular structure to JSON");
                        t.add(e)
                    }
                    if (Array.isArray(e)) return this._convertArray(e, t);
                    var i = null === (n = this._findConverterToCustomFormat(e)) || void 0 === n ? void 0 : n.convertToCustomFormat(e, r);
                    return o(e) ? this._convertObject(i, e, t) : i
                }, e.prototype.convertFromCustomFormat = function(e) {
                    var t, r = this,
                        i = e;
                    return Array.isArray(e) ? i = e.map(function(e) {
                        return r.convertFromCustomFormat(e)
                    }) : o(e) && (i = (0, n.mapValues)(e, this.convertFromCustomFormat.bind(this))), null === (t = this._findConverterFromCustomFormat(i)) || void 0 === t ? void 0 : t.convertFromCustomFormat(i)
                }, e.prototype._convertObject = function(e, t, r) {
                    var o, i = this;
                    return o = "function" == typeof e.toJSON ? (0, n.mapValues)(e.toJSON(), function(e) {
                        return i.convertToCustomFormat(e, r)
                    }) : (0, n.mapValues)(e, function(e) {
                        return i.convertToCustomFormat(e, r)
                    }), r.delete(t), o
                }, e.prototype._convertArray = function(e, t) {
                    var r = this,
                        n = e.map(function(e) {
                            return r.convertToCustomFormat(e, t, !0)
                        });
                    return t.delete(e), n
                }, e.prototype._findConverterFromCustomFormat = function(e) {
                    return this._converters.find(function(t) {
                        return t.canConvertFromCustomFormat(e)
                    })
                }, e.prototype._findConverterToCustomFormat = function(e) {
                    return this._converters.find(function(t) {
                        return t.canConvertToCustomFormat(e)
                    })
                }, e
            }();
        t.ConvertersComposer = i
    }, function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.mapValues = void 0, t.mapValues = function(e, t) {
            var r = {};
            return Object.keys(e).forEach(function(n) {
                var o = t(e[n]);
                void 0 !== o && (r[n] = o)
            }), r
        }
    }, function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.DateConverter = void 0;
        var n = function() {
            function e() {}
            return e.prototype.canConvertToCustomFormat = function(e) {
                return e instanceof Date
            }, e.prototype.convertToCustomFormat = function(e) {
                return {
                    $date: e.toISOString()
                }
            }, e.prototype.canConvertFromCustomFormat = function(e) {
                return this._isObjectWith$Date(e) && "string" == typeof e.$date && function(e) {
                    return !Number.isNaN(Date.parse(e))
                }(e.$date)
            }, e.prototype.convertFromCustomFormat = function(e) {
                return new Date(e.$date)
            }, e.prototype._isObjectWith$Date = function(e) {
                return !!e && "object" == typeof e && "$date" in e
            }, e
        }();
        t.DateConverter = n
    }, function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.DefaultConverter = void 0;
        var n = function() {
            function e() {}
            return e.prototype.canConvertToCustomFormat = function() {
                return !0
            }, e.prototype.convertToCustomFormat = function(e, t) {
                return t && void 0 === e ? null : e
            }, e.prototype.canConvertFromCustomFormat = function() {
                return !0
            }, e.prototype.convertFromCustomFormat = function(e) {
                return e
            }, e
        }();
        t.DefaultConverter = n
    }, function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.exceptionToWebMethodPayload = t.resultToWebMethodPayload = void 0;
        var n = r(33);
        t.resultToWebMethodPayload = function(e, t) {
            var r = t ? JSON.parse(JSON.stringify(e, t)) : (0, n.convertToCustomFormat)(e);
            return void 0 === r ? {} : {
                result: r
            }
        };
        t.exceptionToWebMethodPayload = function(e, t, r) {
            return void 0 === t && (t = function(e) {
                return e
            }), void 0 === r && (r = function(e) {
                return ""
            }), {
                result: e instanceof Error ? {
                    message: t(e.message),
                    name: e.name,
                    stack: r(e.stack),
                    code: e.code,
                    _elementoryError: !0
                } : e,
                exception: !0
            }
        }
    }, function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.Direction = void 0,
            function(e) {
                e.asc = "asc", e.desc = "desc"
            }(t.Direction || (t.Direction = {}))
    }, function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.Operator = void 0,
            function(e) {
                e.and = "$and", e.or = "$or", e.not = "$not", e.eq = "$eq", e.ne = "$ne", e.lt = "$lt", e.lte = "$lte", e.gt = "$gt", e.gte = "$gte", e.hasSome = "$hasSome", e.hasAll = "$hasAll", e.contains = "$contains", e.startsWith = "$startsWith", e.endsWith = "$endsWith", e.urlized = "$urlized"
            }(t.Operator || (t.Operator = {}))
    }, function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.AllowedFilterOperator = t.FieldType = void 0,
            function(e) {
                e.number = "number", e.text = "text", e.image = "image", e.boolean = "boolean", e.document = "document", e.url = "url", e.richText = "richtext", e.date = "date", e.dateTime = "datetime", e.video = "video", e.reference = "reference", e.multiReference = "multi-reference", e.pageLink = "pagelink", e.object = "object", e.mediaGallery = "media-gallery", e.address = "address", e.stringArray = "array<string>", e.color = "color", e.audio = "audio", e.time = "time", e.array = "array", e.richContent = "rich-content", e.language = "language", e.documentArray = "array<document>"
            }(t.FieldType || (t.FieldType = {})),
            function(e) {
                e.eq = "eq", e.ne = "ne", e.lt = "lt", e.lte = "lte", e.gt = "gt", e.gte = "gte", e.hasSome = "hasSome", e.hasAll = "hasAll", e.contains = "contains", e.startsWith = "startsWith", e.endsWith = "endsWith", e.urlized = "urlized"
            }(t.AllowedFilterOperator || (t.AllowedFilterOperator = {}))
    }, function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.Storage = t.PermissionRole = t.DataOperation = void 0,
            function(e) {
                e.aggregate = "aggregate", e.bulkInsert = "bulkInsert", e.bulkRemove = "bulkRemove", e.bulkSave = "bulkSave", e.bulkUpdate = "bulkUpdate", e.count = "count", e.distinct = "distinct", e.find = "find", e.get = "get", e.insert = "insert", e.insertReference = "insertReference", e.isReferenced = "isReferenced", e.queryReferenced = "queryReferenced", e.remove = "remove", e.removeReference = "removeReference", e.replaceReferences = "replaceReferences", e.save = "save", e.truncate = "truncate", e.update = "update"
            }(t.DataOperation || (t.DataOperation = {})),
            function(e) {
                e.anyone = "anyone", e.siteMember = "siteMember", e.siteMemberAuthor = "siteMemberAuthor", e.admin = "admin"
            }(t.PermissionRole || (t.PermissionRole = {})),
            function(e) {
                e.driver = "driver", e.docstore = "docstore", e.app = "app", e.expernal = "external"
            }(t.Storage || (t.Storage = {}))
    }, function(e, t, r) {
        var n, o, i = r(34),
            a = r(35),
            u = 0,
            c = 0;
        e.exports = function(e, t, r) {
            var s = t && r || 0,
                l = t || [],
                f = (e = e || {}).node || n,
                d = void 0 !== e.clockseq ? e.clockseq : o;
            if (null == f || null == d) {
                var p = i();
                null == f && (f = n = [1 | p[0], p[1], p[2], p[3], p[4], p[5]]), null == d && (d = o = 16383 & (p[6] << 8 | p[7]))
            }
            var m = void 0 !== e.msecs ? e.msecs : (new Date).getTime(),
                h = void 0 !== e.nsecs ? e.nsecs : c + 1,
                v = m - u + (h - c) / 1e4;
            if (v < 0 && void 0 === e.clockseq && (d = d + 1 & 16383), (v < 0 || m > u) && void 0 === e.nsecs && (h = 0), h >= 1e4) throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
            u = m, c = h, o = d;
            var y = (1e4 * (268435455 & (m += 122192928e5)) + h) % 4294967296;
            l[s++] = y >>> 24 & 255, l[s++] = y >>> 16 & 255, l[s++] = y >>> 8 & 255, l[s++] = 255 & y;
            var g = m / 4294967296 * 1e4 & 268435455;
            l[s++] = g >>> 8 & 255, l[s++] = 255 & g, l[s++] = g >>> 24 & 15 | 16, l[s++] = g >>> 16 & 255, l[s++] = d >>> 8 | 128, l[s++] = 255 & d;
            for (var b = 0; b < 6; ++b) l[s + b] = f[b];
            return t || a(l)
        }
    }, function(e, t, r) {
        var n = r(34),
            o = r(35);
        e.exports = function(e, t, r) {
            var i = t && r || 0;
            "string" == typeof e && (t = "binary" === e ? new Array(16) : null, e = null);
            var a = (e = e || {}).random || (e.rng || n)();
            if (a[6] = 15 & a[6] | 64, a[8] = 63 & a[8] | 128, t)
                for (var u = 0; u < 16; ++u) t[i + u] = a[u];
            return t || o(a)
        }
    }, function(e, t) {
        e.exports = function(e) {
            if (!e.webpackPolyfill) {
                var t = Object.create(e);
                t.children || (t.children = []), Object.defineProperty(t, "loaded", {
                    enumerable: !0,
                    get: function() {
                        return t.l
                    }
                }), Object.defineProperty(t, "id", {
                    enumerable: !0,
                    get: function() {
                        return t.i
                    }
                }), Object.defineProperty(t, "exports", {
                    enumerable: !0
                }), t.webpackPolyfill = 1
            }
            return t
        }
    }, function(e, t, r) {
        "use strict";
        var n = r(92).isPromise,
            o = r(93),
            i = o.sequence,
            a = o.try_,
            u = r(94),
            c = r(95),
            s = c.isEffect,
            l = c.isImmediateEffect,
            f = c.isQueuedEffect,
            d = function(e) {
                return function(t) {
                    return e.push(t),
                        function() {
                            var r = e.indexOf(t);
                            r >= 0 && e.splice(r, 1)
                        }
                }
            };
        e.exports = function() {
            var e = [],
                t = [],
                r = Promise.resolve();
            return {
                middleware: function(o) {
                    return function(c) {
                        return function(d) {
                            var p = function(e) {
                                    var t = a(function() {
                                        return e.run()
                                    });
                                    return t.fold(function(r) {
                                        var n = e.resultActionCreator ? o.dispatch(e.resultActionCreator(!0, r)) : Promise.resolve();
                                        return [t, n]
                                    }, function(r) {
                                        if (n(r)) {
                                            var i = r.then(function(t) {
                                                return e.resultActionCreator ? o.dispatch(e.resultActionCreator(!1, t)) : Promise.resolve()
                                            }, function(t) {
                                                throw e.resultActionCreator && o.dispatch(e.resultActionCreator(!0, t)).catch(function() {}), t
                                            });
                                            return [t, i]
                                        }
                                        var a = e.resultActionCreator ? o.dispatch(e.resultActionCreator(!1, r)) : Promise.resolve();
                                        return [t, a]
                                    })
                                },
                                m = function() {
                                    var e = void 0,
                                        n = new Promise(function(t) {
                                            return e = t
                                        });
                                    return {
                                        promise: new Promise(function(e, o) {
                                            var i = r = r.then(function() {
                                                return n
                                            }).then(function(e, t) {
                                                return function(r) {
                                                    if (r.length > 0) {
                                                        var n = r.filter(f).map(p);
                                                        return Promise.all(n.map(function(e) {
                                                            return e[1]
                                                        })).then(function() {
                                                            return e()
                                                        }, t), Promise.all(n.map(function(e) {
                                                            return e[0]
                                                        }).map(function(e) {
                                                            return e.fold(function(e) {
                                                                return Promise.reject(e)
                                                            }, function(e) {
                                                                return e
                                                            })
                                                        })).catch(t)
                                                    }
                                                    return e(), Promise.resolve()
                                                }
                                            }(e, o), o).catch(o).then(function() {
                                                i === r && t.slice().forEach(function(e) {
                                                    return e()
                                                })
                                            })
                                        }),
                                        trigger: e
                                    }
                                },
                                h = function(e) {
                                    var t = m(),
                                        r = t.promise,
                                        n = t.trigger;
                                    return a(function() {
                                        return function(e) {
                                            var t = e.filter(l).map(p);
                                            return t.map(function(e) {
                                                return e[0]
                                            }).map(function(e) {
                                                return e.fold(function(e) {
                                                    throw e
                                                }, function(e) {
                                                    return e
                                                })
                                            }), t.map(function(e) {
                                                return e[1]
                                            }).map(function(e) {
                                                return e.catch(function() {})
                                            }), e.filter(f)
                                        }(e)
                                    }).fold(function(e) {
                                        throw n([]), e
                                    }, function(e) {
                                        return n(e), r
                                    })
                                },
                                v = o.getState(),
                                y = c(d),
                                g = o.getState();
                            if (v !== g) {
                                var b = u(v, g);
                                return i(e.slice().map(function(e) {
                                    return a(function() {
                                        return e(b) || []
                                    })
                                })).fold(function(e) {
                                    throw e
                                }, function(e) {
                                    return h(e.filter(s))
                                })
                            }
                            return Promise.resolve(y)
                        }
                    }
                },
                subscribe: d(e),
                onIdle: d(t)
            }
        }
    }, function(e, t, r) {
        "use strict";
        e.exports.isPromise = function(e) {
            return null != e && "function" == typeof e.then
        }
    }, function(e, t, r) {
        "use strict";
        var n = function() {},
            o = function(e, t) {
                return e.fold(t.Error || n, t.Ok || n)
            },
            i = function(e) {
                return {
                    map: function(e) {
                        return this
                    },
                    fold: function(t, r) {
                        return t(e)
                    },
                    chain: function(e) {
                        return this
                    },
                    match: function(e) {
                        return o(this, e)
                    },
                    value: e
                }
            },
            a = function e(t) {
                return {
                    map: function(r) {
                        return e(r(t))
                    },
                    fold: function(e, r) {
                        return r(t)
                    },
                    chain: function(e) {
                        return e(t)
                    },
                    match: function(e) {
                        return o(this, e)
                    },
                    value: t
                }
            },
            u = {
                Left: i,
                Right: a
            };
        e.exports = {
            Either: u,
            sequence: function(e) {
                return e.reduce(function(e, t) {
                    return e.chain(function(e) {
                        return t.map(function(t) {
                            return e.concat(t)
                        })
                    })
                }, a([]))
            },
            try_: function(e) {
                try {
                    return a(e())
                } catch (e) {
                    return i(e)
                }
            }
        }
    }, function(e, t, r) {
        "use strict";
        e.exports = function(e, t) {
            var r = {
                from: e,
                to: t,
                hasChanged: function(r) {
                    return r(e) !== r(t)
                },
                hasChangedToMatch: function(e, n) {
                    return r.hasChanged(e) && n(e(t))
                },
                hasChangedToTrue: function(e) {
                    return r.hasChangedToMatch(e, function(e) {
                        return !0 === e
                    })
                },
                hasChangedToFalse: function(e) {
                    return r.hasChangedToMatch(e, function(e) {
                        return !1 === e
                    })
                },
                hasChangedToNull: function(e) {
                    return r.hasChangedToMatch(e, function(e) {
                        return null === e
                    })
                },
                hasChangedToNotNull: function(e) {
                    return r.hasChangedToMatch(e, function(e) {
                        return null !== e
                    })
                }
            };
            return r
        }
    }, function(e, t, r) {
        "use strict";
        var n = function(e) {
            return null != e && "function" == typeof e.run && "boolean" == typeof e.isQueued && (!e.resultActionCreator || "function" == typeof e.resultActionCreator)
        };
        e.exports = {
            isEffect: n,
            isImmediateEffect: function(e) {
                return n(e) && !e.isQueued
            },
            isQueuedEffect: function(e) {
                return n(e) && e.isQueued
            }
        }
    }, function(e, t, r) {
        "use strict";
        var n = r(97),
            o = r(9),
            i = /^media\//i,
            a = "undefined" != typeof window ? window.devicePixelRatio : 1,
            u = function(e, t) {
                var r = (void 0 === t ? {} : t).baseHostURL;
                return r ? "" + r + e : function(e) {
                    return i.test(e) ? "https://static.wixstatic.com/" + e : "https://static.wixstatic.com/media/" + e
                }(e)
            };
        e.exports.populateGlobalFeatureSupport = n.populateGlobalFeatureSupport, e.exports.getScaleToFitImageURL = function(e, t, r, i, c, s) {
            var l = n.getData(o.fittingTypes.SCALE_TO_FIT, {
                id: e,
                width: t,
                height: r,
                name: s && s.name
            }, {
                width: i,
                height: c,
                htmlTag: n.htmlTag.IMG,
                alignment: n.alignTypes.CENTER,
                pixelAspectRatio: a
            }, s);
            return u(l.uri, s)
        }, e.exports.getScaleToFillImageURL = function(e, t, r, i, c, s) {
            var l = n.getData(o.fittingTypes.SCALE_TO_FILL, {
                id: e,
                width: t,
                height: r,
                name: s && s.name,
                focalPoint: {
                    x: s && s.focalPoint && s.focalPoint.x,
                    y: s && s.focalPoint && s.focalPoint.y
                }
            }, {
                width: i,
                height: c,
                htmlTag: n.htmlTag.IMG,
                alignment: n.alignTypes.CENTER,
                pixelAspectRatio: a
            }, s);
            return u(l.uri, s)
        }, e.exports.getCropImageURL = function(e, t, r, i, c, s, l, f, d, p) {
            var m = n.getData(o.fittingTypes.SCALE_TO_FILL, {
                id: e,
                width: t,
                height: r,
                name: p && p.name,
                crop: {
                    x: i,
                    y: c,
                    width: s,
                    height: l
                }
            }, {
                width: f,
                height: d,
                htmlTag: n.htmlTag.IMG,
                alignment: n.alignTypes.CENTER,
                pixelAspectRatio: a
            }, p);
            return u(m.uri, p)
        }
    }, function(e, t, r) {
        "use strict";
        var n = r(9),
            o = r(15).isValidRequest,
            i = r(98).populateGlobalFeatureSupport,
            a = r(37),
            u = r(103).getURI;
        e.exports.populateGlobalFeatureSupport = i, e.exports.getData = function(e, t, r, i) {
            var c = n.emptyData.uri;
            if (o(e, t, r)) {
                var s = a.getTarget(e, t, r),
                    l = a.getTransform(e, t, s, i);
                c = u(e, t, s, i, l)
            }
            return {
                uri: c
            }
        }, e.exports.fittingTypes = n.fittingTypes, e.exports.alignTypes = n.alignTypes, e.exports.htmlTag = n.htmlTag, e.exports.upscaleMethods = n.upscaleMethods
    }, function(e, t, r) {
        "use strict";
        var n = r(9).noWEBP,
            o = r(99),
            i = r(36),
            a = r(25);
        e.exports.populateGlobalFeatureSupport = function(e) {
            var t;
            void 0 === e && (e = ""), "undefined" != typeof window && "undefined" != typeof navigator ? ((t = o(navigator.userAgent)).browser.safari || t.os.iphone || t.os.ipad ? a.setFeature("isWEBP", n) : (i.checkSupportByUserAgent(navigator.userAgent, t), i.checkSupportByFeatureDetection()), a.setFeature("isObjectFitBrowser", function(e) {
                return e in window.document.documentElement.style
            }("objectFit")), a.setFeature("isMobile", t.os.phone)) : (t = o(e), i.checkSupportByUserAgent(e, t), a.setFeature("isMobile", t.os.phone))
        }
    }, function(e, t, r) {
        e.exports = function() {
            "use strict";
            /*!
             * Based on Zepto's detect module - https://github.com/madrobby/zepto/blob/master/src/detect.js#files
             * Zepto.js may be freely distributed under the MIT license. See: https://github.com/madrobby/zepto/blob/master/MIT-LICENSE
             *
             * note - MS Edge detection was added here, which Zepto does not have.
             */
            return function(e) {
                var t = {},
                    r = {};
                if (!e) return {
                    browser: r,
                    os: t
                };
                var n = e.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
                    o = e.match(/(Android);?[\s\/]+([\d.]+)?/),
                    i = !!e.match(/\(Macintosh\; Intel /),
                    a = e.match(/(iPad).*OS\s([\d_]+)/),
                    u = e.match(/(iPod)(.*OS\s([\d_]+))?/),
                    c = !a && e.match(/(iPhone\sOS)\s([\d_]+)/),
                    s = e.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
                    l = e.match(/Windows Phone ([\d.]+)/),
                    f = s && e.match(/TouchPad/),
                    d = e.match(/Kindle\/([\d.]+)/),
                    p = e.match(/Silk\/([\d._]+)/),
                    m = e.match(/(BlackBerry).*Version\/([\d.]+)/),
                    h = e.match(/(BB10).*Version\/([\d.]+)/),
                    v = e.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
                    y = e.match(/PlayBook/),
                    g = e.match(/Chrome\/([\d.]+)/) || e.match(/CriOS\/([\d.]+)/),
                    b = e.match(/Firefox\/([\d.]+)/),
                    w = e.match(/MSIE\s([\d.]+)/) || e.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
                    O = !g && e.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
                    I = O || e.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/),
                    E = e.match(/Edge\/(\d{2,}\.[\d\w]+)$/),
                    R = e.match(/Opera Mini/);
                return r.webkit = n && !E, r.webkit && (r.version = n[1]), o && (t.android = !0, t.version = o[2]), c && !u && (t.ios = t.iphone = !0, t.version = c[2].replace(/_/g, ".")), a && (t.ios = t.ipad = !0, t.version = a[2].replace(/_/g, ".")), u && (t.ios = t.ipod = !0, t.version = u[3] ? u[3].replace(/_/g, ".") : null), l && (t.wp = !0, t.version = l[1]), s && (t.webos = !0, t.version = s[2]), f && (t.touchpad = !0), m && (t.blackberry = !0, t.version = m[2]), h && (t.bb10 = !0, t.version = h[2]), v && (t.rimtabletos = !0, t.version = v[2]), y && (r.playbook = !0), d && (t.kindle = !0, t.version = d[1]), p && (r.silk = !0, r.version = p[1]), !p && t.android && e.match(/Kindle Fire/) && (r.silk = !0), g && !E && (r.chrome = !0, r.version = g[1]), b && !E && (r.firefox = !0, r.version = b[1]), w && (r.ie = !0, r.version = w[1]), I && (i || t.ios) && (r.safari = !0, i && (r.version = I[1])), O && (r.webview = !0), E && (r.edge = !0, r.version = E[1]), R && (r.operaMini = !0), t.tablet = !!(a || y || o && !e.match(/Mobile/) || b && e.match(/Tablet/) || (w || E) && !e.match(/Phone/) && e.match(/Touch/)), t.phone = !(t.tablet || t.ipod || !(o || c || s || m || h || g && e.match(/Android/) || g && e.match(/CriOS\/([\d.]+)/) || b && e.match(/Mobile/) || w && e.match(/Touch/))), t.mac = i, t.googleBot = !!e.match(/Googlebot\/2.1/), {
                    browser: r,
                    os: t
                }
            }
        }()
    }, function(e, t, r) {
        "use strict";
        var n = r(36),
            o = r(25);
        e.exports.isWEBPBrowserSupport = n.isWEBPBrowserSupport, e.exports.isObjectFitBrowserSupport = function() {
            return o.getFeature("isObjectFitBrowser")
        }, e.exports.isMobile = function() {
            return o.getFeature("isMobile")
        }
    }, function(e, t, r) {
        "use strict";
        var n = r(9),
            o = r(15),
            i = o.getAlignment,
            a = o.getScaleFactor,
            u = o.getOverlappingRect,
            c = o.getAlignedRect,
            s = o.getTransformData,
            l = o.getFocalPoint;

        function f(e, t) {
            var r = s(e.src.width, e.src.height, t, e.devicePixelRatio, n.transformTypes.FIT, e.upscaleMethod);
            return {
                transformType: n.transformTypes.FILL,
                width: Math.round(r.width),
                height: Math.round(r.height),
                alignment: n.alignTypesMap.center,
                upscale: r.scaleFactor > 1,
                forceUSM: r.forceUSM,
                scaleFactor: r.scaleFactor,
                cssUpscaleNeeded: r.cssUpscaleNeeded,
                upscaleMethodValue: r.upscaleMethodValue
            }
        }

        function d(e) {
            return {
                transformType: n.transformTypes.CROP,
                x: Math.round(e.x),
                y: Math.round(e.y),
                width: Math.round(e.width),
                height: Math.round(e.height),
                upscale: !1,
                forceUSM: !1,
                scaleFactor: 1,
                cssUpscaleNeeded: !1
            }
        }
        e.exports.setTransformParts = function(e, t, r) {
            var o;
            switch (t.crop && (o = u(t, t.crop)) && (e.src.width = o.width, e.src.height = o.height, e.src.cropped = !0, e.parts.push(d(o))), e.fittingType) {
                case n.fittingTypes.SCALE_TO_FIT:
                case n.fittingTypes.LEGACY_FIT_WIDTH:
                case n.fittingTypes.LEGACY_FIT_HEIGHT:
                case n.fittingTypes.LEGACY_FULL:
                case n.fittingTypes.FIT_AND_TILE:
                case n.fittingTypes.LEGACY_BG_FIT_AND_TILE:
                case n.fittingTypes.LEGACY_BG_FIT_AND_TILE_HORIZONTAL:
                case n.fittingTypes.LEGACY_BG_FIT_AND_TILE_VERTICAL:
                case n.fittingTypes.LEGACY_BG_NORMAL:
                    e.parts.push(f(e, r));
                    break;
                case n.fittingTypes.SCALE_TO_FILL:
                    e.parts.push(function(e, t) {
                        var r = s(e.src.width, e.src.height, t, e.devicePixelRatio, n.transformTypes.FILL, e.upscaleMethod),
                            o = l(e.focalPoint);
                        return {
                            transformType: o ? n.transformTypes.FILL_FOCAL : n.transformTypes.FILL,
                            width: Math.round(r.width),
                            height: Math.round(r.height),
                            alignment: i(t),
                            focalPointX: o && o.x,
                            focalPointY: o && o.y,
                            upscale: r.scaleFactor > 1,
                            forceUSM: r.forceUSM,
                            scaleFactor: r.scaleFactor,
                            cssUpscaleNeeded: r.cssUpscaleNeeded,
                            upscaleMethodValue: r.upscaleMethodValue
                        }
                    }(e, r));
                    break;
                case n.fittingTypes.STRETCH:
                    e.parts.push(function(e, t) {
                        var r = a(e.src.width, e.src.height, t.width, t.height, n.transformTypes.FILL),
                            o = Object.assign({}, t);
                        return o.width = e.src.width * r, o.height = e.src.height * r, f(e, o)
                    }(e, r));
                    break;
                case n.fittingTypes.TILE_HORIZONTAL:
                case n.fittingTypes.TILE_VERTICAL:
                case n.fittingTypes.TILE:
                case n.fittingTypes.LEGACY_ORIGINAL_SIZE:
                case n.fittingTypes.ORIGINAL_SIZE:
                    o = c(e.src, e.focalPoint, r, r.alignment), e.src.isCropped ? (Object.assign(e.parts[0], o), e.src.width = o.width, e.src.height = o.height) : e.parts.push(d(o));
                    break;
                case n.fittingTypes.LEGACY_STRIP_TILE_HORIZONTAL:
                case n.fittingTypes.LEGACY_STRIP_TILE_VERTICAL:
                case n.fittingTypes.LEGACY_STRIP_TILE:
                case n.fittingTypes.LEGACY_STRIP_ORIGINAL_SIZE:
                    e.parts.push(function(e) {
                        return {
                            transformType: n.transformTypes.LEGACY_CROP,
                            width: Math.round(e.width),
                            height: Math.round(e.height),
                            alignment: i(e),
                            upscale: !1,
                            forceUSM: !1,
                            scaleFactor: 1,
                            cssUpscaleNeeded: !1
                        }
                    }(r));
                    break;
                case n.fittingTypes.LEGACY_STRIP_SCALE_TO_FIT:
                case n.fittingTypes.LEGACY_STRIP_FIT_AND_TILE:
                    e.parts.push(function(e) {
                        return {
                            transformType: n.transformTypes.FIT,
                            width: Math.round(e.width),
                            height: Math.round(e.height),
                            upscale: !1,
                            forceUSM: !0,
                            scaleFactor: 1,
                            cssUpscaleNeeded: !1
                        }
                    }(r));
                    break;
                case n.fittingTypes.LEGACY_STRIP_SCALE_TO_FILL:
                    e.parts.push(function(e) {
                        return {
                            transformType: n.transformTypes.LEGACY_FILL,
                            width: Math.round(e.width),
                            height: Math.round(e.height),
                            alignment: i(e),
                            upscale: !1,
                            forceUSM: !0,
                            scaleFactor: 1,
                            cssUpscaleNeeded: !1
                        }
                    }(r))
            }
        }
    }, function(e, t, r) {
        "use strict";
        var n = r(24),
            o = r(9),
            i = r(15),
            a = i.getPreferredImageQuality,
            u = i.roundToFixed;

        function c(e, t, r) {
            return !isNaN(e) && "number" == typeof e && 0 !== e && e >= t && e <= r
        }
        e.exports.setTransformOptions = function(e, t) {
            t = t || {}, e.quality = function(e, t) {
                var r = e.fileType === o.fileType.PNG && e.isWEBPSupport;
                if (e.fileType === o.fileType.JPG || r) {
                    var i = n.last(e.parts),
                        u = a(i.width, i.height),
                        c = t.quality && t.quality >= 5 && t.quality <= 90 ? t.quality : u;
                    return c = r ? c + 5 : c, parseInt(c, 10)
                }
                return 0
            }(e, t), e.progressive = function(e) {
                return !1 !== e.progressive
            }(t), e.watermark = function(e) {
                return e.watermark
            }(t), e.unsharpMask = function(e, t) {
                var r;
                return ! function(e) {
                    e = e || {};
                    var t = !isNaN(e.radius) && "number" == typeof e.radius && e.radius >= .1 && e.radius <= 500,
                        r = !isNaN(e.amount) && "number" == typeof e.amount && e.amount >= 0 && e.amount <= 10,
                        n = !isNaN(e.threshold) && "number" == typeof e.threshold && e.threshold >= 0 && e.threshold <= 255;
                    return t && r && n
                }(t.unsharpMask) ? function(e) {
                    return e = e || {}, !isNaN(e.radius) && "number" == typeof e.radius && 0 === e.radius && !isNaN(e.amount) && "number" == typeof e.amount && 0 === e.amount && !isNaN(e.threshold) && "number" == typeof e.threshold && 0 === e.threshold
                }(t.unsharpMask) || function(e) {
                    var t = n.last(e.parts);
                    return !(t.scaleFactor >= 1) || t.forceUSM
                }(e) && (r = o.defaultUSM) : r = {
                    radius: t.unsharpMask.radius,
                    amount: t.unsharpMask.amount,
                    threshold: t.unsharpMask.threshold
                }, r && (r.radius = u(r.radius, 2), r.amount = u(r.amount, 2), r.threshold = u(r.threshold, 2)), r
            }(e, t), e.filters = function(e) {
                var t = e.filters || {},
                    r = {};
                return c(t[o.imageFilters.CONTRAST], -100, 100) && (r[o.imageFilters.CONTRAST] = t[o.imageFilters.CONTRAST]), c(t[o.imageFilters.BRIGHTNESS], -100, 100) && (r[o.imageFilters.BRIGHTNESS] = t[o.imageFilters.BRIGHTNESS]), c(t[o.imageFilters.SATURATION], -100, 100) && (r[o.imageFilters.SATURATION] = t[o.imageFilters.SATURATION]), c(t[o.imageFilters.HUE], -180, 180) && (r[o.imageFilters.HUE] = t[o.imageFilters.HUE]), c(t[o.imageFilters.BLUR], 0, 100) && (r[o.imageFilters.BLUR] = t[o.imageFilters.BLUR]), r
            }(t)
        }
    }, function(e, t, r) {
        "use strict";
        var n = r(9),
            o = r(15).isImageTransformApplicable,
            i = r(104),
            a = r(37);
        e.exports.getURI = function(e, t, r, u, c) {
            var s = n.emptyData.uri;
            return o(t.id) ? (c = c || a.getTransform(e, t, r, u, c), s = i.getImageURI(c)) : s = t.id, s
        }
    }, function(e, t, r) {
        "use strict";
        var n, o = r(24),
            i = r(9),
            a = i.imageFilters,
            u = i.transformTypes,
            c = i.API_VERSION,
            s = o.template("fit/w_${width},h_${height}"),
            l = o.template("fill/w_${width},h_${height},al_${alignment}"),
            f = o.template("fill/w_${width},h_${height},fp_${focalPointX}_${focalPointY}"),
            d = o.template("crop/x_${x},y_${y},w_${width},h_${height}"),
            p = o.template("crop/w_${width},h_${height},al_${alignment}"),
            m = o.template("fill/w_${width},h_${height},al_${alignment}"),
            h = o.template(",lg_${upscaleMethodValue}"),
            v = o.template(",q_${quality}"),
            y = o.template(",usm_${radius}_${amount}_${threshold}"),
            g = o.template(",bl"),
            b = o.template(",wm_${watermark}"),
            w = ((n = {})[a.CONTRAST] = o.template(",con_${contrast}"), n[a.BRIGHTNESS] = o.template(",br_${brightness}"), n[a.SATURATION] = o.template(",sat_${saturation}"), n[a.HUE] = o.template(",hue_${hue}"), n[a.BLUR] = o.template(",blur_${blur}"), n);
        e.exports.getImageURI = function(e) {
            var t = [];
            e.parts.forEach(function(e) {
                switch (e.transformType) {
                    case u.CROP:
                        t.push(d(e));
                        break;
                    case u.LEGACY_CROP:
                        t.push(p(e));
                        break;
                    case u.LEGACY_FILL:
                        var r = m(e);
                        e.upscale && (r += h(e)), t.push(r);
                        break;
                    case u.FIT:
                        var n = s(e);
                        e.upscale && (n += h(e)), t.push(n);
                        break;
                    case u.FILL:
                        var o = l(e);
                        e.upscale && (o += h(e)), t.push(o);
                        break;
                    case u.FILL_FOCAL:
                        var i = f(e);
                        e.upscale && (i += h(e)), t.push(i)
                }
            });
            var r = t.join("/");
            return e.quality && (r += v(e)), e.unsharpMask && (r += y(e.unsharpMask)), e.progressive || (r += g(e)), e.watermark && (r += b(e)), e.filters && (r += Object.keys(e.filters).map(function(t) {
                return w[t](e.filters)
            }).join("")), e.src.id + "/" + c + "/" + r + "/" + e.fileName + "." + e.preferredExtension
        }
    }, function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.errorCodes = t.createDataSchemasClientForBrowser = t.WixDataSchemas = void 0;
        var n = function(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }(r(38)),
            o = r(107),
            i = r(39);
        t.WixDataSchemas = n.default, t.createDataSchemasClientForBrowser = o.createDataSchemasClientForBrowser, t.errorCodes = i.errorCodes
    }, function(e, t, r) {
        "use strict";

        function n(e) {
            "@babel/helpers - typeof";
            return (n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            })(e)
        }

        function o(e, t) {
            return (o = Object.setPrototypeOf || function(e, t) {
                return e.__proto__ = t, e
            })(e, t)
        }

        function i(e) {
            var t = function() {
                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0
                } catch (e) {
                    return !1
                }
            }();
            return function() {
                var r, o = u(e);
                if (t) {
                    var i = u(this).constructor;
                    r = Reflect.construct(o, arguments, i)
                } else r = o.apply(this, arguments);
                return function(e, t) {
                    if (t && ("object" === n(t) || "function" == typeof t)) return t;
                    if (void 0 !== t) throw new TypeError("Derived constructors may only return object or undefined");
                    return a(e)
                }(this, r)
            }
        }

        function a(e) {
            if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return e
        }

        function u(e) {
            return (u = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                return e.__proto__ || Object.getPrototypeOf(e)
            })(e)
        }

        function c(e) {
            function t() {
                var t = Reflect.construct(e, Array.from(arguments));
                return Object.setPrototypeOf(t, Object.getPrototypeOf(this)), t
            }
            return t.prototype = Object.create(e.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e, t
        }
        var s = r(40),
            l = function(e) {
                ! function(e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                    e.prototype = Object.create(t && t.prototype, {
                        constructor: {
                            value: e,
                            writable: !0,
                            configurable: !0
                        }
                    }), t && o(e, t)
                }(r, c(Error));
                var t = i(r);

                function r() {
                    var e;
                    ! function(e, t) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    }(this, r);
                    for (var n = arguments.length, o = new Array(n), i = 0; i < n; i++) o[i] = arguments[i];
                    return e = t.call.apply(t, [this].concat(o)), Error.captureStackTrace && Error.captureStackTrace(a(e), e.constructor), e.name = r.name, s.markUserError(a(e)), e
                }
                return r
            }();
        e.exports = {
            UserCodeError: l
        }
    }, function(e, t, r) {
        "use strict";
        (function(e) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.createDataSchemasClientForBrowser = function(t, r, o) {
                return new n.default(e.fetch, t, r, o)
            };
            var n = function(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }(r(38))
        }).call(this, r(14))
    }, function(e, t, r) {
        "use strict";
        r.r(t);
        /*! *****************************************************************************
        Copyright (c) Microsoft Corporation.

        Permission to use, copy, modify, and/or distribute this software for any
        purpose with or without fee is hereby granted.

        THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
        REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
        AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
        INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
        LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
        OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
        PERFORMANCE OF THIS SOFTWARE.
        ***************************************************************************** */
        var n = function(e, t) {
            return (n = Object.setPrototypeOf || {
                    __proto__: []
                }
                instanceof Array && function(e, t) {
                    e.__proto__ = t
                } || function(e, t) {
                    for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
                })(e, t)
        };

        function o(e, t) {
            function r() {
                this.constructor = e
            }
            n(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
        }
        var i = r(11),
            a = r.n(i);

        function u(e) {
            return "object" === a()(e)
        }

        function c(e) {
            return "array" === a()(e)
        }

        function s(e) {
            return "string" === a()(e)
        }

        function l(e) {
            return function(e) {
                if (!s(e)) return e;
                var t = e.slice(0, 1).toUpperCase(),
                    r = e.slice(1, e.length);
                return t + r
            }(a()(e))
        }

        function f(e) {
            if (null == e || "object" != typeof e) return e;
            var t = null;
            if (function(e) {
                    return "date" === a()(e)
                }(e)) t = new Date(e.getTime());
            else
                for (var r in t = e.constructor(), e) t[r] = f(e[r]);
            return t
        }
        var d = r(31),
            p = r(59),
            m = r.n(p);

        function h(e) {
            return m()(e)
        }
        var v = {
                collectionNameMustBeAString: function() {
                    return "WDE0001: Collection name must be a string."
                },
                itemIdMustBeAString: function() {
                    return "WDE0002: ItemId must be a string."
                },
                itemIdsMustBeArrayOfStrings: function() {
                    return "WDE0068: Item ids must be an array of strings"
                },
                removeItemsMustBeLessThanThousand: function(e) {
                    return "WDE0069: Failed to remove items from [" + e + "].\nCannot remove more than 1000 items in one request"
                },
                fieldNameMustBeAString: function() {
                    return "WDE0003: FieldName must be a string."
                },
                itemMustBeAnObject: function(e, t) {
                    return "WDE0004: Failed to save [" + e + "] into [" + t + "].\nItems must be JavaScript objects."
                },
                itemsMustBeArrayOfObjects: function(e) {
                    return "WDE0005: Failed to bulk save items into [" + e + "].\nItems must be an array of JavaScript objects and itemIds must be strings if present."
                },
                itemsMustBeLessThanThousand: function(e) {
                    return "WDE0006: Failed to bulk save items into [" + e + "].\nCannot insert more than 1000 items in one request"
                },
                updateItemInvalid: function() {
                    return "WDE0007: Invalid update. Updated object must have a string _id property."
                },
                invalidArgumentLength: function(e, t, r, n) {
                    return "WDE0008: wixData." + e + " expects between " + t + " and " + r + " arguments, but was called with " + n + "."
                },
                documentTooLarge: function() {
                    return "WDE0009: Document is too large."
                },
                keyTooLargeToIndex: function() {
                    return "WDE0010: Document field is too large to index."
                },
                aggregateValidations: {
                    aggregateInvalid: function(e, t) {
                        return "Failed to perform aggregation on [" + e + "].\n" + t.join("\n")
                    },
                    filterMustBeBuilder: function(e) {
                        return "WDE0011: Invalid " + e + " usage. " + e + " requires WixDataFilter."
                    },
                    filterIsAlreadySet: function(e) {
                        return "WDE0012: Invalid " + e + " usage. Filter is already set."
                    },
                    groupIsAlreadySet: function(e) {
                        return "WDE0013: Invalid " + e + " usage. Group is already set."
                    }
                },
                filterBuilderInvalid: function(e) {
                    return "Failed to build a filter.\n" + e.join("\n") + "."
                },
                groupBuilderInvalid: function(e) {
                    return "Failed to build group.\n" + e.join("\n") + "."
                },
                filterMustBeAnObject: function() {
                    return "WDE0016: Filter must be an object."
                },
                sortBuilderInvalid: function(e) {
                    return "Failed to build a sort.\n" + e.join("\n") + "."
                },
                optionsInvalid: function(e) {
                    return "WDE0018: Options must be an object with one or all of the following boolean properties: " + e.join(", ") + "."
                },
                referenceOperationParameterError: function() {
                    return "WDE0019: Reference operation takes a string ID or an object with an ID to be connected."
                },
                referenceOperationFieldError: function(e) {
                    return "WDE0020: Provided relationshipAttribute [" + e + "] is not a multi-reference field."
                },
                invalidReferenceError: function() {
                    return "WDE0021: Invalid reference"
                },
                multipleMultiRefIncludeError: function() {
                    return "WDE0022: Unable to execute a query. Only single multi-reference field can be included."
                },
                multiRefItemLimitError: function() {
                    return "WDE0023: Can not fetch more than 50 elements when include is being used on multi-reference field"
                },
                fieldIsDeleted: function() {
                    return "WDE0024: Field is deleted"
                },
                schemaDoesNotExist: function(e) {
                    return "WDE0025: The " + e + " collection does not exist. You cannot work with a collection using the Data API before it is created in the Editor."
                },
                collectionDeleted: function(e) {
                    return "WDE0026: The " + e + " collection was removed, so you cannot work with it. To restore its data, create a new collection with the same name."
                },
                permissionDenied: function(e, t) {
                    return "WDE0027: The current user does not have permissions to " + e + " on the " + t + " collection."
                },
                requestTimedOut: function() {
                    return "WDE0028: Request timed out."
                },
                internalAuthorizationProblem: function() {
                    return "WDE0029: An internal error has occurred while trying to check authorization."
                },
                queryValidations: {
                    queryInvalid: function(e, t) {
                        return "Failed to perform query on [" + e + "].\n" + t.join("\n")
                    },
                    collectionNameIsRequired: function() {
                        return "WDE0031: Collection name is required and must be a string."
                    },
                    isNumber: function(e, t, r) {
                        return "WDE0032: Invalid " + e + " parameter [" + l(r) + "]. " + e + " parameter must be a " + t + " number."
                    },
                    isPositiveNumber: function(e, t) {
                        return "WDE0033: Invalid " + e + " parameter [" + t + "]. " + e + " parameter must be a positive number."
                    },
                    isNonNegativeNumber: function(e, t) {
                        return "WDE0034: Invalid " + e + " parameter [" + t + "]. " + e + " parameter must be a non-negative number."
                    },
                    isInteger: function(e, t) {
                        return "WDE0035: Invalid " + e + " parameter [" + t + "]. " + e + " parameter must be an integer."
                    },
                    notGreaterThan: function(e, t, r) {
                        return "WDE0036: Invalid " + e + " parameter [" + t + "]. " + e + " parameter cannot exceed " + r + "."
                    },
                    invalidSkipParameter: function(e, t) {
                        return "WDE0037: Invalid query on [" + e + "].\nInvalid prev positioned query skip on a negative number " + t + "."
                    }
                },
                arityValidations: {
                    arityIsZero: function(e) {
                        return "WDE0038: Invalid " + e + " usage. " + e + " does not take parameters."
                    },
                    arityIsOne: function(e) {
                        return "WDE0039: Invalid " + e + " usage. " + e + " requires one parameter."
                    },
                    arityIsTwo: function(e) {
                        return "WDE0040: Invalid " + e + " usage. " + e + " requires two parameters."
                    },
                    arityIsThree: function(e) {
                        return "WDE0041: Invalid " + e + " usage. " + e + " requires three parameters."
                    },
                    arityIsAtLeastTwo: function(e) {
                        return "WDE0042: Invalid " + e + " usage. " + e + " requires at least two parameters."
                    },
                    arityIsAtLeastOne: function(e) {
                        return "WDE0043: Invalid " + e + " usage. " + e + " requires at least one parameter."
                    }
                },
                filterValidations: {
                    typeIsString: function(e, t) {
                        return "WDE0044: Invalid " + e + " parameter value [" + l(t) + "]. " + e + " parameter must be a String."
                    },
                    typeIsStringNumberOrDate: function(e, t) {
                        return "WDE0045: Invalid " + e + " parameter value [" + l(t) + "]. Valid " + e + " parameter types are String, Number or Date."
                    },
                    sameType: function(e, t, r) {
                        return "WDE0046: Invalid " + e + " parameter values [" + l(t) + "] and [" + l(r) + "]. Both parameters must be of the same type."
                    },
                    typeIsStringNumberOrDateForAll: function(e) {
                        return "WDE0047: Invalid " + e + " usage. " + e + " supports only Number, String or Date items."
                    },
                    validFieldName: function(e, t) {
                        return "WDE0048: Invalid " + e + " field value [" + l(t) + "]. " + e + " field must be a String."
                    },
                    isInstanceOfSameClass: function(e, t, r) {
                        return "WDE0049: Invalid " + e + " parameter [" + l(r) + "]. " + e + " expects " + t + " only."
                    },
                    isForCollection: function(e, t, r) {
                        return "WDE0050: Invalid " + e + " parameter query for [" + r + "]. " + e + " accepts " + t + " for the same collection only."
                    },
                    incorrectDraftPublishFilter: function() {
                        return "WDE0093: Invalid filter for _publishStatus field, only .eq and .ne filters are allowed with 'DRAFT' and 'PUBLISHED' possible values."
                    }
                },
                filterTreeValidationsAjv: {
                    objectType: function(e) {
                        return "WDE0056: " + e + " should be an Object. Got ${0} instead"
                    },
                    arrayType: function(e) {
                        return "WDE0057: " + e + " should be an Array. Got ${0} instead"
                    },
                    arrayLength: function(e, t) {
                        return "WDE0057: ${0}.length is ${0/length}. " + e + " Array should have length " + t
                    },
                    comparisonOperatorType: function(e) {
                        return "WDE0058: " + e + " should be a Date, Number, or String. Got ${0} instead"
                    },
                    stringOperatorType: function(e) {
                        return "WDE0059: " + e + " should be a String. Got ${0} instead"
                    },
                    setOperatorItems: function(e) {
                        return "WDE0060: " + e + " Array should only contain values of types Date, Number, and String. Got ${0} instead"
                    },
                    inOperatorItems: function() {
                        return "WDE0061: $in Array should have length 2, and match [String, Number]. Got ${0} instead"
                    },
                    matchesOperatorRequiredProperty: function(e) {
                        return "WDE0062: $matches value ${0} does not have property " + e
                    },
                    matchesOperatorIgnoreCase: function() {
                        return "WDE0063: $matches.ignoreCase should equal true. Got ${0/ignoreCase} instead"
                    },
                    matchesOperatorSpecItems: function() {
                        return 'WDE0064: $matches.spec Array values should be either {"type":"anyOf","value":" -"} or {"type":"literal","value":String}. Got ${0} instead'
                    },
                    regexNotAllowed: function() {
                        return "WDE0070: $regex keyword is not allowed."
                    }
                },
                filterTreeValidations: {
                    objectType: function(e, t) {
                        return "WDE0056: " + e + " should be an Object. Got " + h(t) + " instead"
                    },
                    arrayType: function(e, t) {
                        return "WDE0057: " + e + " should be an Array. Got " + h(t) + " instead"
                    },
                    arrayLength: function(e, t, r) {
                        return "WDE0057: " + h(r) + ".length is " + r.length + ". " + e + " Array should have length " + t
                    },
                    comparisonOperatorType: function(e, t) {
                        return "WDE0058: " + e + " should be a Date, Number, or String. Got " + h(t) + " instead"
                    },
                    stringOperatorType: function(e, t) {
                        return "WDE0059: " + e + " should be a String. Got " + h(t) + " instead"
                    },
                    setOperatorItems: function(e, t) {
                        return "WDE0060: " + e + " Array should only contain values of types Date, Number, and String. Got " + h(t) + " instead"
                    },
                    inOperatorItems: function(e) {
                        return "WDE0061: $in Array should have length 2, and match [String, Number]. Got " + h(e) + " instead"
                    },
                    matchesOperatorRequiredProperty: function(e, t) {
                        return "WDE0062: $matches value " + h(t) + " does not have property " + e
                    },
                    matchesOperatorIgnoreCase: function(e) {
                        return "WDE0063: $matches.ignoreCase should equal true. Got " + h(e) + " instead"
                    },
                    matchesOperatorSpecItems: function(e) {
                        return 'WDE0064: $matches.spec Array values should be either {"type":"anyOf","value":" -"} or {"type":"literal","value":String}. Got ' + h(e) + " instead"
                    },
                    regexNotAllowed: function() {
                        return "WDE0070: $regex keyword is not allowed."
                    }
                },
                sortValidations: {
                    typeIsStringOrArrayOfStrings: function(e, t) {
                        return "WDE0051: Invalid " + e + " parameters [" + t.map(l) + "]. Valid " + e + " values are String, Array of String or varargs String."
                    }
                },
                orderByValidationsAjv: {
                    sortModelType: function() {
                        return "WDE0065: Sort Model should be an Array. Got ${0} instead"
                    },
                    sortModelItemType: function() {
                        return "WDE0066: Sort Model Array should contain values of type Object only. Got ${0} instead"
                    },
                    sortModelItem: function() {
                        return 'WDE0067: Sort Model Array items should have a single property with value "asc" or "desc". Got ${0} instead'
                    }
                },
                orderByValidations: {
                    sortModelType: function(e) {
                        return "WDE0065: Sort Model should be an Array. Got " + h(e) + " instead"
                    },
                    sortModelItemType: function(e) {
                        return "WDE0066: Sort Model Array should contain values of type Object only. Got " + h(e) + " instead"
                    },
                    sortModelItem: function(e) {
                        return 'WDE0067: Sort Model Array items should have a single property with value "asc" or "desc". Got ' + h(e) + " instead"
                    }
                },
                siteIsInTemplateMode: function() {
                    return "WDE0052: The current site is in template mode. Please save it to modify data."
                },
                internalError: function(e) {
                    return "WDE0053: Internal wixData error: " + e
                },
                serverGeneralError: function() {
                    return "WDE0054: The server could not fulfill the request."
                },
                serverInvalidResponse: function() {
                    return "WDE0055: Failed to parse server response."
                },
                tooManyRequests: function() {
                    return "WDE0014: Too many requests."
                },
                operationNotSupported: function(e, t) {
                    return e + " does not support " + t + " operation."
                },
                databaseQuotaExceeded: function() {
                    return "WDE0091: Database quota exceeded. Delete some data and try again."
                },
                itemDoesNotExist: function(e, t) {
                    return "WDE0073: Item [" + e + "] does not exist in collection [" + t + "]."
                },
                invalidLimit: function(e) {
                    return "WDE0077: 'limit' cannot exceed " + e
                },
                datasetTooLargeToSort: function() {
                    return "WDE0092: Dataset is too large to sort."
                },
                invalidIdForSingleItemCollection: function(e, t, r) {
                    return "WDE0079: [" + e + "] is a single item collection and item must have id [" + t + "], but got [" + r + "] instead."
                },
                payloadIsTooLarge: function() {
                    return "WDE0109: Payload is too large."
                }
            },
            y = {
                ItemDoesNotExist: "WD_ITEM_DOES_NOT_EXIST",
                ItemAlreadyExists: "WD_ITEM_ALREADY_EXISTS",
                SiteInTemplateMode: "WD_SITE_IN_TEMPLATE_MODE",
                UnknownError: "WD_UNKNOWN_ERROR",
                ValidationError: "WD_VALIDATION_ERROR",
                CollectionDeleted: "WD_COLLECTION_DELETED",
                SchemaDoesNotExist: "WD_SCHEMA_DOES_NOT_EXIST",
                PermissionDenied: "WD_PERMISSION_DENIED",
                BadRequest: "WD_BAD_REQUEST",
                Unauthorized: "WD_UNAUTHORIZED",
                TooManyRequests: "WD_TOO_MANY_REQUESTS",
                RequestTimedOut: "WD_REQUEST_TIMED_OUT",
                QuotaExceeded: "WD_DATABASE_QUOTA_EXCEEDED",
                QueryExecutionError: "WD_QUERY_EXECUTION_ERROR"
            };

        function g(e, t) {
            return E(e, t)
        }

        function b(e) {
            return E(e, y.ValidationError)
        }
        var w = "WixDataHookError";

        function O(e) {
            return e instanceof Error && e.name === w
        }

        function I(e) {
            var t = new Error(h(function(e) {
                return void 0 === e ? {
                    type: "undefined"
                } : e instanceof Error ? {
                    type: "error",
                    value: {
                        name: e.name,
                        message: e.message,
                        code: e.code
                    }
                } : {
                    type: "value",
                    value: e
                }
            }(e)));
            return t.name = w, t.originalError = e, Error.captureStackTrace && Error.captureStackTrace(t, I), t
        }

        function E(e, t) {
            var r = new(t && t !== y.UnknownError ? j : Error)(e);
            return r.code = t, r
        }

        function R(e) {
            return g(v.schemaDoesNotExist(e), y.SchemaDoesNotExist)
        }

        function T(e, t, r, n, o) {
            var i = new Error(e);
            return n && (i.name = n), i.code = t, i.item = r, i.originalIndex = o, Object.setPrototypeOf(i, Object.getPrototypeOf(this)), Error.captureStackTrace && Error.captureStackTrace(i, T), i
        }

        function j(e) {
            var t = new d.UserCodeError(e);
            return Object.setPrototypeOf(t, Object.getPrototypeOf(this)), Error.captureStackTrace && Error.captureStackTrace(t, j), t.name = Error.name, t
        }
        T.prototype = Object.create(Error.prototype, {
            constructor: {
                value: Error,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }), j.prototype = Object.create(d.UserCodeError.prototype, {
            constructor: {
                value: j,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        });
        var S = function() {
                function e() {
                    this._validations = []
                }
                return e.prototype.arityIsZero = function(e) {
                    var t = this;
                    return this.addValidation(function() {
                        return 0 === e.length
                    }, function() {
                        return v.arityValidations.arityIsZero(t.operatorName)
                    })
                }, e.prototype.arityIsOne = function(e) {
                    var t = this;
                    return this.addValidation(function() {
                        return 1 === e.length
                    }, function() {
                        return v.arityValidations.arityIsOne(t.operatorName)
                    })
                }, e.prototype.arityIsTwo = function(e) {
                    var t = this;
                    return this.addValidation(function() {
                        return 2 === e.length
                    }, function() {
                        return v.arityValidations.arityIsTwo(t.operatorName)
                    })
                }, e.prototype.arityIsThree = function(e) {
                    var t = this;
                    return this.addValidation(function() {
                        return 3 === e.length
                    }, function() {
                        return v.arityValidations.arityIsThree(t.operatorName)
                    })
                }, e.prototype.arityIsAtLeastTwo = function(e) {
                    var t = this;
                    return this.addValidation(function() {
                        return e.length >= 2
                    }, function() {
                        return v.arityValidations.arityIsAtLeastTwo(t.operatorName)
                    })
                }, e.prototype.arityIsAtLeastOne = function(e) {
                    var t = this;
                    return this.addValidation(function() {
                        return e.length >= 1
                    }, function() {
                        return v.arityValidations.arityIsAtLeastOne(t.operatorName)
                    })
                }, e.prototype.addValidation = function(e, t) {
                    return this._validations.push({
                        predicateFn: e,
                        messageFn: t
                    }), this
                }, e
            }(),
            P = function(e) {
                function t(t) {
                    var r = e.call(this) || this;
                    return r._invalidArguments = f(t), r
                }
                return o(t, e), t.prototype.validateAndAggregate = function() {
                    var e = this,
                        t = this._validations.every(function(t) {
                            var r = t.predicateFn,
                                n = t.messageFn;
                            return e._appendIfInvalid(r(), n())
                        });
                    return [this._invalidArguments, t]
                }, t.prototype._appendIfInvalid = function(e, t) {
                    return !!e || (this._invalidArguments.push(t), !1)
                }, t
            }(S),
            C = function(e) {
                function t() {
                    return null !== e && e.apply(this, arguments) || this
                }
                return o(t, e), t.prototype.validateAndReject = function() {
                    var e = this;
                    return Promise.resolve().then(function() {
                        e._validations.forEach(function(e) {
                            var t = e.predicateFn,
                                r = e.messageFn;
                            if (!t()) throw b(r())
                        })
                    })
                }, t
            }(S),
            D = function(e) {
                function t() {
                    return null !== e && e.apply(this, arguments) || this
                }
                return o(t, e), t.prototype.arity = function(e, t, r, n) {
                    return this.addValidation(function() {
                        return t.length <= n && t.length >= r
                    }, function() {
                        return v.invalidArgumentLength(e, r, n, t.length)
                    })
                }, t.prototype._isObject = function(e, t) {
                    return this.addValidation(function() {
                        return u(e)
                    }, function() {
                        return v.itemMustBeAnObject(e, t)
                    })
                }, t.prototype.item = function(e, t, r) {
                    return this._isObject(e, t).addValidation(function() {
                        return void 0 !== e._id ? s(e._id) : !r
                    }, function() {
                        return v.updateItemInvalid()
                    })
                }, t.prototype.items = function(e, t) {
                    return this.addValidation(function() {
                        return c(e) && e.every(function(e) {
                            return u(e) && (void 0 === e._id || null === e._id || s(e._id))
                        })
                    }, function() {
                        return v.itemsMustBeArrayOfObjects(t)
                    }).addValidation(function() {
                        return e.length <= 1e3
                    }, function() {
                        return v.itemsMustBeLessThanThousand(t)
                    })
                }, t.prototype.fieldName = function(e) {
                    return this.addValidation(function() {
                        return s(e)
                    }, function() {
                        return v.fieldNameMustBeAString()
                    })
                }, t.prototype.itemId = function(e) {
                    return this.addValidation(function() {
                        return s(e)
                    }, function() {
                        return v.itemIdMustBeAString()
                    })
                }, t.prototype.itemIds = function(e, t) {
                    return this.addValidation(function() {
                        return c(e) && e.every(function(e) {
                            return s(e)
                        })
                    }, function() {
                        return v.itemIdsMustBeArrayOfStrings()
                    }).addValidation(function() {
                        return e.length <= 1e3
                    }, function() {
                        return v.removeItemsMustBeLessThanThousand(t)
                    })
                }, t.prototype._options = function(e, t) {
                    return this.addValidation(function() {
                        var r = u(e) && t.every(function(t) {
                            return function(e) {
                                return null == e || function(e) {
                                    return "boolean" === a()(e)
                                }(e)
                            }(e[t])
                        });
                        return null == e || r
                    }, function() {
                        return v.optionsInvalid(t)
                    })
                }, t.prototype.referenceRemoveParameters = function(e) {
                    return this.addValidation(function() {
                        return c(e) && e.every(_)
                    }, v.referenceOperationParameterError)
                }, t.prototype.referenceParameters = function(e) {
                    return this.addValidation(function() {
                        return c(e) && e.every(A)
                    }, v.referenceOperationParameterError)
                }, t.prototype.referenceParameter = function(e) {
                    return this.addValidation(function() {
                        return A(e)
                    }, v.referenceOperationParameterError)
                }, t.prototype.references = function(e) {
                    return this.addValidation(function() {
                        return c(e) && e.every(function(e) {
                            return s(e.relationshipName) && A(e.left) && A(e.right)
                        })
                    }, v.invalidReferenceError)
                }, t.prototype.options = function(e) {
                    return this._options(e, ["suppressAuth", "suppressHooks", "showDrafts"])
                }, t.prototype.bulkInsertOptions = function(e) {
                    return this._options(e, ["suppressAuth", "suppressHooks", "overrideExisting"])
                }, t.prototype.bulkUpdateOptions = function(e) {
                    return this._options(e, ["suppressAuth", "suppressHooks", "showDrafts"])
                }, t.prototype.bulkRemoveOptions = function(e) {
                    return this._options(e, ["suppressAuth", "suppressHooks", "showDrafts"])
                }, t.prototype.truncateOptions = function(e) {
                    return this._options(e, ["suppressAuth"])
                }, t.prototype.collectionName = function(e) {
                    return this.addValidation(function() {
                        return s(e)
                    }, function() {
                        return v.collectionNameMustBeAString()
                    })
                }, t
            }(C);

        function x() {
            return new D
        }

        function A(e) {
            return s(e) && "" != e || u(e) && e.hasOwnProperty("_id")
        }

        function _(e) {
            return s(e) || u(e) && e.hasOwnProperty("_id")
        }
        r.d(t, "messages", function() {
            return v
        }), r.d(t, "codes", function() {
            return y
        }), r.d(t, "wixDataError", function() {
            return g
        }), r.d(t, "validationError", function() {
            return b
        }), r.d(t, "DATA_HOOK_ERROR_NAME", function() {
            return w
        }), r.d(t, "isDataHookError", function() {
            return O
        }), r.d(t, "dataHookError", function() {
            return I
        }), r.d(t, "schemaNotFoundError", function() {
            return R
        }), r.d(t, "BulkError", function() {
            return T
        }), r.d(t, "apiValidator", function() {
            return x
        }), r.d(t, "AggregatingValidator", function() {
            return P
        }), r.d(t, "RejectingValidator", function() {
            return C
        })
    }])
});
//# sourceMappingURL=app.js.map