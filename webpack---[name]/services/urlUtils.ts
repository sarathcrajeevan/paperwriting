/* istanbul ignore next */
export function queryToString(queryStringObj: Record<string, any>) {
  return Object.keys(queryStringObj)
    .map((prop) => `${prop}=${encodeURIComponent(queryStringObj[prop]).replace(/%20/g, '+').replace(/\*/g, '%2A')}`)
    .join('&');
}
