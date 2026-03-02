import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@widgets/layout';
import { loginUser } from '@features/auth';
import { useSession } from '@entities/session';
import { Button, Checkbox, Input, Stack, Typography } from '@shared/ui';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await loginUser({ email: email.trim(), password });
      const fallbackName = email.split('@')[0] || 'Пользователь';
      signIn({
        id: `user-${Date.now()}`,
        name: fallbackName,
        email: email.trim()
      });
      navigate('/foundation');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось выполнить вход.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      sideTitle="С возвращением в Fungi"
      sideDescription="Войдите в аккаунт, чтобы сохранять заметки, отмечать грибы и продолжить обучение."
      sideFooter={
        <Typography variant="caption" className={styles.sideHint}>
          Съедобные и опасные виды, памятки и публикации всегда под рукой.
        </Typography>
      }
    >
      <Stack gap={24}>
        <div>
          <Typography variant="h3" as="h2">
            Вход
          </Typography>
          <Typography variant="bodyS" className={styles.subtitle}>
            Используйте email и пароль от вашего аккаунта.
          </Typography>
        </div>

        <form className={styles.form} noValidate onSubmit={handleSubmit}>
          <Stack gap={16} className={styles.fields}>
            <Input
              name="email"
              type="email"
              label="Email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
            />
            <Input
              name="password"
              type="password"
              label="Пароль"
              placeholder="Введите пароль"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isSubmitting}
            />
            <Checkbox name="remember" label="Запомнить меня" disabled={isSubmitting} />
            {errorMessage ? <Typography variant="caption" className={styles.error}>{errorMessage}</Typography> : null}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Входим...' : 'Войти'}
            </Button>
          </Stack>
        </form>

        <Typography variant="bodyS" className={styles.switch}>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </Typography>
      </Stack>
    </AuthLayout>
  );
}
