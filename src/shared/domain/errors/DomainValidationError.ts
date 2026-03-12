import type { DomainValidationErrorInterface } from './DomainValidationErrorInterface';

/**
 * Domain validation error raised by value objects and entities when
 * business rule invariants are violated.
 *
 * @example
 * ```typescript
 * return Result.err(new DomainValidationError('title', 'Title cannot be empty'));
 * ```
 */
export class DomainValidationError extends Error implements DomainValidationErrorInterface {
  constructor(
    readonly field: string,
    message: string,
  ) {
    super(message);
    this.name = 'DomainValidationError';
  }
}
