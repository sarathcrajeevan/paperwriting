import _ from 'lodash'
import { withDependencies, named, multi } from '@wix/thunderbolt-ioc'
import {
	PageFeatureConfigSymbol,
	IPageWillMountHandler,
	IPageWillUnmountHandler,
	SdkHandlersProvider,
	IPropsStore,
	Props,
	CompActionsSym,
	ICompActionsStore,
} from '@wix/thunderbolt-symbols'
import { getDisplayedId } from '@wix/thunderbolt-commons'
import {
	ComponentsStore,
	ComponentsStoreSymbol,
	ViewerComponent,
	ComponentWillMount,
	ComponentWillMountReturnType,
	ComponentWillMountSymbol,
	groupByMultipleComponentTypes,
	ViewerComponentProvider,
	ComponentDriverProviderSymbol,
} from 'feature-components'
import type { RepeatersPageConfig, RepeatersSdkHandlers } from './types'
import { name } from './symbols'

export const Repeaters = withDependencies(
	[
		named(PageFeatureConfigSymbol, name),
		ComponentsStoreSymbol,
		multi(ComponentWillMountSymbol),
		ComponentDriverProviderSymbol,
		Props,
		CompActionsSym,
	],
	(
		pageFeatureConfig: RepeatersPageConfig,
		componentsStore: ComponentsStore,
		componentWillMountArray: Array<ComponentWillMount<ViewerComponent>>,
		viewerComponentProvider: ViewerComponentProvider,
		propsStore: IPropsStore,
		compActionsStore: ICompActionsStore
	): IPageWillMountHandler & IPageWillUnmountHandler & SdkHandlersProvider<RepeatersSdkHandlers> => {
		const { repeatersData } = pageFeatureConfig
		const componentWillUnmountByCompId: {
			[compId: string]: ComponentWillMountReturnType | Promise<ComponentWillMountReturnType>
		} = {}
		const componentWillMountByCompType = groupByMultipleComponentTypes(componentWillMountArray)

		const invokeComponentWillMount = (
			repeaterDisplayIds: { [templateId: string]: Array<string> },
			repeaterId: string
		) => {
			_.forEach(repeaterDisplayIds, (displayIds, templateId) => {
				const componentType = repeatersData[repeaterId].childComponents[templateId]
				if (!componentWillMountByCompType[componentType]) {
					return
				}
				const uiType = componentsStore.get<ViewerComponent>(templateId).uiType
				displayIds.forEach((id) => {
					const component = viewerComponentProvider.createComponent(id, componentType, uiType)
					componentWillMountByCompType[componentType].map(
						({ componentWillMount }) => (componentWillUnmountByCompId[id] = componentWillMount(component))
					)
				})
			})
		}

		const getTemplateIdToDisplayedIds = (itemIds: Array<string>, repeaterId: string) =>
			_.chain(repeatersData[repeaterId].childComponents)
				.mapValues((childCompType, childCompId) => itemIds.map((itemId) => getDisplayedId(childCompId, itemId)))
				.value()

		return {
			getSdkHandlers: () => ({
				[name]: {
					handleAddedItems: (addedItemsIds, repeaterId) => {
						const templateIdToDisplayedIds = getTemplateIdToDisplayedIds(addedItemsIds, repeaterId)
						invokeComponentWillMount(templateIdToDisplayedIds, repeaterId)
					},
					handleRemovedItems: (removedItemsIds, repeaterId) => {
						const templateIdToDisplayedIds = getTemplateIdToDisplayedIds(removedItemsIds, repeaterId)
						const removedDisplayedIds = _.chain(templateIdToDisplayedIds).values().flatten().value()
						_.forEach(removedDisplayedIds, (displayedId) => {
							if (componentWillUnmountByCompId[displayedId]) {
								const compWillUnMount = componentWillUnmountByCompId[displayedId] as VoidFunction
								compWillUnMount()
								delete componentWillUnmountByCompId[displayedId]
							}
							// clear props and actions for deleted displayed components of repeater
							// (usually when user call repeater.data = [])
							propsStore.set({ [displayedId]: {} })
							compActionsStore.set({ [displayedId]: {} })
						})
					},
				},
			}),
			pageWillMount() {
				_.forEach(repeatersData, ({ items }, repeaterId) => {
					invokeComponentWillMount(getTemplateIdToDisplayedIds(items, repeaterId), repeaterId)
				})
			},
			pageWillUnmount: () => {
				_.values(componentWillUnmountByCompId).forEach(async (componentWillUnmount) =>
					(await componentWillUnmount)?.()
				)
			},
		}
	}
)
