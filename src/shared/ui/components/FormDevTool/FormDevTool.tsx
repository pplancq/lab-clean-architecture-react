import { DevTool } from '@hookform/devtools';
import { createPortal } from 'react-dom';
import { useFormContext } from 'react-hook-form';

export const FormDevTool = () => {
  const { control } = useFormContext();

  if (globalThis.window === undefined || import.meta.env.PROD) {
    return null;
  }

  return createPortal(<DevTool control={control} />, document.body);
};
