import type { DomainValidationErrorInterface } from "@Shared/domain/errors/DomainValidationErrorInterface";
import { Result } from "@Shared/domain/result/Result";
import { AbstractStringValueObject } from "@Shared/domain/value-objects/AbstractStringValueObject";

/**
 * ToastId value object representing a unique toast identifier.
 *
 * Business rules:
 * - Cannot be empty or whitespace-only
 * - Automatically trims whitespace
 */
export class ToastId extends AbstractStringValueObject {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): Result<ToastId, DomainValidationErrorInterface> {
    const trimmed = AbstractStringValueObject.trim(value);

    const notEmptyCheck = AbstractStringValueObject.notEmpty("id", trimmed);
    if (notEmptyCheck.isErr()) {
      return Result.err(notEmptyCheck.getError());
    }

    return Result.ok(new ToastId(trimmed));
  }

  getValue(): string {
    return this.value;
  }
}
