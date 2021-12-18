'use strict'

import ExtendableError from 'es6-error'
import {
    setErrorScope,
    errorBoundaryScopes
} from './errorBoundaries'

class UserError extends ExtendableError {
    constructor(message) {
        super(message)
        setErrorScope(this, errorBoundaryScopes.USER_SCOPE)
    }
}
export default UserError