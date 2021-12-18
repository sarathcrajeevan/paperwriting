import {
    __assign,
    __extends
} from "tslib";
import React from 'react';
import {
    ProGalleryRenderer
} from 'pro-gallery';
var ProGalleryFullscreenMock = /** @class */ (function(_super) {
    __extends(ProGalleryFullscreenMock, _super);

    function ProGalleryFullscreenMock() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProGalleryFullscreenMock.prototype.getInfoRenderer = function(pgItemProps) {
        var title = pgItemProps.title,
            description = pgItemProps.description;
        return (React.createElement("div", null,
            React.createElement("div", {
                className: "item-title"
            }, title),
            React.createElement("div", {
                className: "item-description"
            }, description)));
    };
    ProGalleryFullscreenMock.prototype.render = function() {
        var blueprint = this.props.directFullscreenMockBlueprint.blueprint;
        return (React.createElement(ProGalleryRenderer, __assign({}, this.props, blueprint, {
            customSlideshowInfoRenderer: this.getInfoRenderer
        })));
    };
    return ProGalleryFullscreenMock;
}(React.Component));
export default ProGalleryFullscreenMock;
//# sourceMappingURL=ProGalleryFullscreenMock.js.map