import { Result } from "./index";
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
export declare const withResult: <T, E extends Error, R>(fn: (...args: T[]) => R, fnContext?: any) => (...args: T[]) => R extends Promise<infer u> ? Promise<Result<u, E>> : Result<R, E>;
