import { Button, Container, Stack, Typography } from '@shared/ui';
import styles from './AppFooter.module.css';

const footerLinks = [
  { label: 'Условия использования', href: '#' },
  { label: 'Конфиденциальность', href: '#' },
  { label: 'Контакты', href: '#' }
];

export function AppFooter() {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.row}>
          <Stack gap={4}>
            <Typography variant="h5" className={styles.brand}>
              Fungi
            </Typography>
            <Typography variant="caption" className={styles.copy}>
              Практичная и понятная энциклопедия о грибах.
            </Typography>
          </Stack>

          <nav aria-label="Ссылки в подвале" className={styles.nav}>
            {footerLinks.map((item) => (
              <Button key={item.label} variant="tertiary" onClick={() => window.location.assign(item.href)}>
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      </Container>
    </footer>
  );
}
