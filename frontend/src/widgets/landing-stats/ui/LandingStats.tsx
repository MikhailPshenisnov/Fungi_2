import { Card, Container, Typography } from '@shared/ui';
import styles from './LandingStats.module.css';

const stats = [
  { value: '1K+', label: 'Грибов в нашей базе' },
  { value: '100+', label: 'Статей уже есть на сайте' },
  { value: '8 из 10', label: 'Грибников выбирают нас' }
];

export function LandingStats() {
  return (
    <section id="about" className={styles.section}>
      <Container>
        <div className={styles.grid}>
          {stats.map((item) => (
            <Card key={item.label} className={styles.card}>
              <Typography variant="h3" className={styles.value}>
                {item.value}
              </Typography>
              <Typography variant="bodyS" className={styles.label}>
                {item.label}
              </Typography>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
