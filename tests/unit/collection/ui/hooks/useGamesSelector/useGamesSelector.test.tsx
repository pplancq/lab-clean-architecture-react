import { ServiceProvider } from '@App/providers/ServiceProvider/ServiceProvider';
import type { GamesListState, GamesStoreInterface } from '@Collection/application/stores/GamesStoreInterface';
import { COLLECTION_SERVICES } from '@Collection/serviceIdentifiers';
import { useGamesSelector } from '@Collection/ui/hooks/useGamesSelector/useGamesSelector';
import { renderHook } from '@testing-library/react';
import { Container } from 'inversify';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

const defaultState: GamesListState = { games: [], isLoading: false, error: null };

const createStoreMock = (state: GamesListState): GamesStoreInterface => ({
  subscribe: vi.fn().mockReturnValue(() => {}),
  getGamesList: vi.fn().mockReturnValue(state),
  fetchGames: vi.fn(),
});

const createWrapper = (state: GamesListState) => {
  const container = new Container();
  container.bind<GamesStoreInterface>(COLLECTION_SERVICES.GamesStore).toConstantValue(createStoreMock(state));
  // eslint-disable-next-line react/display-name
  return ({ children }: { children: ReactNode }) => (
    <MemoryRouter>
      <ServiceProvider container={container}>{children}</ServiceProvider>
    </MemoryRouter>
  );
};

describe('useGamesSelector', () => {
  describe('selector behaviour', () => {
    it('should return the full state when selecting getGamesList()', () => {
      const state = { ...defaultState, isLoading: true };
      const { result } = renderHook(() => useGamesSelector(s => s.getGamesList()), {
        wrapper: createWrapper(state),
      });

      expect(result.current).toStrictEqual(state);
    });

    it('should return only isLoading when selecting a boolean slice', () => {
      const { result } = renderHook(() => useGamesSelector(s => s.getGamesList().isLoading), {
        wrapper: createWrapper({ ...defaultState, isLoading: true }),
      });

      expect(result.current).toBeTruthy();
    });

    it('should return only error when selecting the error slice', () => {
      const errorMsg = 'Unable to load games. Please try again.';
      const { result } = renderHook(() => useGamesSelector(s => s.getGamesList().error), {
        wrapper: createWrapper({ ...defaultState, error: errorMsg }),
      });

      expect(result.current).toBe(errorMsg);
    });

    it('should return null error when there is no error', () => {
      const { result } = renderHook(() => useGamesSelector(s => s.getGamesList().error), {
        wrapper: createWrapper(defaultState),
      });

      expect(result.current).toBeNull();
    });
  });
});
