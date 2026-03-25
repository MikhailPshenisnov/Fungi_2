import { createContext } from 'react';

export type ToastTone = 'error' | 'info' | 'success';
export type ToastState = 'entering' | 'visible' | 'exiting';

export interface ToastOptions {
  title?: string;
  durationMs?: number;
  dedupeKey?: string;
}

export interface ToastItem {
  id: string;
  tone: ToastTone;
  title: string | null;
  message: string;
  createdAt: number;
  state: ToastState;
  durationMs: number;
  dedupeKey: string;
  expiresAt: number;
  remainingMs: number | null;
}

export interface ToastContextValue {
  toasts: ToastItem[];
  showError: (message: string, options?: ToastOptions) => string;
  showInfo: (message: string, options?: ToastOptions) => string;
  showSuccess: (message: string, options?: ToastOptions) => string;
  dismiss: (id: string) => void;
  clear: () => void;
  pause: (id: string) => void;
  resume: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
