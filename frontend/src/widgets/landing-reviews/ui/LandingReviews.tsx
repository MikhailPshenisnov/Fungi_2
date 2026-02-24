import { Button, Card, Container, Stack, Typography } from '@shared/ui';
import styles from './LandingReviews.module.css';

const reviews = [
  {
    name: 'Александр Р.',
    role: '1 год с нами',
    text: 'Очень удобно искать информацию по грибам. Всё понятно и без лишнего визуального шума.'
  },
  {
    name: 'Мила Т.',
    role: 'Преподаватель полевой практики',
    text: 'Нравится спокойный и научный тон материалов. Удобно обучать новичков на понятных примерах.'
  },
  {
    name: 'Марк В.',
    role: 'Грибник выходного дня',
    text: 'На телефоне в лесу пользоваться удобно. Опрос помогает быстро сузить круг подходящих видов.'
  }
];

export function LandingReviews() {
  return (
    <section id="reviews" className={styles.section}>
      <Container>
        <Stack gap={20}>
          <Typography variant="h3" className={styles.title}>
            Наши отзывы
          </Typography>
          <div className={styles.grid}>
            {reviews.map((review) => (
              <Card key={review.name} className={styles.card}>
                <Typography variant="body" className={styles.text}>
                  \"{review.text}\"
                </Typography>
                <Typography variant="caption" className={styles.author}>
                  {review.name}
                </Typography>
                <Typography variant="meta" className={styles.role}>
                  {review.role}
                </Typography>
              </Card>
            ))}
          </div>
          <div className={styles.allButton}>
            <Button variant="tertiary">Все отзывы</Button>
          </div>
        </Stack>
      </Container>
    </section>
  );
}
