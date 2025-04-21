"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withResult = exports.partitionResults = void 0;
exports.err = err;
exports.ok = ok;
var partition_results_1 = require("./partition-results");
Object.defineProperty(exports, "partitionResults", { enumerable: true, get: function () { return partition_results_1.partitionResults; } });
var with_result_1 = require("./with-result");
Object.defineProperty(exports, "withResult", { enumerable: true, get: function () { return with_result_1.withResult; } });
function err(error) {
    return {
        data: null,
        error: error,
        successOrThrow: function () {
            throw error;
        },
        successOrDefault: function (defaultValue) {
            return defaultValue;
        },
        transformOnFailure: function (fn) {
            return err(fn(error));
        },
        transformOnSuccess: function () {
            return this;
        }
    };
}
function ok(data) {
    if (data === void 0) { data = undefined; }
    return {
        data: data,
        error: null,
        successOrThrow: function () {
            return data;
        },
        successOrDefault: function () {
            return data;
        },
        transformOnFailure: function () {
            return this;
        },
        transformOnSuccess: function (fn) {
            return ok(fn(data));
        }
    };
}
