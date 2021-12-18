import {
    __extends
} from "tslib";
import React from 'react';
import ReactDOM from 'react-dom';
import {
    window
} from '@wix/photography-client-lib';
import {
    utils
} from '../utils/webUtils';
var RenderStatusIndicator = /** @class */ (function(_super) {
    __extends(RenderStatusIndicator, _super);

    function RenderStatusIndicator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // Removed the state, should be simple enough to convert to a function comp
        _this.getTimingFromEntry = function(entry) {
            var regExp = /[0-9]+/;
            var match = entry.match(regExp);
            return Number(match[0]);
        };
        _this.generateRandomColor = function() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color + '30';
        };
        _this.generateRandomColor2 = function(ms, topms) {
            if (topms === void 0) {
                topms = 400;
            }
            var range = 240;
            var placement = 240 - (ms / topms) * range;
            return "hsl(" + placement + ", 100%, 50%, 0.3)";
        };
        _this.getItemsData = function() {
            return (React.createElement("tr", {
                    class: "show-on-hover"
                },
                React.createElement("td", null, " Items:"),
                React.createElement("td", null,
                    " ",
                    _this.props.items.length)));
        };
        _this.getNumberOfRenders = function() {
            return (React.createElement("tr", {
                    class: "show-on-hover"
                },
                React.createElement("td", null, " Number of renders: "),
                React.createElement("td", null,
                    " ",
                    _this.props.renderCount)));
        };
        _this.getPrerenderMode = function() {
            return (React.createElement("tr", null,
                React.createElement("td", null, " prerenderMode:"),
                React.createElement("td", null,
                    " ",
                    _this.props.isPrerenderMode ? 'On' : 'Off')));
        };
        _this.getTitle = function() {
            return (React.createElement("tr", null,
                React.createElement("td", null, " PG render Indicator")));
        };
        _this.getWorkerLog = function() {
            var _a;
            var log = ((_a = _this.props.workerLog) === null || _a === void 0 ? void 0 : _a.log) ||
                (_this.props.workerLog.length > 0 && _this.props.workerLog) || [];
            return (React.createElement("div", {
                    class: "show-on-hover worker-log"
                },
                React.createElement("table", null,
                    React.createElement("tr", null,
                        React.createElement("td", null, " worker log:"),
                        React.createElement("div", {
                                class: "log-column"
                            },
                            React.createElement("table", null,
                                React.createElement("tr", null,
                                    React.createElement("td", null, log.map(function(entry) {
                                        return (React.createElement("tr", null,
                                            React.createElement("div", {
                                                class: "worker-entry-text",
                                                style: {
                                                    backgroundColor: _this.generateRandomColor2(_this.getTimingFromEntry(entry), _this.getTimingFromEntry(log[log.length - 1])),
                                                }
                                            }, entry)));
                                    })))))))));
        };
        _this.getContainerTable = function() {
            return (React.createElement("tr", {
                    class: "show-on-hover"
                },
                React.createElement("td", null, " container: "),
                React.createElement("td", null,
                    React.createElement("tr", {
                            class: "show-on-hover"
                        },
                        React.createElement("td", null, " width: "),
                        React.createElement("td", null,
                            " ",
                            Math.round(_this.props.container.width),
                            " ")),
                    React.createElement("tr", {
                            class: "show-on-hover"
                        },
                        React.createElement("td", null, " height: "),
                        React.createElement("td", null,
                            " ",
                            Math.round(_this.props.container.height),
                            " ")),
                    React.createElement("tr", {
                            class: "show-on-hover"
                        },
                        React.createElement("td", null, " scrollBase:"),
                        React.createElement("td", null,
                            " ",
                            Math.round(_this.props.container.scrollBase),
                            " ")))));
        };
        _this.getRootClassNames = function() {
            return ("pg-render-indicator" +
                " " +
                ("" + (_this.props.renderedGallery ? 'rendered' : 'not-rendered')));
        };
        _this.createIndicator = function() {
            return (React.createElement("div", {
                    class: _this.getRootClassNames()
                },
                React.createElement("table", null,
                    _this.getTitle(),
                    _this.getPrerenderMode(),
                    _this.getNumberOfRenders(),
                    _this.getItemsData(),
                    _this.getContainerTable()),
                _this.getWorkerLog()));
        };
        return _this;
    }
    RenderStatusIndicator.prototype.shouldUseReactPortal = function() {
        return !utils.isSSR();
    };
    RenderStatusIndicator.prototype.render = function() {
        var indicator = this.createIndicator();
        return this.shouldUseReactPortal() ?
            ReactDOM.createPortal(indicator, window.document.body) :
            indicator;
    };
    return RenderStatusIndicator;
}(React.Component));
export default RenderStatusIndicator;
//# sourceMappingURL=RenderStatusIndicator.js.map