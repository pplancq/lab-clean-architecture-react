import { Button, Icon } from '@pplancq/shelter-ui-react';
import type { ComponentProps, ReactNode } from 'react';
import { useId } from 'react';

import defaultClasses from './FormatToggleOption.module.css';

export type FormatToggleOptionProps = Omit<ComponentProps<'input'>, 'type'> & {
  isInvalid?: boolean;
  label: ReactNode;
  icon: string;
};

export const FormatToggleOption = ({ label, icon, id, isInvalid, ref, ...inputProps }: FormatToggleOptionProps) => {
  const generatedId = useId();
  const inputId = id ?? `${generatedId}-${String(inputProps.value)}`;

  return (
    <Button
      as="label"
      className={[defaultClasses.option, isInvalid && defaultClasses.invalid].filter(Boolean).join(' ')}
      size="large"
      htmlFor={inputId}
      startIcon={<Icon icon={icon} size="medium" role="presentation" />}
    >
      <input type="radio" ref={ref} id={inputId} {...inputProps} />
      {label}
    </Button>
  );
};
