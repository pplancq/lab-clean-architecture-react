import { AllowedValuesError } from '@Shared/domain/errors/AllowedValuesError';
import type { DomainValidationErrorInterface } from '@Shared/domain/errors/DomainValidationErrorInterface';
import { Result } from '@Shared/domain/result/Result';
import type { ToastTypeValue } from '../entities/ToastInterface';

/**
 * ToastType value object representing the visual type of a notification.
 *
 * Business rules:
 * - Must be one of: success, error, info, warning
 */
export class ToastType {
  private static readonly VALID_TYPES: ToastTypeValue[] = ['success', 'error', 'info', 'warning'];

  private constructor(private readonly value: ToastTypeValue) {}

  static create(value: string): Result<ToastType, DomainValidationErrorInterface> {
    if (!this.VALID_TYPES.includes(value as ToastTypeValue)) {
      return Result.err(new AllowedValuesError('type', this.VALID_TYPES));
    }

    return Result.ok(new ToastType(value as ToastTypeValue));
  }

  getValue(): ToastTypeValue {
    return this.value;
  }
}
