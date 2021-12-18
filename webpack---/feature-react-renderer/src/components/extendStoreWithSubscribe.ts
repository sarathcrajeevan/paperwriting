import { StoreWithSubscribe } from '../types'
import { BatchingStrategy, StoreNoUpdate, IRenderDone } from '@wix/thunderbolt-symbols'

type Subscriber = (partialStore: Record<string, any>) => void
type Subscribers = Array<Subscriber>
type SomeCollection = Record<string, any>

export function extendStoreWithSubscribe<StoreType extends StoreNoUpdate<SomeCollection>>(
	store: StoreType,
	batchingStrategy: BatchingStrategy,
	layoutRenderDoneService?: IRenderDone
): StoreWithSubscribe<StoreType> {
	const subscribers: Record<string, Subscribers> = {}
	const unSubscribers: Record<string, Subscribers> = {}
	const ALL_COMPS = 'All Comps'

	const setRenderPendingIfNeeded = (partialStore: SomeCollection) => {
		if (!layoutRenderDoneService || layoutRenderDoneService.getIsRenderPending()) {
			return
		}

		const isThereSubscriberForChange = Object.entries(partialStore).some(([compId]) => subscribers[compId])
		if (isThereSubscriberForChange) {
			layoutRenderDoneService.setRenderPending()
		}
	}

	const trigger = (compId: string, compProps: Record<string, any>, handlers: Record<string, Subscribers>) =>
		handlers[compId] &&
		[...handlers[compId]].forEach((cb) => {
			cb(compProps)
		})
	function notifyComponents(partialStore: SomeCollection) {
		setRenderPendingIfNeeded(partialStore)
		batchingStrategy.batch(() => {
			Object.entries(partialStore).forEach(([compId, compProps]) => {
				if (compProps) {
					trigger(compId, compProps, subscribers)
				} else {
					trigger(compId, compProps, unSubscribers)
				}
			})

			if (subscribers[ALL_COMPS]) {
				subscribers[ALL_COMPS].forEach((cb) => cb(partialStore))
			}
		})
	}

	store.subscribeToChanges((partial: SomeCollection) => notifyComponents(partial))

	const subscribeById = (id: string, cb: Subscriber) => {
		const cleanup = (compId: string, callback: Subscriber, subscriberCollection: Record<string, Subscribers>) => {
			if (!subscriberCollection[compId]) {
				return
			}
			const index = subscriberCollection[compId].indexOf(callback)
			if (index >= 0) {
				subscriberCollection[compId].splice(index, 1)
			}
			if (subscriberCollection[compId].length === 0) {
				delete subscriberCollection[compId]
			}
		}

		const unSubscribe = () => {
			cleanup(id, cb, subscribers)
			cleanup(id, unSubscribe, unSubscribers)
		}

		subscribers[id] = subscribers[id] || []
		unSubscribers[id] = unSubscribers[id] || []
		subscribers[id].push(cb)
		unSubscribers[id].push(unSubscribe)

		return unSubscribe
	}

	return {
		...store,
		subscribeById,
		subscribeToChanges: (callback) => subscribeById(ALL_COMPS, callback),
	}
}
