export var wixSDKDemoValues = function(_a) {
    var _b = _a === void 0 ? {} : _a,
        _c = _b.instanceId,
        instanceId = _c === void 0 ? '' : _c,
        _d = _b.isOverEditor,
        isOverEditor = _d === void 0 ? true : _d,
        _e = _b.isOwner,
        isOwner = _e === void 0 ? true : _e,
        _f = _b.biToken,
        biToken = _f === void 0 ? '' : _f,
        _g = _b.contactId,
        contactId = _g === void 0 ? '' : _g,
        _h = _b.visitorId,
        visitorId = _h === void 0 ? '' : _h,
        _j = _b.isFullWidth,
        isFullWidth = _j === void 0 ? true : _j;
    return ({
        Utils: {
            getInstanceId: function() {
                return instanceId;
            },
            isOverEditor: function() {
                return isOverEditor;
            },
            getPermissions: function() {
                return isOwner ? 'OWNER' : '';
            },
            getInstanceValue: function(key) {
                var map = {
                    biToken: biToken,
                    uid: visitorId
                };
                return map[key];
            },
            getUid: function() {
                return contactId;
            },
        },
        Settings: {
            isFullWidth: function() {
                return isFullWidth;
            },
        },
    });
};
//# sourceMappingURL=WixSDKMockValues.js.map