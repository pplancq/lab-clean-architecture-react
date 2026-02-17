import type { IndexedDBInterface } from '@Shared/infrastructure/persistence/IndexedDBInterface';

/**
 * Service for managing IndexedDB database connection and schema
 *
 * Handles database initialization, version upgrades, and schema creation
 * for the Game Collection application.
 *
 * Database schema:
 * - Database: GameCollectionDB (version 1)
 * - Object Store: games (keyPath: 'id')
 * - Indexes: title, platform, status
 */
export class IndexedDB implements IndexedDBInterface {
  private dbPromise: Promise<IDBDatabase> | null = null;

  constructor(
    private readonly dbName: string,
    private readonly dbVersion: number,
    private readonly storeName: string,
  ) {}

  /**
   * Gets the IndexedDB database instance
   *
   * Creates the database if it doesn't exist, or upgrades it if needed.
   * The connection is cached for reuse.
   *
   * @returns Promise resolving to IDBDatabase instance
   * @throws Error if database cannot be opened
   *
   * @example
   * ```typescript
   * const service = new IndexedDB('GameCollectionDB', 1, 'games');
   * const db = await service.getDatabase();
   * const transaction = db.transaction('games', 'readonly');
   * ```
   */
  async getDatabase(): Promise<IDBDatabase> {
    // If database promise exists, try to resolve it
    if (this.dbPromise) {
      try {
        return await this.dbPromise;
      } catch {
        // Clear failed promise and retry
        this.dbPromise = null;
      }
    }

    // Create new promise to open database
    this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        this.dbPromise = null; // Clear promise on error to allow retry
        reject(new Error(`Failed to open database: ${request.error?.message ?? 'Unknown error'}`));
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(this.storeName)) {
          const objectStore = db.createObjectStore(this.storeName, { keyPath: 'id' });

          // Create indexes for common queries
          objectStore.createIndex('title', 'title', { unique: false });
          objectStore.createIndex('platform', 'platform', { unique: false });
          objectStore.createIndex('status', 'status', { unique: false });
        }
      };
    });

    return this.dbPromise;
  }

  /**
   * Gets the name of the games object store
   *
   * @returns The object store name
   */
  getStoreName(): string {
    return this.storeName;
  }

  /**
   * Closes the database connection
   *
   * Should be called when the database is no longer needed.
   * Useful for testing and cleanup.
   */
  async close(): Promise<void> {
    if (this.dbPromise) {
      const db = await this.dbPromise;
      db.close();
      this.dbPromise = null;
    }
  }
}
