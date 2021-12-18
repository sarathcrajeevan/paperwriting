import { SetProps } from '@wix/thunderbolt-symbols'

export const createBatchUpdateManager = (setProps: SetProps) => {
	const itemsPromises = [] as Array<Promise<Array<string>>>

	const flush = () => {
		setProps(
			Promise.resolve().then(() => {
				// at this stage, all sync "$w('repeater').data = [items]" commands have populated the "itemsPromises" array
				const itemsPromise = Promise.all(itemsPromises).then((items) => ({ items: items.pop() }))

				itemsPromises.length = 0 // marks that the current batch is flushed

				return itemsPromise
			})
		)
	}

	return {
		batch(itemsPromise: Promise<Array<string>>) {
			const flushing = itemsPromises.length

			itemsPromises.push(itemsPromise)

			if (!flushing) {
				flush()
			}
		},
	}
}
