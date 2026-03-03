/**
 * Data Transfer Object for editing a game in the collection.
 *
 * Only `id` is required — all other fields are optional so callers can
 * perform partial updates (only the provided fields will be applied).
 * Platform and format are intentionally absent: they are immutable in the domain.
 */
export class EditGameDTO {
  constructor(
    public readonly id: string,
    public readonly title?: string,
    public readonly description?: string,
    public readonly purchaseDate?: Date | null,
    public readonly status?: string,
  ) {}
}
