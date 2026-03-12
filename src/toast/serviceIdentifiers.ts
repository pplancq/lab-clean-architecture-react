/**
 * Service identifiers for the toast bounded context.
 *
 * Defines Symbol-based identifiers for dependency injection.
 * Uses Object.freeze to ensure immutability at runtime.
 */
export const TOAST_SERVICES = Object.freeze({
  /** In-memory repository storing active toast entities */
  ToastRepository: Symbol.for('Toast.ToastRepository'),

  /** Use case for creating a new toast notification */
  AddToastUseCase: Symbol.for('Toast.AddToastUseCase'),

  /** Use case for removing a toast notification */
  RemoveToastUseCase: Symbol.for('Toast.RemoveToastUseCase'),

  /** Use case for retrieving all active toast notifications */
  GetToastsUseCase: Symbol.for('Toast.GetToastsUseCase'),

  /** Observable store managing the active toast list */
  ToastStore: Symbol.for('Toast.ToastStore'),
} as const);
