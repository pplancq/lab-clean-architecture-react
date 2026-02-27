export type VoidFunction = () => void;

/**
 * Interface for the observer (pub/sub) mechanism.
 *
 * Only exposes the subscription API — state management is the responsibility
 * of concrete implementations.
 */
export interface AbstractObserverInterface {
  /**
   * Subscribe to notifications. Returns an unsubscribe function.
   */
  subscribe(observer: VoidFunction): VoidFunction;
}
