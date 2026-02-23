/**
 * Service identifiers for shared bounded context
 *
 * Defines Symbol-based identifiers for dependency injection.
 * Uses Object.freeze to ensure immutability during runtime.
 */
export const SHARED_SERVICES = Object.freeze({
  /**
   * Date formatting utility for local-timezone-safe date conversions
   */
  DateFormatter: Symbol.for('Shared.DateFormatter'),
} as const);
