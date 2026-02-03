/**
 * Result class for type-safe error handling without exceptions in domain layer
 *
 * Represents either a successful value (Ok) or an error (Err).
 *
 * **Philosophy:** Exceptions thrown by getValue/getError indicate developer bugs (misuse),
 * not business logic errors. Business errors are captured as Err states.
 * With proper type guards (isOk/isErr), normal code flow has no exceptions.
 *
 * Follows OOP principles with encapsulation and single responsibility.
 *
 * @template T - Type of the success value
 * @template E - Type of the error
 *
 * @example
 * ```typescript
 * // Creating a successful result
 * const success = Result.ok(42);
 *
 * // Creating an error result
 * const error = Result.err("Something went wrong");
 *
 * // Type-safe checking (no exceptions in normal flow)
 * if (success.isOk()) {
 *   console.log(success.getValue()); // 42 - safe
 * }
 * ```
 */
export class Result<T, E> {
  private constructor(
    private readonly success: boolean,
    private readonly data: T | E,
  ) {}

  /**
   * Creates a successful Result containing a value
   *
   * @template T - Type of the success value
   * @param value - The success value to wrap
   * @returns A Result in the Ok state
   *
   * @example
   * ```typescript
   * const result = Result.ok(42);
   * ```
   */
  static ok<T>(value: T): Result<T, never> {
    return new Result<T, never>(true, value);
  }

  /**
   * Creates a failed Result containing an error
   *
   * @template E - Type of the error
   * @param error - The error to wrap
   * @returns A Result in the Err state
   *
   * @example
   * ```typescript
   * const result = Result.err("Not found");
   * ```
   */
  static err<E>(error: E): Result<never, E> {
    return new Result<never, E>(false, error);
  }

  /**
   * Checks if this Result is Ok
   * Type guard for TypeScript type narrowing
   *
   * @returns True if Result is Ok, false otherwise
   *
   * @example
   * ```typescript
   * if (result.isOk()) {
   *   const value = result.getValue();
   * }
   * ```
   */
  isOk(): this is Result<T, never> {
    return this.success;
  }

  /**
   * Checks if this Result is Err
   * Type guard for TypeScript type narrowing
   *
   * @returns True if Result is Err, false otherwise
   *
   * @example
   * ```typescript
   * if (result.isErr()) {
   *   console.error(result.getError());
   * }
   * ```
   */
  isErr(): this is Result<never, E> {
    return !this.success;
  }

  /**
   * Extracts the value from an Ok Result
   * Returns default value if provided and Result is Err
   *
   * **Note:** Throws if Result is Err and no defaultValue provided. This indicates
   * developer error (misuse). Always use isOk() type guard first, or provide a default.
   *
   * @param defaultValue - Optional default value to return if Result is Err
   * @returns The value if Ok, or defaultValue if provided and Err
   * @throws Error if Result is Err and no defaultValue provided (developer bug)
   *
   * @example
   * ```typescript
   * const success = Result.ok(42);
   * success.getValue();     // 42
   * success.getValue(0);    // 42
   *
   * const error = Result.err("Not found");
   * error.getValue(0);      // 0 (uses default, safe)
   *
   * // Safe with type guard (recommended)
   * if (error.isErr()) {
   *   // won't reach here
   * } else {
   *   error.getValue();     // Safe, no throw
   * }
   * ```
   */
  getValue(defaultValue?: T): T {
    if (this.success) {
      return this.data as T;
    }
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(String(this.data));
  }

  /**
   * Extracts the error from an Err Result
   *
   * **Note:** Throws if Result is Ok. This indicates developer error (misuse).
   * Always use isErr() type guard first.
   *
   * @returns The error value
   * @throws Error if Result is Ok (developer bug)
   *
   * @example
   * ```typescript
   * const error = Result.err("Not found");
   * error.getError();   // "Not found"
   *
   * // Safe with type guard (recommended)
   * if (error.isErr()) {
   *   error.getError();   // Safe, no throw
   * }
   * ```
   */
  getError(): E {
    if (!this.success) {
      return this.data as E;
    }
    throw new Error('Called getError on an Ok value');
  }

  /**
   * Transforms the value inside an Ok Result
   * Returns a new Result with the transformed value
   * Passes through Err unchanged
   *
   * @param fn - Function to apply to the value
   * @returns A new Result with the transformed value
   *
   * @example
   * ```typescript
   * const result = Result.ok(42);
   * const mapped = result.transform(n => n.toString());
   * // Result.ok("42")
   *
   * const errorResult = Result.err<number, string>("error");
   * const mappedError = errorResult.transform(n => n.toString());
   * // Result.err("error") - unchanged
   * ```
   */
  transform<U>(fn: (value: T) => U): Result<U, E> {
    if (this.success) {
      return Result.ok(fn(this.data as T));
    }
    return Result.err(this.data as E);
  }

  /**
   * Transforms the error inside an Err Result
   * Returns a new Result with the transformed error
   * Passes through Ok unchanged
   *
   * @param fn - Function to apply to the error
   * @returns A new Result with the transformed error
   *
   * @example
   * ```typescript
   * const result = Result.err("error");
   * const mapped = result.transformErr(e => new Error(e));
   * // Result.err(Error("error"))
   *
   * const okResult = Result.ok<number, string>(42);
   * const mappedOk = okResult.transformErr(e => new Error(e));
   * // Result.ok(42) - unchanged
   * ```
   */
  transformErr<F>(fn: (error: E) => F): Result<T, F> {
    if (this.success) {
      return Result.ok(this.data as T);
    }
    return Result.err(fn(this.data as E));
  }
}
