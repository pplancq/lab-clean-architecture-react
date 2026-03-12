/**
 * Interface for unique identifier generation.
 *
 * Abstracts ID generation to allow different implementations
 * (crypto.randomUUID, uuid library, deterministic for tests, etc.)
 * without coupling domain/application logic to a specific strategy.
 */
export interface IdGeneratorInterface {
  /**
   * Generates a new unique identifier.
   *
   * @returns A unique string identifier
   */
  generate(): string;
}
