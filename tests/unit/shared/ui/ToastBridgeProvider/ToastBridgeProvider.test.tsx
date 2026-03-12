import { ServiceProvider } from '@App/providers/ServiceProvider/ServiceProvider';
import { ToastBridgeProvider } from '@Shared/ui/ToastBridgeProvider/ToastBridgeProvider';
import { render, screen } from '@testing-library/react';
import type { ToastStoreInterface } from '@Toast/application/stores/ToastStoreInterface';
import { TOAST_SERVICES } from '@Toast/serviceIdentifiers';
import { Container } from 'inversify';
import { describe, expect, it, vi } from 'vitest';

const createMockToastStore = (): ToastStoreInterface => {
  const toasts: never[] = [];

  return {
    addToast: vi.fn(),
    removeToast: vi.fn(),
    getAllToasts: vi.fn(() => toasts),
    subscribe: vi.fn(() => () => {}),
  };
};

const createContainer = (toastStore: ToastStoreInterface): Container => {
  const container = new Container();
  container.bind<ToastStoreInterface>(TOAST_SERVICES.ToastStore).toConstantValue(toastStore);
  return container;
};

describe('ToastBridgeProvider', () => {
  it('should render children', () => {
    const container = createContainer(createMockToastStore());

    render(
      <ServiceProvider container={container}>
        <ToastBridgeProvider>
          <span>content</span>
        </ToastBridgeProvider>
      </ServiceProvider>,
    );

    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('should provide ToastContext to children', () => {
    const toastStore = createMockToastStore();
    const container = createContainer(toastStore);

    render(
      <ServiceProvider container={container}>
        <ToastBridgeProvider>
          <span>content</span>
        </ToastBridgeProvider>
      </ServiceProvider>,
    );

    expect(toastStore.getAllToasts).toHaveBeenCalledWith();
  });

  it('should throw when used outside ServiceProvider', () => {
    expect(() => {
      render(
        <ToastBridgeProvider>
          <span>content</span>
        </ToastBridgeProvider>,
      );
    }).toThrow('useService must be used within a ServiceProvider');
  });
});
