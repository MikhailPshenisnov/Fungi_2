import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@widgets/layout';
import { registerUser } from '@features/auth';
import { useSession } from '@entities/session';
import { Button, Checkbox, Input, Stack, Typography } from '@shared/ui';
import styles from './RegisterPage.module.css';

export function RegisterPage() {
  const navigate = useNavigate();
  const { signIn } = useSession();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await registerUser({ name: username.trim(), email: email.trim(), password });
      signIn({
        id: `user-${Date.now()}`,
        name: username.trim() || 'Пользователь',
        email: email.trim()
      });
      navigate('/foundation');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось выполнить регистрацию.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      sideTitle="Создайте аккаунт Fungi"
      sideDescription="После регистрации вы сможете вести личный список наблюдений и получать персональные рекомендации."
      sideFooter={
        <Typography variant="caption" className={styles.sideHint}>
          Регистрация занимает меньше минуты.
        </Typography>
      }
      contentFooter={
        <Typography variant="meta" className={styles.footerText}>
          Продолжая, вы принимаете <a href="#">условия использования</a> и{' '}
          <a href="#">политику конфиденциальности</a>.
        </Typography>
      }
    >
      <Stack gap={24}>
        <div>
          <Typography variant="h3" as="h2">
            Регистрация
          </Typography>
          <Typography variant="bodyS" className={styles.subtitle}>
            Заполните данные, чтобы начать пользоваться сервисом.
          </Typography>
        </div>

        <form className={styles.form} noValidate onSubmit={handleSubmit}>
          <Stack gap={16} className={styles.fields}>
            <Input
              name="username"
              label="Имя пользователя"
              placeholder="Например, mycology_fan"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              disabled={isSubmitting}
            />
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
              placeholder="Не менее 8 символов"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isSubmitting}
            />
            <Checkbox
              name="agree"
              label="Согласен с политикой конфиденциальности и условиями использования"
              disabled={isSubmitting}
            />
            {errorMessage ? <Typography variant="caption" className={styles.error}>{errorMessage}</Typography> : null}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Создаём аккаунт...' : 'Создать аккаунт'}
            </Button>
          </Stack>
        </form>

        <Typography variant="bodyS" className={styles.switch}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </Typography>
      </Stack>
    </AuthLayout>
  );
}
