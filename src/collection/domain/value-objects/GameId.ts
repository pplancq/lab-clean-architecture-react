import { Result } from '@Shared/domain/result/Result';

type GameIdError = {
  field: 'gameId';
  message: string;
};

/**
 * GameId value object representing a unique game identifier
 *
 * Business rules:
 * - Cannot be empty or whitespace-only
 * - Automatically trims whitespace
 *
 * @example
 * ```typescript
 * const result = GameId.create('game-123');
 * if (result.isOk()) {
 *   const gameId = result.getValue();
 *   console.log(gameId.getValue()); // 'game-123'
 * }
 * ```
 */
export class GameId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  /**
   * Creates a new GameId instance
   *
   * @param value - The identifier value
   * @returns Result containing GameId or validation error
   */
  static create(value: string): Result<GameId, GameIdError> {
    if (!value || value.trim().length === 0) {
      return Result.err({
        field: 'gameId',
        message: 'GameId cannot be empty',
      });
    }
    return Result.ok(new GameId(value.trim()));
  }

  /**
   * Gets the game ID
   *
   * @returns The game ID as a string
   */
  getId(): string {
    return this.value;
  }
}
