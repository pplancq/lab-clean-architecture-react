/**
 * Interface for toast application layer errors.
 */
export interface ToastApplicationErrorInterface {
  readonly type: string;
  readonly message: string;
  readonly field?: string;
}
