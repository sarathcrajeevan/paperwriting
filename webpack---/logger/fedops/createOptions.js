import {
    createHooks
} from './createHooks'

const createFedopsOptions = appLogger => {
    const {
        startHook,
        endHook
    } = createHooks(appLogger)
    const fedopsLoggerOptions = {
        appId: 'databinding',
        appName: 'databinding',
        startHook,
        endHook,
    }

    return fedopsLoggerOptions
}

export default createFedopsOptions