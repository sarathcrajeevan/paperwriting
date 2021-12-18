const {
    generateDependenciesToken,
    EMPTY_DEPENDENCIES_TOKEN
} = require('@wix/cloud-user-code-dependencies-token-generator')
const {
    enrichUrl
} = require('./enrichUrl')

const generateDependenciesTokenFromCodePackages = codePackagesData => {
    if (!codePackagesData || codePackagesData === []) {
        return EMPTY_DEPENDENCIES_TOKEN
    }

    const codePackagesObject = codePackagesData.reduce((acc, codePackage) => {
        acc[codePackage.importName] = codePackage.gridAppId
        return acc
    }, {})

    return generateDependenciesToken(codePackagesObject)
}

const createUserCodeMapWithEnrichedUrls = ({
    userCodeMap,
    codePackagesData
}) => {
    const dependenciesToken = generateDependenciesTokenFromCodePackages(
        codePackagesData
    )

    return userCodeMap.map(userCodeData => {
        return {
            ...userCodeData,
            url: enrichUrl(userCodeData.url, {
                'dependencies-token': dependenciesToken
            })
        }
    })
}

module.exports = {
    createUserCodeMapWithEnrichedUrls
}