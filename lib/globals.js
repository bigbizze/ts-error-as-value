"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
var with_result_1 = require("./with-result");
var partition_results_1 = require("./partition-results");
var ResultIs = {
    success: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.warn("ResultIs.success is deprecated and will be removed in a later update. Use ok instead.");
        return _1.ok.apply(void 0, args);
    },
    failure: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.warn("ResultIs.failure is deprecated and will be removed in a later update. Use err instead.");
        return _1.err.apply(void 0, args);
    }
};
if (typeof window !== "undefined") {
    window.err = _1.err;
    window.ok = _1.ok;
    window.ResultIs = ResultIs; // For backwards compatibility
    window.withResult = with_result_1.withResult;
    window.partitionResults = partition_results_1.partitionResults;
}
else {
    globalThis.err = _1.err;
    globalThis.ok = _1.ok;
    globalThis.ResultIs = ResultIs; // For backwards compatibility
    globalThis.withResult = with_result_1.withResult;
    globalThis.partitionResults = partition_results_1.partitionResults;
}
