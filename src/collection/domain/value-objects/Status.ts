import { Result } from '@Shared/domain/result/Result';

export enum StatusType {
  OWNED = 'Owned',
  WISHLIST = 'Wishlist',
  SOLD = 'Sold',
  LOANED = 'Loaned',
}

type StatusError = {
  field: 'status';
  message: string;
};

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
  static create(value: string): Result<Status, StatusError> {
    const trimmedValue = value?.trim() ?? '';
    const statusValue = Object.values(StatusType).find(s => s.toLowerCase() === trimmedValue.toLowerCase());

    if (!statusValue) {
      return Result.err({
        field: 'status',
        message: `Invalid status: ${value}. Valid statuses are: ${Object.values(StatusType).join(', ')}`,
      });
    }

    return Result.ok(new Status(statusValue as StatusType));
  }

  /**
   * Creates a Status from a StatusType enum value
   *
   * @param value - The status type enum
   * @returns Status instance
   */
  static createFromEnum(value: StatusType): Status {
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
