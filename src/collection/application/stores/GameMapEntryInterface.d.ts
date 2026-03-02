import type { Game } from '@Collection/domain/entities/Game';

/**
 * Represents a single game entry in the games map.
 * Combines the game data with per-entry metadata for loading and error state.
 *
 * isLazy: true  → partial data loaded from the list (GetGamesUseCase)
 * isLazy: false → full data loaded from detail (GetGameByIdUseCase)
 */
export interface GameMapEntryInterface {
  data: Game | null;
  isLazy: boolean;
  isLoading: boolean;
  hasError: boolean;
  error: string | null;
}
