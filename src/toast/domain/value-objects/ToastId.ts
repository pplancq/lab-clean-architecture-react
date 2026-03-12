import type { DomainValidationErrorInterface } from '@Shared/domain/errors/DomainValidationErrorInterface';
import { NotEmptyError } from '@Shared/domain/errors/NotEmptyError';
import { Result } from '@Shared/domain/result/Result';

/**
 * ToastId value object representing a unique toast identifier.
 *
 * Business rules:
 * - Cannot be empty or whitespace-only
 * - Automatically trims whitespace
 */
export class ToastId {
  private constructor(private readonly value: string) {}

  static create(value: string): Result<ToastId, DomainValidationErrorInterface> {
    if (!value || value.trim().length === 0) {
      return Result.err(new NotEmptyError('id'));
    }

    return Result.ok(new ToastId(value.trim()));
  }

  getValue(): string {
    return this.value;
  }
}
