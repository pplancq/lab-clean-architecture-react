import { Button } from '@pplancq/shelter-ui-react';
import { useEffect, useId, useRef } from 'react';

import defaultClasses from './ConfirmDialog.module.css';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Accessible confirmation dialog built on the native <dialog> element.
 *
 * - Focus trap is handled natively by showModal().
 * - ESC key fires the 'cancel' event; we intercept it to keep React in control.
 * - Focus returns to the trigger element on close (managed by the parent via onCancel).
 */
export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const titleId = useId();
  const descriptionId = useId();

  // Open/close the native dialog in sync with React state
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (open) {
      dialog.showModal();
      return;
    }
    dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={defaultClasses.dialog}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={onCancel}
    >
      <h2 id={titleId} className={defaultClasses.title}>
        {title}
      </h2>
      <p id={descriptionId} className={defaultClasses.description}>
        {description}
      </p>
      <div className={defaultClasses.actions}>
        <Button onClick={onCancel}>{cancelLabel}</Button>
        <Button color="danger" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  );
};
