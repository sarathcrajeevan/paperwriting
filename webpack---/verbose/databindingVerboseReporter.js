'use strict'

import {
    Maybe
} from '@wix/wix-code-adt'

const serializeMessage = (
        compPresentation,
        collectionName,
        bindingDescription,
    ) =>
    JSON.stringify({
        compPresentation,
        collectionName,
        bindingDescription,
    })

const getComponentDescription = component =>
    component.id ? `#${component.id}` : component.type

const getComponentPresentation = (component, parentNickname) => {
    const compDescription = getComponentDescription(component)
    return parentNickname ?
        `#${parentNickname}.${compDescription}` :
        compDescription
}

const getBindingMsg = (
        compponentPresentation,
        collectionName,
        bindingDescription,
    ) =>
    bindingDescription ?
    `[Dataset - Connected] '${collectionName}' collection to element '${compponentPresentation}':` :
    `[Dataset - Connected] '${collectionName}' collection to element '${compponentPresentation}'`

const getValueMsg = (compponentPresentation, collectionName, parentId) =>
    `[Dataset - Populated] '${collectionName}' collection into element '${compponentPresentation}':`

export default (verboseReporter, shouldVerbose) => {
    const loggedMessages = new Set([])

    return (collectionName, parentId) => {
        if (!shouldVerbose) {
            return {
                logBinding: () => {},
                logValue: () => {},
            }
        }

        const logBinding = ({
            component,
            bindingDescription
        }) => {
            const componentPresentation = getComponentPresentation(
                component,
                parentId,
            )
            const serializedMessage = serializeMessage(
                componentPresentation,
                collectionName,
                bindingDescription,
            )

            if (!loggedMessages.has(serializedMessage)) {
                loggedMessages.add(serializedMessage)

                const bindingMsg = getBindingMsg(
                    componentPresentation,
                    collectionName,
                    bindingDescription,
                )

                Maybe.fromNullable(bindingDescription).fold(
                    () => verboseReporter(bindingMsg),
                    () => verboseReporter(bindingMsg, bindingDescription),
                )
            }
        }

        const logValue = ({
            component,
            valueDescription
        }) => {
            const componentPresentation = getComponentPresentation(
                component,
                parentId,
            )
            const valueMsg = getValueMsg(
                componentPresentation,
                collectionName,
                parentId,
            )

            verboseReporter(valueMsg, valueDescription)
        }

        return {
            logBinding,
            logValue,
        }
    }
}