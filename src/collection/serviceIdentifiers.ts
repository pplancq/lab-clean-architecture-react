/**
 * Service identifiers for collection bounded context
 *
 * Defines Symbol-based identifiers for dependency injection.
 * Uses Object.freeze to ensure immutability during runtime.
 */
export const COLLECTION_SERVICES = Object.freeze({
  /**
   * IndexedDB database interface for game collection storage
   */
  IndexedDB: Symbol.for('Collection.IndexedDB'),

  /**
   * Repository interface for Game entity persistence
   */
  GameRepository: Symbol.for('Collection.GameRepository'),

  /**
   * Use case for adding a game to the collection
   */
  AddGameUseCase: Symbol.for('Collection.AddGameUseCase'),

  /**
   * Use case for retrieving all games from the collection
   */
  GetGamesUseCase: Symbol.for('Collection.GetGamesUseCase'),

  /**
   * Use case for retrieving a single game by its identifier
   */
  GetGameByIdUseCase: Symbol.for('Collection.GetGameByIdUseCase'),

  /**
   * Observable store for the games collection
   */
  GamesStore: Symbol.for('Collection.GamesStore'),
} as const);
