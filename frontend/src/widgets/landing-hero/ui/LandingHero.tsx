import { Button, Card, Container, Stack, Tag, Typography } from '@shared/ui';
import styles from './LandingHero.module.css';

export function LandingHero() {
  return (
    <section className={styles.section}>
      <Container size="full-width">
        <Card className={styles.heroCard}>
          <Container size="lg">
            <div className={styles.content}>
              <Stack gap={20}>
                <Tag tone="neutral" size="l">
                  Более 1000 пользователей
                </Tag>
                <Typography variant="h0" as="h1" className={styles.title}>
                  Исследуй мир грибов с FUNGI
                </Typography>
                <Typography variant="bodyL" className={styles.description}>
                  FUNGI – электронная энциклопедия о грибах, которая предоставляет информацию о видах, местах
                  произрастания, съедобности и важных фактах.
                </Typography>
                <Stack direction="horizontal" gap={12} className={styles.actions}>
                  <Button>Исследовать</Button>
                  <Button variant="secondary">К статьям</Button>
                </Stack>
              </Stack>
              <div className={styles.visual}>
                <img src="/images/landing/hero.png" alt="Иллюстрация грибов" className={styles.visualImage} />
              </div>
            </div>
          </Container>
        </Card>
      </Container>
    </section>
  );
}
