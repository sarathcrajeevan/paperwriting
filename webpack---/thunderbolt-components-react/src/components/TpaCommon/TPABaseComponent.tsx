import React, { ComponentType, CSSProperties, useEffect, useRef, useState } from 'react'
import { TPAWidgetProps, TPAWidgetBeckyProps, DefaultCompPlatformProps } from '@wix/thunderbolt-components'
import style from './TPABaseComponent.scss'
import { useOverlay } from './useOverlay'
import _ from 'lodash'

const IFRAME_CROSS_DOMAIN_PERMISSIONS = ['autoplay', 'camera', 'microphone', 'geolocation', 'vr'].join(';')

export type TPABaseWidgetProps = DefaultCompPlatformProps &
	TPAWidgetProps &
	TPAWidgetBeckyProps & {
		styleOverrides?: any
		isMobileFullScreenMode?: boolean
		iOSVersion?: number
		allowScrolling?: boolean
		appDefinitionName: string
		appDefinitionId: string
	}

const getMobileEnterFullScreenResponsiveStyles = () => ({
	position: 'fixed',
	margin: '0',
	top: '0',
	left: '0',
	width: '100vw',
	bottom: '0',
})

const getMobileEnterFullScreenClassicStyles = () => ({
	display: 'block',
	position: 'absolute',
	margin: 0,
	top: 'calc(-1 * var(--wix-ads-height))',
	bottom: 0,
	left: 0,
	right: 0,
	zIndex: 2000,
	height: 'auto',
	width: 'auto',
})

const getMobileExitFullScreenClassicStyles = () => ({
	display: 'none',
})

const getStyleOverrides = (
	isMobileView: boolean,
	isResponsive: boolean,
	config: Pick<
		TPABaseWidgetProps,
		'heightOverflow' | 'heightOverride' | 'styleOverrides' | 'isMobileFullScreenMode' | 'iOSVersion'
	>
) => {
	const styles = {
		containerOverrides: {} as any,
		iframeOverrides: {} as any,
	}

	// enter/exit full screen mode on mobile
	const enterMobileFullScreenMode = isMobileView && config.isMobileFullScreenMode
	if (enterMobileFullScreenMode) {
		if (isResponsive) {
			styles.containerOverrides = getMobileEnterFullScreenResponsiveStyles()

			// iOS: on version 13 height is too small when position fixed
			if (config.iOSVersion && config.iOSVersion < 14) {
				styles.containerOverrides.position = 'relative'
				styles.containerOverrides.height = '100%'

				styles.iframeOverrides = {
					display: 'block',
					position: 'relative',
					width: '100%',
					height: '100%',
					minHeight: '100%',
					minWidth: '100%',
				}
			}
		} else {
			styles.containerOverrides = getMobileEnterFullScreenClassicStyles()
		}

		return styles
	}

	const exitMobileFullScreenMode = isMobileView && config.isMobileFullScreenMode === false // can be undefined, so strict check
	if (exitMobileFullScreenMode && !isResponsive) {
		styles.containerOverrides = getMobileExitFullScreenClassicStyles()
		return styles
	}

	if (config.styleOverrides) {
		const { width, height } = config.styleOverrides
		styles.containerOverrides = { width, height }

		// iOS: fix a case when chat button disapears after exit from fullScreenMode (when position fixed), for iOS 14 and greater, responsive sites
		if (config.iOSVersion && config.iOSVersion >= 14) {
			styles.containerOverrides.content = 'attr(x)' // this will force browser repaint
		}
	}

	if (typeof config.heightOverride !== 'number' || isNaN(config.heightOverride)) {
		return styles
	}

	if (config.heightOverflow) {
		styles.containerOverrides.overflow = 'visible'
		styles.iframeOverrides.height = config.heightOverride
		styles.iframeOverrides.zIndex = 1001
	} else {
		styles.containerOverrides.overflow = 'hidden'
		styles.containerOverrides.height = config.heightOverride
	}

	return styles
}

const TPABaseComponent: ComponentType<TPABaseWidgetProps> = (props) => {
	const {
		id,
		src,
		title,
		isAppInClientSpecMap,
		isViewerMode,
		isMobileView,
		isResponsive,
		sentAppIsAlive,
		reportIframeStartedLoading,
		onMouseEnter = _.noop,
		onMouseLeave = _.noop,
		allowScrolling,
		translate,
		appDefinitionName,
		appDefinitionId,
		...rest
	} = props || {}

	const compRef = useRef<HTMLDivElement>(null)
	const width = compRef.current?.clientWidth || 0
	const height = compRef.current?.clientHeight || 0

	const { overlay, shouldShowIframe, isVisible } = useOverlay({
		appDefinitionName,
		appDefinitionId,
		isAppInClientSpecMap,
		isViewerMode,
		sentAppIsAlive,
		translate,
		width,
		height,
	})

	const getRootClassNames = () => {
		if (isMobileView && typeof rest.isMobileFullScreenMode === 'boolean') {
			return // this case is covered by styleOverrides
		}

		const classNames: Array<string> = [style.root]
		if (!isVisible) {
			classNames.push(style.hidden)
		}
		return classNames.join(' ')
	}

	const { containerOverrides, iframeOverrides } = getStyleOverrides(isMobileView, isResponsive, rest) || {}

	const [shouldRenderSrc, setShouldRenderSrc] = useState(false)
	useEffect(() => {
		// we want to render the src only on client side (consent policy concerns)
		// and after the viewer set the function props on the comp
		// @ts-ignore PLAT-1044 figure out how can it be that reportIframeStartedLoading is not defined
		if (!shouldRenderSrc && src && reportIframeStartedLoading) {
			setShouldRenderSrc(true)
		}
	}, [shouldRenderSrc, src, reportIframeStartedLoading])

	const iframeProps: {
		className: string
		style: CSSProperties
		title: string
		'aria-label': string
		scrolling: 'yes' | 'no'
		key?: string
		src?: string
	} = {
		className: style.iframe,
		style: iframeOverrides,
		title,
		'aria-label': title,
		scrolling: allowScrolling ? 'yes' : 'no',
	}

	if (shouldRenderSrc) {
		reportIframeStartedLoading()
		iframeProps.key = src // https://stackoverflow.com/questions/29859048/updating-an-iframe-history-and-url-then-making-it-work-with-back-button
		iframeProps.src = src
	}

	return (
		<div
			style={containerOverrides}
			ref={compRef}
			id={id}
			className={getRootClassNames()}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			{shouldShowIframe && (
				// eslint-disable-next-line jsx-a11y/iframe-has-title
				<iframe
					{...iframeProps}
					allowFullScreen={true}
					// @ts-ignore
					allowtransparency="true"
					allowvr="true"
					frameBorder="0"
					allow={IFRAME_CROSS_DOMAIN_PERMISSIONS}
				/>
			)}
			{overlay}
		</div>
	)
}

const TPABaseOrSeoContent: ComponentType<TPABaseWidgetProps> = (props) => {
	if (props.seoHtmlContent) {
		return <div id={props.id} dangerouslySetInnerHTML={{ __html: props.seoHtmlContent }}></div>
	} else {
		return <TPABaseComponent {...props} />
	}
}
export default TPABaseOrSeoContent
