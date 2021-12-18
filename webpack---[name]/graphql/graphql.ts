/* eslint-disable  */
import {GetDestinationCompletionListQueryVariables} from './queries-schema';
import {query as getStoreSettingsQuery} from './getStoreSettings.graphql';
import {query as getDestinationCompletionListQuery} from './getDestinationCompletionList.graphql';

export class GraphQL {
  /* istanbul ignore next */
  static getStoreSettings() {
    return {
      query: getStoreSettingsQuery,
    } as {query: any};
  }

  /* istanbul ignore next */
  static getDestinationCompletionList(variables: GetDestinationCompletionListQueryVariables) {
    return {
      query: getDestinationCompletionListQuery,
      variables,
    } as {query: any; variables: GetDestinationCompletionListQueryVariables};
  }
}
