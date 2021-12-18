export var getScopedVar = function(_a) {
    var name = _a.name,
        prefix = _a.prefix;
    return prefix ? "--" + prefix + "-corvid-" + name : "--corvid-" + name;
};
//# sourceMappingURL=getScopedVar.js.map