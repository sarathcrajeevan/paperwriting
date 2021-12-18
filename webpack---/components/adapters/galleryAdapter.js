'use strict'
import {
    forEach,
    has,
    isEmpty,
    get
} from 'lodash-es'
import {
    getFieldValue,
    addComponentEventListener
} from './helpers'
import {
    transformFromRecordToView
} from '../transformData'
import baseAdapter from './baseAdapter'
import {
    selectCurrentRecord,
    selectCurrentRecordIndex,
} from '../../dataset-controller/rootReducer'

export default ({
    getState,
    wixSdk,
    getFieldType,
    applicationCodeZone,
    databindingVerboseReporter,
    platformAPIs,
    wixFormatter,
    modeIsLivePreview,
}) => {
    const copyRecordToImage = (image, record, properties, role) =>
        forEach(properties || [], ({
            fieldName,
            format
        }, propPath) => {
            const value = transformFromRecordToView({
                value: getFieldValue(record, fieldName),
                role,
                fieldType: getFieldType(fieldName).getOrElse(''),
                propPath,
                format,
                utils: {
                    formatter: wixFormatter,
                    mediaItemUtils: platformAPIs.mediaItemUtils,
                },
            })
            image[propPath] = value
        })

    const setCurrentIndexOfGallery = component => {
        try {
            if (component.galleryCapabilities.hasCurrentItem) {
                component.currentIndex = selectCurrentRecordIndex(getState())
            }
        } catch {
            // see comments in CLNT-7339, we will use a new API that will allow us to know if we can set the current index
        }
    }

    const refreshView = async ({
            connectionConfig: {
                properties
            },
            component,
            role
        },
        actions,
    ) => {
        const {
            items: records
        } = await actions.fetchCurrentItems(getState())

        try {
            const items = records.map(record => {
                const image = {}
                copyRecordToImage(image, record, properties, role)
                return image
            })
            const noImages = items.every(({
                src
            }) => !src)

            if (modeIsLivePreview && noImages) return

            databindingVerboseReporter.logValue({
                component,
                valueDescription: items,
            })
            component.items = items
        } catch (e) {
            // is the value bound to the src property bad?
            if (e.name !== 'URIError') {
                throw e
            }
        }

        setCurrentIndexOfGallery(component)
    }

    const logVerboseForBinding = (component, properties) => {
        const bindingDescription = {}

        forEach(properties, ({
            fieldName
        }, propName) => {
            bindingDescription[propName] = fieldName
        })

        databindingVerboseReporter.logBinding({
            component,
            bindingDescription,
        })
    }

    return {
        ...baseAdapter,

        clearComponent({
            component
        }) {
            component.items = []
        },

        isValidContext({
            connectionConfig: {
                properties
            }
        }) {
            return !isEmpty(properties)
        },

        bindToComponent({
            connectionConfig: {
                properties
            },
            component
        }, actions) {
            if (has(properties, 'link')) {
                //set gallery settings to "when clicked --> a link opens"
                component.clickAction = 'link'
            }

            if (get(component, ['galleryCapabilities', 'hasCurrentItem'])) {
                addComponentEventListener(
                    component,
                    'onCurrentItemChanged',
                    () => {
                        actions.setCurrentIndex(component.currentIndex)
                    },
                    applicationCodeZone,
                )
            }

            logVerboseForBinding(component, properties)
        },

        currentRecordModified({
                connectionConfig: {
                    properties
                },
                component,
                role
            },
            actions,
            updatedFields,
        ) {
            const record = selectCurrentRecord(getState())
            const currentIndex = selectCurrentRecordIndex(getState())

            const imagesToBeChanged = component.items || []
            const imageToBeChanged = imagesToBeChanged[currentIndex]

            if (imageToBeChanged) {
                copyRecordToImage(imageToBeChanged, record, properties, role)
            }

            component.items = imagesToBeChanged
            setCurrentIndexOfGallery(component)
        },

        recordSetLoaded: refreshView,
        currentViewChanged: refreshView,

        currentIndexChanged({
            component
        }, actions) {
            setCurrentIndexOfGallery(component)
        },
    }
}