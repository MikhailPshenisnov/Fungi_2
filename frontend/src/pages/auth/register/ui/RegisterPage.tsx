import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@widgets/layout';
import {
  PERSONAL_DATA_CONSENT_VERSION,
  registerUser,
  USER_AGREEMENT_VERSION
} from '@features/auth';
import { getCurrentUserProfile } from '@features/avatar';
import { normalizePermissionCodes, useSession } from '@entities/session';
import { appleLogo, googleLogo } from '@shared/assets/icons';
import { Button, Checkbox, Input, Stack, Typography, useToast } from '@shared/ui';
import styles from './RegisterPage.module.css';

export function RegisterPage() {
  const navigate = useNavigate();
  const { signIn } = useSession();
  const { showError, showInfo } = useToast();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isUserAgreementAccepted, setIsUserAgreementAccepted] = useState(false);
  const [isPersonalDataConsentAccepted, setIsPersonalDataConsentAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canSubmit = !isSubmitting && isUserAgreementAccepted && isPersonalDataConsentAccepted;

  function handleSocialAuth(provider: 'google' | 'apple') {
    showInfo(`Авторизация через ${provider === 'google' ? 'Google' : 'Apple'} будет добавлена в следующей итерации.`, {
      title: 'Скоро'
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isUserAgreementAccepted || !isPersonalDataConsentAccepted) {
      return;
    }

    setIsSubmitting(true);

    try {
      const authResult = await registerUser({
        name: username.trim(),
        email: email.trim(),
        password,
        isUserAgreementAccepted,
        isPersonalDataProcessingConsentAccepted: isPersonalDataConsentAccepted,
        userAgreementVersion: USER_AGREEMENT_VERSION,
        personalDataProcessingConsentVersion: PERSONAL_DATA_CONSENT_VERSION
      });
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
        rememberSession: true
      });

      navigate('/profile', { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось выполнить регистрацию.';
      showError(message, { title: 'Ошибка регистрации' });
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
          Продолжая, вы принимаете <Link to="/legal/user-agreement">пользовательское соглашение</Link> и{' '}
          <Link to="/legal/personal-data-consent">согласие на обработку персональных данных</Link>.
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

        <Stack direction="horizontal" gap={12} className={styles.socialAuth}>
          <Button
            type="button"
            variant="secondary"
            leftIcon={<img src={googleLogo} alt="" className={styles.socialIcon} />}
            onClick={() => handleSocialAuth('google')}
            aria-label="Продолжить через Google"
            disabled={isSubmitting}
          />
          <Button
            type="button"
            variant="secondary"
            leftIcon={<img src={appleLogo} alt="" className={styles.socialIcon} />}
            onClick={() => handleSocialAuth('apple')}
            aria-label="Продолжить через Apple"
            disabled={isSubmitting}
          />
        </Stack>

        <div className={styles.divider} aria-hidden="true">
          <span>или</span>
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
              name="isUserAgreementAccepted"
              label={
                <>
                  Я принимаю <Link to="/legal/user-agreement">Пользовательское соглашение</Link>
                </>
              }
              checked={isUserAgreementAccepted}
              onChange={(event) => setIsUserAgreementAccepted(event.target.checked)}
              disabled={isSubmitting}
              required
            />
            <Checkbox
              name="isPersonalDataProcessingConsentAccepted"
              label={
                <>
                  Я даю согласие на{' '}
                  <Link to="/legal/personal-data-consent">обработку персональных данных</Link>
                </>
              }
              checked={isPersonalDataConsentAccepted}
              onChange={(event) => setIsPersonalDataConsentAccepted(event.target.checked)}
              disabled={isSubmitting}
              required
            />
            <Button type="submit" disabled={!canSubmit}>
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
