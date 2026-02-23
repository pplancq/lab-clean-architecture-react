import { SelectField, type SelectFieldProps } from '@Shared/ui/components/SelectField/SelectField';
import { type RegisterOptions, useFormContext } from 'react-hook-form';

export type FormSelectFieldProps = Omit<SelectFieldProps, 'name'> & {
  name: string;
  rules?: RegisterOptions;
};

export const FormSelectField = ({ rules, name, id, ...props }: FormSelectFieldProps) => {
  const { register, formState } = useFormContext();
  const { errors } = formState;

  return (
    <SelectField {...props} {...register(name, rules)} id={id || name} errorMessage={errors[name]?.message as string} />
  );
};
