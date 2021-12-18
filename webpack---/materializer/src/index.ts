import { Queue } from './Queue'
import { toposort } from './toposort'
import { DataFragment, MaterializerFactory, Visitor, Node, Ref, RefProvider, InferSchema, Update } from './types'
import { getByString, getByArray, setByArray, hasByArray, isObjectLike, take } from './utils'

export * from './types'

const BIG_FACTOR = 32
const SMALL_FACTOR = 32

const traverse = (obj: any, visit: Visitor, queueFactor: number) => {
	const queue = new Queue<Node>(queueFactor)
	queue.enqueue({ path: [], val: obj })

	while (!queue.isEmpty()) {
		const next = queue.dequeue()
		if (!visit(next.val, next.path)) {
			const type = typeof next.val
			if (
				!next.val ||
				type === 'string' ||
				type === 'number' ||
				type === 'boolean' ||
				type === 'symbol' ||
				type === 'function'
			) {
				continue
			}
			if (Array.isArray(next.val)) {
				for (let i = 0; i < next.val.length; i++) {
					queue.enqueue({
						path: [...next.path, i],
						val: next.val[i],
					})
				}
			} else {
				const keys = Object.keys(next.val)
				for (const key of keys) {
					queue.enqueue({
						path: [...next.path, key],
						val: next.val[key],
					})
				}
			}
		}
	}
}

const isRef = (x: any): x is Ref<any> =>
	typeof x === 'object' && x !== null && x.hasOwnProperty('$type') && x.$type === 'ref'
// @ts-ignore
export const inferSchema: InferSchema = (dataFragment) => {
	const schema = {}
	const removed: Array<Array<string | number>> = []
	traverse(
		dataFragment,
		(value, path) => {
			if (typeof value === 'undefined') {
				removed.push(path)
				return true
			}
			if (isRef(value)) {
				setByArray(schema, path, value)
				return true
			}
		},
		BIG_FACTOR
	)
	return { schema, removed }
}

export const createMaterializer: MaterializerFactory = ({ observedRoots, depth, transform }) => {
	const template = {}
	const materialized = {}
	const schemas = {}
	const pendingInvalidations = new Set<string>()
	const index: Map<string, Set<string>> = new Map()

	const mergeTemplates = (newTemplate: DataFragment) => {
		traverse(
			newTemplate,
			(value, path) => {
				if (typeof value === 'undefined') {
					const oldTemplate = getByArray(template, path)
					traverse(
						oldTemplate,
						(__, oldPath) => {
							if (path.length + oldPath.length === depth) {
								pendingInvalidations.add([...path, ...oldPath].join('.'))
								return true
							}
						},
						SMALL_FACTOR
					)
					setByArray(template, path, undefined)
					return true
				}

				if (path.length === depth) {
					const oldTemplate = getByArray(template, path)
					pendingInvalidations.add(path.join('.'))
					if (isObjectLike(oldTemplate)) {
						setByArray(template, path, { ...oldTemplate, ...value })
					} else {
						setByArray(template, path, value)
					}
					return true
				}
			},
			BIG_FACTOR
		)
	}

	const mergeSchemas = (newSchema: DataFragment, removed: Array<Array<string | number>> = []) => {
		removed.forEach((pathToRemove) => {
			const oldSchema = getByArray(schemas, pathToRemove)
			if (!oldSchema) {
				return
			}

			traverse(
				oldSchema,
				(val) => {
					if (val.hasOwnProperty('$type')) {
						const oldRefPath = take(val.refPath, depth).join('.')
						index.get(oldRefPath)!.delete(take(pathToRemove, depth).join('.'))
						return true
					}
				},
				SMALL_FACTOR
			)
		})
		traverse(
			newSchema,
			(value, path) => {
				if (!value.$type) {
					return
				}

				const oldSchema = getByArray(schemas, path)
				if (oldSchema) {
					const oldRefPath = take(oldSchema.refPath, depth).join('.')
					if (!index.has(oldRefPath)) {
						index.set(oldRefPath, new Set<string>())
					}
					index.get(oldRefPath)!.delete(take(path, depth).join('.'))
				}

				setByArray(schemas, path, value)
				const refPath = take(value.refPath, depth).join('.')
				if (!index.has(refPath)) {
					index.set(refPath, new Set<string>())
				}
				index.get(refPath)!.add(take(path, depth).join('.'))
				return true
			},
			SMALL_FACTOR
		)
	}

	const getAllInvalidations = (invalidations: Set<string>) => {
		const allInvalidations: Set<string> = new Set<string>()
		const queue = new Queue<Set<string>>(BIG_FACTOR)
		queue.enqueue(invalidations)
		while (!queue.isEmpty()) {
			const paths = queue.dequeue()
			paths.forEach((p) => {
				if (allInvalidations.has(p)) {
					return
				}

				allInvalidations.add(p)
				if (index.has(p)) {
					queue.enqueue(index.get(p)!)
				}
			})
		}
		return allInvalidations
	}

	const populate = (invalidations: Set<string>) => {
		const allInvalidations: Set<string> = getAllInvalidations(invalidations)
		const paths = toposort(allInvalidations, index).map((path) => path.split('.'))

		for (const path of paths) {
			const val = getByArray(template, path)

			if (!hasByArray(schemas, path)) {
				setByArray(materialized, path, transform ? transform(val, path) : val)
				continue
			}
			const nodeSchema = getByArray(schemas, path)
			let newVal = {}
			traverse(
				val,
				(objValue, objPath) => {
					const schema = getByArray(nodeSchema, objPath)
					if (!schema) {
						setByArray(newVal, objPath, objValue)
						return true
					}
					if (schema.hasOwnProperty('$type')) {
						const resolved = getByArray(materialized, schema.refPath) ?? schema.defaultValue
						if (objPath.length > 0) {
							setByArray(newVal, objPath, resolved)
						} else {
							newVal = resolved
						}
						return true
					}
					if (Array.isArray(objValue)) {
						setByArray(newVal, objPath, [])
						return
					}
				},
				SMALL_FACTOR
			)
			setByArray(materialized, path, transform ? transform(newVal, path) : newVal)
		}

		return paths
	}

	const flush = () => {
		const recursiveInvalidations = populate(pendingInvalidations)

		pendingInvalidations.clear()

		return recursiveInvalidations.filter(([root]) => observedRoots.includes(root))
	}

	const updateWithoutFlush: Update<void> = (fragment, { schema, removed } = inferSchema(fragment)) => {
		mergeSchemas(schema, removed)
		mergeTemplates(fragment)
	}

	return {
		update(fragment, schema) {
			updateWithoutFlush(fragment, schema)
			return flush()
		},
		batch(batchFunction) {
			batchFunction(updateWithoutFlush)
			return flush()
		},
		get: (path) => (Array.isArray(path) ? getByArray(materialized, path) : getByString(materialized, path)),
	}
}

export const createRef = <T>(refPath: Array<string>, defaultValue?: any): Ref<T> => {
	return { $type: 'ref', refPath, defaultValue }
}

export function getBoundRefProvider(pathToBind: Array<string>): RefProvider {
	return <T>(innerPath: Array<string>, defaultValue?: any): Ref<T> =>
		createRef<T>([...pathToBind, ...innerPath], defaultValue)
}
