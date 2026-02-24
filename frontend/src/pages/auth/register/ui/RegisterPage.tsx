import { Link } from 'react-router-dom';
import { AuthLayout } from '@widgets/layout';
import { Button, Checkbox, Input, Stack, Typography } from '@shared/ui';
import styles from './RegisterPage.module.css';

export function RegisterPage() {
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

        <form className={styles.form} noValidate>
          <Stack gap={16}>
            <Input name="username" label="Имя пользователя" placeholder="Например, mycology_fan" autoComplete="username" />
            <Input name="email" type="email" label="Email" placeholder="you@example.com" autoComplete="email" />
            <Input
              name="password"
              type="password"
              label="Пароль"
              placeholder="Не менее 8 символов"
              autoComplete="new-password"
            />
            <Checkbox name="agree" label="Согласен с политикой конфиденциальности и условиями использования" />
            <Button type="submit">Создать аккаунт</Button>
          </Stack>
        </form>

        <Typography variant="bodyS" className={styles.switch}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </Typography>
      </Stack>
    </AuthLayout>
  );
}
