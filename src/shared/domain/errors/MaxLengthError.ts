import { DomainValidationError } from "./DomainValidationError";

/**
 * Validation error raised when a field value exceeds its maximum allowed length.
 *
 * @example
 * ```typescript
 * return Result.err(new MaxLengthError('title', 200));
 * // message: "title cannot exceed 200 characters"
 *
 * return Result.err(new MaxLengthError('title', 200, 'Game title is too long'));
 * // message: "Game title is too long"
 * ```
 */
export class MaxLengthError extends DomainValidationError {
  constructor(field: string, maxLength: number, message = `${field} cannot exceed ${maxLength} characters`) {
    super(field, message);
    this.name = "MaxLengthError";
  }
}
