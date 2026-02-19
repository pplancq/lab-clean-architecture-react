import { InputField, type InputFieldProps } from '@pplancq/shelter-ui-react';
import { type RegisterOptions, useFormContext } from 'react-hook-form';

export type FormInputFieldProps = Omit<InputFieldProps, 'name'> & {
  name: string;
  rules?: RegisterOptions;
};

export const FormInputField = ({ rules, name, id, ...props }: FormInputFieldProps) => {
  const { register, formState } = useFormContext();
  const { errors } = formState;

  return (
    <InputField {...props} {...register(name, rules)} id={id || name} errorMessage={errors[name]?.message as string} />
  );
};
