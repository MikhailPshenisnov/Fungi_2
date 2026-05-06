import { Link } from 'react-router-dom';
import { Container, Stack, Typography } from '@shared/ui';
import styles from './AppFooter.module.css';

const footerLinks = [
  { label: 'Условия использования', href: '/legal/user-agreement' },
  { label: 'Конфиденциальность', href: '/legal/personal-data-consent' },
  { label: 'Контакты', href: '/about' }
];

export function AppFooter() {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.row}>
          <Stack gap={4}>
            <Typography variant="h5" as="span" className={styles.brand}>
              Fungi
            </Typography>
            <Typography variant="caption" className={styles.copy}>
              Практичная и понятная энциклопедия о грибах.
            </Typography>
          </Stack>

          <nav aria-label="Ссылки в подвале" className={styles.nav}>
            {footerLinks.map((item) => (
              <Link key={item.label} to={item.href} className={styles.link}>
                <Typography variant="caption">{item.label}</Typography>
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </footer>
  );
}
