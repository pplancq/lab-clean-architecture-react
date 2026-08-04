import type { DomainValidationErrorInterface } from "@Shared/domain/errors/DomainValidationErrorInterface";
import { Result } from "@Shared/domain/result/Result";
import { AbstractStringValueObject } from "@Shared/domain/value-objects/AbstractStringValueObject";

/**
 * GameTitle value object representing a game title
 *
 * Business rules:
 * - Cannot be empty or whitespace-only
 * - Cannot exceed 200 characters
 * - Automatically trims whitespace
 *
 * @example
 * ```typescript
 * const result = GameTitle.create('The Legend of Zelda');
 * if (result.isOk()) {
 *   const title = result.unwrap();
 *   console.log(title.getTitle()); // 'The Legend of Zelda'
 * }
 * ```
 */
export class GameTitle extends AbstractStringValueObject {
  private constructor(value: string) {
    super(value);
  }

  /**
   * Creates a new GameTitle instance
   *
   * @param value - The title value
   * @returns Result containing GameTitle or validation error
   */
  public static create(value: string): Result<GameTitle, DomainValidationErrorInterface> {
    const trimmed = AbstractStringValueObject.trim(value);

    const notEmptyCheck = AbstractStringValueObject.notEmpty("title", trimmed);
    if (notEmptyCheck.isErr()) {
      return Result.err(notEmptyCheck.getError());
    }

    const maxLengthCheck = AbstractStringValueObject.maxLength("title", trimmed, 200);
    if (maxLengthCheck.isErr()) {
      return Result.err(maxLengthCheck.getError());
    }

    return Result.ok(new GameTitle(trimmed));
  }

  /**
   * Gets the game title
   *
   * @returns The game title as a string
   */
  getTitle(): string {
    return this.value;
  }
}
