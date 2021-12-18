export enum SelectedOfferingsFilterType {
  ALL = 'ALL',
  SPECIFIC = 'SPECIFIC',
  FIRST = 'FIRST',
}
export interface SelectedResources {
  categories?: string[];
  offerings?: string[];
  filter: SelectedOfferingsFilterType;
}
