import type { DomainValidationErrorInterface } from "@Shared/domain/errors/DomainValidationErrorInterface";
import { Result } from "@Shared/domain/result/Result";
import { AbstractStringValueObject } from "@Shared/domain/value-objects/AbstractStringValueObject";

/**
 * ToastMessage value object representing the notification text.
 *
 * Business rules:
 * - Cannot be empty or whitespace-only
 * - Automatically trims whitespace
 */
export class ToastMessage extends AbstractStringValueObject {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): Result<ToastMessage, DomainValidationErrorInterface> {
    const trimmed = AbstractStringValueObject.trim(value);

    const notEmptyCheck = AbstractStringValueObject.notEmpty("message", trimmed);
    if (notEmptyCheck.isErr()) {
      return Result.err(notEmptyCheck.getError());
    }

    return Result.ok(new ToastMessage(trimmed));
  }

  getValue(): string {
    return this.value;
  }
}
