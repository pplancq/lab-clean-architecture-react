export type ToastTypeValue = 'success' | 'error' | 'info' | 'warning';

/**
 * Interface for the Toast entity.
 *
 * A toast represents a transient notification with a message, visual type,
 * and auto-dismiss duration.
 */
export interface ToastInterface {
  /** Returns the unique identifier of the toast */
  getId(): string;

  /** Returns the notification message */
  getMessage(): string;

  /** Returns the visual type used for styling and accessibility */
  getType(): ToastTypeValue;

  /** Returns the auto-dismiss duration in milliseconds */
  getDuration(): number;
}
