"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withResult = void 0;
var index_1 = require("./index");
var utils_1 = require("./utils");
/**
 * @desc Function which wraps another function and returns a new function that has the same argument types as the wrapped function.
 * This new function will return a Fail result if the wrapped function throws an error, and returns an Ok result if the wrapped function does not.
 * @param fn The wrapped function
 * @param fnContext (optional) the context to execute the wrapped function in (for e.g. if it's a class method and needs the instance's properties to function)
 *
 * @example

 const { data: bufferFromUTF, error } = withResult(Buffer.from)([], "utf-8");
 if (error) {
   return ResultIs.failure(error);
 }
 console.log(bufferFromUTF);

 */
var withResult = function (fn, fnContext) { return function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    try {
        var data = fnContext ? fn.apply(fnContext, args) : fn.apply(void 0, args);
        if ((0, utils_1.isPromise)(data)) {
            return data
                .then(function (value) { return (0, index_1.ok)(value); })
                .catch(function (e) { return (0, index_1.err)(e); });
        }
        return (0, index_1.ok)(data);
    }
    catch (error) {
        var e = error instanceof Error ? error : new Error("Unknown error");
        return (0, index_1.err)(e);
    }
}; };
exports.withResult = withResult;
