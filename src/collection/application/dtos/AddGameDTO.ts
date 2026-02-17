/**
 * Data Transfer Object for adding a game to the collection
 *
 * This DTO carries the raw input data from the UI/API layer to the application layer.
 * It uses only primitive types and is exempt from the interface requirement (DTOs are pure data containers).
 *
 * ## Date Handling in DTOs
 *
 * The choice between `Date` and `string` for date fields depends on the context:
 *
 * ### Use `Date` type when:
 * - Transferring data between UI and Application layers (same runtime context)
 * - Both layers can safely handle native Date objects
 * - No serialization/deserialization is needed
 * - Reduces potential parsing errors
 *
 * ### Use `string` (ISO 8601) when:
 * - Transferring data to/from Infrastructure layer (DB, API)
 * - Crossing serialization boundaries (network, storage)
 * - Target system doesn't support Date objects natively
 * - Need normalized, portable representation
 *
 * **This DTO uses `Date`** because it's designed for UI → Application communication
 * where both layers share the same runtime. The Infrastructure layer will handle
 * conversion to string when persisting to storage.
 *
 * @example
 * ```typescript
 * const dto = new AddGameDTO(
 *   'game-123',
 *   'The Legend of Zelda',
 *   'Classic adventure game',
 *   'Nintendo Switch',
 *   'Physical',
 *   new Date(),
 *   'Owned'
 * );
 * ```
 */
export class AddGameDTO {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly platform: string,
    public readonly format: string,
    public readonly purchaseDate: Date | null,
    public readonly status: string,
  ) {}
}
