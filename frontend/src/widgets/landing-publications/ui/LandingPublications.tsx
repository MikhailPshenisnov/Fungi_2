import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Container, ContentState, Stack, Tag, Typography } from '@shared/ui';
import { getPublicArticles } from '@features/articles';
import styles from './LandingPublications.module.css';

const PUBLICATIONS_LIMIT = 3;
const WORDS_PER_MINUTE = 180;

function estimateReadingMinutes(paragraphs: { paragraphText: string }[]): number {
  const text = paragraphs.map((paragraph) => paragraph.paragraphText).join(' ');
  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

export function LandingPublications() {
  const publicationsQuery = useQuery({
    queryKey: ['landing', 'publications'],
    queryFn: () => getPublicArticles({ sort: 'newest', page: 1, pageSize: PUBLICATIONS_LIMIT })
  });

  const publications = publicationsQuery.data?.articles ?? [];

  return (
    <section id="articles" className={styles.section}>
      <Container>
        <Stack gap={20}>
          <Typography variant="h3" as="h2" className={styles.title}>
            Наши статьи
          </Typography>
          {publicationsQuery.isLoading ? (
            <ContentState tone="loading" title="Загружаем статьи..." />
          ) : publicationsQuery.isError ? (
            <ContentState
              tone="error"
              title="Не удалось загрузить статьи"
              description="Попробуйте обновить страницу чуть позже."
              action={
                <Button onClick={() => publicationsQuery.refetch()}>
                  Повторить
                </Button>
              }
            />
          ) : publications.length > 0 ? (
            <div className={styles.grid}>
              {publications.map((article) => (
                <Card key={article.id} hoverable className={styles.card}>
                  <Link to={`/articles/${article.id}`} className={styles.cardLink}>
                    <img src={article.headerPhotoLink} alt={article.title} className={styles.cover} />
                    <div className={styles.content}>
                      <Tag tone="neutral" size="s" className={styles.tag}>
                        Публикация
                      </Tag>
                      <Typography variant="h4" as="h3" className={styles.cardTitle}>
                        {article.title}
                      </Typography>
                      <Typography variant="bodyS" className={styles.meta}>
                        {article.authorString}
                      </Typography>
                      <Typography variant="bodyS" className={styles.meta}>
                        {estimateReadingMinutes(article.paragraphs)} мин чтения • {article.likesCount} в избранном
                      </Typography>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <ContentState tone="empty" title="Пока нет опубликованных статей." />
          )}
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
