import type { DomainValidationErrorInterface } from '@Shared/domain/errors/DomainValidationErrorInterface';
import { Result } from '@Shared/domain/result/Result';

import { GameTitle } from '../value-objects/GameTitle';
import { Platform } from '../value-objects/Platform';

/**
 * GameFilterCriteria entity representing search/filter criteria for games
 *
 * This entity composes value objects to represent various filter criteria.
 * Currently supports:
 * - Title search (via GameTitle VO)
 * - Platform filter with multi-select OR logic (via Platform VO)
 *
 * Future extensions may include:
 * - Genre filter
 * - Release date range
 * - etc.
 *
 * Business rules:
 * - An empty criteria (no filters) is valid and means "show all"
 * - Each criterion is optional and represented by its own Value Object
 * - Empty strings are not allowed for title filter (must be undefined or valid title)
 * - An empty platforms array is treated as "no platform filter"
 * - The entity exposes both raw and normalized title filters
 *
 * @example
 * ```typescript
 * // Create criteria with title search and platform filter
 * const result = GameFilterCriteria.create({ title: 'Mario', platforms: ['Nintendo Switch'] });
 * if (result.isOk()) {
 *   const criteria = result.unwrap();
 *   console.log(criteria.getTitleFilter()); // 'Mario'
 *   console.log(criteria.getPlatforms()); // ['Nintendo Switch']
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
  private constructor(
    private readonly title?: GameTitle,
    private readonly platforms?: Platform[],
  ) {}

  /**
   * Creates a new GameFilterCriteria instance
   *
   * @param params - Filter parameters
   * @param params.title - Optional title search text (undefined = no filter, empty string = validation error)
   * @param params.platforms - Optional array of platform names to filter by (undefined or empty array = no filter)
   * @returns Result containing GameFilterCriteria or validation error
   */
  public static create(
    params: {
      title?: string;
      platforms?: string[];
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

    let platformVOs: Platform[] | undefined;

    if (params.platforms !== undefined && params.platforms.length > 0) {
      const platformResults = params.platforms.map(platform => Platform.create(platform));
      const firstError = platformResults.find(r => r.isErr());
      if (firstError?.isErr()) {
        return Result.err(firstError.getError());
      }
      platformVOs = platformResults.map(r => r.unwrap());
    }

    return Result.ok(new GameFilterCriteria(titleVO, platformVOs));
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
   * Gets the platform filter values
   *
   * @returns Array of platform names to filter by, or undefined if no platform filter
   */
  getPlatforms(): string[] | undefined {
    return this.platforms?.map(p => p.getPlatform());
  }

  /**
   * Checks if the criteria is empty (no filters active)
   *
   * @returns True if no filters are set, false otherwise
   */
  isEmpty(): boolean {
    return this.title === undefined && (this.platforms === undefined || this.platforms.length === 0);
  }
}
