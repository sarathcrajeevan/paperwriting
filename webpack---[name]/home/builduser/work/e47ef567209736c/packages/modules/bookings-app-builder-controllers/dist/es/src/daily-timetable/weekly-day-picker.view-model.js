import * as moment from 'moment';
import * as format from 'string-format';
import {
    TimetableClickType,
    TimetableDirection,
    TimetableNavigationType,
} from '../bi-logger/bi.const';
export var DEFAULT_LOCALE = 'en-US';
var WeeklyDayPickerViewModel = /** @class */ (function() {
    function WeeklyDayPickerViewModel(_a) {
        var $widget = _a.$widget,
            $w = _a.$w,
            wixSdkAdapter = _a.wixSdkAdapter,
            onDaySelected = _a.onDaySelected,
            sundayAsFirstDay = _a.sundayAsFirstDay,
            _b = _a.getTranslation,
            getTranslation = _b === void 0 ? function(key) {
                return key;
            } : _b,
            _c = _a.dateRegionalSettingsLocale,
            dateRegionalSettingsLocale = _c === void 0 ? DEFAULT_LOCALE : _c,
            _d = _a.isAlignDateAndTimeEnabled,
            isAlignDateAndTimeEnabled = _d === void 0 ? false : _d,
            _e = _a.isTimetableAccessibilityEnabled,
            isTimetableAccessibilityEnabled = _e === void 0 ? false : _e;
        this.isRtl = false;
        this.sundayAsFirstDay = false;
        this.isMobile = false;
        this.isRendered = false;
        this.getTranslation = getTranslation;
        this.sundayAsFirstDay = sundayAsFirstDay;
        this.$w = $w;
        this.$widget = $widget;
        this.wixSdkAdapter = wixSdkAdapter;
        this.onDaySelected = onDaySelected;
        this.isTimetableAccessibilityEnabled = isTimetableAccessibilityEnabled;
        this.isAlignDateAndTimeEnabled = isAlignDateAndTimeEnabled;
        this.dateRegionalSettingsLocale = dateRegionalSettingsLocale;
        this.initLocalizationInfo();
        this.isMobile = this.wixSdkAdapter.getDeviceType() === 'Mobile';
        this.initListeners();
    }
    WeeklyDayPickerViewModel.prototype.setViewLoaded = function() {
        this.isRendered = true;
    };
    WeeklyDayPickerViewModel.prototype.setSelectedDate = function(selectedDate) {
        var _this = this;
        var startOfSelectedDate = selectedDate.clone().startOf('day');
        if (!this.selectedDate ||
            this.selectedDate.valueOf() !== startOfSelectedDate.valueOf()) {
            this.selectedDate = startOfSelectedDate;
            var startOfWeek_1 = this.getFirstDayOfCurrentWeek();
            var endOfWeek = startOfWeek_1.clone().add(6, 'days').endOf('day');
            this.currentRange = {
                start: startOfWeek_1,
                end: endOfWeek,
            };
            var weekDays = Array(7)
                .fill(null)
                .map(function(_, index) {
                    var date = startOfWeek_1.clone().add(index, 'days');
                    return {
                        _id: "" + date.valueOf(),
                        date: date,
                        isActive: date.valueOf() === _this.selectedDate.valueOf(),
                    };
                });
            this.$w('#daysToolbar').data = this.isRtl ? weekDays.reverse() : weekDays;
            this.$w('#dateRangeLabel').text = this.getFormattedDateRange();
            var isEditorMode = this.wixSdkAdapter.isEditorMode();
            if (startOfWeek_1.isBefore(Date.now()) && !isEditorMode) {
                this.backButton.disable();
            } else {
                this.backButton.enable();
            }
        }
    };
    WeeklyDayPickerViewModel.prototype.hideAllElements = function() {
        this.$w('#dateRangeLabel').collapse();
        this.$w('#daysToolbar').collapse();
        this.leftButton.collapse();
        this.rightButton.collapse();
        this.divider.collapse();
    };
    WeeklyDayPickerViewModel.prototype.showAllElements = function() {
        this.$w('#dateRangeLabel').expand();
        this.$w('#daysToolbar').expand();
        this.leftButton.expand();
        this.rightButton.expand();
        this.divider.expand();
    };
    WeeklyDayPickerViewModel.prototype.initListeners = function() {
        var _this = this;
        this.backButton.onClick(function() {
            _this.onDayClicked(_this.getFirstDayOfCurrentWeek().add(-7, 'days'), {
                type: TimetableClickType.ARROW,
                direction: TimetableDirection.BACKWARD,
                navType: TimetableNavigationType.WEEK,
            });
        });
        this.forwardButton.onClick(function() {
            _this.onDayClicked(_this.getFirstDayOfCurrentWeek().add(7, 'days'), {
                type: TimetableClickType.ARROW,
                direction: TimetableDirection.FORWARD,
                navType: TimetableNavigationType.WEEK,
            });
        });
        this.initDaysRepeaterListeners();
    };
    WeeklyDayPickerViewModel.prototype.getAriaLabelForDay = function(date) {
        return date
            .toDate()
            .toLocaleDateString(this.wixSdkAdapter.getRegionalSettings(), {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
    };
    WeeklyDayPickerViewModel.prototype.initDaysRepeaterListeners = function() {
        var _this = this;
        this.daysRepeater.onItemReady(function($item, itemData, index) {
            $item('#day').text = _this.getFormattedDayOfTheWeek(itemData.date);
            var dayButton = _this.getDayButton($item);
            dayButton.label = _this.getFormattedDateForWeekDay(itemData.date);
            if (_this.isTimetableAccessibilityEnabled && (dayButton === null || dayButton === void 0 ? void 0 : dayButton.accessibility)) {
                // todo: until thunderbolt is completely merged we need to check dayButton?.accessibility
                dayButton.accessibility.ariaLabel = _this.getAriaLabelForDay(itemData.date);
            }
            dayButton.onClick(function() {
                _this.onDayClicked(itemData.date, {
                    type: TimetableClickType.DATE,
                    direction: TimetableDirection.NA,
                    navType: TimetableNavigationType.DAY,
                });
            });
            _this.setItemsEnabledState(itemData, dayButton);
        });
    };
    WeeklyDayPickerViewModel.prototype.getDayButton = function($item) {
        return $item('#dayPickerButton');
    };
    Object.defineProperty(WeeklyDayPickerViewModel.prototype, "daysRepeater", {
        get: function() {
            return this.$w('#daysToolbar');
        },
        enumerable: false,
        configurable: true
    });
    WeeklyDayPickerViewModel.prototype.setItemsEnabledState = function(itemData, dayButton) {
        if (this.shouldDayItemBeSelected(itemData)) {
            this.setSelectedItem(dayButton);
        } else if (this.shouldDayItemBeDisabled(itemData)) {
            this.setDisabledItem(dayButton);
        } else {
            dayButton.enable();
        }
    };
    WeeklyDayPickerViewModel.prototype.setSelectedItem = function(dayButton) {
        // Since there is no selected state at the moment, we use disabled as "selected"
        dayButton.disable();
    };
    WeeklyDayPickerViewModel.prototype.setDisabledItem = function(dayButton) {
        // Since there is no selected state at the moment, we use disabled as "selected", so disabled acts as enabled
        // dayButton.disable();
        dayButton.enable();
    };
    WeeklyDayPickerViewModel.prototype.shouldDayItemBeSelected = function(itemData) {
        return itemData.isActive;
    };
    WeeklyDayPickerViewModel.prototype.shouldDayItemBeDisabled = function(itemData) {
        return itemData.date.clone().endOf('day') < Date.now();
    };
    WeeklyDayPickerViewModel.prototype.getFormattedDateForWeekDay = function(date) {
        return date
            .toDate()
            .toLocaleDateString(this.wixSdkAdapter.getRegionalSettings(), {
                day: 'numeric',
            });
    };
    WeeklyDayPickerViewModel.prototype.getFormattedDateForCalendarHeader = function(date) {
        var formattedDateTime = new Date(moment(date).format('YYYY-MM-DDTHH:mm:ss'));
        var formatOptions = {
            day: 'numeric',
            month: 'long',
        };
        var dateTimeFormat = new Intl.DateTimeFormat(this.dateRegionalSettingsLocale, formatOptions);
        return this.isAlignDateAndTimeEnabled ?
            dateTimeFormat.format(formattedDateTime) :
            date
            .toDate()
            .toLocaleDateString(this.wixSdkAdapter.getCurrentLanguage(), {
                day: 'numeric',
                month: 'short',
            });
    };
    WeeklyDayPickerViewModel.prototype.getDayAsDate = function(date) {
        var dayOfTheWeek = date.day();
        var someSunday = new Date(Date.parse('15 Mar 2020'));
        var newDate = new Date(someSunday);
        newDate.setHours(24 * dayOfTheWeek);
        return newDate;
    };
    WeeklyDayPickerViewModel.prototype.getFormattedDayOfTheWeek = function(date) {
        return this.getDayAsDate(date)
            .toLocaleDateString(this.wixSdkAdapter.getCurrentLanguage(), {
                weekday: this.isMobile ? 'narrow' : 'short',
            })
            .toLocaleUpperCase();
    };
    WeeklyDayPickerViewModel.prototype.getFormattedDateRange = function() {
        return format(this.getTranslation('bookings.daily-timetable.header.date-range-format') || '{0} - {1}', this.getFormattedDateForCalendarHeader(this.currentRange.start), this.getFormattedDateForCalendarHeader(this.currentRange.end));
    };
    WeeklyDayPickerViewModel.prototype.initLocalizationInfo = function() {
        this.isRtl = this.wixSdkAdapter.isViewDirectionRtl();
        this.backButton = this.isRtl ? this.rightButton : this.leftButton;
        this.forwardButton = this.isRtl ? this.leftButton : this.rightButton;
    };
    WeeklyDayPickerViewModel.prototype.getFirstDayOfCurrentWeek = function() {
        return this.selectedDate
            .clone()
            .startOf(this.sundayAsFirstDay ? 'week' : 'isoWeek');
    };
    Object.defineProperty(WeeklyDayPickerViewModel.prototype, "rightButton", {
        get: function() {
            return this.$w('#rightButton');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WeeklyDayPickerViewModel.prototype, "leftButton", {
        get: function() {
            return this.$w('#leftButton');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WeeklyDayPickerViewModel.prototype, "divider", {
        get: function() {
            return this.$w('#daysToolbarDivider');
        },
        enumerable: false,
        configurable: true
    });
    WeeklyDayPickerViewModel.prototype.onDayClicked = function(selectedDate, navInfo) {
        var _this = this;
        this.setSelectedDate(selectedDate);
        this.onDaySelected(this.selectedDate, navInfo);
        this.daysRepeater.forEachItem(function($item, itemData, index) {
            var dayButton = _this.getDayButton($item);
            _this.setItemsEnabledState(itemData, dayButton);
        });
    };
    return WeeklyDayPickerViewModel;
}());
export {
    WeeklyDayPickerViewModel
};
//# sourceMappingURL=weekly-day-picker.view-model.js.map