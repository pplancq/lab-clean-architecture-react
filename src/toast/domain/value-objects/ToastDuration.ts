import type { DomainValidationErrorInterface } from '@Shared/domain/errors/DomainValidationErrorInterface';
import { PositiveNumberError } from '@Shared/domain/errors/PositiveNumberError';
import { Result } from '@Shared/domain/result/Result';

/**
 * ToastDuration value object representing the auto-dismiss delay in milliseconds.
 *
 * Business rules:
 * - Must be a strictly positive number
 */
export class ToastDuration {
  private static readonly MIN_DURATION = 1;

  private constructor(private readonly value: number) {}

  static create(value: number): Result<ToastDuration, DomainValidationErrorInterface> {
    if (value < this.MIN_DURATION) {
      return Result.err(new PositiveNumberError('duration'));
    }

    return Result.ok(new ToastDuration(value));
  }

  getValue(): number {
    return this.value;
  }
}
