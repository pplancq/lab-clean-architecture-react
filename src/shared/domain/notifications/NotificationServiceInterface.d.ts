/**
 * Port for displaying user-facing notifications.
 *
 * Bounded contexts depend on this interface without knowing
 * about the underlying UI implementation (e.g. toast).
 */
export interface NotificationServiceInterface {
  success(message: string): void;
  error(message: string): void;
  info(message: string): void;
  warning(message: string): void;
}
