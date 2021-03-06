export var addToken = function(url, item) {
    var token = item.dto.imageToken || item.dto.token;
    if (token) {
        url = url.replace(/,wm_.+\//g, '/');
        return url + ("?token=" + token);
    }
    return url;
};
export default {
    addToken: addToken
};
//# sourceMappingURL=imageTokenHelper.js.map