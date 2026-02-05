import type { LoggerInterface } from './LoggerInterface';

/**
 * Console Logger for Service Worker
 * Prefixes all logs with [GCM:SW]
 */
export class ConsoleLogger implements LoggerInterface {
  private readonly prefix = '[GCM:SW]';

  info(message: string, ...args: unknown[]): void {
    console.info(this.prefix, message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    console.warn(this.prefix, message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    console.error(this.prefix, message, ...args);
  }
}
