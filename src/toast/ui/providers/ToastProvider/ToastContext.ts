import type { ToastStoreInterface } from '@Toast/application/stores/ToastStoreInterface';
import { createContext } from 'react';

type ToastContextValue = {
  toast: ToastStoreInterface;
};

export const ToastContext = createContext<ToastContextValue | null>(null);
