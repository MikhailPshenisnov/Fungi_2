import { useEffect } from 'react';
import { Button, Typography } from '@shared/ui';
import styles from './AuthRequiredPopup.module.css';

interface AuthRequiredPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: () => void;
}

export function AuthRequiredPopup({ isOpen, onClose, onRegister }: AuthRequiredPopupProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label="Авторизация для лайка"
        onClick={(event) => event.stopPropagation()}
      >
        <Typography variant="h4">Для лайка нужен аккаунт</Typography>
        <Typography variant="bodyS" className={styles.text}>
          Зарегистрируйтесь, чтобы сохранять реакцию и собирать личную историю активности.
        </Typography>
        <div className={styles.actions}>
          <Button onClick={onRegister}>Регистрироваться</Button>
          <Button variant="secondary" onClick={onClose}>
            Позже
          </Button>
        </div>
      </div>
    </div>
  );
}

