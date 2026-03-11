import { DomainValidationError } from './DomainValidationError';

/**
 * Validation error raised when a field value is not among the allowed options.
 *
 * @example
 * ```typescript
 * return Result.err(new AllowedValuesError('type', ['success', 'error', 'info', 'warning']));
 * // message: "type must be one of: success, error, info, warning"
 *
 * return Result.err(new AllowedValuesError('status', ['active', 'inactive'], 'Invalid status'));
 * // message: "Invalid status"
 * ```
 */
export class AllowedValuesError extends DomainValidationError {
  constructor(
    field: string,
    allowedValues: readonly string[],
    message = `${field} must be one of: ${allowedValues.join(', ')}`,
  ) {
    super(field, message);
    this.name = 'AllowedValuesError';
  }
}
