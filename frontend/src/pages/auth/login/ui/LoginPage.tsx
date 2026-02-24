import { Link } from 'react-router-dom';
import { AuthLayout } from '@widgets/layout';
import { Button, Checkbox, Input, Stack, Typography } from '@shared/ui';
import styles from './LoginPage.module.css';

export function LoginPage() {
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

        <form className={styles.form} noValidate>
          <Stack gap={16}>
            <Input name="email" type="email" label="Email" placeholder="you@example.com" autoComplete="email" />
            <Input
              name="password"
              type="password"
              label="Пароль"
              placeholder="Введите пароль"
              autoComplete="current-password"
            />
            <Checkbox name="remember" label="Запомнить меня" />
            <Button type="submit">Войти</Button>
          </Stack>
        </form>

        <Typography variant="bodyS" className={styles.switch}>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </Typography>
      </Stack>
    </AuthLayout>
  );
}
