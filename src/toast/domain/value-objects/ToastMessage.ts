import type { DomainValidationErrorInterface } from '@Shared/domain/errors/DomainValidationErrorInterface';
import { NotEmptyError } from '@Shared/domain/errors/NotEmptyError';
import { Result } from '@Shared/domain/result/Result';

/**
 * ToastMessage value object representing the notification text.
 *
 * Business rules:
 * - Cannot be empty or whitespace-only
 * - Automatically trims whitespace
 */
export class ToastMessage {
  private constructor(private readonly value: string) {}

  static create(value: string): Result<ToastMessage, DomainValidationErrorInterface> {
    if (!value || value.trim().length === 0) {
      return Result.err(new NotEmptyError('message'));
    }

    return Result.ok(new ToastMessage(value.trim()));
  }

  getValue(): string {
    return this.value;
  }
}
