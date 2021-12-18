import {
    entries,
    isPlainObject,
    isArray
} from 'lodash-es'
import {
    Maybe
} from '@wix/wix-code-adt'

// parseStandardFilter :: FilterExpression -> Maybe {field, condition, value, positive}
export const parseStandardFilter = filterExpression =>
    getFirstEntry(filterExpression)
    .chain(([operator, operands]) =>
        operator === '$not' && isArray(operands) ?
        parseStandardFilterSigned({
            positive: false,
            filterExpression: operands[0],
        }) :
        Maybe.Nothing(),
    )
    .orElse(() =>
        parseStandardFilterSigned({
            positive: true,
            filterExpression
        }),
    )

// parseStandardFilterSigned :: {positive, filterExpression} -> Maybe {field, condition, value, positive}
const parseStandardFilterSigned = ({
        positive,
        filterExpression
    }) =>
    getFirstEntry(filterExpression).chain(
        ([field, filterExpressionAtCondition]) =>
        getFirstEntry(filterExpressionAtCondition).map(([condition, value]) => ({
            field,
            condition,
            value,
            positive,
        })),
    )

// getFirstEntry :: Object => Maybe [key, value]
const getFirstEntry = object => {
    if (!isPlainObject(object)) {
        return Maybe.Nothing()
    }

    const firstEntry = entries(object)[0]

    return Maybe.fromNullable(firstEntry)
}