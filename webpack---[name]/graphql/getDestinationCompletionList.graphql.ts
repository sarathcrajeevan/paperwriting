export const query = `query getDestinationCompletionList($forShipping: Boolean!, $forTax: Boolean!) {
  destinationCompletionList(forShipping: $forShipping, forTax: $forTax) {
    country
    subdivisions
  }
}`;
