import React, { useEffect, useRef, useState, Suspense } from 'react'
import { TPA_STATUS } from '@wix/thunderbolt-components'
import _ from 'lodash'

const TPAPreloaderOverlay = React.lazy(
	() => import('./TPAPreloaderOverlay/TPAPreloaderOverlay' /* webpackChunkName: "TPAPreloaderOverlay" */)
)

const TPAUnavailableMessageOverlay = React.lazy(
	() =>
		import(
			'./TPAUnavailableMessageOverlay/TPAUnavailableMessageOverlay' /* webpackChunkName: "TPAUnavailableMessageOverlay" */
		)
)

const TPAErrorMessageOverlay = React.lazy(() =>
	process.env.PACKAGE_NAME === 'thunderbolt-ds'
		? import('./TPAErrorMessageOverlay/TPAErrorMessageOverlay' /* webpackChunkName: "TPAErrorMessageOverlay" */)
		: import(
				'./TPAUnavailableMessageOverlay/TPAUnavailableMessageOverlay' /* webpackChunkName: "TPAUnavailableMessageOverlay" */
		  )
)

const ALIVE_TIMEOUT = 20000
const OVERLAY_GRACE = 5000

const DENY_IFRAME_RENDERING_STATES = {
	mobile: 'unavailableInMobile',
	https: 'unavailableInHttps',
}

const OVERLAY_STATES = {
	notInClientSpecMap: 'notInClientSpecMap',
	unresponsive: 'unresponsive',
	preloader: 'preloader',
}

export type Props = {
	isAppInClientSpecMap: boolean
	isViewerMode: boolean
	sentAppIsAlive: boolean
	translate?: (feature: string, key: string, defaultValue: string) => string
	width: number
	height: number
	appDefinitionId: string
	appDefinitionName: string
}

export function useOverlay({
	isAppInClientSpecMap,
	isViewerMode,
	sentAppIsAlive,
	translate,
	width,
	height,
	appDefinitionId,
	appDefinitionName,
}: Props) {
	const isMounted = useRef(false)
	const [overlayState, setOverlayState] = useState<string | null>(null)
	const showOverlayTimeout = useRef(0)
	const appIsAliveTimeout = useRef(0)
	const [isVisible, setVisibility] = useState<boolean>(false)
	const [status, setStatus] = useState<TPA_STATUS>('loading')

	useEffect(() => {
		isMounted.current = true
		scheduleShowOverlayTimeout()
		if (isViewerMode) {
			setOverlayState(calculateOverlayState())
		}
		if (!_.includes(DENY_IFRAME_RENDERING_STATES, overlayState)) {
			scheduleAliveTimeout()
			// TODO tpaUtils.incAppCounter();
		}

		return () => {
			isMounted.current = false
			clearAliveTimeout()
			clearShowOverlayTimeout()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (sentAppIsAlive) {
			clearAliveTimeout()
			clearShowOverlayTimeout()
			setStatus('alive')
			if (overlayState === OVERLAY_STATES.preloader) {
				setOverlayState(null)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sentAppIsAlive])

	const getInitialOverlayState = () => {
		// TODO
		// if (isMobileView && !this.isMobileReady()) {
		// 	return DENY_IFRAME_RENDERING_STATES.mobile;
		// }

		if (!isAppInClientSpecMap) {
			return OVERLAY_STATES.notInClientSpecMap
		}

		return OVERLAY_STATES.preloader
	}

	const reload = () => {
		scheduleShowOverlayTimeout()
		scheduleAliveTimeout()
		setVisibility(false)
		setOverlayState(null)
	}

	const clearAliveTimeout = () => {
		if (appIsAliveTimeout) {
			clearTimeout(appIsAliveTimeout.current)
			appIsAliveTimeout.current = 0

			// TODO tpaUtils.decAppCounter(this.props.reportBeatEvent, this.props.primaryPageId);
		}
	}

	const clearShowOverlayTimeout = () => {
		if (showOverlayTimeout) {
			clearTimeout(showOverlayTimeout.current)
			showOverlayTimeout.current = 0
		}
	}

	const scheduleShowOverlayTimeout = () => {
		clearShowOverlayTimeout()
		showOverlayTimeout.current = window.setTimeout(() => {
			clearShowOverlayTimeout()
			showOverlayIfNeeded()
		}, OVERLAY_GRACE)
	}

	const showOverlayIfNeeded = () => {
		if (
			isMounted.current &&
			status !== 'alive' &&
			((!overlayState && isAppInClientSpecMap) || (!isAppInClientSpecMap && !isViewerMode))
		) {
			setOverlayState(getInitialOverlayState())
			setVisibility(true)
		}
		setStatus('loading')
	}

	const scheduleAliveTimeout = () => {
		clearAliveTimeout()
		appIsAliveTimeout.current = window.setTimeout(() => {
			clearAliveTimeout()
			if (isMounted.current && status !== 'alive' && isAppInClientSpecMap) {
				setOverlayState(OVERLAY_STATES.unresponsive)
				setVisibility(true)
			}
		}, ALIVE_TIMEOUT)
	}

	const calculateOverlayState = () => {
		if (status !== 'alive' && (!overlayState || overlayState !== OVERLAY_STATES.unresponsive)) {
			return overlayState
		}

		const underMobileAndNotSupported = false // TODO this.isUnderMobileView() && this.isMobileReady && !this.isMobileReady();
		if (underMobileAndNotSupported) {
			return DENY_IFRAME_RENDERING_STATES.mobile
		} else if (isAppInClientSpecMap) {
			return OVERLAY_STATES.preloader
		} else {
			return OVERLAY_STATES.notInClientSpecMap
		}
	}

	const createOverlayComponent = () => {
		switch (overlayState) {
			case OVERLAY_STATES.preloader:
				return (
					<Suspense fallback={<div />}>
						<TPAPreloaderOverlay
							height={height}
							translate={translate}
							appDefinitionName={appDefinitionName}
							isEditor={!isViewerMode}
						/>
					</Suspense>
				)
			case OVERLAY_STATES.unresponsive:
				return (
					<Suspense fallback={<div />}>
						<TPAErrorMessageOverlay
							appDefinitionId={appDefinitionId}
							appDefinitionName={appDefinitionName}
							overlayState={overlayState}
							width={width}
							translate={translate}
							reload={reload}
						/>
					</Suspense>
				)
			case DENY_IFRAME_RENDERING_STATES.https:
			case DENY_IFRAME_RENDERING_STATES.mobile:
				return (
					<Suspense fallback={<div />}>
						<TPAUnavailableMessageOverlay
							appDefinitionId={appDefinitionId}
							appDefinitionName={appDefinitionName}
							overlayState={overlayState}
							width={width}
							translate={translate}
						/>
					</Suspense>
				)
			case OVERLAY_STATES.notInClientSpecMap:
				return (
					<Suspense fallback={<div />}>
						<TPAErrorMessageOverlay
							appDefinitionId={appDefinitionId}
							appDefinitionName={appDefinitionName}
							overlayState={overlayState}
							width={width}
							translate={translate}
						/>
					</Suspense>
				)
			default:
				return null
		}
	}

	if (
		!isVisible &&
		(status === 'alive' ||
			overlayState === OVERLAY_STATES.preloader ||
			overlayState === OVERLAY_STATES.unresponsive ||
			overlayState === DENY_IFRAME_RENDERING_STATES.mobile)
	) {
		setVisibility(true)
	}

	return {
		isVisible,
		shouldShowIframe: !overlayState || overlayState === OVERLAY_STATES.preloader,
		overlay: createOverlayComponent(),
	}
}
