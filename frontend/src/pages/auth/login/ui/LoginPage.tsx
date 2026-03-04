import { FormEvent, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@widgets/layout';
import { loginUser } from '@features/auth';
import { getCurrentUserProfile } from '@features/avatar';
import { normalizePermissionCodes, useSession } from '@entities/session';
import { appleLogo, googleLogo } from '@shared/assets/icons';
import { Button, Checkbox, Input, Stack, Typography } from '@shared/ui';
import styles from './LoginPage.module.css';

interface LocationState {
  reason?: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const state = location.state as LocationState | null;
    if (state?.reason === 'session-expired') {
      setErrorMessage('Сессия истекла. Войдите снова.');
    }
  }, [location.state]);

  function handleSocialAuth(provider: 'google' | 'apple') {
    setErrorMessage(`Авторизация через ${provider === 'google' ? 'Google' : 'Apple'} будет добавлена в следующей итерации.`);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const authResult = await loginUser({ email: email.trim(), password });
      const profileResult = await getCurrentUserProfile(authResult.token);
      const roleAccessLevel = profileResult.user.role?.accessLevel ?? 20;
      const roleName =
        typeof profileResult.user.role?.name === 'string' && profileResult.user.role.name.trim().length > 0
          ? profileResult.user.role.name.trim()
          : 'Unknown role';

      signIn({
        user: {
          id: profileResult.user.id,
          name: profileResult.user.username,
          email: profileResult.user.email,
          avatarUrl: profileResult.user.avatarUrl ?? null,
          roleId: profileResult.user.role?.id ?? '',
          roleName,
          roleAccessLevel,
          permissions: normalizePermissionCodes(profileResult.user.role?.permissions)
        },
        token: authResult.token,
        rememberSession: rememberMe
      });

      navigate('/profile', { replace: true });
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

        <Stack direction="horizontal" gap={12} className={styles.socialAuth}>
          <Button
            type="button"
            variant="secondary"
            leftIcon={<img src={googleLogo} alt="" className={styles.socialIcon} />}
            onClick={() => handleSocialAuth('google')}
            aria-label="Войти через Google"
            disabled={isSubmitting}
          />
          <Button
            type="button"
            variant="secondary"
            leftIcon={<img src={appleLogo} alt="" className={styles.socialIcon} />}
            onClick={() => handleSocialAuth('apple')}
            aria-label="Войти через Apple"
            disabled={isSubmitting}
          />
        </Stack>

        <div className={styles.divider} aria-hidden="true">
          <span>или</span>
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
            <Checkbox
              name="remember"
              label="Запомнить меня"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.currentTarget.checked)}
              disabled={isSubmitting}
            />
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
