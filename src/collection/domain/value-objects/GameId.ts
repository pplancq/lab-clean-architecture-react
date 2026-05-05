import type { DomainValidationErrorInterface } from '@Shared/domain/errors/DomainValidationErrorInterface';
import { Result } from '@Shared/domain/result/Result';
import { AbstractStringValueObject } from '@Shared/domain/value-objects/AbstractStringValueObject';

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
 *   const gameId = result.unwrap();
 *   console.log(gameId.getId()); // 'game-123'
 * }
 * ```
 */
export class GameId extends AbstractStringValueObject {
  private constructor(value: string) {
    super(value);
  }

  /**
   * Creates a new GameId instance
   *
   * @param value - The identifier value
   * @returns Result containing GameId or validation error
   */
  public static create(value: string): Result<GameId, DomainValidationErrorInterface> {
    const trimmed = AbstractStringValueObject.trim(value);

    const notEmptyCheck = AbstractStringValueObject.notEmpty('gameId', trimmed);
    if (notEmptyCheck.isErr()) {
      return Result.err(notEmptyCheck.getError());
    }

    return Result.ok(new GameId(trimmed));
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
