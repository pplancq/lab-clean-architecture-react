import { ServiceProvider } from '@App/providers/ServiceProvider/ServiceProvider';
import { useService } from '@Shared/ui/hooks/useService/useService';
import { renderHook } from '@testing-library/react';
import { Container } from 'inversify';
import { describe, expect, it, vi } from 'vitest';

describe('useService', () => {
  it('should throw error when used outside ServiceProvider', () => {
    const serviceIdentifier = Symbol('TestService');

    expect(() => {
      renderHook(() => useService(serviceIdentifier));
    }).toThrow('useService must be used within a ServiceProvider');
  });

  it('should return service from container', () => {
    const serviceIdentifier = Symbol('TestService');
    const container = new Container();

    container.bind(serviceIdentifier).toConstantValue({ test: 'value' });

    const containerSpy = vi.spyOn(container, 'get');

    renderHook(() => useService(serviceIdentifier), {
      wrapper: ({ children }) => <ServiceProvider container={container}>{children}</ServiceProvider>,
    });

    expect(containerSpy).toHaveBeenCalledWith(serviceIdentifier);
  });
});
