export interface DebounceServiceInterface {
  debounce<A extends unknown[]>(callback: (...args: A) => void, delay: number): (...args: A) => void;
}
