import { Result } from '@Shared/domain/result/Result';

type PlatformError = {
  field: 'platform';
  message: string;
};

/**
 * Platform value object representing the gaming platform
 *
 * Accepts any platform name (e.g., 'PlayStation 5', 'Xbox Series X', 'Nintendo Switch')
 * This flexibility allows for platform variations without code changes.
 *
 * Business rules:
 * - Platform name is required
 * - Cannot exceed 100 characters
 * - Trimmed automatically
 *
 * @example
 * ```typescript
 * const result = Platform.create('PlayStation 5');
 * if (result.isOk()) {
 *   const platform = result.unwrap();
 *   console.log(platform.getPlatform()); // 'PlayStation 5'
 *   console.log(platform.toString()); // 'PlayStation 5'
 * }
 * ```
 */
export class Platform {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  /**
   * Creates a Platform from a string value
   *
   * @param value - The platform name
   * @returns Result containing Platform or validation error
   */
  static create(value: string): Result<Platform, PlatformError> {
    if (!value || value.trim().length === 0) {
      return Result.err({
        field: 'platform',
        message: 'Platform name is required',
      });
    }

    if (value.length > 100) {
      return Result.err({
        field: 'platform',
        message: 'Platform name cannot exceed 100 characters',
      });
    }

    return Result.ok(new Platform(value.trim()));
  }

  /**
   * Gets the platform name
   *
   * @returns The platform name as a string
   */
  getPlatform(): string {
    return this.value;
  }
}
