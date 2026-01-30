import { HEADERS, METHODS, MIME_TYPES } from '@Front/shared/infrastructure/fetchApi/constant';
import { fetchApi } from '@Front/shared/infrastructure/fetchApi/fetchApi';
import { FetchApiError } from '@Front/shared/infrastructure/fetchApi/FetchApiError';
import { server } from '@Mocks/server';
import { beforeAll, describe, expect, it, vi } from 'vitest';

describe('fetchApi', () => {
  const fetchMock = vi.fn();
  window.fetch = fetchMock;

  beforeAll(() => {
    server.close();
  });

  it('should return JSON data on success', async () => {
    const mockResponse = { message: 'Success' };
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
      headers: new Headers({ [HEADERS.contentType]: MIME_TYPES.json }),
    });

    const result = await fetchApi<{ message: string }>('/test', { method: METHODS.get });

    expect(result).toStrictEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      '/test',
      expect.objectContaining({
        method: METHODS.get,
      }),
    );
  });

  it('should throw an error when the HTTP response is not successful', async () => {
    const mockError = 'Not Found';
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: () => Promise.resolve(mockError),
      headers: new Headers({ [HEADERS.contentType]: MIME_TYPES.text }),
    });

    await expect(fetchApi('/error', { method: METHODS.get })).rejects.toThrowError(FetchApiError);

    expect(fetch).toHaveBeenCalledWith(
      '/error',
      expect.objectContaining({
        method: METHODS.get,
      }),
    );
  });

  it('should handle non-JSON responses', async () => {
    const mockResponse = 'Plain text response';
    fetchMock.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockResponse),
      headers: new Headers({ [HEADERS.contentType]: MIME_TYPES.text }),
    });

    const result = await fetchApi<string>('/text', { method: METHODS.get });

    expect(result).toBe(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      '/text',
      expect.objectContaining({
        method: METHODS.get,
      }),
    );
  });

  it('should add Content-Type header for POST requests with data', async () => {
    const mockResponse = { message: 'Created' };
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
      headers: new Headers({ [HEADERS.contentType]: MIME_TYPES.json }),
    });

    const postData = { name: 'Test' };
    const result = await fetchApi<{ message: string }>('/create', {
      method: METHODS.post,
      body: JSON.stringify(postData),
    });

    expect(result).toStrictEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      '/create',
      expect.objectContaining({
        method: METHODS.post,
        body: JSON.stringify(postData),
      }),
    );

    const calledHeaders = fetchMock.mock.settledResults[0].value?.headers as Headers;
    expect(calledHeaders.get(HEADERS.contentType)).toBe(MIME_TYPES.json);
  });

  it('should throw an error containing text content on HTTP failure', async () => {
    const mockError = 'Error message in plain text';
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: () => Promise.resolve(mockError),
      headers: new Headers(),
    });

    await expect(fetchApi('/server-error', { method: METHODS.get })).rejects.toThrowError(
      new FetchApiError(mockError, 500, MIME_TYPES.text),
    );

    expect(fetch).toHaveBeenCalledWith(
      '/server-error',
      expect.objectContaining({
        method: METHODS.get,
      }),
    );
  });

  it('should return raw response when Content-Type header is missing', async () => {
    const mockResponse = { message: 'Success' };
    fetchMock.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(JSON.stringify(mockResponse)),
      headers: new Headers(),
    });

    const result = await fetchApi('/missing-content-type', { method: METHODS.get });

    expect(result).toStrictEqual(JSON.stringify(mockResponse));
    expect(fetch).toHaveBeenCalledWith(
      '/missing-content-type',
      expect.objectContaining({
        method: METHODS.get,
      }),
    );
  });
});
