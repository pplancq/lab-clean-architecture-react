import { DomainValidationError } from './DomainValidationError';

/**
 * Validation error raised when a numeric field is not strictly positive.
 *
 * @example
 * ```typescript
 * return Result.err(new PositiveNumberError('duration'));
 * // message: "duration must be a positive number"
 *
 * return Result.err(new PositiveNumberError('amount', 'Amount must be greater than zero'));
 * // message: "Amount must be greater than zero"
 * ```
 */
export class PositiveNumberError extends DomainValidationError {
  constructor(field: string, message = `${field} must be a positive number`) {
    super(field, message);
    this.name = 'PositiveNumberError';
  }
}
