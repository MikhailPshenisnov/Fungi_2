import { Button, Card, Container, Stack, Typography } from '@shared/ui';
import styles from './LandingSurvey.module.css';

export function LandingSurvey() {
  return (
    <section className={styles.section}>
      <Container>
        <Card className={styles.card}>
          <div className={styles.layout}>
            <div className={styles.device} aria-hidden="true" />
            <Stack gap={16}>
              <Typography variant="h3" className={styles.title}>
                Пройдите опрос, чтобы определить гриб
              </Typography>
              <Typography variant="body" className={styles.text}>
                Наш интерактивный тест за 3-5 вопросов подскажет, какой гриб перед вами.
              </Typography>
              <div className={styles.buttonWrap}>
                <Button>Пройти опрос</Button>
              </div>
            </Stack>
          </div>
        </Card>
      </Container>
    </section>
  );
}
