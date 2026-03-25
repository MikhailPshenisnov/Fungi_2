import { Link } from 'react-router-dom';
import { Button, Card, Container, Stack, Typography } from '@shared/ui';
import styles from './LandingPublications.module.css';

const publications = [
  { title: 'Мухомор - ядовитый гриб?', meta: '24 мин • 4.8' },
  { title: 'Грибы как источник пищи', meta: '32 мин • 4.9' },
  { title: 'Психоактивные грибы', meta: '15 мин • 4.5' }
];

export function LandingPublications() {
  return (
    <section id="articles" className={styles.section}>
      <Container>
        <Stack gap={20}>
          <Typography variant="h3" as="h2" className={styles.title}>
            Наши статьи
          </Typography>
          <div className={styles.grid}>
            {publications.map((article) => (
              <Card key={article.title} hoverable className={styles.card}>
                <div className={styles.cover} aria-hidden="true" />
                <Typography variant="h4" as="h3" className={styles.cardTitle}>
                  {article.title}
                </Typography>
                <Typography variant="bodyS" className={styles.meta}>
                  {article.meta}
                </Typography>
              </Card>
            ))}
          </div>
          <div className={styles.allButton}>
            <Link to="/articles" className={styles.allButtonLink}>
              <Button variant="tertiary">Все статьи</Button>
            </Link>
          </div>
        </Stack>
      </Container>
    </section>
  );
}
