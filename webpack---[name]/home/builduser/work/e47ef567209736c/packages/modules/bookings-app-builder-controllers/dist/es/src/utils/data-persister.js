import {
    __awaiter,
    __generator
} from "tslib";
var DataPersister = /** @class */ (function() {
    function DataPersister() {
        this.fetchedData = {};
        this.savedData = {};
    }
    DataPersister.prototype.getOrFetch = function(fetcher, forceFetch) {
        if (forceFetch === void 0) {
            forceFetch = false;
        }
        return __awaiter(this, void 0, void 0, function() {
            var fetchedData;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        if (!forceFetch && this.fetchedData[fetcher.toString()]) {
                            return [2 /*return*/ , this.fetchedData[fetcher.toString()]];
                        }
                        return [4 /*yield*/ , fetcher()];
                    case 1:
                        fetchedData = _a.sent();
                        this.fetchedData[fetcher.toString()] = fetchedData;
                        return [2 /*return*/ , fetchedData];
                }
            });
        });
    };
    DataPersister.prototype.get = function(key) {
        return this.savedData[key];
    };
    DataPersister.prototype.set = function(key, value) {
        this.savedData[key] = value;
    };
    return DataPersister;
}());
export default DataPersister;
//# sourceMappingURL=data-persister.js.map