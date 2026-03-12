import { DomainValidationError } from './DomainValidationError';

/**
 * Validation error raised when a required field is empty or whitespace-only.
 *
 * @example
 * ```typescript
 * return Result.err(new NotEmptyError('title'));
 * // message: "title cannot be empty"
 *
 * return Result.err(new NotEmptyError('title', 'Game title is required'));
 * // message: "Game title is required"
 * ```
 */
export class NotEmptyError extends DomainValidationError {
  constructor(field: string, message = `${field} cannot be empty`) {
    super(field, message);
    this.name = 'NotEmptyError';
  }
}
