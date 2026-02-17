/**
 * Test utilities for IndexedDB testing
 *
 * Provides helpers for setting up and tearing down IndexedDB instances
 * for integration tests.
 */

/**
 * Deletes a database by name
 *
 * Useful for cleanup after tests.
 *
 * @param dbName - Name of the database to delete
 * @returns Promise that resolves when deletion is complete
 *
 * @example
 * ```typescript
 * afterEach(async () => {
 *   await deleteDatabase('GameCollectionDB');
 * });
 * ```
 */
export const deleteDatabase = (dbName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(dbName);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };

    request.onblocked = () => {
      // Database deletion is blocked, but we'll resolve anyway
      // This can happen if there are open connections
      resolve();
    };
  });
};
