/**
 * Interface for domain validation errors raised by value objects and entities.
 *
 * Provides a normalized contract for validation failures across all bounded
 * contexts, replacing ad-hoc inline object types.
 */
export interface DomainValidationErrorInterface {
  /** The name of the field that failed validation */
  readonly field: string;
  /** Human-readable description of the validation failure */
  readonly message: string;
}
