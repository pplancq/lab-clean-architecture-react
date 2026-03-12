import type { ToastStoreInterface } from '@Toast/application/stores/ToastStoreInterface';
import { useToastService } from '@Toast/ui/hooks/useToastService/useToastService';
import { useCallback, useRef, useSyncExternalStore } from 'react';

/**
 * Subscribe to a slice of the ToastStore with concurrent mode safety.
 *
 * The selector ref pattern ensures stale closures do not affect reactivity:
 * - `selectorRef` always holds the latest selector function
 * - `useCallback` memoizes subscriptions and snapshot functions, avoiding
 *   spurious re-renders while remaining stable across renders
 *
 * @param selector - Projection function over ToastStoreInterface
 * @returns The selected slice, updated on every relevant store change
 */
export const useToastSelector = <T>(selector: (store: ToastStoreInterface) => T): T => {
  const store = useToastService();

  const selectorRef = useRef(selector);
  selectorRef.current = selector;

  return useSyncExternalStore(
    useCallback(cb => store.subscribe(cb), [store]),
    useCallback(() => selectorRef.current(store), [store]),
    useCallback(() => selectorRef.current(store), [store]),
  );
};
