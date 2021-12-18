export const query = `query getFilters($enabledFilters: [String!]!, $mainCategory: String) {
    catalog {
        filters(enabledFilters: $enabledFilters, mainCategory: $mainCategory) {
            filterType
            name
            field
            values {
                key
                value
            }
        }
    }

}
`;
