import { Button, Card, Container, Stack, Tag, Typography } from '@shared/ui';
import styles from './LandingMushrooms.module.css';

const mushrooms = [
  { family: 'Болетовые', name: 'Подосиновик жёлто-бурый', latin: 'Leccinum versipelle', edible: true },
  { family: 'Вёшенковые', name: 'Вёшенка устричная', latin: 'Pleurotus ostreatus', edible: true },
  { family: 'Аманитовые', name: 'Мухомор красный', latin: 'Amanita muscaria', edible: false },
  { family: 'Маслёнковые', name: 'Маслёнок жёлто-бурый', latin: 'Suillus variegatus', edible: true }
];

export function LandingMushrooms() {
  return (
    <section id="mushrooms" className={styles.section}>
      <Container>
        <Stack gap={20}>
          <Typography variant="h3" as="h2" className={styles.title}>
            Наши грибы
          </Typography>
          <div className={styles.grid}>
            {mushrooms.map((mushroom) => (
              <Card key={mushroom.name} hoverable className={styles.card}>
                <div className={styles.cover} aria-hidden="true" />
                <Typography variant="caption" className={styles.family}>
                  {mushroom.family}
                </Typography>
                <Typography variant="h5" as="p" className={styles.name}>
                  {mushroom.name}
                </Typography>
                <Typography variant="caption" className={styles.latin}>
                  {mushroom.latin}
                </Typography>
                <Tag tone={mushroom.edible ? 'success' : 'error'} size="s" className={styles.statusTag}>
                  {mushroom.edible ? 'Съедобный' : 'Опасный'}
                </Tag>
              </Card>
            ))}
          </div>
          <div className={styles.allButton}>
            <Button variant="tertiary">Все грибы</Button>
          </div>
        </Stack>
      </Container>
    </section>
  );
}
