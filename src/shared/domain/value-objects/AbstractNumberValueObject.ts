import { PositiveNumberError } from "@Shared/domain/errors/PositiveNumberError";
import { Result } from "@Shared/domain/result/Result";

/**
 * Abstract base class for number-based value objects.
 *
 * Provides reusable validation helpers as protected static methods.
 * Subclasses extend this class and call these helpers in their static `create` factory.
 *
 * @example
 * ```typescript
 * export class ToastDuration extends AbstractNumberValueObject {
 *   private constructor(value: number) { super(value); }
 *
 *   public static create(value: number): Result<ToastDuration, DomainValidationErrorInterface> {
 *     const check = AbstractNumberValueObject.positiveNumber('duration', value);
 *     if (check.isErr()) return Result.err(check.getError());
 *     return Result.ok(new ToastDuration(value));
 *   }
 * }
 * ```
 */
export abstract class AbstractNumberValueObject {
  protected constructor(protected readonly value: number) {}

  /**
   * Validates that a number is strictly positive (>= 1) and finite.
   *
   * @param field - Field name used in the error message
   * @param value - The number to validate
   */
  protected static positiveNumber(field: string, value: number): Result<number, PositiveNumberError> {
    if (!Number.isFinite(value) || value < 1) {
      return Result.err(new PositiveNumberError(field));
    }
    return Result.ok(value);
  }
}
