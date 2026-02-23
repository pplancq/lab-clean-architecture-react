import { HelperText, Label } from '@pplancq/shelter-ui-react';
import { type ChangeEventHandler, type ReactNode, type SelectHTMLAttributes, useCallback, useId } from 'react';

import defaultClasses from './SelectField.module.css';

export type SelectFieldProps = {
  layout?: 'stacked' | 'inline';
  required?: boolean;
  label: ReactNode;
  textHelper?: ReactNode;
  errorMessage?: ReactNode;
} & SelectHTMLAttributes<HTMLSelectElement>;

export const SelectField = ({
  layout = 'stacked',
  required,
  label,
  errorMessage,
  textHelper,
  id,
  className,
  children,
  onChange = () => {},
  value,
  defaultValue,
  ...selectProps
}: SelectFieldProps) => {
  const generatedId = useId();
  const selectId = id || generatedId;
  const helperId = `${selectId}-helper`;
  const isInvalid = !!errorMessage;

  const hasValue = Boolean(value || defaultValue);

  const handleChange = useCallback<ChangeEventHandler<HTMLSelectElement>>(
    e => {
      if (e.target.value === '' && !e.target.classList.contains(defaultClasses.selectPlaceholder)) {
        e.target.classList.add(defaultClasses.selectPlaceholder);
      } else {
        e.target.classList.remove(defaultClasses.selectPlaceholder);
      }

      onChange(e);
    },
    [onChange],
  );

  return (
    <div
      className={[defaultClasses.selectField, layout === 'inline' && defaultClasses.selectFieldInline, className]
        .filter(Boolean)
        .join(' ')}
    >
      <Label htmlFor={selectId} required={required}>
        {label}
      </Label>
      <div className={defaultClasses.selectWrapper}>
        <select
          id={selectId}
          className={[
            defaultClasses.select,
            !hasValue && defaultClasses.selectPlaceholder,
            isInvalid && defaultClasses.selectError,
          ]
            .filter(Boolean)
            .join(' ')}
          required={required}
          aria-invalid={isInvalid || undefined}
          aria-describedby={!isInvalid && textHelper ? helperId : undefined}
          aria-errormessage={isInvalid ? helperId : undefined}
          value={value}
          defaultValue={defaultValue}
          {...selectProps}
          onChange={handleChange}
        >
          {children}
        </select>
      </div>
      {(textHelper ?? errorMessage) ? (
        <HelperText id={helperId} error={isInvalid}>
          {errorMessage ?? textHelper}
        </HelperText>
      ) : null}
    </div>
  );
};
