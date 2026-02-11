import { Result } from '@Shared/domain/result/Result';
import { GameId } from '../value-objects/GameId';
import { GameTitle } from '../value-objects/GameTitle';
import { GameDescription } from '../value-objects/GameDescription';
import { Platform } from '../value-objects/Platform';
import { Format } from '../value-objects/Format';
import { Status, StatusType } from '../value-objects/Status';

type GameError = {
  field: string;
  message: string;
};

/**
 * Props for creating a Game entity (using primitives)
 */
type GameCreateProps = {
  id: string;
  title: string;
  description: string;
  platform: string;
  format: string;
  purchaseDate: Date | null;
  status: string;
};

/**
 * Internal props with instantiated value objects
 */
type GameProps = {
  id: GameId;
  title: GameTitle;
  description: GameDescription;
  platform: Platform;
  format: Format;
  purchaseDate: Date | null;
  status: Status;
};

/**
 * Game entity representing a video game in the collection
 *
 * Business rules:
 * - All properties are validated through value objects
 * - Platform and format are immutable
 * - Status can be updated via `updateStatus`
 * - Title and description can be updated
 * - Purchase date is optional (null for wishlist items)
 *
 * @example
 * ```typescript
 * const result = Game.create({
 *   id: 'game-123',
 *   title: 'The Legend of Zelda',
 *   description: 'Classic adventure game',
 *   platform: 'PlayStation',
 *   format: 'Physical',
 *   purchaseDate: new Date(),
 *   status: 'Owned'
 * });
 *
 * if (result.isOk()) {
 *   const game = result.unwrap();
 * }
 * ```
 */
export class Game {
  private readonly id: GameId;

  private title: GameTitle;

  private description: GameDescription;

  private readonly platform: Platform;

  private readonly format: Format;

  private purchaseDate: Date | null;

  private status: Status;

  private constructor(props: GameProps) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.platform = props.platform;
    this.format = props.format;
    this.purchaseDate = props.purchaseDate;
    this.status = props.status;
  }

  /**
   * Factory method to create a new Game entity from primitives
   *
   * @param props - Game properties (primitives that will be converted to value objects)
   * @returns Result containing Game or validation error from any value object
   */
  static create(props: GameCreateProps): Result<Game, GameError> {
    // Create and validate GameId
    const gameIdResult = GameId.create(props.id);
    if (gameIdResult.isErr()) {
      return Result.err(gameIdResult.getError());
    }

    // Create and validate GameTitle
    const titleResult = GameTitle.create(props.title);
    if (titleResult.isErr()) {
      return Result.err(titleResult.getError());
    }

    // Create and validate GameDescription
    const descriptionResult = GameDescription.create(props.description);
    if (descriptionResult.isErr()) {
      return Result.err(descriptionResult.getError());
    }

    // Create and validate Platform
    const platformResult = Platform.create(props.platform);
    if (platformResult.isErr()) {
      return Result.err(platformResult.getError());
    }

    // Create and validate Format
    const formatResult = Format.create(props.format);
    if (formatResult.isErr()) {
      return Result.err(formatResult.getError());
    }

    // Create and validate Status
    const statusResult = Status.create(props.status);
    if (statusResult.isErr()) {
      return Result.err(statusResult.getError());
    }

    // All value objects are valid, create the Game entity
    return Result.ok(
      new Game({
        id: gameIdResult.unwrap(),
        title: titleResult.unwrap(),
        description: descriptionResult.unwrap(),
        platform: platformResult.unwrap(),
        format: formatResult.unwrap(),
        purchaseDate: props.purchaseDate,
        status: statusResult.unwrap(),
      }),
    );
  }

  // Getters (return primitives, not VOs - VOs are implementation details)

  getId(): string {
    return this.id.getId();
  }

  getTitle(): string {
    return this.title.getTitle();
  }

  getDescription(): string {
    return this.description.getDescription();
  }

  getPlatform(): string {
    return this.platform.getPlatform();
  }

  getFormat(): string {
    return this.format.getFormat();
  }

  getPurchaseDate(): Date | null {
    return this.purchaseDate;
  }

  getStatus(): StatusType {
    return this.status.getStatus();
  }

  // Business logic methods

  /**
   * Updates the game title from a string
   *
   * @param newTitle - New title string for the game
   * @returns Result with void on success or validation error
   */
  updateTitle(newTitle: string): Result<void, GameError> {
    const titleResult = GameTitle.create(newTitle);
    if (titleResult.isErr()) {
      return Result.err(titleResult.getError());
    }

    this.title = titleResult.unwrap();
    return Result.ok(undefined);
  }

  /**
   * Updates the game description from a string
   *
   * @param newDescription - New description string for the game
   * @returns Result with void on success or validation error
   */
  updateDescription(newDescription: string): Result<void, GameError> {
    const descriptionResult = GameDescription.create(newDescription);
    if (descriptionResult.isErr()) {
      return Result.err(descriptionResult.getError());
    }

    this.description = descriptionResult.unwrap();
    return Result.ok(undefined);
  }

  /**
   * Updates the purchase date
   *
   * @param date - New purchase date (null for wishlist items)
   */
  updatePurchaseDate(date: Date | null): void {
    this.purchaseDate = date;
  }

  /**
   * Updates the game status from a string
   *
   * @param newStatus - New status string for the game
   * @returns Result with void on success or validation error
   */
  updateStatus(newStatus: string): Result<void, GameError> {
    const statusResult = Status.create(newStatus);
    if (statusResult.isErr()) {
      return Result.err(statusResult.getError());
    }

    this.status = statusResult.unwrap();
    return Result.ok(undefined);
  }

  /**
   * Checks if the game was purchased after a specific date
   *
   * @param date - Date to compare against
   * @returns True if game was purchased after the date
   */
  isPurchasedAfter(date: Date): boolean {
    if (!this.purchaseDate) {
      return false;
    }

    return this.purchaseDate > date;
  }

  /**
   * Checks if the game is in the wishlist
   *
   * @returns True if game is in wishlist status
   */
  isInWishlist(): boolean {
    return this.status.getStatus() === StatusType.WISHLIST;
  }

  /**
   * Checks if the game is owned
   *
   * @returns True if game is owned
   */
  isOwned(): boolean {
    return this.status.getStatus() === StatusType.OWNED;
  }
}
