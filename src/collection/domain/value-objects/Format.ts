import type { DomainValidationErrorInterface } from '@Shared/domain/errors/DomainValidationErrorInterface';
import { Result } from '@Shared/domain/result/Result';
import { AbstractStringValueObject } from '@Shared/domain/value-objects/AbstractStringValueObject';

/**
 * Format value object representing the game format
 *
 * Accepts any format name (e.g., 'Physical', 'Digital', 'Collector\'s Edition', 'Steelbook')
 * This flexibility allows for format variations without code changes.
 *
 * Business rules:
 * - Format name is required
 * - Cannot exceed 50 characters
 * - Trimmed automatically
 *
 * @example
 * ```typescript
 * const result = Format.create('Physical');
 * if (result.isOk()) {
 *   const format = result.unwrap();
 *   console.log(format.getFormat()); // 'Physical'
 * }
 * ```
 */
export class Format extends AbstractStringValueObject {
  private constructor(value: string) {
    super(value);
  }

  /**
   * Creates a Format from a string value
   *
   * @param value - The format name
   * @returns Result containing Format or validation error
   */
  public static create(value: string): Result<Format, DomainValidationErrorInterface> {
    const trimmed = AbstractStringValueObject.trim(value);

    const notEmptyCheck = AbstractStringValueObject.notEmpty('format', trimmed);
    if (notEmptyCheck.isErr()) {
      return Result.err(notEmptyCheck.getError());
    }

    const maxLengthCheck = AbstractStringValueObject.maxLength('format', trimmed, 50);
    if (maxLengthCheck.isErr()) {
      return Result.err(maxLengthCheck.getError());
    }

    return Result.ok(new Format(trimmed));
  }

  /**
   * Gets the format name
   *
   * @returns The format name as a string
   */
  getFormat(): string {
    return this.value;
  }
}
