import { TextAreaField, type TextAreaFieldProps } from '@Shared/ui/components/TextAreaField/TextAreaField';
import { type RegisterOptions, useFormContext } from 'react-hook-form';

export type FormTextAreaFieldProps = Omit<TextAreaFieldProps, 'name'> & {
  name: string;
  rules?: RegisterOptions;
};

export const FormTextAreaField = ({ rules, name, id, ...props }: FormTextAreaFieldProps) => {
  const { register, formState } = useFormContext();
  const { errors } = formState;

  return (
    <TextAreaField
      {...props}
      {...register(name, rules)}
      id={id || name}
      errorMessage={errors[name]?.message as string}
    />
  );
};
