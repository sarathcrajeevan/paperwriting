export var basePropsSDKFactory = function(_a) {
    var handlers = _a.handlers,
        metaData = _a.metaData;
    var compId = metaData.compId,
        connection = metaData.connection,
        compType = metaData.compType,
        isGlobal = metaData.isGlobal,
        getParent = metaData.getParent,
        role = metaData.role,
        wixCodeId = metaData.wixCodeId;
    var type = "$w." + compType;
    return {
        get id() {
            return wixCodeId || role; // TODO check with @zivp if forms need this "|| role" and if not remove it.
        },
        get role() {
            return role;
        },
        get connectionConfig() {
            return connection === null || connection === void 0 ? void 0 : connection.config;
        },
        get uniqueId() {
            return compId;
        },
        get parent() {
            return getParent();
        },
        get global() {
            return isGlobal();
        },
        get type() {
            return type;
        },
        scrollTo: function() {
            return new Promise(function(resolve) {
                return handlers.scrollToComponent(compId, resolve);
            });
        },
        toJSON: function() {
            return {
                id: role,
                type: type,
                global: global
            };
        },
    };
};
//# sourceMappingURL=basePropsSDKFactory.js.map