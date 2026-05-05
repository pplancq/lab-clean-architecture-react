import { MaxLengthError } from '@Shared/domain/errors/MaxLengthError';
import { NotEmptyError } from '@Shared/domain/errors/NotEmptyError';
import { Result } from '@Shared/domain/result/Result';

/**
 * Abstract base class for string-based value objects.
 *
 * Provides reusable validation helpers as public static methods.
 * Subclasses extend this class and call these helpers in their static `create` factory.
 *
 * @example
 * ```typescript
 * export class GameTitle extends AbstractStringValueObject {
 *   private constructor(value: string) { super(value); }
 *
 *   public static create(value: string): Result<GameTitle, DomainValidationErrorInterface> {
 *     const trimmed = AbstractStringValueObject.trim(value);
 *     const notEmptyCheck = AbstractStringValueObject.notEmpty('title', trimmed);
 *     if (notEmptyCheck.isErr()) return Result.err(notEmptyCheck.getError());
 *     const maxLengthCheck = AbstractStringValueObject.maxLength('title', trimmed, 200);
 *     if (maxLengthCheck.isErr()) return Result.err(maxLengthCheck.getError());
 *     return Result.ok(new GameTitle(trimmed));
 *   }
 * }
 * ```
 */
export abstract class AbstractStringValueObject {
  protected constructor(protected readonly value: string) {}

  /**
   * Trims leading and trailing whitespace from a string.
   * Returns an empty string when given null or undefined.
   */
  protected static trim(value: string): string {
    return value?.trim() ?? '';
  }

  /**
   * Validates that a (pre-trimmed) string is not empty.
   *
   * @param field - Field name used in the error message
   * @param value - The trimmed string to validate
   */
  protected static notEmpty(field: string, value: string): Result<string, NotEmptyError> {
    if (value.length === 0) {
      return Result.err(new NotEmptyError(field));
    }
    return Result.ok(value);
  }

  /**
   * Validates that a string does not exceed the given maximum length.
   *
   * @param field - Field name used in the error message
   * @param value - The string to validate
   * @param max - Maximum allowed character count (inclusive)
   */
  protected static maxLength(field: string, value: string, max: number): Result<string, MaxLengthError> {
    if (value.length > max) {
      return Result.err(new MaxLengthError(field, max));
    }
    return Result.ok(value);
  }
}
