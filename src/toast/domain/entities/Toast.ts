import type { DomainValidationErrorInterface } from '@Shared/domain/errors/DomainValidationErrorInterface';
import { Result } from '@Shared/domain/result/Result';
import { ToastDuration } from '../value-objects/ToastDuration';
import { ToastId } from '../value-objects/ToastId';
import { ToastMessage } from '../value-objects/ToastMessage';
import { ToastType } from '../value-objects/ToastType';
import type { ToastInterface, ToastTypeValue } from './ToastInterface';

type ToastCreateProps = {
  id: string;
  message: string;
  type: ToastTypeValue;
  duration: number;
};

type ToastProps = {
  id: ToastId;
  message: ToastMessage;
  type: ToastType;
  duration: ToastDuration;
};

/**
 * Toast entity representing a transient notification.
 *
 * Business rules:
 * - All properties are validated through value objects
 * - Immutable after creation
 * - Type determines the visual style and semantic meaning
 *
 * @example
 * ```typescript
 * const result = Toast.create({
 *   id: 'uuid-...',
 *   message: 'Game saved successfully',
 *   type: 'success',
 *   duration: 3000,
 * });
 *
 * if (result.isOk()) {
 *   const toast = result.unwrap();
 * }
 * ```
 */
export class Toast implements ToastInterface {
  private constructor(private readonly props: ToastProps) {}

  /**
   * Factory method to create a new Toast entity from primitives.
   *
   * @param props - Toast properties (primitives converted to value objects)
   * @returns Result containing Toast or validation error
   */
  static create(props: ToastCreateProps): Result<Toast, DomainValidationErrorInterface> {
    const idResult = ToastId.create(props.id);
    if (idResult.isErr()) {
      return Result.err(idResult.getError());
    }

    const messageResult = ToastMessage.create(props.message);
    if (messageResult.isErr()) {
      return Result.err(messageResult.getError());
    }

    const typeResult = ToastType.create(props.type);
    if (typeResult.isErr()) {
      return Result.err(typeResult.getError());
    }

    const durationResult = ToastDuration.create(props.duration);
    if (durationResult.isErr()) {
      return Result.err(durationResult.getError());
    }

    return Result.ok(
      new Toast({
        id: idResult.unwrap(),
        message: messageResult.unwrap(),
        type: typeResult.unwrap(),
        duration: durationResult.unwrap(),
      }),
    );
  }

  getId(): string {
    return this.props.id.getValue();
  }

  getMessage(): string {
    return this.props.message.getValue();
  }

  getType(): ToastTypeValue {
    return this.props.type.getValue();
  }

  getDuration(): number {
    return this.props.duration.getValue();
  }
}
