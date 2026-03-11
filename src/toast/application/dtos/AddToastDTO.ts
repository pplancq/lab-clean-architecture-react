import type { ToastTypeValue } from '@Toast/domain/entities/ToastInterface';

/**
 * DTO for adding a new toast notification.
 *
 * Duration defaults to 3000ms if not provided.
 */
export class AddToastDTO {
  constructor(
    readonly message: string,
    readonly type: ToastTypeValue,
    readonly duration: number = 3000,
  ) {}
}
