import type { DomainValidationErrorInterface } from '@Shared/domain/errors/DomainValidationErrorInterface';
import { Result } from '@Shared/domain/result/Result';

import { GameTitle } from '../value-objects/GameTitle';

/**
 * GameFilterCriteria entity representing search/filter criteria for games
 *
 * This entity composes value objects to represent various filter criteria.
 * Currently supports:
 * - Title search (via GameTitle VO)
 *
 * Future extensions may include:
 * - Platform filter
 * - Genre filter
 * - Release date range
 * - etc.
 *
 * Business rules:
 * - An empty criteria (no filters) is valid and means "show all"
 * - Each criterion is optional and represented by its own Value Object
 * - Empty strings are not allowed for title filter (must be undefined or valid title)
 * - The entity exposes both raw and normalized title filters
 *
 * @example
 * ```typescript
 * // Create criteria with title search
 * const result = GameFilterCriteria.create({ title: 'Mario' });
 * if (result.isOk()) {
 *   const criteria = result.unwrap();
 *   console.log(criteria.getTitleFilter()); // 'Mario' (raw, trimmed)
 *   console.log(criteria.getTitleFilterNormalized()); // 'mario' (normalized)
 *   console.log(criteria.isEmpty()); // false
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Create empty criteria
 * const emptyCriteria = GameFilterCriteria.create({}).unwrap();
 * console.log(emptyCriteria.isEmpty()); // true
 * ```
 */
export class GameFilterCriteria {
  private constructor(private readonly title?: GameTitle) {}

  /**
   * Creates a new GameFilterCriteria instance
   *
   * @param params - Filter parameters
   * @param params.title - Optional title search text (undefined = no filter, empty string = validation error)
   * @returns Result containing GameFilterCriteria or validation error
   */
  public static create(
    params: {
      title?: string;
    } = {},
  ): Result<GameFilterCriteria, DomainValidationErrorInterface> {
    let titleVO: GameTitle | undefined;

    if (params.title !== undefined) {
      const titleResult = GameTitle.create(params.title);
      if (titleResult.isErr()) {
        return Result.err(titleResult.getError());
      }
      titleVO = titleResult.unwrap();
    }

    return Result.ok(new GameFilterCriteria(titleVO));
  }

  getTitleFilter(): string | undefined {
    return this.title?.getTitle();
  }

  /**
   * Gets the normalized title filter for case-insensitive search
   *
   * @returns The normalized (lowercase) title for filtering, or undefined if no title filter
   */
  getTitleFilterNormalized(): string | undefined {
    return this.title?.getTitle().toLowerCase();
  }

  /**
   * Checks if the criteria is empty (no filters active)
   *
   * @returns True if no filters are set, false otherwise
   */
  isEmpty(): boolean {
    return this.title === undefined;
  }
}
