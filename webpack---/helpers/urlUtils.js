const COLLECTION_FIELD = /[^{}]+(?=\})/g
const COLLECTION_FIELD_INCLUDING_BRACES = /\{[^{}]+\}/g
const NON_LETTER_OR_NUMBER = /[^\dA-Za-z]/g

export const cleanUrl = url => url.replace(/(\/{2,})/g, '/').replace(/^\//, '')

export const parseUrlPattern = pattern => {
    pattern = cleanUrl(pattern)
    return {
        fields: pattern.match(COLLECTION_FIELD) || [],
        nonFields: pattern
            .replace(COLLECTION_FIELD, '')
            .split(NON_LETTER_OR_NUMBER)
            .filter(x => !!x),
    }
}

export const parseUrl = url => {
    url = cleanUrl(url)
    const urlParts = url.split('/').filter(s => s.length > 0)
    const pattern = '/' + urlParts.slice(1).join('/')
    return {
        prefix: urlParts[0],
        pattern,
    }
}

export const buildUrl = (prefix, pattern) => cleanUrl(`${prefix}/${pattern}`)

export const constructUrl = (
    record,
    dynamicUrl,
    useLowerCaseInDynamicValues,
) => {
    return (
        '/' +
        cleanUrl(dynamicUrl).replace(COLLECTION_FIELD_INCLUDING_BRACES, match => {
            const fieldName = match.substring(1, match.length - 1)
            const fieldValue = useLowerCaseInDynamicValues ?
                String(record[fieldName]).toLowerCase() :
                record[fieldName]
            return encodeURIComponent(`${fieldValue}`.replace(/ /g, '-'))
        })
    )
}

export const addField = (url, field) => cleanUrl(`${url}/{${field}}`)

export const isEqual = (url1, url2) => cleanUrl(url1) === cleanUrl(url2)