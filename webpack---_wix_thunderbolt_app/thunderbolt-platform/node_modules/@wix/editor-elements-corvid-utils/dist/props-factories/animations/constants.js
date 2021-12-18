var __assign = (this && this.__assign) || function() {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
export var sharedEffectDefaultOptions = {
    duration: 1200,
    delay: 0,
};
export var effectDefaultOptions = {
    arc: __assign(__assign({}, sharedEffectDefaultOptions), {
        direction: 'left'
    }),
    bounce: __assign(__assign({}, sharedEffectDefaultOptions), {
        direction: 'topLeft',
        intensity: 'medium'
    }),
    puff: __assign({}, sharedEffectDefaultOptions),
    zoom: __assign({}, sharedEffectDefaultOptions),
    fade: __assign({}, sharedEffectDefaultOptions),
    flip: __assign(__assign({}, sharedEffectDefaultOptions), {
        direction: 'right'
    }),
    float: __assign(__assign({}, sharedEffectDefaultOptions), {
        direction: 'right'
    }),
    fly: __assign(__assign({}, sharedEffectDefaultOptions), {
        direction: 'right'
    }),
    fold: __assign(__assign({}, sharedEffectDefaultOptions), {
        direction: 'left'
    }),
    glide: __assign(__assign({}, sharedEffectDefaultOptions), {
        angle: 0,
        distance: 0
    }),
    roll: __assign(__assign({}, sharedEffectDefaultOptions), {
        direction: 'left'
    }),
    slide: __assign(__assign({}, sharedEffectDefaultOptions), {
        direction: 'left'
    }),
    spin: __assign(__assign({}, sharedEffectDefaultOptions), {
        direction: 'cw',
        cycles: 5
    }),
    turn: __assign(__assign({}, sharedEffectDefaultOptions), {
        direction: 'right'
    }),
    ArcIn: __assign(__assign({}, sharedEffectDefaultOptions), {
        direction: 'right'
    }),
    ArcOut: __assign(__assign({}, sharedEffectDefaultOptions), {
        direction: 'right'
    }),
    BounceIn: __assign(__assign({}, sharedEffectDefaultOptions), {
        direction: 'topLeft',
        intensity: 'medium'
    }),
    BounceOut: __assign(__assign({}, sharedEffectDefaultOptions), {
        direction: 'topLeft',
        intensity: 'medium'
    }),
    ExpandIn: __assign(__assign({}, sharedEffectDefaultOptions), {
        direction: 'right'
    }),
    CollapseOut: __assign({}, sharedEffectDefaultOptions),
    Conceal: __assign(__assign({}, sharedEffectDefaultOptions), {
        direction: 'right'
    }),
    Reveal: __assign(__assign({}, sharedEffectDefaultOptions), {
        direction: 'left'
    }),
    FadeIn: __assign({}, sharedEffectDefaultOptions),
    FadeOut: __assign({}, sharedEffectDefaultOptions),
    FlipIn: __assign(__assign({}, sharedEffectDefaultOptions), {
        direction: 'left'
    }),
    FlipOut: __assign(__assign({}, sharedEffectDefaultOptions), {
        direction: 'left'
    }),
    FloatIn: __assign(__assign({}, sharedEffectDefaultOptions), {
        direction: 'right'
    }),
    FloatOut: __assign(__assign({}, sharedEffectDefaultOptions), {
        direction: 'right'
    }),
    FlyIn: __assign(__assign({}, sharedEffectDefaultOptions), {
        direction: 'right'
    }),
    FlyOut: __assign(__assign({}, sharedEffectDefaultOptions), {
        direction: 'right'
    }),
    FoldIn: __assign(__assign({}, sharedEffectDefaultOptions), {
        direction: 'left'
    }),
    FoldOut: __assign(__assign({}, sharedEffectDefaultOptions), {
        direction: 'left'
    }),
    GlideIn: __assign(__assign({}, sharedEffectDefaultOptions), {
        angle: 0,
        distance: 150
    }),
    GlideOut: __assign(__assign({}, sharedEffectDefaultOptions), {
        angle: 0,
        distance: 150
    }),
    DropIn: __assign({}, sharedEffectDefaultOptions),
    PopOut: __assign({}, sharedEffectDefaultOptions),
    SlideIn: __assign(__assign({}, sharedEffectDefaultOptions), {
        direction: 'left'
    }),
    SlideOut: __assign(__assign({}, sharedEffectDefaultOptions), {
        direction: 'left'
    }),
    SpinIn: __assign(__assign({}, sharedEffectDefaultOptions), {
        direction: 'cw',
        cycles: 2
    }),
    SpinOut: __assign(__assign({}, sharedEffectDefaultOptions), {
        direction: 'cw',
        cycles: 2
    }),
    TurnIn: __assign(__assign({}, sharedEffectDefaultOptions), {
        direction: 'right'
    }),
    TurnOut: __assign(__assign({}, sharedEffectDefaultOptions), {
        direction: 'right'
    }),
};
export var EFFECTS = {
    HIDE: {
        suffix: 'out',
        deprecatedValues: [
            'ArcOut',
            'BounceOut',
            'CollapseOut',
            'Conceal',
            'FadeOut',
            'FlipOut',
            'FloatOut',
            'FlyOut',
            'FoldOut',
            'GlideOut',
            'PopOut',
            'SlideOut',
            'SpinOut',
            'TurnOut',
        ],
    },
    SHOW: {
        suffix: 'in',
        deprecatedValues: [
            'ArcIn',
            'BounceIn',
            'DropIn',
            'ExpandIn',
            'FadeIn',
            'FlipIn',
            'FloatIn',
            'FlyIn',
            'FoldIn',
            'GlideIn',
            'Reveal',
            'SlideIn',
            'SpinIn',
            'TurnIn',
        ],
    },
};
export var effectInfoLink = function(propertyName) {
    return "https://www.wix.com/corvid/reference/$w/hiddenmixin/" + propertyName;
};
//# sourceMappingURL=constants.js.map