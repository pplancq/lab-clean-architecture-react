import { RegisterServiceWorker } from '@Pwa/registration/RegisterServiceWorker';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

declare let global: typeof globalThis;

describe('RegisterServiceWorker', () => {
  let originalNavigator: Navigator;

  beforeEach(() => {
    originalNavigator = global.navigator;

    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
    });
  });

  it('should register service worker when available', async () => {
    const mockRegister = vi.fn().mockResolvedValue({ scope: '/' });

    Object.defineProperty(global, 'navigator', {
      value: {
        ...originalNavigator,
        serviceWorker: {
          register: mockRegister,
        },
      },
      writable: true,
    });

    await RegisterServiceWorker.register();

    expect(mockRegister).toHaveBeenCalledWith('/serviceWorker.js');
  });

  it('should not throw error if service worker not supported', async () => {
    Object.defineProperty(global, 'navigator', {
      value: {
        ...originalNavigator,
        serviceWorker: undefined,
      },
      writable: true,
    });

    await expect(RegisterServiceWorker.register()).resolves.not.toThrow();
  });

  it('should handle registration errors gracefully', async () => {
    const mockRegister = vi.fn().mockRejectedValue(new Error('Registration failed'));
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    Object.defineProperty(global, 'navigator', {
      value: {
        ...originalNavigator,
        serviceWorker: {
          register: mockRegister,
        },
      },
      writable: true,
    });

    await RegisterServiceWorker.register();

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(mockRegister).toHaveBeenCalled();
  });
});
