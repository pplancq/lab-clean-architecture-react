import { HEADERS, MIME_TYPES } from './constant';
import type { MimeTypes } from './fetchApi.type';
import { FetchApiError } from './FetchApiError';

/**
 * Generic API fetch utility with automatic type conversion and error handling.
 *
 * Makes HTTP requests to the `/api` endpoint and automatically parses the response
 * based on its content type (JSON or plain text). Throws a `FetchApiError` if the
 * response status is not OK (2xx).
 *
 * @template T - The expected type of the parsed response data
 *
 * @param {string} url - The API endpoint URL.
 *                       Example: `/users`, `/mocks/123`, `/search?q=test`
 * @param {RequestInit} options - Fetch API options (headers, method, body, etc.).
 *                               Example: `{ method: 'POST', headers: { 'Content-Type': 'application/json' } }`
 *
 * @returns {Promise<T>} A promise that resolves with the parsed response data of type T
 *
 * @throws {FetchApiError} When the HTTP response status is not OK (2xx).
 *                        The error contains the response body as message, HTTP status code, and content type.
 *
 * @example
 * // Fetch JSON data
 * interface User {
 *   id: number;
 *   name: string;
 *   email: string;
 * }
 *
 * try {
 *   const user = await fetchApi<User>('/users/42', { method: 'GET' });
 *   console.log(user.name);
 * } catch (error) {
 *   if (error instanceof FetchApiError) {
 *     console.error(`Failed to fetch user: ${error.message} (${error.code})`);
 *   }
 * }
 *
 * @example
 * // POST request with JSON body
 * interface CreateUserRequest {
 *   name: string;
 *   email: string;
 * }
 *
 * const newUser = await fetchApi<User>('/users', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ name: 'John', email: 'john@example.com' }),
 * });
 *
 * @example
 * // Fetch plain text response
 * const csvData = await fetchApi<string>('/export/users.csv', { method: 'GET' });
 */
export const fetchApi = async <T>(url: string, options: RequestInit): Promise<T> => {
  const response = await fetch(url, { ...options });

  if (!response.ok) {
    throw new FetchApiError(
      await response.text(),
      response.status,
      (response.headers.get(HEADERS.contentType) as MimeTypes) ?? MIME_TYPES.text,
    );
  }

  const contentType = response.headers.get(HEADERS.contentType) ?? '';

  switch (true) {
    case contentType.includes(MIME_TYPES.json):
      return (await response.json()) as T;
    default:
      return (await response.text()) as T;
  }
};
