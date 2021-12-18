import {
    isEnvLive
} from '../../helpers/viewMode'

const getDefaults = (initAppForPageBIParams = {}, viewMode) => {
    const liveSiteDefaults = isEnvLive(viewMode) ?
        {
            vsi: initAppForPageBIParams.viewerSessionId
        } :
        {}

    return {
        pageId: initAppForPageBIParams.pageId,
        ...liveSiteDefaults,
    }
}

export default getDefaults