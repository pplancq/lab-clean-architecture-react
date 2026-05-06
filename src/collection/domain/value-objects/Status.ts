import type { DomainValidationErrorInterface } from '@Shared/domain/errors/DomainValidationErrorInterface';
import { AllowedValuesError } from '@Shared/domain/errors/AllowedValuesError';
import { Result } from '@Shared/domain/result/Result';

export enum StatusType {
  OWNED = 'Owned',
  WISHLIST = 'Wishlist',
  SOLD = 'Sold',
  LOANED = 'Loaned',
}

/**
 * Status value object representing the game ownership status
 *
 * Business rules:
 * - Must be one of: Owned, Wishlist, Sold, or Loaned
 * - Case-insensitive validation
 *
 * @example
 * ```typescript
 * const result = Status.create('Owned');
 * if (result.isOk()) {
 *   const status = result.unwrap();
 *   console.log(status.getStatus()); // StatusType.OWNED
 * }
 * ```
 */
export class Status {
  private readonly value: StatusType;

  private constructor(value: StatusType) {
    this.value = value;
  }

  /**
   * Creates a Status from a string value
   *
   * @param value - The status name (case-insensitive)
   * @returns Result containing Status or validation error
   */
  public static create(value: string): Result<Status, DomainValidationErrorInterface> {
    const trimmedValue = value?.trim() ?? '';
    const allowedValues = Object.values(StatusType);
    const statusValue = allowedValues.find(s => s.toLowerCase() === trimmedValue.toLowerCase());

    if (!statusValue) {
      return Result.err(new AllowedValuesError('status', allowedValues));
    }

    return Result.ok(new Status(statusValue as StatusType));
  }

  /**
   * Creates a Status from a StatusType enum value
   *
   * @param value - The status type enum
   * @returns Status instance
   */
  public static createFromEnum(value: StatusType): Status {
    return new Status(value);
  }

  /**
   * Gets the status value
   *
   * @returns The status as a StatusType enum value
   */
  getStatus(): StatusType {
    return this.value;
  }
}
