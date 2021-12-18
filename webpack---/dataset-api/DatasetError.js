'use strict'

import {
    UserError
} from '../logger'
const ERROR_TYPE = 'DatasetError'

class DatasetError extends UserError {
    constructor(code, message) {
        super(message)
        this.name = ERROR_TYPE
        this.code = code
    }
}
export default DatasetError