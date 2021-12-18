import baseAdapter from './baseAdapter'
import {
    transformFromRecordToView
} from '../transformData'

const adapter = ({
    databindingVerboseReporter,
    modeIsLivePreview
}) => {
    const updateComponent = async ({
            connectionConfig: {
                properties: {
                    options: {
                        fieldName
                    },
                },
            },
            component,
            role,
        },
        actions,
    ) => {
        const {
            items
        } = await actions.fetchAll()

        const options = items.reduce((acc, record) => {
            const value = transformFromRecordToView({
                value: record[fieldName],
                role,
            })

            if (value) acc.push({
                value,
                label: value
            })

            return acc
        }, [])

        if (modeIsLivePreview && options.length === 0) return

        component.options = options

        databindingVerboseReporter.logValue({
            component,
            valueDescription: {
                options
            },
        })
    }

    return {
        ...baseAdapter,

        isValidContext({
            connectionConfig: {
                properties = {}
            }
        }) {
            return Boolean(Object.keys(properties).length)
        },

        clearComponent({
            component
        }) {
            component.options = []
        },

        bindToComponent({
            component,
            connectionConfig: {
                properties: {
                    options: {
                        fieldName
                    },
                },
            },
        }) {
            databindingVerboseReporter.logBinding({
                component,
                bindingDescription: {
                    options: fieldName
                },
            })
        },

        currentRecordModified: updateComponent,
        recordSetLoaded: updateComponent,
    }
}

export default adapter