import type { ApplicationErrorInterface } from './ApplicationErrorInterface';

/**
 * Validation error for application layer
 *
 * Represents validation failures at the application level,
 * including both input validation and domain validation errors.
 */
export interface ValidationErrorInterface extends ApplicationErrorInterface {
  readonly type: 'Validation';

  /**
   * Field that failed validation
   */
  readonly field?: string;
}
