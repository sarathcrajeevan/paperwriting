import {
    invoke
} from 'lodash-es'
const performanceIsDefined = typeof performance !== 'undefined' // in node we can't take this var from global scope

export default {
    mark: performanceIsDefined ?
        (...args) => invoke(performance, 'mark', ...args) :
        () => {},

    measure: performanceIsDefined ?
        (...args) => invoke(performance, 'measure', ...args) :
        () => {},
}