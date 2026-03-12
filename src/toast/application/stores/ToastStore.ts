import { AbstractObserver } from '@Shared/application/stores/AbstractObserver';
import type { Toast } from '@Toast/domain/entities/Toast';
import type { ToastTypeValue } from '@Toast/domain/entities/ToastInterface';
import { AddToastDTO } from '../dtos/AddToastDTO';
import type { AddToastUseCaseInterface } from '../use-cases/AddToastUseCaseInterface';
import type { GetToastsUseCaseInterface } from '../use-cases/GetToastsUseCaseInterface';
import type { RemoveToastUseCaseInterface } from '../use-cases/RemoveToastUseCaseInterface';
import type { ToastStoreInterface } from './ToastStoreInterface';

/**
 * Observable store managing active toast notifications.
 *
 * Responsibilities:
 * - Orchestrate AddToastUseCase, RemoveToastUseCase and GetToastsUseCase
 * - Schedule and cancel auto-dismiss timers per toast (application concern)
 * - Notify subscribers after every state change
 *
 * Storage is fully delegated to the repository via use cases.
 * The store only tracks timeouts, keeping its responsibilities minimal.
 *
 * @extends AbstractObserver
 * @implements ToastStoreInterface
 */
export class ToastStore extends AbstractObserver implements ToastStoreInterface {
  private readonly timeoutMap: Map<string, ReturnType<typeof setTimeout>> = new Map();

  constructor(
    private readonly addToastUseCase: AddToastUseCaseInterface,
    private readonly removeToastUseCase: RemoveToastUseCaseInterface,
    private readonly getToastsUseCase: GetToastsUseCaseInterface,
  ) {
    super();
  }

  addToast(message: string, type: ToastTypeValue, duration?: number): void {
    const dto = new AddToastDTO(message, type, duration);
    const result = this.addToastUseCase.execute(dto);

    if (result.isErr()) {
      return;
    }

    this.notifyObservers();

    this.autoRemoveToast(result.unwrap());
  }

  removeToast(id: string): void {
    const result = this.removeToastUseCase.execute(id);

    if (result.isErr()) {
      return;
    }

    this.notifyObservers();

    this.cleanAutoRemoveToast(id);
  }

  getAllToasts(): Toast[] {
    return this.getToastsUseCase.execute().unwrap();
  }

  private autoRemoveToast(toast: Toast) {
    const toastId = toast.getId();
    const toastDuration = toast.getDuration();

    const timeout = setTimeout(() => {
      this.removeToast(toastId);
    }, toastDuration);

    this.timeoutMap.set(toastId, timeout);
  }

  private cleanAutoRemoveToast(id: string) {
    const timeout = this.timeoutMap.get(id);
    if (timeout !== undefined) {
      clearTimeout(timeout);
      this.timeoutMap.delete(id);
    }
  }
}
