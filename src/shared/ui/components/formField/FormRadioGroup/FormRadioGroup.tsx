import { RadioGroup, type RadioGroupProps } from '@pplancq/shelter-ui-react';
import { Children, cloneElement, useMemo } from 'react';
import { type RegisterOptions, useFormContext } from 'react-hook-form';

export type FormRadioGroupProps = Omit<RadioGroupProps, 'name'> & {
  name: string;
  rules?: RegisterOptions;
};

export const FormRadioGroup = ({ rules, name, id, children, ...props }: FormRadioGroupProps) => {
  const { register, formState } = useFormContext();
  const { errors } = formState;

  const radioOptions = useMemo(
    () =>
      Children.map(children, child =>
        cloneElement(child, {
          ...register(name, rules),
          ...child.props,
        }),
      ),
    [children, name, rules, register],
  );

  return (
    <RadioGroup {...props} name={name} id={id || name} errorMessage={errors[name]?.message as string}>
      {radioOptions}
    </RadioGroup>
  );
};
