import { ColumnsRepeaterProps } from '@wix/thunderbolt-components'
import style from './style/ColumnsRepeater.scss'
import React, { ComponentType, ReactNode, MouseEventHandler, createRef, useCallback } from 'react'
import _ from 'lodash'

export type ColumnsRepeaterCompProps = ColumnsRepeaterProps & {
	id: string
	children: (id: string) => ReactNode
}

const supportedKeyboardKeys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End']

const ColumnsRepeater: ComponentType<ColumnsRepeaterCompProps> = ({
	id,
	children,
	items,
	columns: columnsBasedOnWidth,
	isKeyboardNavigationAvailable,
	onMouseEnter = _.noop,
	onMouseLeave = _.noop,
	a11y = {},
	rowRole,
	cellRole,
}) => {
	const { label, role } = a11y

	const columns = Math.min(columnsBasedOnWidth, items.length)
	const itemsInColumn = items.reduce<Array<Array<string>>>(
		(acc, item, index) => {
			const column = index % columns
			acc[column].push(item)
			return acc
		},
		new Array(columns).fill(null).map(() => [])
	)

	const cellRefs = itemsInColumn.map((column) => column.map(() => createRef<HTMLDivElement>()))

	const getCellTabIndex = useCallback(
		([row, column]: [number, number]) => {
			if (!isKeyboardNavigationAvailable) {
				return
			}

			return column === 0 && row === 0 ? 0 : -1
		},
		[isKeyboardNavigationAvailable]
	)

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>, [row, column]: [number, number]) => {
			if (!isKeyboardNavigationAvailable) {
				return
			}

			const target = event.target as Element

			const shouldHandleKeyboardEvent =
				supportedKeyboardKeys.includes(event.key) && target.tagName !== 'INPUT' && target.tagName !== 'SELECT'

			if (!shouldHandleKeyboardEvent) {
				return
			}

			event.preventDefault()

			const lastColumnIndex = itemsInColumn.length - 1
			const lastRowInLastColumnIndex = itemsInColumn[lastColumnIndex]?.length - 1

			const nextStateByKey: Record<string, [number, number]> = {
				ArrowDown: [row + 1, column],
				ArrowUp: [row - 1, column],
				ArrowRight: [row, column + 1],
				ArrowLeft: [row, column - 1],
				Home: [0, 0],
				End: [lastRowInLastColumnIndex, lastColumnIndex],
			}

			const nextState = nextStateByKey[event.key]

			if (!nextState) {
				return
			}

			const [nextRow, nextColumn] = nextState
			const cellRef = cellRefs[nextColumn]?.[nextRow]

			cellRef?.current?.focus()
		},
		[isKeyboardNavigationAvailable, itemsInColumn, cellRefs]
	)

	const isGrid = role === 'grid'

	return (
		<div id={id} onMouseEnter={onMouseEnter as MouseEventHandler} onMouseLeave={onMouseLeave as MouseEventHandler}>
			<div role={role} aria-label={label} className={style.grid}>
				{itemsInColumn.map((column, columnIndex) => (
					<div role={rowRole} className={style.row} key={columnIndex}>
						{column.map((childId, rowIndex) => (
							<div
								role={cellRole}
								className={`${style.gridcell}`}
								key={childId}
								tabIndex={getCellTabIndex([rowIndex, columnIndex])}
								ref={cellRefs[columnIndex][rowIndex]}
								onKeyDown={isGrid ? (e) => handleKeyDown(e, [rowIndex, columnIndex]) : undefined}
							>
								{children(childId)}
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	)
}

export default ColumnsRepeater
