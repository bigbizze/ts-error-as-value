export { partitionResults } from "./partition-results";
export { withResult } from "./with-result";
export type Failure<T = void, E extends Error = Error> = {
    data: null;
    error: E;
    successOrThrow(): T;
    successOrDefault<D>(defaultValue: D): D;
    transformOnFailure<E2 extends Error>(fn: (fail: E) => E2): Failure<T, E2>;
    transformOnSuccess<N>(fn: (data: never) => N): Failure<T, E>;
};
export type Success<T = void> = {
    data: T;
    error: null;
    successOrThrow(): T;
    successOrDefault<D>(defaultValue: D): T;
    transformOnFailure<E2 extends Error>(fn: (fail: never) => E2): Success<T>;
    transformOnSuccess<N>(fn: (data: T) => N): Success<N>;
};
export type Result<T = void, E extends Error = Error> = Failure<T, E> | Success<T>;
export declare function err<T = void, E extends Error = Error>(error: E): Failure<T, E>;
export declare function ok(): Success;
export declare function ok<T>(data?: T): Success<T>;
