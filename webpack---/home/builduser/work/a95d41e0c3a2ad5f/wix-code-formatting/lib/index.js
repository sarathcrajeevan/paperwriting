"use strict";

var _dataFormattingOption;

function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}

function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
            ownKeys(Object(source), true).forEach(function(key) {
                _defineProperty(target, key, source[key]);
            });
        } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
            ownKeys(Object(source)).forEach(function(key) {
                Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
            });
        }
    }
    return target;
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

var dateFormats = {
    SHORT_DATE: 'SHORT_DATE',
    MEDIUM_DATE: 'MEDIUM_DATE',
    LONG_DATE: 'LONG_DATE',
    FULL_DATE: 'FULL_DATE',
    SHORT_DATE_TIME: 'SHORT_DATE_TIME',
    LONG_DATE_TIME: 'LONG_DATE_TIME',
    FULL_DATE_TIME: 'FULL_DATE_TIME',
    MEDIUM_TIME_12: 'MEDIUM_TIME_12',
    MEDIUM_TIME_24: 'MEDIUM_TIME_24',
    LONG_TIME_12: 'LONG_TIME_12',
    LONG_TIME_24: 'LONG_TIME_24',
    HOUR_ONLY: 'HOUR_ONLY',
    MINUTE_ONLY: 'MINUTE_ONLY',
    YEAR_ONLY: 'YEAR_ONLY',
    MONTH_ONLY: 'MONTH_ONLY',
    SHORT_MONTH_ONLY: 'SHORT_MONTH_ONLY',
    DAY_ONLY: 'DAY_ONLY'
};
var dataFormattingOptions = (_dataFormattingOption = {}, _defineProperty(_dataFormattingOption, dateFormats.SHORT_DATE, {
    day: 'numeric',
    month: 'numeric',
    year: '2-digit'
}), _defineProperty(_dataFormattingOption, dateFormats.MEDIUM_DATE, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
}), _defineProperty(_dataFormattingOption, dateFormats.LONG_DATE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
}), _defineProperty(_dataFormattingOption, dateFormats.FULL_DATE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long'
}), _defineProperty(_dataFormattingOption, dateFormats.SHORT_DATE_TIME, {
    day: 'numeric',
    month: 'numeric',
    year: '2-digit',
    hour: 'numeric',
    minute: 'numeric'
}), _defineProperty(_dataFormattingOption, dateFormats.LONG_DATE_TIME, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
}), _defineProperty(_dataFormattingOption, dateFormats.FULL_DATE_TIME, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    weekday: 'long',
    timeZoneName: 'short'
}), _defineProperty(_dataFormattingOption, dateFormats.MEDIUM_TIME_12, {
    minute: 'numeric',
    hour: 'numeric'
}), _defineProperty(_dataFormattingOption, dateFormats.MEDIUM_TIME_24, {
    minute: 'numeric',
    hour: 'numeric',
    hour12: false
}), _defineProperty(_dataFormattingOption, dateFormats.LONG_TIME_12, {
    minute: 'numeric',
    hour: 'numeric',
    second: 'numeric'
}), _defineProperty(_dataFormattingOption, dateFormats.LONG_TIME_24, {
    minute: 'numeric',
    hour: 'numeric',
    second: 'numeric',
    hour12: false
}), _defineProperty(_dataFormattingOption, dateFormats.HOUR_ONLY, {
    hour: 'numeric'
}), _defineProperty(_dataFormattingOption, dateFormats.MINUTE_ONLY, {
    minute: 'numeric'
}), _defineProperty(_dataFormattingOption, dateFormats.YEAR_ONLY, {
    year: 'numeric'
}), _defineProperty(_dataFormattingOption, dateFormats.MONTH_ONLY, {
    month: 'long'
}), _defineProperty(_dataFormattingOption, dateFormats.SHORT_MONTH_ONLY, {
    month: 'short'
}), _defineProperty(_dataFormattingOption, dateFormats.DAY_ONLY, {
    weekday: 'long'
}), _dataFormattingOption);

module.exports = function() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        locale = _ref.locale,
        timeZone = _ref.timeZone;

    if (!locale) {
        throw new Error('A "locale" parameter is required for wixFormatting');
    }

    return {
        formatDateTime: function formatDateTime(date, format) {
            var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                localeOverride = _ref2.locale,
                timeZoneOverride = _ref2.timeZone;

            var options = _objectSpread(_objectSpread({}, dataFormattingOptions[format]), {}, {
                timeZone: timeZoneOverride || timeZone
            });

            return new Intl.DateTimeFormat(localeOverride || locale, options).format(date);
        },
        dateFormats: dateFormats
    };
};

module.exports.dateFormats = dateFormats;