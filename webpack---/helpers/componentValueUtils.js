import componentTypes from '@wix/dbsm-common/src/componentTypes'

const {
    Checkbox: checkboxSdkType,
    Dropdown: dropdownSdkType
} = componentTypes

export const getComponentValueAccessorName = component => {
    switch (component.type) {
        case checkboxSdkType:
            return 'checked'
        default:
            return 'value'
    }
}

export const getComponentDefaultValue = component => {
    switch (component.type) {
        case checkboxSdkType:
            return false
        case dropdownSdkType:
            return ''
        default:
            return null
    }
}