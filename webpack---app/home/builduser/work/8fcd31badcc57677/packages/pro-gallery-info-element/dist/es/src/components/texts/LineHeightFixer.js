function _createForOfIteratorHelperLoose(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (it) return (it = it.call(o)).next.bind(it);
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;
        return function() {
            if (i >= o.length) return {
                done: true
            };
            return {
                done: false,
                value: o[i++]
            };
        };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
    }
    return arr2;
}

import {
    GALLERY_CONSTS
} from 'pro-gallery-lib';
import {
    window
} from '@wix/photography-client-lib';
import designConsts from '../../common/constants/designConsts';
var minWidthToShowContent = 135;
var minWithForNormalSizedItem = 190;

var LineHeightFixer = /*#__PURE__*/ function() {
    function LineHeightFixer() {}

    var _proto = LineHeightFixer.prototype;

    _proto.getDimensions = function getDimensions(element) {
        var cs = window.getComputedStyle(element);
        var paddingY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
        var paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
        var borderX = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
        var borderY = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
        return {
            width: element.clientWidth - paddingX - borderX,
            height: element.clientHeight - paddingY - borderY
        };
    };

    _proto.saveCurrentDisplay = function saveCurrentDisplay(element) {
        if (!element) return;
        var curDisplay = this.getCss(element, 'display');

        if (curDisplay !== 'none') {
            element.setAttribute('data-display', this.getCss(element, 'display'));
        }
    };

    _proto.getSavedDisplay = function getSavedDisplay(element) {
        return element && element.getAttribute('data-display') || '-webkit-box';
    };

    _proto.removeElement = function removeElement(element) {
        this.saveCurrentDisplay(element);
        this.setCss(element, {
            display: 'none'
        });
    };

    _proto.hideElement = function hideElement(element, shouldOverrideDisplay) {
        if (shouldOverrideDisplay === void 0) {
            shouldOverrideDisplay = true;
        }

        if (element) {
            if (shouldOverrideDisplay) {
                var display = this.getSavedDisplay(element);
                this.setCss(element, {
                    visibility: 'hidden',
                    display: display
                });
            } else {
                this.setCss(element, {
                    visibility: 'hidden'
                });
            }
        }
    };

    _proto.showElement = function showElement(element, shouldOverrideDisplay) {
        if (shouldOverrideDisplay === void 0) {
            shouldOverrideDisplay = true;
        }

        if (shouldOverrideDisplay) {
            var display = this.getSavedDisplay(element);
            this.setCss(element, {
                visibility: 'inherit',
                display: display
            });
        } else {
            this.setCss(element, {
                visibility: 'inherit'
            });
        }
    };

    _proto.getCss = function getCss(element, rule, _default) {
        return window.getComputedStyle(element)[rule] || _default;
    };

    _proto.setCss = function setCss(element, styles) {
        try {
            Object.assign(element.style, styles);
        } catch (e) { //
        }
    };

    _proto.shouldFix = function shouldFix(oldProps, newProps) {
        var options = oldProps.options,
            title = oldProps.title,
            description = oldProps.description,
            style = oldProps.style,
            externalTotalInfoHeight = oldProps.externalTotalInfoHeight;
        var newOptions = newProps.options;
        var newTitle = newProps.title;
        var newDescription = newProps.description;
        var newStyle = newProps.style;
        var newExternalTotalInfoHeight = newProps.externalTotalInfoHeight;
        var newIsSocialPopulated = newOptions.allowSocial || newOptions.loveButton || newOptions.allowDownload;
        var oldIsSocialPopulated = options.allowSocial || options.loveButton || options.allowDownload;
        return style.height !== newStyle.height || externalTotalInfoHeight !== newExternalTotalInfoHeight || style.width !== newStyle.width || GALLERY_CONSTS.isLayout('SLIDESHOW')(options) !== GALLERY_CONSTS.isLayout('SLIDESHOW')(newOptions) || options.allowTitle !== newOptions.allowTitle || options.allowDescription !== newOptions.allowDescription || options.slideshowInfoSize !== newOptions.slideshowInfoSize || options.textImageSpace !== newOptions.textImageSpace || options.textsVerticalPadding !== newOptions.textsVerticalPadding || options.textsHorizontalPadding !== newOptions.textsHorizontalPadding || options.titleDescriptionSpace !== newOptions.titleDescriptionSpace || options.imageInfoType !== newOptions.imageInfoType || options.itemDescriptionFont !== newOptions.itemDescriptionFont || options.calculateTextBoxHeightMode !== newOptions.calculateTextBoxHeightMode || options.itemFont !== newOptions.itemFont || oldIsSocialPopulated !== newIsSocialPopulated || title !== newTitle || description !== newDescription;
    };

    _proto.calcAvailableHeight = function calcAvailableHeight(props, textsContainerAvailableHeight) {
        var options = props.options,
            infoContainer = props.infoContainer;
        var availableHeight;

        if (GALLERY_CONSTS.isLayout('SLIDESHOW')(options)) {
            var socialElements = infoContainer.getElementsByClassName('info-element-social');
            var socialElement = socialElements.length > 0 && socialElements[0];
            var socialHeight = 0;
            var socialMarginBottom = 0;

            if (socialElement) {
                socialHeight = socialElement.clientHeight;
                socialMarginBottom = parseInt(this.getCss(socialElement, 'margin-bottom', 0));
            } else {
                var socialIsPopulated = options.allowSocial || options.loveButton || options.allowDownload;

                if (socialIsPopulated) {
                    // no socialElement at the moment (in SSR we render only TextInfoElement), but should be (will be in CSR, when we will render InfoElement)
                    socialHeight = 24; // height of info-element-social

                    socialMarginBottom = 24; // margin-bottom of info-element-social populated-item
                }
            }

            var itemInfoChildDivPaddingTop = 24; // padding-top of slideshow-info-element-inner

            availableHeight = options.slideshowInfoSize - itemInfoChildDivPaddingTop - socialHeight - socialMarginBottom;
        } else {
            availableHeight = textsContainerAvailableHeight;
        }

        return availableHeight;
    };

    _proto.fix = function fix(props, textsContainer) {
        var options = props.options,
            title = props.title,
            description = props.description;

        if (!textsContainer || GALLERY_CONSTS.isLayout('SLIDESHOW')(options) && !props.infoContainer // calcAvailableHeight when slideshow is using infoContainer
        ) {
            return;
        }

        for (var _iterator = _createForOfIteratorHelperLoose(options.titlePlacement.split(',')), _step; !(_step = _iterator()).done;) {
            var placement = _step.value;
            var textPlacementRightOrLeft = GALLERY_CONSTS.hasExternalHorizontalPlacement(placement);
            var textPlacementAboveOrBelow = GALLERY_CONSTS.hasExternalVerticalPlacement(placement);
            var availableDimensions = this.getDimensions(textsContainer);
            var availableHeight = this.calcAvailableHeight(props, availableDimensions.height);
            var customButtonElements = textsContainer.getElementsByClassName('info-element-custom-button-wrapper');
            var titleElements = textsContainer.getElementsByClassName('info-element-title');
            var descriptionElements = textsContainer.getElementsByClassName('info-element-description');
            var customButtonExists = customButtonElements.length > 0;
            var customButtonElement = customButtonExists && customButtonElements[0];
            var titleElement = titleElements.length > 0 && titleElements[0];
            var descriptionElement = descriptionElements.length > 0 && descriptionElements[0];
            var isItemWidthToSmall = availableDimensions.width < minWidthToShowContent;
            this.hideElement(titleElement);
            this.setCss(titleElement, {
                overflow: 'hidden'
            });
            this.hideElement(descriptionElement, !(textPlacementAboveOrBelow || textPlacementRightOrLeft)); // if textPlacementAboveOrBelow or textPlacementRightOrLeft, descriptionElement should not get 'display: -webkit-box'

            this.setCss(descriptionElement, {
                overflow: 'hidden'
            });
            this.hideElement(customButtonElement, false); // customButtonElement should not get 'display: -webkit-box'

            if (customButtonExists) {
                var buttonHeight = this.getDimensions(customButtonElement).height;

                if (Number.isNaN(buttonHeight) || availableHeight + 30 < buttonHeight) {
                    this.removeElement(customButtonElement);
                    customButtonExists = false;
                } else if (isItemWidthToSmall) {
                    this.setCss(customButtonElement.querySelector('button'), {
                        'min-width': 0 + 'px',
                        'max-width': minWidthToShowContent + 'px'
                    });
                    this.showElement(customButtonElement, false); // customButtonElement should not get 'display: -webkit-box'
                } else if (availableDimensions.width < minWithForNormalSizedItem) {
                    this.setCss(customButtonElement.querySelector('button'), {
                        'min-width': minWidthToShowContent + 'px',
                        'max-width': availableDimensions.width + 'px'
                    });
                    this.showElement(customButtonElement, false); // customButtonElement should not get 'display: -webkit-box'
                } else {
                    // show the button without any additional changes
                    this.showElement(customButtonElement, false); // customButtonElement should not get 'display: -webkit-box'
                }

                if (customButtonExists) {
                    availableHeight -= buttonHeight;
                    availableHeight -= designConsts.spaceBetweenElements;

                    if (availableHeight < 0) {
                        availableHeight = 0;
                    }
                }
            }

            var titleNumOfAvailableLines = 0;
            var shouldDisplayTitle = titleElement && title && options.allowTitle;

            if (shouldDisplayTitle) {
                this.setCss(titleElement, {
                    overflow: 'visible'
                });

                if (titleElements.length === 1) {
                    var titleHeight = // when padding is large and the we decrease padding the clientHeight stay small
                        parseInt(titleElement.children[0].offsetHeight) > parseInt(titleElement.clientHeight) ? parseInt(titleElement.children[0].offsetHeight) : parseInt(titleElement.clientHeight);
                    var titleLineHeight = parseInt(this.getCss(titleElement, 'line-height', 1));
                    var numOfTitleLines = 1;

                    if (titleHeight >= titleLineHeight) {
                        numOfTitleLines = Math.floor(titleHeight / titleLineHeight);
                    }

                    titleNumOfAvailableLines = Math.floor(availableHeight / titleLineHeight);

                    if (titleNumOfAvailableLines === 0) {
                        this.removeElement(titleElement);
                    } else {
                        this.setCss(titleElement, {
                            overflow: 'hidden'
                        });
                        this.showElement(titleElement);
                        var isTitleFitInAvailableHeight = titleNumOfAvailableLines >= numOfTitleLines;

                        if (isTitleFitInAvailableHeight) {
                            this.setCss(titleElement, {
                                '-webkit-line-clamp': 'none'
                            });
                            titleHeight = titleLineHeight * numOfTitleLines;
                        } else {
                            this.setCss(titleElement, {
                                '-webkit-line-clamp': titleNumOfAvailableLines + ''
                            });
                            titleHeight = titleLineHeight * titleNumOfAvailableLines;
                        }

                        var isThereAnyAvailableHeightLeft = availableHeight > titleHeight;

                        if (isThereAnyAvailableHeightLeft) {
                            availableHeight -= titleHeight;
                        } else {
                            availableHeight = 0;
                        }
                    }
                }
            }

            var shouldDisplayDescription = descriptionElement && description && options.allowDescription && availableHeight > 0 && (shouldDisplayTitle && titleNumOfAvailableLines > 0 || !shouldDisplayTitle); // when there s no place for title the description not suppose to be shown

            if (shouldDisplayDescription) {
                this.setCss(descriptionElement, {
                    overflow: 'visible'
                });

                if (shouldDisplayTitle) {
                    availableHeight -= options.titleDescriptionSpace;
                }

                if (availableHeight < 0) {
                    availableHeight = 0;
                }

                var lineHeight = parseInt(this.getCss(descriptionElement, 'line-height', 1));
                var numOfLines = Math.floor(availableHeight / lineHeight);

                if (numOfLines === 0) {
                    this.removeElement(descriptionElement);
                    this.setCss(titleElement, {
                        marginBottom: designConsts.spaceBetweenElements + 'px'
                    });
                } else {
                    this.setCss(descriptionElement, {
                        overflow: 'hidden',
                        '-webkit-line-clamp': numOfLines + ''
                    });
                    this.showElement(descriptionElement, !(textPlacementAboveOrBelow || textPlacementRightOrLeft)); // if textPlacementAboveOrBelow or textPlacementRightOrLeft, descriptionElement should not get 'display: -webkit-box'
                }
            }
        }
    };

    return LineHeightFixer;
}();

export default new LineHeightFixer();