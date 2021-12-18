import Context from './AppContext'
import _ from 'lodash'
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ActionProps, CompEventSymbol, CompProps, PropsMap, StateRefsValuesMap, Store } from '@wix/thunderbolt-symbols'
import { CompController } from '@wix/thunderbolt-components-loader'

const emptyPropsFunc = () => ({})

// compController can be
// 1. function for mapActionsToProps
// 2. object with optional function fields mapStateToProps, mapActionsToProps
const extractControllerMappers = (compController: CompController) => {
	// TODO: remove backward compatibility once https://jira.wixpress.com/browse/TB-4863 is resolved
	const isOldController = _.isFunction(compController)
	const mapActionsToProps = isOldController ? compController : compController?.mapActionsToProps || emptyPropsFunc
	const mapStateToProps = isOldController ? emptyPropsFunc : compController?.mapStateToProps || emptyPropsFunc

	return {
		mapActionsToProps,
		mapStateToProps,
	}
}

const isVisibilityHidden = (compId: string): boolean => {
	const elem = document.getElementById(compId)
	return elem ? window.getComputedStyle(elem).visibility === 'hidden' : false
}

const useEventProps = (displayedId: string, compProps: CompProps): CompProps => {
	const functionPropsRef = useRef({} as CompProps)
	const fixedFunctionPropsRef = useRef({} as CompProps)

	if (!compProps) {
		return compProps
	}

	const fixedFunctionProps = Object.entries(compProps).reduce((acc, [propName, propValue]) => {
		if (typeof propValue === 'function') {
			if (propValue !== functionPropsRef.current[propName]) {
				functionPropsRef.current[propName] = propValue
				fixedFunctionPropsRef.current[propName] = (...args: Array<never>) => {
					// overcome react bug where onMouseLeave is emitted if element becomes hidden while hovered
					// https://github.com/facebook/react/issues/22883
					if (propName === 'onMouseLeave' && isVisibilityHidden(displayedId)) {
						return
					}

					return propValue[CompEventSymbol] ? propValue({ args, compId: displayedId }) : propValue(...args)
				}
			}
			return { ...acc, [propName]: fixedFunctionPropsRef.current[propName] }
		}
		return acc
	}, {} as ActionProps)

	return { ...compProps, ...fixedFunctionProps }
}

const useControllerMappers = (displayedId: string, compType: string, compProps: CompProps, stateValues: CompProps) => {
	const { createCompControllerArgs, compControllers } = useContext(Context)
	const compController = compControllers[compType]
	const { mapActionsToProps, mapStateToProps } = extractControllerMappers(compController)
	const stateProps = useMemo(() => mapStateToProps(stateValues, compProps), [stateValues, compProps, mapStateToProps])

	const controllerActions: ActionProps = useMemo(
		() => mapActionsToProps(createCompControllerArgs(displayedId, stateValues)),
		[displayedId, createCompControllerArgs, stateValues, mapActionsToProps]
	)

	const compOwnActions: ActionProps = useMemo(() => {
		return Object.keys(controllerActions).reduce(
			(acc, actionName) => (compProps[actionName] ? { ...acc, [actionName]: compProps[actionName] } : acc),
			{}
		)
	}, [controllerActions, compProps])

	const mergedControllerActions = useMemo(() => {
		return Object.entries(compOwnActions).reduce((acc, [actionName, action]) => {
			return {
				...acc,
				[actionName]: (...args: Array<any>) => {
					controllerActions[actionName](...args)
					action(...args)
				},
			}
		}, {})
	}, [compOwnActions, controllerActions])

	return { ...compProps, ...controllerActions, ...mergedControllerActions, ...stateProps }
}

const getRepeatedValues = (
	store: Store<StateRefsValuesMap | PropsMap>,
	isRepeatedComp: boolean,
	compId: string,
	displayedId: string
) => (isRepeatedComp ? { ...store.get(compId), ...store.get(displayedId) } : store.get(compId))

export const useProps = (displayedId: string, compId: string, compType: string) => {
	const { props: propsStore, compControllers, stateRefs: stateRefsStore } = useContext(Context)
	const isRepeatedComp = displayedId !== compId
	const compProps = getRepeatedValues(propsStore, isRepeatedComp, compId, displayedId)
	const compStateValues = getRepeatedValues(stateRefsStore, isRepeatedComp, compId, displayedId)
	const propsWithEventHandlersWrapper = useEventProps(displayedId, compProps)
	return compControllers[compType] // eslint-disable-next-line react-hooks/rules-of-hooks
		? useControllerMappers(displayedId, compType, propsWithEventHandlersWrapper, compStateValues)
		: propsWithEventHandlersWrapper
}

export const useStoresObserver = (id: string, displayedId: string): void => {
	const { structure: structureStore, props: propsStore, compsLifeCycle, stateRefs: stateRefsStore } = useContext(
		Context
	)

	const [, setTick] = useState(0)
	const forceUpdate = useCallback(() => setTick((tick) => tick + 1), [])

	const subscribeToStores = () => {
		compsLifeCycle.notifyCompDidMount(id, displayedId) // we call it when the id\displayed id changes although it's not mount
		const stores = [propsStore, structureStore, stateRefsStore]
		const unSubscribers: Array<() => void> = []
		stores.forEach((store) => {
			const unsubscribe = store.subscribeById(displayedId, forceUpdate)
			unSubscribers.push(unsubscribe)
			if (displayedId !== id) {
				forceUpdate() // sync repeated component props with stores props in case stores props were updated during first render
				unSubscribers.push(store.subscribeById(id, forceUpdate))
			}
		})

		return () => {
			unSubscribers.forEach((cb) => cb())
		}
	}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(subscribeToStores, [id, displayedId])
}
