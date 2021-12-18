'use strict'

import {
    Maybe
} from '@wix/wix-code-adt'
import componentTypes from '@wix/dbsm-common/src/componentTypes'

const {
    Repeater
} = componentTypes
// isContainerType :: Type -> Bool
const isContainerType = type => [Repeater].includes(type)

// Component = { id, component, role, children, parent }
// findContainer :: Component -> Maybe Container
const findContainer = component => {
    const parent = Maybe.fromNullable(component).chain(({
            parent
        }) =>
        Maybe.fromNullable(parent),
    )
    const container = parent.filter(({
        type
    }) => isContainerType(type))
    return container.orElse(() => parent.chain(parent => findContainer(parent)))
}

export {
    findContainer
}