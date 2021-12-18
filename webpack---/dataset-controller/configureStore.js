import {
    createStore as createReduxStore,
    applyMiddleware
} from 'redux'
import {
    createTraceReduxMiddleware
} from './traceReduxMiddleware'
import reduxSerialEffects from 'redux-serial-effects'
import rootReducer from './rootReducer'

const configureStore = (logger, datasetId) => {
    const {
        middleware: serialEffectsMiddleware,
        subscribe,
        onIdle,
    } = reduxSerialEffects.createMiddleware()

    const store = createReduxStore(
        rootReducer,
        undefined,
        applyMiddleware(
            serialEffectsMiddleware,
            createTraceReduxMiddleware(logger, datasetId),
        ),
    )

    return {
        store,
        subscribe,
        onIdle,
    }
}

export default configureStore