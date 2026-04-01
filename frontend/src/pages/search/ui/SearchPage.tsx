import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useSession } from '@entities/session';
import { getPublicArticles } from '@features/articles';
import { getFilteredMushrooms, useDebouncedValue } from '@features/mushrooms';
import { ApiError } from '@shared/api';
import { Button, Card, Container, ContentState, Stack, Tag, Typography, useToast } from '@shared/ui';
import { PageLayout } from '@widgets/layout';
import styles from './SearchPage.module.css';

const SEARCH_PAGE_SIZE = 6;

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleDateString('ru-RU');
}

function getSearchQuery(searchParams: URLSearchParams): string {
  return searchParams.get('q')?.trim() ?? '';
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showError } = useToast();
  const { signOut } = useSession();

  const query = useMemo(() => getSearchQuery(searchParams), [searchParams]);
  const [searchDraft, setSearchDraft] = useState(query);
  const debouncedQuery = useDebouncedValue(searchDraft, 350);

  const hasQuery = query.length > 0;

  const articlesQuery = useQuery({
    queryKey: ['search', 'articles', query, SEARCH_PAGE_SIZE],
    enabled: hasQuery,
    queryFn: () =>
      getPublicArticles({
        q: query,
        sort: 'likes',
        page: 1,
        pageSize: SEARCH_PAGE_SIZE
      })
  });

  const mushroomsQuery = useQuery({
    queryKey: ['search', 'mushrooms', query, SEARCH_PAGE_SIZE],
    enabled: hasQuery,
    queryFn: () =>
      getFilteredMushrooms({
        partOfName: query,
        sort: 'likes',
        page: 1,
        pageSize: SEARCH_PAGE_SIZE
      })
  });

  const handleSessionExpired = useCallback(() => {
    signOut();
    navigate('/login', { replace: true, state: { reason: 'session-expired' } });
  }, [navigate, signOut]);

  useEffect(() => {
    setSearchDraft(query);
  }, [query]);

  useEffect(() => {
    const nextQuery = debouncedQuery.trim();
    if (nextQuery === query) {
      return;
    }

    setSearchParams(
      (previousSearchParams) => {
        const nextSearchParams = new URLSearchParams(previousSearchParams);
        if (nextQuery.length > 0) {
          nextSearchParams.set('q', nextQuery);
        } else {
          nextSearchParams.delete('q');
        }
        return nextSearchParams;
      },
      { replace: true }
    );
  }, [debouncedQuery, query, setSearchParams]);

  useEffect(() => {
    const queryError = articlesQuery.error ?? mushroomsQuery.error;
    if (!queryError) {
      return;
    }

    if (queryError instanceof ApiError && queryError.status === 401) {
      handleSessionExpired();
      return;
    }

    showError(queryError instanceof Error ? queryError.message : 'Не удалось выполнить поиск.', {
      title: 'Поиск',
      dedupeKey: 'global-search-error'
    });
  }, [articlesQuery.error, handleSessionExpired, mushroomsQuery.error, showError]);

  const isLoading = hasQuery && (articlesQuery.isLoading || mushroomsQuery.isLoading);
  const hasError = hasQuery && (articlesQuery.isError || mushroomsQuery.isError);

  const articlesResult = articlesQuery.data?.articles ?? [];
  const mushroomsResult = mushroomsQuery.data?.mushrooms ?? [];
  const isEmpty = hasQuery && !isLoading && !hasError && articlesResult.length === 0 && mushroomsResult.length === 0;

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchDraft(event.target.value);
  }

  function handleRetry() {
    void Promise.all([articlesQuery.refetch(), mushroomsQuery.refetch()]);
  }

  return (
    <PageLayout>
      <Container size="lg" className={styles.container}>
        <section className={styles.hero}>
          <Stack gap={10}>
            <Typography variant="h1">Глобальный поиск</Typography>
            <Typography variant="bodyS" className={styles.heroText}>
              Ищем одновременно по статьям и каталогу грибов.
            </Typography>
          </Stack>
          <label className={styles.searchField}>
            <span className={styles.searchLabel}>Запрос</span>
            <input value={searchDraft} onChange={handleSearchChange} placeholder="Введите название статьи или гриба" />
          </label>
        </section>

        {!hasQuery ? (
          <ContentState
            tone="info"
            title="Введите поисковый запрос"
            description="Например: белый гриб, мухомор, зимние грибы."
          />
        ) : null}

        {isLoading ? <ContentState tone="loading" title="Ищем результаты..." /> : null}

        {hasError ? (
          <ContentState
            tone="error"
            title="Поиск временно недоступен"
            description="Попробуйте повторить запрос через пару секунд."
            action={<Button onClick={handleRetry}>Повторить</Button>}
          />
        ) : null}

        {isEmpty ? (
          <ContentState
            tone="empty"
            title="Ничего не найдено"
            description="Попробуйте изменить формулировку или сократить запрос."
          />
        ) : null}

        {hasQuery && !isLoading && !hasError && !isEmpty ? (
          <div className={styles.sections}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <Typography variant="h3">Статьи</Typography>
                <Typography variant="caption">{articlesQuery.data?.totalCount ?? 0} результатов</Typography>
              </div>
              {articlesResult.length > 0 ? (
                <div className={styles.grid}>
                  {articlesResult.map((article) => (
                    <Card key={article.id} className={styles.card}>
                      <Stack gap={8}>
                        <Typography variant="h5">{article.title}</Typography>
                        <Typography variant="caption" className={styles.metaText}>
                          {article.authorString} • {formatDate(article.publishDate)}
                        </Typography>
                        <div className={styles.tags}>
                          <Tag tone="info">Лайков: {article.likesCount}</Tag>
                        </div>
                        <Link to={`/articles/${article.id}`} className={styles.linkButton}>
                          Открыть статью
                        </Link>
                      </Stack>
                    </Card>
                  ))}
                </div>
              ) : (
                <ContentState tone="empty" title="По статьям совпадений нет" />
              )}
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <Typography variant="h3">Грибы</Typography>
                <Typography variant="caption">{mushroomsQuery.data?.totalCount ?? 0} результатов</Typography>
              </div>
              {mushroomsResult.length > 0 ? (
                <div className={styles.grid}>
                  {mushroomsResult.map((mushroom) => (
                    <Card key={mushroom.id} className={styles.card}>
                      <Stack gap={8}>
                        <Typography variant="h5">{mushroom.name}</Typography>
                        <Typography variant="caption" className={styles.metaText}>
                          {mushroom.family}
                          {mushroom.latinName ? ` • ${mushroom.latinName}` : ''}
                        </Typography>
                        <div className={styles.tags}>
                          <Tag tone="info">{mushroom.eatable}</Tag>
                          <Tag tone="info">Лайков: {mushroom.likesCount}</Tag>
                        </div>
                        <Link to={`/mushrooms/${mushroom.id}`} className={styles.linkButton}>
                          Открыть гриб
                        </Link>
                      </Stack>
                    </Card>
                  ))}
                </div>
              ) : (
                <ContentState tone="empty" title="По грибам совпадений нет" />
              )}
            </section>
          </div>
        ) : null}
      </Container>
    </PageLayout>
  );
}
