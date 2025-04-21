"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPromise = void 0;
var isPromise = function (value) {
    return value.then != null;
};
exports.isPromise = isPromise;
