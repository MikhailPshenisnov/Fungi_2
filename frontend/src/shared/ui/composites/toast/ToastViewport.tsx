import { useToast } from './use-toast';
import styles from './Toast.module.css';

function getToneClassName(tone: 'error' | 'info' | 'success'): string {
  if (tone === 'error') {
    return styles.toastError;
  }

  if (tone === 'success') {
    return styles.toastSuccess;
  }

  return styles.toastInfo;
}

function getStateClassName(state: 'entering' | 'visible' | 'exiting'): string {
  if (state === 'entering') {
    return styles.toastEntering;
  }

  if (state === 'exiting') {
    return styles.toastExiting;
  }

  return styles.toastVisible;
}

export function ToastViewport() {
  const { toasts, dismiss, pause, resume } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className={styles.viewport} aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <section
          key={toast.id}
          role={toast.tone === 'error' ? 'alert' : 'status'}
          aria-live={toast.tone === 'error' ? 'assertive' : 'polite'}
          className={`${styles.toast} ${getToneClassName(toast.tone)} ${getStateClassName(toast.state)}`}
          onMouseEnter={() => pause(toast.id)}
          onMouseLeave={() => resume(toast.id)}
          onFocus={() => pause(toast.id)}
          onBlur={() => resume(toast.id)}
        >
          <div className={styles.toastContent}>
            {toast.title ? <div className={styles.toastTitle}>{toast.title}</div> : null}
            <div className={styles.toastMessage}>{toast.message}</div>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => dismiss(toast.id)}
            aria-label="Закрыть уведомление"
          >
            ×
          </button>
        </section>
      ))}
    </div>
  );
}
