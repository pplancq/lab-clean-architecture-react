import { Result } from '@Shared/domain/result/Result';

type GameTitleError = {
  field: 'title';
  message: string;
};

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
 *   const title = result.getValue();
 *   console.log(title.getValue()); // 'The Legend of Zelda'
 * }
 * ```
 */
export class GameTitle {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  /**
   * Creates a new GameTitle instance
   *
   * @param value - The title value
   * @returns Result containing GameTitle or validation error
   */
  static create(value: string): Result<GameTitle, GameTitleError> {
    const trimmedValue = value.trim();

    if (trimmedValue.length === 0) {
      return Result.err({
        field: 'title',
        message: 'Game title cannot be empty',
      });
    }

    if (value.length > 200) {
      return Result.err({
        field: 'title',
        message: 'Game title cannot exceed 200 characters',
      });
    }

    return Result.ok(new GameTitle(trimmedValue));
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
