"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partitionResults = partitionResults;
var utils_1 = require("./utils");
var isResultArray = function (array) {
    return array.every(function (item) { return (item && "data" in item && "error" in item); });
};
var isPromiseResultArray = function (array) {
    return array.every(utils_1.isPromise);
};
/**
 * @desc Takes in an array of Results, an array of promises of results, or a promise of an
 * array of results, and returns an object with a data property containing an array of all
 * the data from the results, and an errors property containing an AggregateError if there
 * were multiple errors, a single error if there was only one, or null if there were no
 * errors.
 */
function partitionResults(results) {
    var processResults = function (results) {
        var data = [];
        var errors = [];
        for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
            var result = results_1[_i];
            if (result.error) {
                errors.push(result.error);
            }
            else {
                data.push(result.data);
            }
        }
        var partitionedErrors = null;
        if (errors.length > 1) {
            partitionedErrors = new AggregateError(errors);
        }
        else if (errors.length > 0) {
            partitionedErrors = errors[0];
        }
        return {
            data: data,
            errors: partitionedErrors
        };
    };
    // Check if results is a Promise
    if ((0, utils_1.isPromise)(results)) {
        return results.then(function (resolvedResults) {
            // Handle Promise<Result<T, E>[]>
            if (Array.isArray(resolvedResults)) {
                return processResults(resolvedResults);
            }
            else {
                return Promise.all(resolvedResults).then(processResults);
            }
        });
    }
    else if (Array.isArray(results)) { // Check if results is a Promise[]
        if (isResultArray(results)) {
            // Handle Result<T, E>[]
            return processResults(results);
        }
        else if (isPromiseResultArray(results)) {
            // Handle Promise<Result<T, E>>[]
            return Promise.all(results).then(processResults);
        }
    }
    // Handle Result<T, E>[]
    return processResults(results);
}
