/**
 * Available gaming platforms for the game collection.
 *
 * This list is used both in the add-game form (platform selection)
 * and in the platform filter component.
 *
 * Note: At a later stage, this will be replaced by a dynamic list
 * fetched from the database.
 */
export const PLATFORMS = [
  'PlayStation 5',
  'PlayStation 4',
  'Xbox Series X|S',
  'Xbox One',
  'Nintendo Switch',
  'PC',
] as const;
