/**
 * Cache Strategy Interface
 * Defines contract for different caching strategies (Cache-First, Network-First, etc.)
 */
export interface CacheStrategyInterface {
  /**
   * Execute the caching strategy for a given request
   * @param request - The fetch request to handle
   * @returns Promise resolving to the response
   */
  execute(request: Request): Promise<Response>;
}
