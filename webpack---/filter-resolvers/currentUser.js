'use strict'

import {
    Maybe
} from '@wix/wix-code-adt'

const currentUserFilterResolver = wixCodeSdk => () =>
    Maybe.fromNullable(wixCodeSdk.user.currentUser).map(({
            id,
            loggedIn
        }) =>
        loggedIn ? id : null,
    )

export default currentUserFilterResolver