/**
 * Logger Interface
 * Defines contract for logging in service worker context
 */
export interface LoggerInterface {
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
}
