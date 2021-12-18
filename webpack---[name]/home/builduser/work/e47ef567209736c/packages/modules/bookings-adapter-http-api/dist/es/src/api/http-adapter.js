import {
    __assign
} from "tslib";
export var XSRF_HEADER_NAME = 'X-XSRF-TOKEN';

function handleRawResponse(rawResponse, expectResponseData) {
    if (rawResponse.status !== 200) {
        var urlWithoutDomain = rawResponse.url && rawResponse.url.replace(/^.*\/\/[^\/]+/, '');
        throw new Error("Got " + rawResponse.statusText + " (" + rawResponse.status + ") when requested: " + urlWithoutDomain);
    }
    return expectResponseData ? rawResponse.json() : {};
}

function createHttpCall(method, url, config, expectResponse, data) {
    var init = __assign(__assign({}, config), {
        method: method
    });
    if (data) {
        init.body = JSON.stringify(data);
    }
    return fetch(url, init).then(function(res) {
        return handleRawResponse(res, expectResponse);
    });
}
export default function httpAdapterFactory(instance, revision, csrfToken) {
    var getConfig = function(csrfTokenNeeded) {
        if (csrfTokenNeeded === void 0) {
            csrfTokenNeeded = false;
        }
        var config = {
            headers: {
                'Content-Type': 'application/json',
                'x-wix-site-revision': revision,
                authorization: instance,
            },
        };
        if (csrfTokenNeeded && csrfToken) {
            config.headers[XSRF_HEADER_NAME] = csrfToken;
        }
        return config;
    };
    return {
        get: function(url, specificConfig) {
            if (specificConfig === void 0) {
                specificConfig = getConfig();
            }
            return createHttpCall('get', url, specificConfig, true);
        },
        put: function(url, data, expectResponse) {
            if (expectResponse === void 0) {
                expectResponse = false;
            }
            return createHttpCall('put', url, getConfig(true), expectResponse, data);
        },
        post: function(url, data, expectResponse) {
            if (expectResponse === void 0) {
                expectResponse = false;
            }
            return createHttpCall('post', url, getConfig(true), expectResponse, data);
        },
        delete: function(url, expectResponse) {
            if (expectResponse === void 0) {
                expectResponse = false;
            }
            return createHttpCall('delete', url, getConfig(true), expectResponse);
        },
    };
}
//# sourceMappingURL=http-adapter.js.map