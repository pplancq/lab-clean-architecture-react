import { ToastNotificationService } from '@Shared/infrastructure/notifications/ToastNotificationService';
import type { ToastStoreInterface } from '@Toast/application/stores/ToastStoreInterface';
import { describe, expect, it, vi } from 'vitest';

const createMockToastStore = (): ToastStoreInterface => ({
  addToast: vi.fn(),
  removeToast: vi.fn(),
  getAllToasts: vi.fn(() => []),
  subscribe: vi.fn(() => vi.fn()),
});

describe('ToastNotificationService', () => {
  describe('success', () => {
    it('should call addToast with success type', () => {
      const toastStore = createMockToastStore();
      const service = new ToastNotificationService(toastStore);

      service.success('Game added!');

      expect(toastStore.addToast).toHaveBeenCalledWith('Game added!', 'success');
    });

    it('should call addToast exactly once', () => {
      const toastStore = createMockToastStore();
      const service = new ToastNotificationService(toastStore);

      service.success('Operation successful');

      expect(toastStore.addToast).toHaveBeenCalledTimes(1);
    });
  });

  describe('error', () => {
    it('should call addToast with error type', () => {
      const toastStore = createMockToastStore();
      const service = new ToastNotificationService(toastStore);

      service.error('Something went wrong');

      expect(toastStore.addToast).toHaveBeenCalledWith('Something went wrong', 'error');
    });
  });

  describe('info', () => {
    it('should call addToast with info type', () => {
      const toastStore = createMockToastStore();
      const service = new ToastNotificationService(toastStore);

      service.info('Processing your request');

      expect(toastStore.addToast).toHaveBeenCalledWith('Processing your request', 'info');
    });
  });

  describe('warning', () => {
    it('should call addToast with warning type', () => {
      const toastStore = createMockToastStore();
      const service = new ToastNotificationService(toastStore);

      service.warning('Low storage space');

      expect(toastStore.addToast).toHaveBeenCalledWith('Low storage space', 'warning');
    });
  });
});
