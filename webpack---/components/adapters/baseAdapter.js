'use strict'

export default {
    isValidContext() {
        return true
    },

    hideComponent({
        component
    }, {
        rememberInitiallyHidden = false
    } = {}) {
        if (typeof component.hide !== 'function') return
        if (!component.hidden) {
            component.hide()
        } else if (rememberInitiallyHidden) {
            this.initiallyHidden = true
        }
    },

    showComponent({
        component
    }, {
        ignoreInitiallyHidden = false
    } = {}) {
        if (component.hidden && (!ignoreInitiallyHidden || !this.initiallyHidden)) {
            component.show()
        }
    },

    clearComponent() {},

    bindToComponent() {},

    currentRecordModified() {},

    recordSetLoaded() {},

    currentViewChanged() {},

    currentIndexChanged() {},
}