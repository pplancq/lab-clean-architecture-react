/**
 * Data Transfer Object for Game entity persistence
 *
 * Plain object with primitives only, optimized for IndexedDB storage.
 * Isolates the domain model from storage concerns.
 *
 * @remarks
 * - All properties are primitives (no value objects)
 * - purchaseDate stored as ISO string or null for easy serialization
 * - Matches Game entity structure but without domain logic
 */
export class GameDTO {
  constructor(
    /** Unique identifier for the game */
    public readonly id: string,
    /** Game title */
    public readonly title: string,
    /** Game description */
    public readonly description: string,
    /** Gaming platform (e.g., 'PlayStation', 'Xbox', 'PC') */
    public readonly platform: string,
    /** Game format (e.g., 'Physical', 'Digital') */
    public readonly format: string,
    /** Purchase date as ISO string, or null for wishlist items */
    public readonly purchaseDate: string | null,
    /** Game status (e.g., 'Owned', 'Wishlist', 'Playing', 'Completed') */
    public readonly status: string,
  ) {}
}
