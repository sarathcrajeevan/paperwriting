export const query = `query getAppSettings($externalId: String!) {
  appSettings(externalId: $externalId) {
      widgetSettings
    }
}
`;
