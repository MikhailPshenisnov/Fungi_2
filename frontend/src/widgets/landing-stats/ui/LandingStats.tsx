import { useQuery } from '@tanstack/react-query';
import { getPublicArticles } from '@features/articles';
import { getFilteredMushrooms } from '@features/mushrooms';
import { Card, Container, Typography } from '@shared/ui';
import styles from './LandingStats.module.css';

export function LandingStats() {
  const mushroomsQuery = useQuery({
    queryKey: ['landing', 'stats', 'mushrooms'],
    queryFn: () => getFilteredMushrooms({ page: 1, pageSize: 1, sort: 'name' })
  });

  const articlesQuery = useQuery({
    queryKey: ['landing', 'stats', 'articles'],
    queryFn: () => getPublicArticles({ page: 1, pageSize: 1, sort: 'newest' })
  });

  const mushroomsCount = mushroomsQuery.data?.totalCount;
  const articlesCount = articlesQuery.data?.totalCount;
  const totalMaterialsCount =
    typeof mushroomsCount === 'number' && typeof articlesCount === 'number' ? mushroomsCount + articlesCount : undefined;

  const stats = [
    {
      value: typeof mushroomsCount === 'number' ? mushroomsCount.toLocaleString('ru-RU') : '...',
      label: 'Грибов в базе'
    },
    {
      value: typeof articlesCount === 'number' ? articlesCount.toLocaleString('ru-RU') : '...',
      label: 'Статей в каталоге'
    },
    {
      value: typeof totalMaterialsCount === 'number' ? totalMaterialsCount.toLocaleString('ru-RU') : '...',
      label: 'Всего материалов'
    }
  ];

  return (
    <section id="about" className={styles.section}>
      <Container>
        <div className={styles.grid}>
          {stats.map((item) => (
            <Card key={item.label} className={styles.card}>
              <Typography variant="h3" as="p" className={styles.value}>
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
