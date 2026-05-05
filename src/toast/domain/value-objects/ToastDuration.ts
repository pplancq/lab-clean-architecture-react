import type { DomainValidationErrorInterface } from '@Shared/domain/errors/DomainValidationErrorInterface';
import { Result } from '@Shared/domain/result/Result';
import { AbstractNumberValueObject } from '@Shared/domain/value-objects/AbstractNumberValueObject';

/**
 * ToastDuration value object representing the auto-dismiss delay in milliseconds.
 *
 * Business rules:
 * - Must be a strictly positive finite number (>= 1)
 */
export class ToastDuration extends AbstractNumberValueObject {
  private constructor(value: number) {
    super(value);
  }

  public static create(value: number): Result<ToastDuration, DomainValidationErrorInterface> {
    const check = AbstractNumberValueObject.positiveNumber('duration', value);
    if (check.isErr()) {
      return Result.err(check.getError());
    }

    return Result.ok(new ToastDuration(value));
  }

  getValue(): number {
    return this.value;
  }
}
