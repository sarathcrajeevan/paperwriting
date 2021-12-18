import { withDependencies } from '@wix/thunderbolt-ioc'
import { Experiments, ExperimentsSymbol, TpaHandlerProvider } from '@wix/thunderbolt-symbols'
import { TpaModalSymbol, TpaPopupSymbol } from '../symbols'
import { ITpaModal, ITpaPopup } from '../types'
import { closeWindow } from '../utils/closeWindow'

export const OnEscapeClickedHandler = withDependencies(
	[TpaModalSymbol, TpaPopupSymbol, ExperimentsSymbol],
	(tpaModal: ITpaModal, tpaPopup: ITpaPopup, experiments: Experiments): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				onEscapeClicked: (compId) => {
					if (experiments['specs.thunderbolt.closeWindowOnEscPress']) {
						closeWindow({ tpaModal, tpaPopup, compId })
					}
				},
			}
		},
	})
)
