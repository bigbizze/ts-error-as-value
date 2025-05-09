### Typescript error as value

### Motivation
Any error-as-values library in typescript is liable for being used *a lot* within any project which adds it, so making the API as convenient as humanly possible was my primary concern.

The alternative typescript libraries for achieving errors-as-values all seem to have verbose and cumbersome APIs, often wrapping all returns with class instances, and asking you to call method on them such as "isOk" or "isErr" to function.

Instead of this, we leverage typescript's discriminated unions to handle most of the heavy lifting for us.

To further decrease friction for using this in your project, you can also import the functions and types of this package into your project's global scope in a convenient way.

---

### Install

```bash
yarn install ts-err-as-value
```
or
```bash
pnpm install ts-err-as-value
```
---

### (Optionally) Make functions and types global
```ts
import "ts-err-as-value/globals";
```
This will make the functions ok, err and withResult, partitionResults, as well as the types Success, Failure and Result globally available

---

## ok and err - Basic Usage
Creating `Success` and `Failure` result objects
```ts
const { data, error } = ok("Hello");
if (error) {
  // do something with error
} else {
  // do something with data
}
```
or

```ts

const {data, error} = err(new Error("Error"));
if (error) {
 // do something with error
} else {
 // do something with data
}
```
---

Wrapping the returns from functions with `err` for errors, and `ok` for non-error so that the function calling it receives a `Result` type.

```ts
// Specifying the return type here is optional, as it will be inferred without it
const fnWithResult = (): Result<string, Error> => {
  if ("" !== "") {
    return ok("hello");
  }
  return err(new Error("Method failed"));
};

const { data, error } = fnWithResult();

if (error) {
  // is an error
} else {
  // data is guaranteed to be a string here, and error is guaranteed to be null
}
```

Or with promises:

```ts
const fnWithResult = async (): Promise<Result<string, Error>> => {
  if ("" !== "") {
    return ok("hello");
  }
  return err(new Error("Method failed"));
};

const callsFnThatCallsFnWithResult = async () => {
  const { data, error, errorStack } = (await fnWithResult())
  if (error) {
    return err(error);
  }
  return ok(data);
};

callsFnThatCallsFnWithResult();
```

--- 

### Chaining methods on a `Result`
```ts

class NewError extends Error {}

const fnWithResult = (): Result<string, Error> => {
  if ("" !== "") {
    return ok("hello");
  }
  return err(new Error("Method failed"));
};

const callsFnThatCallsFnWithResult = async (): Promise<Result<boolean, NewError>> => {
  const { data, error } = fnWithResult()
    // Because of using mapErr below, error will be an instance of NewError if fnWithResult returns an error
    .mapErr(error => new NewError("Failed to call fnWithResult"))
    // Because of using andThen below, data will be boolean if fnWithResult returns a value.
    .andThen(data => {
      return data === "hello";
    });
  if (error) {
    return err(error);
  }
  return ok(data);
};
```

---

## withResult
*One downside to using a system where errors are treated as values in javascript is that you have no control over whether a third party dependency will throw errors or not. As a result, we need a way to wrap functions that can throw errors and force them to return a result for us.*

withResult is a function which wraps another function and returns a `Failure` result if the wrapped function throws an error,
 or a `Success` result if the wrapped function does not.
```ts
import somePkg from "package-that-throws-errors";

const doStuff = withResult(somePkg.doStuff);

const { data, error } = await doStuff("hello");

if (error) {
  // the function doStuff in the package threw an error
}
```

---

## partitionResults
When you have an array of results, we need a convenient way to split the errors from the successes.
This is what `partitionResults` is for. It takes in an array of Results, an array of promises or
results, or a promise of an array of results, and returns an object with the data and errors split into two arrays.

If there is more than one error found, it will return an instance of the native [AggregateError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError).

If there is only one error, it will return the error itself.

If there are no errors, the errors property will be null.

```ts
const arrayOfResults: Result<string>[] = [ ok("hello"), err(new Error("oops")) ];
const { data, errors } = partitionResults(arrayOfResults);
// data: [ "hello" ]
// errors: Error: oops

const promiseOfArrayOfResults: Promise<Result<string>[]> = Promise.resolve([ ok("hello"), err(new Error("oops")) ]);
const { data, errors } = await partitionResults(promiseOfArrayOfResults);
// data: [ "hello" ]
// errors: Error: oops

const arrayOfPromisesOfResults: Promise<Result<string>>[] = [ Promise.resolve(ok("hello")), Promise.resolve(err(new Error("oops"))) ];
const { data, errors } = await partitionResults(promiseOfArrayOfResults);
// data: [ "hello" ]
// errors: Error: oops
```
---

## API

```typescript
export type Failure<E extends Error = Error> = {
  data: null,
  error: E,
  successOrThrow(): void, // Returns the value, but throws an error if the result is an Error
  successOrDefault<D>(defaultValue: D): D, // Returns the value or gives you a default value if it's an error
  transformOnFailure<E2 extends Error>(fn: (fail: E) => E2): Failure<E2>, // If the result is an error, map the error to another error
  transformOnSuccess<N>(fn: (data: never) => N): Failure<E> // If the result is not an error, map the data in it
};

export type Success<T> = {
  data: T,
  error: null,
  successOrThrow(): T, // Returns the value, but throws an error if the result is an Error
  successOrDefault<D>(defaultValue: D): T, // Returns the value or gives you a default value if it's an error
  transformOnFailure<E2 extends Error>(fn: (fail: never) => E2): Success<T>, // If the result is an error, map the error to another error
  transformOnSuccess<N>(fn: (data: T) => N): Success<N> // If the result is not an error, map the data in it
};

export type Result<
  T, E extends Error = Error
> = Failure<E> | Success<T>;

```

```ts
declare function ok<T = void>(data?: T): Success<T>;
declare function err<E extends Error>(error: E): Failure<E>;
```

```ts
// When the wrapped function returns a promise
declare function withResult<T, E extends Error, R>(
  fn: (...args: T[]) => Promise<R>
): (
  ...args: T[]
) => Promise<Result<R, E>>

// When the wrapped function does not return a promise
declare function withResult<T, E extends Error, R>(
  fn: (...args: T[]) => R
): (
  ...args: T[]
) => Result<R, E>
```

```ts

declare interface PartitionedResults<T, E extends Error> {
  data: T[],
  errors: AggregateError | E | null
}

declare function partitionResults<T, E extends Error>(
  results: Result<T, E>[]
): PartitionedResults<T, E>;

declare function partitionResults<T, E extends Error>(
  results: Promise<Result<T, E>[]>
): Promise<PartitionedResults<T, E>>;

declare function partitionResults<T, E extends Error>(
  results: Promise<Result<T, E>>[]
): Promise<PartitionedResults<T, E>>;
```
---




