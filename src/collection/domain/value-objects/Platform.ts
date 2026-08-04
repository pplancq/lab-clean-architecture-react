import type { DomainValidationErrorInterface } from "@Shared/domain/errors/DomainValidationErrorInterface";
import { Result } from "@Shared/domain/result/Result";
import { AbstractStringValueObject } from "@Shared/domain/value-objects/AbstractStringValueObject";

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
 * }
 * ```
 */
export class Platform extends AbstractStringValueObject {
  private constructor(value: string) {
    super(value);
  }

  /**
   * Creates a Platform from a string value
   *
   * @param value - The platform name
   * @returns Result containing Platform or validation error
   */
  public static create(value: string): Result<Platform, DomainValidationErrorInterface> {
    const trimmed = AbstractStringValueObject.trim(value);

    const notEmptyCheck = AbstractStringValueObject.notEmpty("platform", trimmed);
    if (notEmptyCheck.isErr()) {
      return Result.err(notEmptyCheck.getError());
    }

    const maxLengthCheck = AbstractStringValueObject.maxLength("platform", trimmed, 100);
    if (maxLengthCheck.isErr()) {
      return Result.err(maxLengthCheck.getError());
    }

    return Result.ok(new Platform(trimmed));
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
