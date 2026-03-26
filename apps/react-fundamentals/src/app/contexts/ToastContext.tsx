import { createContext, useContext } from 'react';
import type { ToastMessage } from '@mas/react-ui';

type AddToast = (msg: Omit<ToastMessage, 'id'>) => void;

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const ToastContext = createContext<AddToast>(() => {});

export const useAppToast = () => useContext(ToastContext);
