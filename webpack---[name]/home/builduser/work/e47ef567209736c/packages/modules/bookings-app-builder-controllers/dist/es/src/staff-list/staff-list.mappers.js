import {
    __assign
} from "tslib";
import {
    FilterTypeOptions,
    StaffWidgetSettingsKeys,
} from '@wix/bookings-app-builder-settings-const/dist/src/StaffWidget/Settings.const';
export function staffDtoToStaffToDisplay(staffDto) {
    var _a, _b;
    return {
        email: staffDto.resource.email,
        name: staffDto.resource.name,
        phone: staffDto.resource.phone,
        description: staffDto.resource.description,
        _id: staffDto.resource.id,
        image: (_a = staffDto.resource.images) === null || _a === void 0 ? void 0 : _a[0],
        slug: staffDto.slugs && ((_b = staffDto.slugs[0]) === null || _b === void 0 ? void 0 : _b.name),
    };
}

function mergeStaff(staffOption, unfilteredStaffListMap) {
    return __assign(__assign({}, unfilteredStaffListMap.get(staffOption.id)), {
        overridePageId: staffOption.overridePageId
    });
}

function arrayToMap(array) {
    return new Map(array.map(function(currentValue) {
        return [currentValue._id, currentValue];
    }));
}
var shouldFilterAndOrderStaffList = function(orderedStaffOptions) {
    return orderedStaffOptions && orderedStaffOptions.length;
};
var shouldDisplayAllStaff = function(staffListSettingsFilter) {
    return staffListSettingsFilter === FilterTypeOptions.ALL;
};
export function getStaffListToDisplay(staffListDto, staffListWidgetSettings) {
    if (staffListWidgetSettings === void 0) {
        staffListWidgetSettings = {};
    }
    var unfilteredStaffList = staffListDto.map(staffDtoToStaffToDisplay);
    var filteredAndOrderedStaffList = unfilteredStaffList;
    var orderedStaffOptions = staffListWidgetSettings[StaffWidgetSettingsKeys.ORDERED_STAFF_OPTIONS];
    var staffListFilter = staffListWidgetSettings[StaffWidgetSettingsKeys.FILTER_TYPE];
    if (shouldFilterAndOrderStaffList(orderedStaffOptions)) {
        var unfilteredStaffListAsMap_1 = arrayToMap(unfilteredStaffList);
        filteredAndOrderedStaffList = orderedStaffOptions
            .filter(function(staffOption) {
                return !staffOption.hidden && unfilteredStaffListAsMap_1.get(staffOption.id);
            })
            .map(function(staffOption) {
                return mergeStaff(staffOption, unfilteredStaffListAsMap_1);
            });
        if (shouldDisplayAllStaff(staffListFilter)) {
            var filteredAndOrderedStaffListAsMap_1 = arrayToMap(filteredAndOrderedStaffList);
            var missingStaff = unfilteredStaffList.filter(function(staff) {
                return !filteredAndOrderedStaffListAsMap_1.get(staff._id);
            });
            filteredAndOrderedStaffList.push.apply(filteredAndOrderedStaffList, missingStaff);
        }
    }
    return filteredAndOrderedStaffList;
}
//# sourceMappingURL=staff-list.mappers.js.map