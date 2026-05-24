import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Container, ContentState, Stack, Tag, Typography } from '@shared/ui';
import { getFilteredMushrooms } from '@features/mushrooms';
import styles from './LandingMushrooms.module.css';

const MUSHROOMS_LIMIT = 4;

export function LandingMushrooms() {
  const mushroomsQuery = useQuery({
    queryKey: ['landing', 'mushrooms'],
    queryFn: () => getFilteredMushrooms({ page: 1, pageSize: MUSHROOMS_LIMIT, sort: 'name' })
  });

  const mushrooms = mushroomsQuery.data?.mushrooms ?? [];

  return (
    <section id="mushrooms" className={styles.section}>
      <Container>
        <Stack gap={20}>
          <Typography variant="h3" as="h2" className={styles.title}>
            Наши грибы
          </Typography>
          {mushroomsQuery.isLoading ? (
            <ContentState tone="loading" title="Загружаем грибы..." />
          ) : mushroomsQuery.isError ? (
            <ContentState
              tone="error"
              title="Не удалось загрузить грибы"
              description="Попробуйте обновить страницу чуть позже."
              action={
                <Button onClick={() => mushroomsQuery.refetch()}>
                  Повторить
                </Button>
              }
            />
          ) : mushrooms.length > 0 ? (
            <div className={styles.grid}>
              {mushrooms.map((mushroom) => (
                <Card key={mushroom.id} hoverable className={styles.card}>
                  <Link to={`/mushrooms/${mushroom.id}`} className={styles.cardLink}>
                    <img src={mushroom.headerPhotoLink} alt={mushroom.name} className={styles.cover} />
                    <div className={styles.content}>
                      <Typography variant="caption" className={styles.family}>
                        {mushroom.family}
                      </Typography>
                      <Typography variant="h5" as="p" className={styles.name}>
                        {mushroom.name}
                      </Typography>
                      <Typography variant="caption" className={styles.latin}>
                        {mushroom.latinName ?? 'Латинское название не указано'}
                      </Typography>
                      <Tag tone={mushroom.eatable.toLowerCase().includes('не') ? 'error' : 'success'} size="s" className={styles.statusTag}>
                        {mushroom.eatable}
                      </Tag>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <ContentState tone="empty" title="Пока нет грибов в каталоге." />
          )}
          <div className={styles.allButton}>
            <Link to="/mushrooms" className={styles.allButtonLink}>
              <Button variant="tertiary">Все грибы</Button>
            </Link>
          </div>
        </Stack>
      </Container>
    </section>
  );
}
