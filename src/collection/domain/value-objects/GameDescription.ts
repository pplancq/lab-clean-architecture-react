import { Result } from '@Shared/domain/result/Result';

type GameDescriptionError = {
  field: 'description';
  message: string;
};

/**
 * GameDescription value object representing a game description
 *
 * Business rules:
 * - Can be empty (optional field)
 * - Cannot exceed 1000 characters
 *
 * @example
 * ```typescript
 * const result = GameDescription.create('A classic adventure game');
 * if (result.isOk()) {
 *   const description = result.getValue();
 *   console.log(description.getValue()); // 'A classic adventure game'
 * }
 * ```
 */
export class GameDescription {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  /**
   * Creates a new GameDescription instance
   *
   * @param value - The description value
   * @returns Result containing GameDescription or validation error
   */
  static create(value: string): Result<GameDescription, GameDescriptionError> {
    if (value.length > 1000) {
      return Result.err({
        field: 'description',
        message: 'Game description cannot exceed 1000 characters',
      });
    }

    return Result.ok(new GameDescription(value));
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
