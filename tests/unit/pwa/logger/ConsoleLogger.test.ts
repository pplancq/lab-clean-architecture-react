import { ConsoleLogger } from '@Pwa/logger/ConsoleLogger';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('ConsoleLogger', () => {
  let consoleLogger: ConsoleLogger;

  beforeEach(() => {
    consoleLogger = new ConsoleLogger();
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('info', () => {
    it('should log info messages with [GCM:SW] prefix', () => {
      consoleLogger.info('Test message', 'arg1', 'arg2');

      expect(console.info).toHaveBeenCalledWith('[GCM:SW]', 'Test message', 'arg1', 'arg2');
      expect(console.info).toHaveBeenCalledTimes(1);
    });
  });

  describe('warn', () => {
    it('should log warning messages with [GCM:SW] prefix', () => {
      consoleLogger.warn('Warning message', { key: 'value' });

      expect(console.warn).toHaveBeenCalledWith('[GCM:SW]', 'Warning message', { key: 'value' });
      expect(console.warn).toHaveBeenCalledTimes(1);
    });
  });

  describe('error', () => {
    it('should log error messages with [GCM:SW] prefix', () => {
      const error = new Error('Test error');
      consoleLogger.error('Error occurred', error);

      expect(console.error).toHaveBeenCalledWith('[GCM:SW]', 'Error occurred', error);
      expect(console.error).toHaveBeenCalledTimes(1);
    });
  });
});
