import { Game } from '@Collection/domain/entities/Game';
import { Result } from '@Shared/domain/result/Result';
import { GameDTO } from '../dtos/GameDTO';

type GameError = {
  field: string;
  message: string;
};

/**
 * Mapper between Game entity and GameDTO
 *
 * Handles conversion between domain entities (with value objects)
 * and storage DTOs (with primitives).
 */
export class GameMapper {
  /**
   * Converts a Game entity to a GameDTO for storage
   *
   * @param game - The Game entity to convert
   * @returns GameDTO ready for IndexedDB storage
   *
   * @example
   * ```typescript
   * const game = Game.create({ ... }).unwrap();
   * const dto = GameMapper.toDTO(game);
   * // dto can now be stored in IndexedDB
   * ```
   */
  static toDTO(game: Game): GameDTO {
    return new GameDTO(
      game.getId(),
      game.getTitle(),
      game.getDescription(),
      game.getPlatform(),
      game.getFormat(),
      game.getPurchaseDate()?.toISOString() ?? null,
      game.getStatus(),
    );
  }

  /**
   * Converts a GameDTO to a Game entity
   *
   * @param dto - The GameDTO from storage
   * @returns Result containing Game entity or validation error
   *
   * @example
   * ```typescript
   * const dto = { id: 'game-123', title: 'Zelda', ... };
   * const result = GameMapper.toDomain(dto);
   * if (result.isOk()) {
   *   const game = result.unwrap();
   * }
   * ```
   */
  static toDomain(dto: GameDTO): Result<Game, GameError> {
    return Game.create({
      id: dto.id,
      title: dto.title,
      description: dto.description,
      platform: dto.platform,
      format: dto.format,
      purchaseDate: dto.purchaseDate ? new Date(dto.purchaseDate) : null,
      status: dto.status,
    });
  }
}
