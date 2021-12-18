import _ from 'lodash'
import { getDisplayedId, getItemId } from '@wix/thunderbolt-commons'
import { composeSDKFactories, createElementPropsSDKFactory } from '@wix/editor-elements-corvid-utils'
import type { PlatformEnvData, ModelsAPI } from '@wix/thunderbolt-symbols'
import type { componentSdkFactoryArgs, ComponentSdkFactory } from '@wix/thunderbolt-platform-types'
import type { ColumnsRepeaterSDK, DataItem, OnItemCallback, ViewerAPI, Reporter, OnItemRemovedCallback } from '../../../types'
import type { WixSelector } from '../../wixSelector'
import type { CompCacheParams, InstanceCacheFactory } from '../../instanceCache'
import type { ComponentSdkStateFactory } from '../../componentSdkState'
import { getScopedInstancesForRole } from '../../repeaterUtils'
import { createBatchUpdateManager } from './batchedUpdatesManager'
import { name as repeaters } from 'feature-repeaters'

type RepeaterState = {
	onItemReadyCallbacks: Array<Function>
	onItemRemovedCallbacks: Array<Function>
	currentItems: Array<any>
	isItemsSet: boolean
}
function createRepeaterState() {
	const repeaterStateByRepeaterId: Record<string, RepeaterState> = {}
	return {
		getRepeaterState(repeaterId: string, initialItems: Array<{ _id: string }>): RepeaterState {
			if (!repeaterStateByRepeaterId[repeaterId]) {
				repeaterStateByRepeaterId[repeaterId] = {
					onItemReadyCallbacks: [],
					onItemRemovedCallbacks: [],
					isItemsSet: false,
					currentItems: initialItems,
				}
			}
			return repeaterStateByRepeaterId[repeaterId]
		},
	}
}

const MAX_ITEMS_EDITOR = 12

export function RepeaterSdk({
	modelsApi,
	wixSelector,
	viewerAPI,
	reporter,
	sdkInstancesCache,
	componentSdkState,
	platformEnvData: {
		site: { viewMode },
	},
	createRepeatedControllers,
	handlers,
}: {
	modelsApi: ModelsAPI
	wixSelector: WixSelector
	viewerAPI: ViewerAPI
	reporter: Reporter
	sdkInstancesCache: InstanceCacheFactory
	componentSdkState: ComponentSdkStateFactory
	platformEnvData: PlatformEnvData
	createRepeatedControllers: Function
	handlers: any
}): ComponentSdkFactory {
	const isEditorMode = viewMode === 'Editor'
	const { getRepeaterState } = createRepeaterState()

	const createScoped$wFactory = (repeaterId: string, controllerCompId: string) => (itemId: string) => {
		const $wScope = wixSelector.create$wRepeaterScope({ compId: repeaterId, itemId })
		const getInstanceForRole = getScopedInstancesForRole({
			modelsApi,
			controllerCompId,
			repeaterId,
			itemId,
			getInstanceFn: wixSelector.getInstance,
			$wScope,
		})
		return wixSelector.$wFactory(controllerCompId, getInstanceForRole, repeaterId)
	}

	const getIdsFromItems = (items: Array<DataItem>) => items.map((item) => item._id)
	const getAddedItems = (currentData: Array<DataItem>, newData: Array<DataItem>) => {
		const currentDataIds = getIdsFromItems(currentData)
		return newData.filter((newItem) => !currentDataIds.includes(newItem._id))
	}
	const getRemovedItems = (currentData: Array<DataItem>, newData: Array<DataItem>) => {
		const newDataIds = getIdsFromItems(newData)
		return currentData.filter((currentItem) => !newDataIds.includes(currentItem._id))
	}

	const reportWrongType = (propertyName: string, functionName: string, wrongValue: any, expectedType: string) => {
		reporter.logSdkError(`The ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value ${wrongValue}. It must be of type ${expectedType}.`)
	}

	const isString = (val: any) => typeof val === 'string' || val instanceof String

	const isFunction = (maybeFunction: any): maybeFunction is Function => {
		return typeof maybeFunction === 'function'
	}

	const repeaterItemIdRegex = /^[a-zA-Z\d-]+$/
	const validateIdFormat = (id: string) => repeaterItemIdRegex.test(id)
	const validateDataArrayAndReport = (data: Array<DataItem>, repeaterId: string): boolean => {
		if (!Array.isArray(data)) {
			reportWrongType('data', 'data', data, 'array')
			return false
		}
		const ids: { [id: string]: boolean } = {}
		return data.every((item, index) => {
			if (!item._id) {
				reporter.logSdkError('Each item in the items array must have a member named `_id` which contains a unique value identifying the item.')
				return false
			}
			if (!isString(item._id)) {
				reportWrongType('_id', 'data', item._id, 'string')
				return false
			}
			if (!validateIdFormat(item._id)) {
				reporter.logSdkError(
					`Error setting the data property of ${repeaterId}. The data array contains the invalid ID ${item._id} at index ${index}. IDs must be comprised of only the following characters: A-Z, a-z, 0-9, and dashes.`
				)
				return false
			}
			if (ids[item._id]) {
				reporter.logSdkWarning(`The data that was passed to data contained at least two items with the same ID: ${item._id}. Only the first item was accepted.`)
			} else {
				ids[item._id] = true
			}
			return true
		})
	}

	const logErrorFromFunction = (compId: string, functionName: string, errorMessage: string) => {
		reporter.logSdkError(`The ${functionName} function of ${compId} threw the following error: ${errorMessage}`)
	}

	function updateAddedItemsStyles(repeaterChildComponents: Array<string>, itemIds: Array<string>) {
		repeaterChildComponents.forEach((templateId) => {
			itemIds.forEach((itemId) => {
				// we want the style overrides store to contain an entry for the new item
				// so that if there are style overrides on the template, they will apply on the newly added item.
				viewerAPI.updateStyles({ [getDisplayedId(templateId, itemId)]: {} })
			})
		})
	}

	const sdk = ({ props, setProps, compId: repeaterId, controllerCompId, sdkData }: componentSdkFactoryArgs<any, { repeaterChildComponents: Array<string> }>): ColumnsRepeaterSDK => {
		const initialItems = props.items.map((id: string) => ({ _id: id }))
		const repeaterState = getRepeaterState(repeaterId, initialItems)
		const createScoped$w = createScoped$wFactory(repeaterId, controllerCompId)

		const handleAddedItems = async (newData: Array<DataItem>, addedItemsIds: Array<string>) => {
			if (!addedItemsIds.length) {
				return
			}
			handlers[repeaters].handleAddedItems(addedItemsIds, repeaterId)
			const onItemReadyCallbacks = [...repeaterState.onItemReadyCallbacks]
			updateAddedItemsStyles(sdkData.repeaterChildComponents, addedItemsIds)
			const runControllersOnReadys = await createRepeatedControllers(repeaterId, addedItemsIds)
			newData.forEach((item, index) => {
				if (addedItemsIds.includes(item._id)) {
					onItemReadyCallbacks.forEach((cb) => cb(item, index))
				}
			})
			await runControllersOnReadys()
		}

		const handleRemovedItems = (newData: Array<DataItem>, prevRepeaterItems: Array<DataItem>) => {
			const removedItemIds = getIdsFromItems(getRemovedItems(prevRepeaterItems, newData))
			if (!removedItemIds.length) {
				return
			}
			handlers[repeaters].handleRemovedItems(removedItemIds, repeaterId)

			if (repeaterState.isItemsSet) {
				prevRepeaterItems.forEach((item) => {
					if (removedItemIds.includes(item._id)) {
						repeaterState.onItemRemovedCallbacks.forEach((cb) => cb(item))
					}
				})
			}

			sdkInstancesCache.clearCacheByPredicate(({ itemId }: CompCacheParams) => removedItemIds.includes(itemId!))
			componentSdkState.clearStateByPredicate((compId) => removedItemIds.includes(getItemId(compId)))
		}

		const callItemCallback = (cb: OnItemCallback) => (item: DataItem, index: number) => {
			return cb(createScoped$w(item._id), item, index)
		}

		const callCallbackWithLog = <F extends (...args: any) => any>(functionName: string, cb: F) => (...args: Parameters<F>) => {
			try {
				cb(...args)
			} catch (ex) {
				logErrorFromFunction(repeaterId, functionName, ex.message)
			}
		}

		const validateFunctionTypeAndReport = (maybeFunction: any, propertyName: string, functionName: string): maybeFunction is Function => {
			if (!isFunction(maybeFunction)) {
				reportWrongType(propertyName, functionName, maybeFunction, 'function')
				return false
			}
			return true
		}

		const batchedUpdatesManager = createBatchUpdateManager(setProps)

		return {
			get data() {
				// cloning currentItems because if user get currentItems he can mutate them and then break our getAddedItems functionality
				return _.clone(repeaterState.currentItems)
			},
			set data(newData) {
				if (!validateDataArrayAndReport(newData, repeaterId)) {
					return
				}
				if (isEditorMode && newData.length > MAX_ITEMS_EDITOR) {
					newData = newData.slice(0, MAX_ITEMS_EDITOR)
				}

				const prevRepeaterItems = repeaterState.currentItems
				// cloning newData to not mutate user data
				const uniqueNewData = _.uniqBy(newData, '_id')
				Object.assign(props, { items: uniqueNewData.map((item) => item._id) })
				// running handleRemovedItems before updating the currentItems so any use of the currentItems inside onItemRemove will not work
				handleRemovedItems(uniqueNewData, prevRepeaterItems)
				const addedItemsIds = getIdsFromItems(getAddedItems(prevRepeaterItems, newData))
				// setting currentItems after calculating addedItemsIds to not override reference of prevRepeaterItems
				repeaterState.currentItems = uniqueNewData
				repeaterState.isItemsSet = true

				// handling addedItems after updating currentItems so that forEach api will work with the new items
				const handleAddedItemsPromise = handleAddedItems(uniqueNewData, addedItemsIds)
				// the batched updates manager will block the initial render until data is set and onItemReadyCallbacks are executed
				batchedUpdatesManager.batch(handleAddedItemsPromise.then(() => getIdsFromItems(uniqueNewData)))
			},

			onItemReady(cb: OnItemCallback) {
				if (!validateFunctionTypeAndReport(cb, 'callback', 'onItemReady')) {
					return
				}

				const onItemReadyCallback = callItemCallback(cb)

				repeaterState.onItemReadyCallbacks.push(callCallbackWithLog('onItemReady', onItemReadyCallback))

				if (repeaterState.isItemsSet) {
					repeaterState.currentItems.forEach((item, index) => onItemReadyCallback(item, index))
				}
			},
			onItemRemoved(cb: OnItemRemovedCallback) {
				if (!validateFunctionTypeAndReport(cb, 'callback', 'onItemRemoved')) {
					return
				}

				repeaterState.onItemRemovedCallbacks.push(callCallbackWithLog('onItemRemoved', cb))
			},
			forEachItem(cb) {
				if (!validateFunctionTypeAndReport(cb, 'callback', 'forEachItem')) {
					return
				}

				repeaterState.currentItems.forEach(callItemCallback(cb))
			},
			forItems(requestedItemIds, cb) {
				if (!Array.isArray(requestedItemIds)) {
					reportWrongType('itemIds', 'forItems', requestedItemIds, 'array')
					return
				}
				if (!validateFunctionTypeAndReport(cb, 'callback', 'forItems')) {
					return
				}

				const repeaterItemsIds = new Set(repeaterState.currentItems.map((item) => item._id))
				const existingItemIds = new Set()

				requestedItemIds.forEach((itemId) => {
					if (repeaterItemsIds.has(itemId)) {
						existingItemIds.add(itemId)
					} else {
						reporter.logSdkWarning(`The data that was passed to forItems contained non existing item with the ID: ${itemId}.`)
					}
				})

				repeaterState.currentItems.forEach((item, i) => {
					if (existingItemIds.has(item._id)) {
						callItemCallback(cb)(item, i)
					}
				})
			},
		}
	}
	// @ts-ignore TODO: fix types
	return composeSDKFactories(sdk, createElementPropsSDKFactory())
}
