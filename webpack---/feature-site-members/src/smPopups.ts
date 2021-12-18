import { IPopups, PopupEventListener } from 'feature-popups'
import { AUTH_RESULT_REASON } from './constants'

export class SMPopups {
	popups?: IPopups
	// We use the following identifier to determine whether the
	// user closed the custom popup by himself or it closed because
	// he prompt / navigated to another custom popup / popup
	shouldRunCustomPopupCloseCallback = true
	// We use the following to keep track on requestAuthentication
	// requests so we be able reject/resolve the original request even upon
	// further navigation's
	requestAuthenticationRejection: any
	requestAuthenticationResolveInstance: any
	config: { isCloseable: boolean; returnPages: boolean }

	constructor(popups?: IPopups) {
		this.popups = popups
		this.config = { isCloseable: true, returnPages: false }
	}

	async openPopupPage(pageId: string, closeHandler?: PopupEventListener) {
		// We are doing the following in order to determine if it's the user who closed
		// the popup or it's just closed by opening another popup replacing the opened one.
		const previousShouldRunCustomPopupCloseCallback = this.shouldRunCustomPopupCloseCallback
		this.shouldRunCustomPopupCloseCallback = false
		await this.popups?.openPopupPage(pageId, () => {
			if (this.shouldRunCustomPopupCloseCallback) {
				this.rejectAuthenticationRequest()
				if (closeHandler) {
					closeHandler()
				}
			}
		})
		this.shouldRunCustomPopupCloseCallback = previousShouldRunCustomPopupCloseCallback
	}

	preventCustomPopupCloseCallback() {
		this.shouldRunCustomPopupCloseCallback = false
	}

	allowCustomPopupCloseCallback() {
		this.shouldRunCustomPopupCloseCallback = true
	}
	// In order to prevent access to a private page we must be able to track and reject the initial authentication request
	assignRequestAuthenticationRejection(reject: any) {
		this.requestAuthenticationRejection = this.requestAuthenticationRejection || reject
	}
	// In order to prevent access to a private page we must be able to track and resolve the initial authentication request
	assignRequestAuthenticationResolveInstance(resolve: any) {
		this.requestAuthenticationResolveInstance = this.requestAuthenticationResolveInstance || resolve
	}
	rejectAuthenticationRequest() {
		if (!this.requestAuthenticationRejection) {
			return
		}
		this.requestAuthenticationRejection(AUTH_RESULT_REASON.CANCELED)
		// Once we do reject the authentication request we stop track it and make a
		// room for another request to come.
		this.requestAuthenticationRejection = undefined
	}
	setConfig({ isCloseable = true, returnPages = false }) {
		this.config = { isCloseable, returnPages }
	}
	reset() {
		this.requestAuthenticationRejection = undefined
		this.requestAuthenticationResolveInstance = undefined
		this.config = { isCloseable: true, returnPages: false }
	}
}
