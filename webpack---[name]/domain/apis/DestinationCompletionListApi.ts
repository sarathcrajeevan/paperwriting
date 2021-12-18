import {GraphQL} from '../../graphql';
import {ApiBase} from './ApiBase';
import {IDestinationCompletion} from '@wix/wixstores-graphql-schema';
import {GetDestinationCompletionListQueryVariables} from '../../graphql/queries-schema';

export class DestinationCompletionListApi extends ApiBase {
  /* istanbul ignore next */
  public async getList(variables: GetDestinationCompletionListQueryVariables): Promise<IDestinationCompletion[]> {
    const response = await this.siteStore.tryGetGqlAndFallbackToPost(this.endpoint, {
      ...GraphQL.getDestinationCompletionList(variables),
      operationName: 'getDestinationCompletionList',
      source: 'WixStoresWebClient',
    });

    return response.data.destinationCompletionList;
  }
}
