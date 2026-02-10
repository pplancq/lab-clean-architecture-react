import { Result } from '@Shared/domain/result/Result';

type FormatError = {
  field: 'format';
  message: string;
};

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
 *   const format = result.getValue();
 *   console.log(format.getValue()); // 'Physical'
 *   console.log(format.toString()); // 'Physical'
 * }
 * ```
 */
export class Format {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  /**
   * Creates a Format from a string value
   *
   * @param value - The format name
   * @returns Result containing Format or validation error
   */
  static create(value: string): Result<Format, FormatError> {
    if (!value || value.trim().length === 0) {
      return Result.err({
        field: 'format',
        message: 'Format name is required',
      });
    }

    if (value.length > 50) {
      return Result.err({
        field: 'format',
        message: 'Format name cannot exceed 50 characters',
      });
    }

    return Result.ok(new Format(value.trim()));
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
