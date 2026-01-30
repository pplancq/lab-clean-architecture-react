import type { MimeTypes } from './fetchApi.type';

/**
 * Custom error class for API fetch failures.
 *
 * Extends the native Error class to provide additional context about API errors,
 * including HTTP status code and response content type.
 *
 * @class FetchApiError
 * @extends {Error}
 *
 * @example
 * try {
 *   await fetchApi('/users');
 * } catch (error) {
 *   if (error instanceof FetchApiError) {
 *     console.error(`API Error: ${error.message} (${error.code})`);
 *   }
 * }
 */
export class FetchApiError extends Error {
  constructor(
    /** The error message describing what went wrong */
    message: string,
    /** The HTTP status code of the failed response (e.g., 404, 500) */
    public readonly code?: number,
    /** The MIME type of the error response (e.g., 'application/json', 'text/plain') */
    public readonly contentType?: MimeTypes,
  ) {
    super(message);
    this.name = 'FetchApiError';
  }
}
