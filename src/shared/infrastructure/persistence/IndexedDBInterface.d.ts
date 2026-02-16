/**
 * Interface for IndexedDB operations.
 *
 * Defines methods for accessing the IndexedDB database and store.
 */
export interface IndexedDBInterface {
  /**
   * Gets the IndexedDB database instance.
   *
   * @returns Promise resolving to IDBDatabase instance
   * @throws Error if database cannot be opened
   *
   * @example
   * ```typescript
   * const dbInterface: IndexedDBInterface = ...;
   * const db = await dbInterface.getDatabase();
   * const transaction = db.transaction(dbInterface.getStoreName(), 'readonly');
   * ```
   */
  getDatabase(): Promise<IDBDatabase>;

  /**
   * Gets the name of the object store.
   *
   * @return The object store name
   */
  getStoreName(): string;

  /**
   * Closes the database connection.
   *
   * @returns Promise that resolves when the connection is closed
   */
  close(): Promise<void>;
}
