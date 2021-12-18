export const isObjectLike = (item: unknown) => Array.isArray(item) || typeof item === 'object'

export const take = (list: Array<string | number>, count: number) =>
	count === list.length ? list : list.slice(0, count)

export const getByArray = (obj: any, path: Array<string | number>) => {
	let val = obj
	for (const pathPart of path) {
		val = val[pathPart]
		if (typeof val === 'undefined') {
			return undefined
		}
	}

	return val
}

export const getByString = (obj: any, path: string) => getByArray(obj, path.split('.'))

export const setByArray = (obj: any, path: Array<string | number>, value: unknown) => {
	let val = obj
	let i = 0
	for (; i < path.length - 1; i++) {
		val[path[i]] = val[path[i]] || {}
		val = val[path[i]]
	}
	val[path[i]] = value
}

export const setByString = (obj: any, path: string, value: unknown) => setByArray(obj, path.split('.'), value)

export const hasByArray = (obj: any, pathArray: Array<string>) => {
	let val = obj
	for (const pathPart of pathArray) {
		if (val.hasOwnProperty(pathPart)) {
			val = val[pathPart]
		} else {
			return false
		}
	}

	return true
}
