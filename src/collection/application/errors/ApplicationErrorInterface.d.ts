/**
 * Base error interface for application layer errors
 *
 * Application errors wrap domain errors and repository errors,
 * providing a unified error interface for the application layer.
 */
export interface ApplicationErrorInterface {
  /**
   * Error type discriminator for error handling
   */
  readonly type: string;

  /**
   * Human-readable error message
   */
  readonly message: string;

  /**
   * Additional metadata about the error
   */
  readonly metadata?: Record<string, unknown>;
}
