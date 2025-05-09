export { partitionResults } from "./partition-results";

export { withResult } from "./with-result";


export type Failure<
  T = void,
  E extends Error = Error
> = {
  data: null,
  error: E,
  successOrThrow(): T, // Returns the value, but throws an error if the result is an Error
  successOrDefault<D>(defaultValue: D): D, // Returns the value or gives you a default value if it's an error
  transformOnFailure<E2 extends Error>(fn: (fail: E) => E2): Failure<T, E2>, // If the result is an error, map the error to another error
  transformOnSuccess<N>(fn: (data: never) => N): Failure<T, E> // If the result is not an error, map the data in it
};

export type Success<T = void> = {
  data: T,
  error: null,
  successOrThrow(): T, // Returns the value, but throws an error if the result is an Error
  successOrDefault<D>(defaultValue: D): T, // Returns the value or gives you a default value if it's an error
  transformOnFailure<E2 extends Error>(fn: (fail: never) => E2): Success<T>, // If the result is an error, map the error to another error
  transformOnSuccess<N>(fn: (data: T) => N): Success<N> // If the result is not an error, map the data in it
};

export type Result<
  T = void, E extends Error = Error
> = Failure<T, E> | Success<T>;

export function err<
  T = void,
  E extends Error = Error
>(
  error: E
): Failure<T, E> {
  return {
    data: null,
    error: error,
    successOrThrow(): never {
      throw error;
    },
    successOrDefault<D>(defaultValue: D): D {
      return defaultValue;
    },
    transformOnFailure<E2 extends Error>(fn: (err: E) => E2): Failure<T, E2> {
      return err<T, E2>(fn(error));
    },
    transformOnSuccess(): Failure<T, E> {
      return this;
    }
  };
}

export function ok(): Success;
export function ok<T>(data?: T): Success<T>;
export function ok<T = void>(
  data: T = undefined as T
): Success<T> {
  return {
    data: data,
    error: null,
    successOrThrow(): T {
      return data as T;
    },
    successOrDefault(): T {
      return data as T;
    },
    transformOnFailure(): Success<T> {
      return this;
    },
    transformOnSuccess<N>(fn: (data: T) => N): Success<N> {
      return ok(fn(data as T));
    }
  };
}
