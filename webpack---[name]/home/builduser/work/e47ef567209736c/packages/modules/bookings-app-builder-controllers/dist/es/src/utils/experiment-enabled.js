import {
    __awaiter,
    __generator
} from "tslib";
export function isExperimentEnabled(spec, experiments) {
    return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
            switch (_a.label) {
                case 0:
                    return [4 /*yield*/ , experiments.ready()];
                case 1:
                    _a.sent();
                    return [2 /*return*/ , experiments.get(spec) === 'true'];
            }
        });
    });
}
//# sourceMappingURL=experiment-enabled.js.map