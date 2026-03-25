import { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ToastContext, type ToastContextValue, type ToastItem, type ToastOptions, type ToastTone } from './toast.context';
import { ToastViewport } from './ToastViewport';

const MAX_TOASTS = 3;
const DEFAULT_DURATION_MS = 4_000;
const EXIT_DURATION_MS = 220;
const ENTER_DURATION_MS = 24;
const DEDUPE_WINDOW_MS = 3_000;

function normalizeMessage(value: string): string {
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : 'Произошла ошибка.';
}

function normalizeDuration(value: number | undefined): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return DEFAULT_DURATION_MS;
  }

  return Math.max(1_000, Math.round(value));
}

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastIdCounterRef = useRef(0);
  const toastsRef = useRef<ToastItem[]>([]);
  const autoDismissTimersRef = useRef<Map<string, number>>(new Map());
  const removalTimersRef = useRef<Map<string, number>>(new Map());
  const enterTimersRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    toastsRef.current = toasts;
  }, [toasts]);

  useEffect(() => {
    const autoDismissTimers = autoDismissTimersRef.current;
    const removalTimers = removalTimersRef.current;
    const enterTimers = enterTimersRef.current;

    return () => {
      for (const timerId of autoDismissTimers.values()) {
        window.clearTimeout(timerId);
      }
      for (const timerId of removalTimers.values()) {
        window.clearTimeout(timerId);
      }
      for (const timerId of enterTimers.values()) {
        window.clearTimeout(timerId);
      }
    };
  }, []);

  const clearAutoDismissTimer = useCallback((toastId: string) => {
    const timerId = autoDismissTimersRef.current.get(toastId);
    if (!timerId) {
      return;
    }

    window.clearTimeout(timerId);
    autoDismissTimersRef.current.delete(toastId);
  }, []);

  const clearRemovalTimer = useCallback((toastId: string) => {
    const timerId = removalTimersRef.current.get(toastId);
    if (!timerId) {
      return;
    }

    window.clearTimeout(timerId);
    removalTimersRef.current.delete(toastId);
  }, []);

  const clearEnterTimer = useCallback((toastId: string) => {
    const timerId = enterTimersRef.current.get(toastId);
    if (!timerId) {
      return;
    }

    window.clearTimeout(timerId);
    enterTimersRef.current.delete(toastId);
  }, []);

  const scheduleRemoval = useCallback(
    (toastId: string) => {
      if (removalTimersRef.current.has(toastId)) {
        return;
      }

      const timerId = window.setTimeout(() => {
        autoDismissTimersRef.current.delete(toastId);
        removalTimersRef.current.delete(toastId);
        enterTimersRef.current.delete(toastId);
        setToasts((previousToasts) => previousToasts.filter((toast) => toast.id !== toastId));
      }, EXIT_DURATION_MS);

      removalTimersRef.current.set(toastId, timerId);
    },
    []
  );

  const dismiss = useCallback(
    (toastId: string) => {
      clearAutoDismissTimer(toastId);
      clearEnterTimer(toastId);

      setToasts((previousToasts) =>
        previousToasts.map((toast) => {
          if (toast.id !== toastId || toast.state === 'exiting') {
            return toast;
          }

          return {
            ...toast,
            state: 'exiting'
          };
        })
      );

      scheduleRemoval(toastId);
    },
    [clearAutoDismissTimer, clearEnterTimer, scheduleRemoval]
  );

  const scheduleAutoDismiss = useCallback(
    (toastId: string, delayMs: number) => {
      clearAutoDismissTimer(toastId);

      if (delayMs <= 0) {
        dismiss(toastId);
        return;
      }

      const timerId = window.setTimeout(() => {
        dismiss(toastId);
      }, delayMs);

      autoDismissTimersRef.current.set(toastId, timerId);
    },
    [clearAutoDismissTimer, dismiss]
  );

  const scheduleEnter = useCallback(
    (toastId: string) => {
      clearEnterTimer(toastId);

      const timerId = window.setTimeout(() => {
        enterTimersRef.current.delete(toastId);
        setToasts((previousToasts) =>
          previousToasts.map((toast) => {
            if (toast.id !== toastId || toast.state !== 'entering') {
              return toast;
            }

            return {
              ...toast,
              state: 'visible'
            };
          })
        );
      }, ENTER_DURATION_MS);

      enterTimersRef.current.set(toastId, timerId);
    },
    [clearEnterTimer]
  );

  const showToast = useCallback(
    (tone: ToastTone, message: string, options?: ToastOptions): string => {
      const now = Date.now();
      const durationMs = normalizeDuration(options?.durationMs);
      const normalizedMessage = normalizeMessage(message);
      const normalizedTitle = options?.title?.trim() ? options.title.trim() : null;
      const dedupeKey =
        options?.dedupeKey?.trim() || `${tone}::${normalizedTitle ?? ''}::${normalizedMessage}`;

      let createdToastId: string | null = null;
      let existingToastId: string | null = null;
      let overflowToastId: string | null = null;

      setToasts((previousToasts) => {
        const existingToast = previousToasts.find(
          (toast) =>
            toast.state !== 'exiting' &&
            toast.dedupeKey === dedupeKey &&
            now - toast.createdAt <= DEDUPE_WINDOW_MS
        );

        if (existingToast) {
          existingToastId = existingToast.id;

          return previousToasts.map((toast) => {
            if (toast.id !== existingToast.id) {
              return toast;
            }

            return {
              ...toast,
              tone,
              title: normalizedTitle,
              message: normalizedMessage,
              state: 'visible',
              createdAt: now,
              durationMs,
              dedupeKey,
              expiresAt: now + durationMs,
              remainingMs: null
            };
          });
        }

        toastIdCounterRef.current += 1;
        const toastId = `toast-${now}-${toastIdCounterRef.current}`;
        createdToastId = toastId;

        const nextToast: ToastItem = {
          id: toastId,
          tone,
          title: normalizedTitle,
          message: normalizedMessage,
          state: 'entering',
          createdAt: now,
          durationMs,
          dedupeKey,
          expiresAt: now + durationMs,
          remainingMs: null
        };

        const nextToasts = [nextToast, ...previousToasts];
        if (nextToasts.length <= MAX_TOASTS) {
          return nextToasts;
        }

        const overflowToast = nextToasts[nextToasts.length - 1];
        overflowToastId = overflowToast.id;

        return nextToasts.map((toast, index) =>
          index === nextToasts.length - 1
            ? {
                ...toast,
                state: 'exiting'
              }
            : toast
        );
      });

      if (existingToastId) {
        clearRemovalTimer(existingToastId);
        scheduleAutoDismiss(existingToastId, durationMs);
        return existingToastId;
      }

      if (createdToastId) {
        scheduleEnter(createdToastId);
        scheduleAutoDismiss(createdToastId, durationMs);
      }

      if (overflowToastId) {
        clearAutoDismissTimer(overflowToastId);
        clearEnterTimer(overflowToastId);
        scheduleRemoval(overflowToastId);
      }

      return createdToastId ?? `toast-${now}`;
    },
    [
      clearAutoDismissTimer,
      clearEnterTimer,
      clearRemovalTimer,
      scheduleAutoDismiss,
      scheduleEnter,
      scheduleRemoval
    ]
  );

  const pause = useCallback(
    (toastId: string) => {
      clearAutoDismissTimer(toastId);

      const now = Date.now();
      setToasts((previousToasts) =>
        previousToasts.map((toast) => {
          if (toast.id !== toastId || toast.state === 'exiting') {
            return toast;
          }

          const remainingMs = toast.remainingMs ?? Math.max(0, toast.expiresAt - now);
          return {
            ...toast,
            remainingMs
          };
        })
      );
    },
    [clearAutoDismissTimer]
  );

  const resume = useCallback(
    (toastId: string) => {
      const now = Date.now();
      let delayMs: number | null = null;

      setToasts((previousToasts) =>
        previousToasts.map((toast) => {
          if (toast.id !== toastId || toast.state === 'exiting') {
            return toast;
          }

          delayMs = toast.remainingMs ?? Math.max(0, toast.expiresAt - now);

          return {
            ...toast,
            remainingMs: null,
            expiresAt: now + delayMs
          };
        })
      );

      if (delayMs !== null) {
        scheduleAutoDismiss(toastId, delayMs);
      }
    },
    [scheduleAutoDismiss]
  );

  const clear = useCallback(() => {
    const activeToasts = toastsRef.current;
    for (const toast of activeToasts) {
      dismiss(toast.id);
    }
  }, [dismiss]);

  const showError = useCallback(
    (message: string, options?: ToastOptions) => showToast('error', message, options),
    [showToast]
  );
  const showInfo = useCallback(
    (message: string, options?: ToastOptions) => showToast('info', message, options),
    [showToast]
  );
  const showSuccess = useCallback(
    (message: string, options?: ToastOptions) => showToast('success', message, options),
    [showToast]
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      toasts,
      showError,
      showInfo,
      showSuccess,
      dismiss,
      clear,
      pause,
      resume
    }),
    [clear, dismiss, pause, resume, showError, showInfo, showSuccess, toasts]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport />
    </ToastContext.Provider>
  );
}
