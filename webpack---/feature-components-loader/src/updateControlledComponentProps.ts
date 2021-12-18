import {
	IPropsStore,
	Props,
	BusinessLogger,
	BusinessLoggerSymbol,
	ReporterSymbol,
	IReporterApi,
	IPlatformPropsSyncManager,
	PlatformPropsSyncManagerSymbol,
	Structure,
	IStructureStore,
	StateRefsValues,
} from '@wix/thunderbolt-symbols'
import { withDependencies, optional } from '@wix/thunderbolt-ioc'
import type { CreateCompControllerArgs } from './types'
import { getFullId } from '@wix/thunderbolt-commons'
import _ from 'lodash'

export const controlledComponentFactory = withDependencies(
	[Props, Structure, PlatformPropsSyncManagerSymbol, optional(BusinessLoggerSymbol), optional(ReporterSymbol)],
	(
		propsStore: IPropsStore,
		structureStore: IStructureStore,
		platformPropsSyncManager: IPlatformPropsSyncManager,
		businessLogger: BusinessLogger,
		reporter?: IReporterApi
	) => {
		const createCompControllerArgs: CreateCompControllerArgs = (
			displayedId: string,
			stateRefs: StateRefsValues = {}
		) => {
			const initialContextId = structureStore.getContextIdOfCompId(getFullId(displayedId))
			const stateRefsFunctions = _.pickBy(stateRefs, _.isFunction)

			return {
				...(reporter && { trackEvent: reporter.trackEvent }),
				...stateRefsFunctions,
				// @ts-ignore
				reportBi: (params, ctx) => {
					// @ts-ignore
					return businessLogger.logger.log(params, ctx)
				},
				updateProps: (overrideProps) => {
					// Ignore invokations from handlers that were created on other pages
					const currentContextId = structureStore.getContextIdOfCompId(getFullId(displayedId))

					if (!structureStore.get(getFullId(displayedId)) || initialContextId !== currentContextId) {
						return
					}

					propsStore.update({ [displayedId]: overrideProps })
					platformPropsSyncManager.triggerPlatformPropsSync(displayedId, overrideProps)
				},
			}
		}

		return {
			extendRendererProps() {
				return {
					createCompControllerArgs,
				}
			},
		}
	}
)
