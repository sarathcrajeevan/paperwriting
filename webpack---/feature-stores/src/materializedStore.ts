import { Subscriber, IMaterializedStore, IMaterializedSubStore, StoreWithUpdate } from '@wix/thunderbolt-symbols'
import { getDisplayedId, getFullId, getItemId } from '@wix/thunderbolt-commons'
import { createMaterializer } from '@wix/materializer'
import { withDependencies } from '@wix/thunderbolt-ioc'

type Subscribers<T> = Array<Subscriber<T>>

export const getMaterializedStore = (): IMaterializedStore => {
	const observedRoots: Array<string> = []
	const materializer = createMaterializer({ observedRoots, depth: 3 })
	const subscribers: Subscribers<any> = []

	return {
		createContextBasedStore: <T extends Record<string, any>>(subStoreName: string): StoreWithUpdate<T> => {
			observedRoots.push(subStoreName)
			const getPageStoreName = (id: string, pageId?: string) => {
				const subStore = materializer.get([subStoreName]) || {}
				const storeNames = Object.keys(subStore)
				return (
					storeNames.find((storeName) => storeName !== 'general' && subStore[storeName][id]) ||
					storeNames.find((storeName) => storeName !== 'general' && subStore[storeName][getFullId(id)]) ||
					(pageId &&
						storeNames.find((storeName) => storeName !== 'general' && subStore[storeName][pageId])) ||
					'general'
				)
			}

			const getContextIdOfCompId = (compId: string): string | null => {
				const pageStore = getPageStoreName(compId)
				return pageStore === 'general' ? null : pageStore
			}

			const update = (partialStore: T) => {
				const partialStoreWithCompleteEntries = Object.entries(partialStore).reduce(
					(acc, [compId, value]) => {
						const pageStore = getPageStoreName(compId)
						acc[subStoreName][pageStore] = acc[subStoreName][pageStore] || {}
						acc[subStoreName][pageStore][compId] = value

						return acc
					},
					{ [subStoreName]: {} } as any
				)

				const invalidations = materializer.update(partialStoreWithCompleteEntries)
				const updates = Object.assign(
					{},
					...invalidations.map((path) => {
						const [, , compId] = path
						return { [compId]: materializer.get(path) }
					})
				)

				subscribers.forEach((cb) => {
					cb(updates)
				})
			}

			const moveToPageStore = (id: string, pageId: string) => {
				const currentStoreName = getPageStoreName(id, pageId)
				materializer.update({ [subStoreName]: { [currentStoreName]: { [id]: undefined } } })
				const newStoreName = getPageStoreName(id, pageId)
				materializer.update({ [subStoreName]: { [newStoreName]: { [id]: {} } } })
			}

			const updatePageId = (id: string, pageId?: string) => {
				if (pageId) {
					const currentStoreName = getPageStoreName(id)
					const currentStore = materializer.get([subStoreName, currentStoreName])
					moveToPageStore(id, pageId)

					// repeater items with displayedIds inflated from 'id'
					const repeatersItems = Object.keys(currentStore).filter(
						(compId) => getDisplayedId(id, getItemId(compId)) === compId
					)
					repeatersItems.forEach((inflatedId) => moveToPageStore(inflatedId, pageId))
				}
			}

			return {
				get: (id: string) => {
					const pageStore = getPageStoreName(id)!
					return materializer.get([subStoreName, pageStore, id])
				},
				getContextIdOfCompId,
				setChildStore: (contextId: string, pageNewStore?: T) => {
					if (pageNewStore) {
						const generalStore = materializer.get([subStoreName, 'general'])

						const payload = Object.keys(generalStore || {}).reduce<Record<string, Record<string, any>>>(
							(acc, compId) => {
								if (pageNewStore[compId] || pageNewStore[getFullId(compId)]) {
									acc[contextId][compId] = { ...pageNewStore[compId], ...generalStore[compId] }
									acc.general[compId] = undefined
								}
								return acc
							},
							{ general: {}, [contextId]: {} }
						)

						materializer.update({
							[subStoreName]: {
								general: payload.general,
								[contextId]: { ...pageNewStore, ...payload[contextId] },
							},
						})
					} else {
						const invalidations = materializer.update({ [subStoreName]: { [contextId]: undefined } })
						const emptyStore = Object.assign(
							{},
							...invalidations.map(([, , compId]) => ({ [compId]: null }))
						)
						subscribers.forEach((cb) => cb(emptyStore))
					}
				},
				getEntireStore: () => {
					const { general, ...otherStores } = materializer.get(subStoreName)
					return Object.assign({}, general, ...Object.values(otherStores))
				},
				update,
				updatePageId,
				set: () => {
					throw new Error('Unsupported')
				},
				subscribeToChanges: (cb: Subscriber<T>) => {
					subscribers.push(cb)
				},
			}
		},
		createStore: <T extends Record<string, any>>(subStoreName: string): IMaterializedSubStore<T> => {
			return {
				update: (partialStore: Partial<T>) => {
					const invalidations = materializer.update({ [subStoreName]: partialStore })
					const updates = Object.assign(
						{},
						...invalidations.map((path) => {
							const [, , compId] = path
							return { [compId]: materializer.get(path) }
						})
					)

					subscribers.forEach((cb) => {
						cb(updates)
					})
				},
				get: (path: Array<string>) => {
					return materializer.get([subStoreName, ...path])
				},
			}
		},
	}
}

export const MaterializedStore = withDependencies([], getMaterializedStore)
