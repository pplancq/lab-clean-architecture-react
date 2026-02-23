import { HelperText, Label } from '@pplancq/shelter-ui-react';
import { type ReactNode, type TextareaHTMLAttributes, useId } from 'react';

import defaultClasses from './TextAreaField.module.css';

export type TextAreaFieldProps = {
  layout?: 'stacked' | 'inline';
  required?: boolean;
  label: ReactNode;
  textHelper?: ReactNode;
  errorMessage?: ReactNode;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextAreaField = ({
  layout = 'stacked',
  required,
  label,
  errorMessage,
  textHelper,
  id,
  className,
  ...textareaProps
}: TextAreaFieldProps) => {
  const generatedId = useId();
  const textAreaId = id || generatedId;
  const helperId = `${textAreaId}-helper`;
  const isInvalid = !!errorMessage;

  return (
    <div
      className={[defaultClasses.textAreaField, layout === 'inline' && defaultClasses.textAreaFieldInline, className]
        .filter(Boolean)
        .join(' ')}
    >
      <Label htmlFor={textAreaId} required={required}>
        {label}
      </Label>
      <textarea
        id={textAreaId}
        placeholder=" "
        className={[defaultClasses.textArea, isInvalid && defaultClasses.textAreaError].filter(Boolean).join(' ')}
        required={required}
        aria-invalid={isInvalid || undefined}
        aria-describedby={!isInvalid && textHelper ? helperId : undefined}
        aria-errormessage={isInvalid ? helperId : undefined}
        {...textareaProps}
      />
      {(textHelper ?? errorMessage) ? (
        <HelperText id={helperId} error={isInvalid}>
          {errorMessage ?? textHelper}
        </HelperText>
      ) : null}
    </div>
  );
};
