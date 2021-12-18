import {
    CONTEXT_PROPS
} from '../types/ContextProps';
import {
    get
} from '../utils/get';
import {
    BLOG_TPA_PAGE_ID,
    RSS_ROUTES,
    RSS_ROUTE_TYPES
} from './consts';
import {
    BLOG_APP_DEF_ID
} from './static-page-v2/consts';
import {
    getRssFullURL
} from './utils';
export var getBlogFeedRoute = function(item) {
    var _a, _b;
    var requiredApps = [BLOG_APP_DEF_ID];
    var isHomePage = get(item, "context." + CONTEXT_PROPS.IS_HOME_PAGE) === 'true';
    var installedApps = (_b = (_a = item === null || item === void 0 ? void 0 : item.context) === null || _a === void 0 ? void 0 : _a[CONTEXT_PROPS.INSTALLED_APPS]) === null || _b === void 0 ? void 0 : _b.map(function(app) {
        return app.appDefinitionId;
    });
    var shouldAppsRenderTag = requiredApps === null || requiredApps === void 0 ? void 0 : requiredApps.some(function(appDefId) {
        return installedApps === null || installedApps === void 0 ? void 0 : installedApps.includes(appDefId);
    });
    var isBlogFeedPage = get(item, "context." + CONTEXT_PROPS.TPA_PAGE_ID) === BLOG_TPA_PAGE_ID;
    if ((isHomePage && shouldAppsRenderTag) || isBlogFeedPage) {
        var siteUrl = get(item, "context." + CONTEXT_PROPS.SITE_URL);
        return getRssFullURL({
            siteUrl: siteUrl,
            rssRoute: RSS_ROUTES[RSS_ROUTE_TYPES.BLOG],
        });
    }
    return '';
};