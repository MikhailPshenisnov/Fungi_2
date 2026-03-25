import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Article } from '@entities/article';
import { hasPermission, PERMISSION_CODES, useSession } from '@entities/session';
import {
  AuthRequiredPopup,
  getArticleLikesCount,
  getPublicArticles,
  hasUserLikedArticle,
  parseArticleCatalogQuery,
  paginateArticles,
  serializeArticleCatalogQuery,
  sortArticles,
  toggleArticleLike,
  DEFAULT_ARTICLE_CATALOG_QUERY,
  type ArticleCatalogQueryState,
  type ArticleSortMode
} from '@features/articles';
import { useDebouncedValue } from '@features/mushrooms';
import { ApiError } from '@shared/api';
import { favoriteIcon } from '@shared/assets/icons';
import { Button, Card, Container, Input, Select, Stack, Tag, Typography, useToast } from '@shared/ui';
import { PageLayout } from '@widgets/layout';
import styles from './ArticlesPage.module.css';

const PAGE_SIZE = 12;

const sortOptions = [
  { label: 'Сначала новые', value: 'newest' },
  { label: 'Сначала старые', value: 'oldest' },
  { label: 'По лайкам', value: 'likes' }
];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('ru-RU');
}

function statusTone(status: string): 'info' | 'success' | 'warning' | 'error' {
  if (status === 'Published') {
    return 'success';
  }

  if (status === 'InReview' || status === 'Scheduled') {
    return 'warning';
  }

  if (status === 'Rejected') {
    return 'error';
  }

  return 'info';
}

function statusLabel(status: string): string {
  switch (status) {
    case 'Draft':
      return 'Черновик';
    case 'InReview':
      return 'На модерации';
    case 'Scheduled':
      return 'Запланировано';
    case 'Published':
      return 'Опубликовано';
    case 'Rejected':
      return 'Отклонено';
    case 'Archived':
      return 'Архив';
    default:
      return status;
  }
}

export function ArticlesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showError } = useToast();
  const { isAuthenticated, token, signOut, user } = useSession();

  const [searchDraft, setSearchDraft] = useState('');
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const [brokenImageById, setBrokenImageById] = useState<Record<string, boolean>>({});
  const [isLikingById, setIsLikingById] = useState<Record<string, boolean>>({});
  const [likeOverridesById, setLikeOverridesById] = useState<Record<string, { likesCount: number; isLiked: boolean }>>(
    {}
  );

  const queryState = useMemo(() => parseArticleCatalogQuery(searchParams), [searchParams]);
  const debouncedSearch = useDebouncedValue(searchDraft, 400);

  const articlesQuery = useQuery({
    queryKey: ['articles', 'public', queryState.q, queryState.author],
    queryFn: () =>
      getPublicArticles({
        q: queryState.q || undefined,
        author: queryState.author || undefined
      })
  });

  const articles = useMemo(() => articlesQuery.data ?? [], [articlesQuery.data]);
  const sortedArticles = useMemo(() => sortArticles(articles, queryState.sort), [articles, queryState.sort]);
  const paginatedResult = useMemo(() => paginateArticles(sortedArticles, queryState.page, PAGE_SIZE), [sortedArticles, queryState.page]);
  const pageArticles = paginatedResult.items;
  const pageArticleIds = useMemo(() => pageArticles.map((article) => article.id), [pageArticles]);

  const hasLikedQuery = useQuery({
    queryKey: ['articles', 'has-liked', token ?? 'guest', pageArticleIds.join(',')],
    enabled: Boolean(isAuthenticated && token && pageArticleIds.length > 0),
    queryFn: async () => {
      const rows = await Promise.all(
        pageArticleIds.map(async (articleId) => ({
          articleId,
          hasLiked: await hasUserLikedArticle(articleId, token!)
        }))
      );

      return Object.fromEntries(rows.map((row) => [row.articleId, row.hasLiked])) as Record<string, boolean>;
    }
  });

  const hasLikedById = useMemo(() => hasLikedQuery.data ?? {}, [hasLikedQuery.data]);

  const backToCatalogPath = useMemo(() => {
    const serialized = serializeArticleCatalogQuery(queryState).toString();
    return serialized.length > 0 ? `/articles?${serialized}` : '/articles';
  }, [queryState]);
  const canOpenEditorWorkspace = user ? hasPermission(user.permissions, PERMISSION_CODES.articlesWrite) : false;

  const handleSessionExpired = useCallback(() => {
    signOut();
    navigate('/login', { replace: true, state: { reason: 'session-expired' } });
  }, [navigate, signOut]);

  const updateQueryState = useCallback(
    (patch: Partial<ArticleCatalogQueryState>, replace = true) => {
      setSearchParams(
        (previousSearchParams) => {
          const currentState = parseArticleCatalogQuery(previousSearchParams);
          const nextState: ArticleCatalogQueryState = {
            ...currentState,
            ...patch,
            page: Math.max(1, patch.page ?? currentState.page)
          };

          return serializeArticleCatalogQuery(nextState);
        },
        { replace }
      );
    },
    [setSearchParams]
  );

  useEffect(() => {
    setSearchDraft(queryState.q);
  }, [queryState.q]);

  useEffect(() => {
    const nextQuery = debouncedSearch.trim();
    if (nextQuery === queryState.q) {
      return;
    }

    updateQueryState({ q: nextQuery, page: 1 });
  }, [debouncedSearch, queryState.q, updateQueryState]);

  useEffect(() => {
    if (queryState.page !== paginatedResult.page) {
      updateQueryState({ page: paginatedResult.page });
    }
  }, [paginatedResult.page, queryState.page, updateQueryState]);

  useEffect(() => {
    if (!hasLikedQuery.error) {
      return;
    }

    if (hasLikedQuery.error instanceof ApiError && hasLikedQuery.error.status === 401) {
      handleSessionExpired();
      return;
    }

    showError(hasLikedQuery.error instanceof Error ? hasLikedQuery.error.message : 'Не удалось получить статус лайка.', {
      title: 'Лайки',
      dedupeKey: 'articles-has-liked-error'
    });
  }, [handleSessionExpired, hasLikedQuery.error, showError]);

  useEffect(() => {
    if (!articlesQuery.error) {
      return;
    }

    if (articlesQuery.error instanceof ApiError && articlesQuery.error.status === 401) {
      handleSessionExpired();
      return;
    }

    showError(articlesQuery.error instanceof Error ? articlesQuery.error.message : 'Не удалось загрузить каталог статей.', {
      title: 'Каталог статей',
      dedupeKey: 'articles-catalog-error'
    });
  }, [articlesQuery.error, handleSessionExpired, showError]);

  function handleSearchInputChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchDraft(event.target.value);
  }

  function handleAuthorFilterChange(event: ChangeEvent<HTMLInputElement>) {
    updateQueryState({ author: event.target.value, page: 1 });
  }

  function handleSortChange(event: ChangeEvent<HTMLSelectElement>) {
    updateQueryState({ sort: event.target.value as ArticleSortMode, page: 1 });
  }

  function handleResetFilters() {
    setSearchDraft(DEFAULT_ARTICLE_CATALOG_QUERY.q);
    setSearchParams(serializeArticleCatalogQuery(DEFAULT_ARTICLE_CATALOG_QUERY));
  }

  function openArticleDetails(articleId: string) {
    navigate(`/articles/${articleId}`, { state: { backTo: backToCatalogPath } });
  }

  function handleArticleCardKeyDown(event: KeyboardEvent<HTMLDivElement>, articleId: string) {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    openArticleDetails(articleId);
  }

  function resolveLikeState(articleId: string, fallbackLikesCount: number): { likesCount: number; isLiked: boolean } {
    const override = likeOverridesById[articleId];
    if (override) {
      return override;
    }

    return {
      likesCount: fallbackLikesCount,
      isLiked: Boolean(hasLikedById[articleId])
    };
  }

  async function handleToggleLike(article: Article) {
    if (!isAuthenticated || !token) {
      setIsAuthPopupOpen(true);
      return;
    }

    if (isLikingById[article.id]) {
      return;
    }

    const previousState = resolveLikeState(article.id, article.likesCount);
    const optimisticIsLiked = !previousState.isLiked;
    const optimisticLikesCount = Math.max(0, previousState.likesCount + (optimisticIsLiked ? 1 : -1));

    setIsLikingById((previousMap) => ({ ...previousMap, [article.id]: true }));
    setLikeOverridesById((previousMap) => ({
      ...previousMap,
      [article.id]: {
        isLiked: optimisticIsLiked,
        likesCount: optimisticLikesCount
      }
    }));

    try {
      const confirmedIsLiked = await toggleArticleLike(article.id, token);
      const confirmedLikesCount = await getArticleLikesCount(article.id);

      setLikeOverridesById((previousMap) => ({
        ...previousMap,
        [article.id]: {
          isLiked: confirmedIsLiked,
          likesCount: confirmedLikesCount
        }
      }));

      void queryClient.invalidateQueries({ queryKey: ['articles', 'public'] });
    } catch (error) {
      setLikeOverridesById((previousMap) => ({
        ...previousMap,
        [article.id]: previousState
      }));

      if (error instanceof ApiError && error.status === 401) {
        handleSessionExpired();
        return;
      }

      showError(error instanceof Error ? error.message : 'Не удалось обновить лайк.', {
        title: 'Лайки',
        dedupeKey: 'articles-like-toggle-error'
      });
    } finally {
      setIsLikingById((previousMap) => ({ ...previousMap, [article.id]: false }));
    }
  }

  function handleGoToPreviousPage() {
    updateQueryState({ page: Math.max(1, queryState.page - 1) });
  }

  function handleGoToNextPage() {
    updateQueryState({ page: Math.min(paginatedResult.totalPages, queryState.page + 1) });
  }

  return (
    <PageLayout>
      <Container size="lg" className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.heroTop}>
            <Stack gap={14}>
              <Typography variant="h1">Статьи о грибах</Typography>
              <Typography variant="body" className={styles.heroText}>
                Публикации, подборки и практические заметки от редакторов проекта.
              </Typography>
            </Stack>
            {canOpenEditorWorkspace ? (
              <Button
                variant="secondary"
                onClick={() => {
                  navigate('/editor/articles?scope=drafts');
                }}
              >
                В редактор
              </Button>
            ) : null}
          </div>
        </section>

        <Card className={styles.filtersCard}>
          <div className={styles.filtersGrid}>
            <Input
              label="Поиск по названию"
              value={searchDraft}
              onChange={handleSearchInputChange}
              placeholder="Например, съедобные грибы"
            />
            <Input
              label="Автор"
              value={queryState.author}
              onChange={handleAuthorFilterChange}
              placeholder="Имя автора"
            />
            <Select label="Сортировка" value={queryState.sort} onChange={handleSortChange} options={sortOptions} />
            <div className={styles.filterActions}>
              <Button variant="secondary" onClick={handleResetFilters}>
                Сбросить фильтры
              </Button>
            </div>
          </div>
        </Card>

        {articlesQuery.isLoading ? (
          <div className={styles.loadingState}>Загружаем публикации...</div>
        ) : null}

        {articlesQuery.isError ? (
          <Card className={styles.stateCard}>
            <Stack gap={12}>
              <Typography variant="h4">Каталог статей временно недоступен</Typography>
              <Typography variant="bodyS" className={styles.stateText}>
                Попробуйте повторить запрос чуть позже.
              </Typography>
              <Button onClick={() => articlesQuery.refetch()}>Повторить</Button>
            </Stack>
          </Card>
        ) : null}

        {!articlesQuery.isLoading && !articlesQuery.isError ? (
          <>
            {pageArticles.length === 0 ? (
              <Card className={styles.stateCard}>
                <Typography variant="body">По вашему запросу статьи не найдены.</Typography>
              </Card>
            ) : (
              <div className={styles.grid}>
                {pageArticles.map((article) => {
                  const likeState = resolveLikeState(article.id, article.likesCount);
                  const isLiking = Boolean(isLikingById[article.id]);
                  const isImageBroken = Boolean(brokenImageById[article.id]);

                  return (
                    <Card
                      key={article.id}
                      hoverable
                      className={styles.card}
                      role="link"
                      tabIndex={0}
                      onClick={() => openArticleDetails(article.id)}
                      onKeyDown={(event) => handleArticleCardKeyDown(event, article.id)}
                    >
                      <div className={styles.cardImageWrap}>
                        {!isImageBroken ? (
                          <img
                            src={article.headerPhotoLink}
                            alt={article.title}
                            className={styles.cardImage}
                            onError={() =>
                              setBrokenImageById((previousState) => ({
                                ...previousState,
                                [article.id]: true
                              }))
                            }
                          />
                        ) : (
                          <div className={styles.imageFallback} aria-hidden="true">
                            {article.title}
                          </div>
                        )}
                      </div>

                      <Stack gap={12}>
                        <div className={styles.cardHeader}>
                          <Typography variant="h4" className={styles.cardTitle}>
                            {article.title}
                          </Typography>
                          <Tag tone={statusTone(article.status)}>{statusLabel(article.status)}</Tag>
                        </div>

                        <Typography variant="bodyS" className={styles.cardMeta}>
                          {article.authorString} • {formatDate(article.publishDate)}
                        </Typography>

                        <button
                          type="button"
                          className={
                            likeState.isLiked
                              ? `${styles.likeButton} ${styles.likeButtonActive}`
                              : styles.likeButton
                          }
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            void handleToggleLike(article);
                          }}
                          disabled={isLiking}
                          aria-label={likeState.isLiked ? 'Убрать лайк статье' : 'Поставить лайк статье'}
                        >
                          <img src={favoriteIcon} alt="" aria-hidden="true" className={styles.likeIcon} />
                          <span>{likeState.likesCount}</span>
                        </button>
                      </Stack>
                    </Card>
                  );
                })}
              </div>
            )}

            {paginatedResult.totalPages > 1 ? (
              <div className={styles.pagination}>
                <Button variant="secondary" onClick={handleGoToPreviousPage} disabled={queryState.page <= 1}>
                  Назад
                </Button>
                <Typography variant="bodyS">
                  Страница {queryState.page} из {paginatedResult.totalPages}
                </Typography>
                <Button
                  variant="secondary"
                  onClick={handleGoToNextPage}
                  disabled={queryState.page >= paginatedResult.totalPages}
                >
                  Вперёд
                </Button>
              </div>
            ) : null}
          </>
        ) : null}
      </Container>

      <AuthRequiredPopup
        isOpen={isAuthPopupOpen}
        onClose={() => setIsAuthPopupOpen(false)}
        onRegister={() => {
          setIsAuthPopupOpen(false);
          navigate('/register');
        }}
      />
    </PageLayout>
  );
}
