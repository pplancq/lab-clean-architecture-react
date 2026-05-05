import type { DomainValidationErrorInterface } from '@Shared/domain/errors/DomainValidationErrorInterface';
import { Result } from '@Shared/domain/result/Result';
import { AbstractStringValueObject } from '@Shared/domain/value-objects/AbstractStringValueObject';

/**
 * GameDescription value object representing a game description
 *
 * Business rules:
 * - Can be empty (optional field)
 * - Cannot exceed 1000 characters
 * - Automatically trims whitespace
 *
 * @example
 * ```typescript
 * const result = GameDescription.create('A classic adventure game');
 * if (result.isOk()) {
 *   const description = result.unwrap();
 *   console.log(description.getDescription()); // 'A classic adventure game'
 * }
 * ```
 */
export class GameDescription extends AbstractStringValueObject {
  private constructor(value: string) {
    super(value);
  }

  /**
   * Creates a new GameDescription instance
   *
   * @param value - The description value
   * @returns Result containing GameDescription or validation error
   */
  public static create(value: string): Result<GameDescription, DomainValidationErrorInterface> {
    const trimmed = AbstractStringValueObject.trim(value);

    const maxLengthCheck = AbstractStringValueObject.maxLength('description', trimmed, 1000);
    if (maxLengthCheck.isErr()) {
      return Result.err(maxLengthCheck.getError());
    }

    return Result.ok(new GameDescription(trimmed));
  }

  /**
   * Gets the game description
   *
   * @returns The game description as a string
   */
  getDescription(): string {
    return this.value;
  }
}
