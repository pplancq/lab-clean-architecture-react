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

/**
 * Clears all IndexedDB databases
 *
 * Should be called before each test to ensure isolation.
 * Note: This uses the global indexedDB instance configured by fake-indexeddb/auto
 *
 * @example
 * ```typescript
 * beforeEach(async () => {
 *   await clearAllDatabases();
 * });
 * ```
 */
export const clearAllDatabases = async (): Promise<void> => {
  const dbs = await indexedDB.databases();
  await Promise.all(dbs.map(db => (db.name ? deleteDatabase(db.name) : Promise.resolve())));
};

/**
 * Gets all records from a specific object store
 *
 * Useful for verifying test results.
 *
 * @param dbName - Database name
 * @param storeName - Object store name
 * @returns Promise resolving to array of all records
 *
 * @example
 * ```typescript
 * const games = await getAllRecords('GameCollectionDB', 'games');
 * expect(games).toHaveLength(3);
 * ```
 */
export const getAllRecords = async <T>(dbName: string, storeName: string): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => {
        db.close();
        resolve(getAllRequest.result as T[]);
      };

      getAllRequest.onerror = () => {
        db.close();
        reject(getAllRequest.error);
      };
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};
