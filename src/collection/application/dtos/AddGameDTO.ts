/**
 * Data Transfer Object for adding a game to the collection
 *
 * This DTO carries the raw input data from the UI/API layer to the application layer.
 * It uses only primitive types and is exempt from the interface requirement (DTOs are pure data containers).
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
