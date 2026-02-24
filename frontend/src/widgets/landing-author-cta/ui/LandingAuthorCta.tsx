import { Button, Card, Container, Input, Stack, Typography } from '@shared/ui';
import styles from './LandingAuthorCta.module.css';

export function LandingAuthorCta() {
  return (
    <section className={styles.section}>
      <Container>
        <Card className={styles.card}>
          <div className={styles.layout}>
            <Stack gap={12}>
              <Typography variant="h3" as="h2" className={styles.title}>
                Стань автором статей
              </Typography>
              <Typography variant="body" className={styles.text}>
                Делитесь знаниями о грибах с сообществом. Мы рассматриваем каждую заявку.
              </Typography>
            </Stack>
            <form className={styles.form}>
              <Input label="Email" type="email" placeholder="example@mail.ru" />
              <Button type="submit">Отправить</Button>
            </form>
          </div>
        </Card>
      </Container>
    </section>
  );
}
