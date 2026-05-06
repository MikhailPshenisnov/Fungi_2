import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import type { Article } from '@entities/article';
import { useSession } from '@entities/session';
import {
  AuthRequiredPopup,
  getArticleLikesCount,
  getPublicArticleById,
  getPublicArticles,
  hasUserLikedArticle,
  toggleArticleLike
} from '@features/articles';
import { ApiError } from '@shared/api';
import { favoriteIcon } from '@shared/assets/icons';
import { Button, Card, Container, ContentState, Tag, Typography, useToast } from '@shared/ui';
import { PageLayout } from '@widgets/layout';
import styles from './ArticleDetailPage.module.css';

const ARTICLE_NAVIGATION_PAGE_SIZE = 100;
const RELATED_ARTICLES_LIMIT = 3;
const WORDS_PER_MINUTE = 180;

interface LocationState {
  backTo?: string;
}

interface ArticleDetailPageProps {
  articleId?: string;
}

function resolveBackToPath(state: unknown): string {
  if (!state || typeof state !== 'object') {
    return '/articles';
  }

  const typedState = state as LocationState;
  if (typeof typedState.backTo !== 'string') {
    return '/articles';
  }

  const normalizedBackTo = typedState.backTo.trim();
  if (!normalizedBackTo.startsWith('/')) {
    return '/articles';
  }

  return normalizedBackTo;
}

function estimateReadingMinutes(article: Article): number {
  const text = article.paragraphs.map((paragraph) => paragraph.paragraphText).join(' ');
  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

function formatReadingTime(article: Article): string {
  return `${estimateReadingMinutes(article)} мин чтения`;
}

function getStatusTone(status: string): 'info' | 'success' | 'warning' | 'error' {
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

function getStatusLabel(status: string): string {
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

export function ArticleDetailPage({ articleId: articleIdProp }: ArticleDetailPageProps = {}) {
  const { id: articleIdRoute } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showError } = useToast();
  const { isAuthenticated, token, signOut } = useSession();

  const articleId = articleIdProp ?? articleIdRoute ?? '';
  const backToPath = useMemo(() => resolveBackToPath(location.state), [location.state]);

  const [isHeaderImageBroken, setIsHeaderImageBroken] = useState(false);
  const [brokenGalleryImageByUrl, setBrokenGalleryImageByUrl] = useState<Record<string, boolean>>({});
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [likeOverride, setLikeOverride] = useState<{ likesCount: number; isLiked: boolean } | null>(null);
  const [brokenRelatedArticleImageById, setBrokenRelatedArticleImageById] = useState<Record<string, boolean>>({});
  const [isRelatedArticleLikingById, setIsRelatedArticleLikingById] = useState<Record<string, boolean>>({});
  const [relatedArticleLikeOverridesById, setRelatedArticleLikeOverridesById] = useState<
    Record<string, { likesCount: number; isLiked: boolean }>
  >({});

  const articleQuery = useQuery({
    queryKey: ['articles', 'detail', articleId],
    enabled: articleId.length > 0,
    queryFn: () => getPublicArticleById(articleId)
  });

  const likesCountQuery = useQuery({
    queryKey: ['articles', 'detail', articleId, 'likes-count'],
    enabled: articleId.length > 0,
    queryFn: () => getArticleLikesCount(articleId)
  });

  const relatedArticlesQuery = useQuery({
    queryKey: ['articles', 'detail', articleId, 'related-publications'],
    enabled: articleId.length > 0,
    queryFn: () => getPublicArticles({ sort: 'newest', page: 1, pageSize: ARTICLE_NAVIGATION_PAGE_SIZE })
  });

  const hasLikedQuery = useQuery({
    queryKey: ['articles', 'detail', articleId, 'has-liked', token ?? 'guest'],
    enabled: Boolean(articleId.length > 0 && isAuthenticated && token),
    queryFn: () => hasUserLikedArticle(articleId, token!)
  });

  const article = articleQuery.data;
  const allNavigationArticles = useMemo(() => relatedArticlesQuery.data?.articles ?? [], [relatedArticlesQuery.data?.articles]);
  const relatedArticles = useMemo(
    () => allNavigationArticles.filter((relatedArticle) => relatedArticle.id !== articleId).slice(0, RELATED_ARTICLES_LIMIT),
    [allNavigationArticles, articleId]
  );
  const nextArticle = useMemo(() => {
    if (allNavigationArticles.length < 2) {
      return null;
    }

    const currentArticleIndex = allNavigationArticles.findIndex((navigationArticle) => navigationArticle.id === articleId);
    if (currentArticleIndex < 0) {
      return null;
    }

    return allNavigationArticles[(currentArticleIndex + 1) % allNavigationArticles.length] ?? null;
  }, [allNavigationArticles, articleId]);
  const relatedArticleIds = useMemo(() => relatedArticles.map((relatedArticle) => relatedArticle.id), [relatedArticles]);

  const galleryImages = useMemo(() => {
    if (!article) {
      return [];
    }

    const entries = article.extraPhotoLinks
      .map((value) => value.trim())
      .filter((value) => value.length > 0);

    return Array.from(new Set(entries));
  }, [article]);

  const likeState = likeOverride ?? {
    likesCount: likesCountQuery.data ?? article?.likesCount ?? 0,
    isLiked: Boolean(hasLikedQuery.data)
  };

  const relatedArticlesHasLikedQuery = useQuery({
    queryKey: ['articles', 'detail', articleId, 'related-has-liked', token ?? 'guest', relatedArticleIds.join(',')],
    enabled: Boolean(isAuthenticated && token && relatedArticleIds.length > 0),
    queryFn: async () => {
      const rows = await Promise.all(
        relatedArticleIds.map(async (relatedArticleId) => ({
          articleId: relatedArticleId,
          hasLiked: await hasUserLikedArticle(relatedArticleId, token!)
        }))
      );

      return Object.fromEntries(rows.map((row) => [row.articleId, row.hasLiked])) as Record<string, boolean>;
    }
  });

  const relatedArticleHasLikedById = useMemo(
    () => relatedArticlesHasLikedQuery.data ?? {},
    [relatedArticlesHasLikedQuery.data]
  );

  const handleSessionExpired = useCallback(() => {
    signOut();
    navigate('/login', { replace: true, state: { reason: 'session-expired' } });
  }, [navigate, signOut]);

  useEffect(() => {
    if (!hasLikedQuery.error) {
      return;
    }

    if (hasLikedQuery.error instanceof ApiError && hasLikedQuery.error.status === 401) {
      handleSessionExpired();
      return;
    }

    showError(hasLikedQuery.error instanceof Error ? hasLikedQuery.error.message : 'Не удалось получить статус избранного.', {
      title: 'Избранное',
      dedupeKey: `article-detail-has-liked-error-${articleId}`
    });
  }, [articleId, handleSessionExpired, hasLikedQuery.error, showError]);

  useEffect(() => {
    if (!articleQuery.error) {
      return;
    }

    if (articleQuery.error instanceof ApiError && articleQuery.error.status === 401) {
      handleSessionExpired();
      return;
    }

    showError(articleQuery.error instanceof Error ? articleQuery.error.message : 'Не удалось загрузить статью.', {
      title: 'Статья',
      dedupeKey: `article-detail-load-error-${articleId}`
    });
  }, [articleId, articleQuery.error, handleSessionExpired, showError]);

  useEffect(() => {
    if (!relatedArticlesQuery.error) {
      return;
    }

    showError(
      relatedArticlesQuery.error instanceof Error
        ? relatedArticlesQuery.error.message
        : 'Не удалось загрузить другие публикации.',
      {
        title: 'Другие публикации',
        dedupeKey: `article-detail-related-articles-error-${articleId}`
      }
    );
  }, [articleId, relatedArticlesQuery.error, showError]);

  useEffect(() => {
    if (!relatedArticlesHasLikedQuery.error) {
      return;
    }

    if (relatedArticlesHasLikedQuery.error instanceof ApiError && relatedArticlesHasLikedQuery.error.status === 401) {
      handleSessionExpired();
      return;
    }

    showError(
      relatedArticlesHasLikedQuery.error instanceof Error
        ? relatedArticlesHasLikedQuery.error.message
        : 'Не удалось получить статус избранного для других публикаций.',
      {
        title: 'Избранное',
        dedupeKey: `article-detail-related-has-liked-error-${articleId}`
      }
    );
  }, [articleId, handleSessionExpired, relatedArticlesHasLikedQuery.error, showError]);

  useEffect(() => {
    if (!likesCountQuery.error) {
      return;
    }

    showError(likesCountQuery.error instanceof Error ? likesCountQuery.error.message : 'Не удалось загрузить счётчик избранного.', {
      title: 'Избранное',
      dedupeKey: `article-detail-like-count-error-${articleId}`
    });
  }, [articleId, likesCountQuery.error, showError]);

  useEffect(() => {
    setIsHeaderImageBroken(false);
    setBrokenGalleryImageByUrl({});
    setBrokenRelatedArticleImageById({});
    setIsRelatedArticleLikingById({});
    setRelatedArticleLikeOverridesById({});
    setLikeOverride(null);
    setIsLiking(false);
  }, [articleId]);

  async function handleToggleLike() {
    if (!articleId || isLiking) {
      return;
    }

    if (!isAuthenticated || !token) {
      setIsAuthPopupOpen(true);
      return;
    }

    const previousState = {
      likesCount: likeState.likesCount,
      isLiked: likeState.isLiked
    };

    const optimisticIsLiked = !previousState.isLiked;
    const optimisticLikesCount = Math.max(0, previousState.likesCount + (optimisticIsLiked ? 1 : -1));

    setIsLiking(true);
    setLikeOverride({
      likesCount: optimisticLikesCount,
      isLiked: optimisticIsLiked
    });

    try {
      const confirmedIsLiked = await toggleArticleLike(articleId, token);
      const confirmedLikesCount = await getArticleLikesCount(articleId);
      setLikeOverride({
        likesCount: confirmedLikesCount,
        isLiked: confirmedIsLiked
      });
    } catch (error) {
      setLikeOverride(previousState);

      if (error instanceof ApiError && error.status === 401) {
        handleSessionExpired();
        return;
      }

      showError(error instanceof Error ? error.message : 'Не удалось обновить избранное.', {
        title: 'Избранное',
        dedupeKey: `article-detail-like-toggle-error-${articleId}`
      });
    } finally {
      setIsLiking(false);
      void queryClient.invalidateQueries({ queryKey: ['articles', 'public'] });
      void queryClient.invalidateQueries({ queryKey: ['articles', 'detail', articleId] });
      void queryClient.invalidateQueries({ queryKey: ['articles', 'detail', articleId, 'likes-count'] });
      if (token) {
        void queryClient.invalidateQueries({ queryKey: ['articles', 'detail', articleId, 'has-liked', token] });
      }
    }
  }

  function resolveRelatedArticleLikeState(articleToResolve: Article): { likesCount: number; isLiked: boolean } {
    const override = relatedArticleLikeOverridesById[articleToResolve.id];
    if (override) {
      return override;
    }

    return {
      likesCount: articleToResolve.likesCount,
      isLiked: Boolean(relatedArticleHasLikedById[articleToResolve.id])
    };
  }

  async function handleToggleRelatedArticleLike(articleToToggle: Article) {
    if (!isAuthenticated || !token) {
      setIsAuthPopupOpen(true);
      return;
    }

    if (isRelatedArticleLikingById[articleToToggle.id]) {
      return;
    }

    const previousState = resolveRelatedArticleLikeState(articleToToggle);
    const optimisticIsLiked = !previousState.isLiked;
    const optimisticLikesCount = Math.max(0, previousState.likesCount + (optimisticIsLiked ? 1 : -1));

    setIsRelatedArticleLikingById((previousMap) => ({ ...previousMap, [articleToToggle.id]: true }));
    setRelatedArticleLikeOverridesById((previousMap) => ({
      ...previousMap,
      [articleToToggle.id]: {
        isLiked: optimisticIsLiked,
        likesCount: optimisticLikesCount
      }
    }));

    try {
      const confirmedIsLiked = await toggleArticleLike(articleToToggle.id, token);
      const confirmedLikesCount = await getArticleLikesCount(articleToToggle.id);

      setRelatedArticleLikeOverridesById((previousMap) => ({
        ...previousMap,
        [articleToToggle.id]: {
          isLiked: confirmedIsLiked,
          likesCount: confirmedLikesCount
        }
      }));

      void queryClient.invalidateQueries({ queryKey: ['articles', 'public'] });
      void queryClient.invalidateQueries({ queryKey: ['articles', 'detail', articleToToggle.id] });
    } catch (error) {
      setRelatedArticleLikeOverridesById((previousMap) => ({
        ...previousMap,
        [articleToToggle.id]: previousState
      }));

      if (error instanceof ApiError && error.status === 401) {
        handleSessionExpired();
        return;
      }

      showError(error instanceof Error ? error.message : 'Не удалось обновить избранное.', {
        title: 'Избранное',
        dedupeKey: `article-detail-related-like-toggle-error-${articleToToggle.id}`
      });
    } finally {
      setIsRelatedArticleLikingById((previousMap) => ({ ...previousMap, [articleToToggle.id]: false }));
      void queryClient.invalidateQueries({ queryKey: ['articles', 'detail', articleToToggle.id, 'likes-count'] });
      if (token) {
        void queryClient.invalidateQueries({ queryKey: ['articles', 'detail', articleToToggle.id, 'has-liked', token] });
      }
    }
  }

  if (!articleId) {
    return (
      <PageLayout>
        <Container size="lg" className={styles.container}>
          <ContentState
            tone="error"
            className={styles.stateCard}
            title="Некорректный идентификатор статьи"
            description="Проверьте адрес страницы и откройте карточку заново из каталога."
            action={
              <Link to="/articles" className={styles.backLinkButton}>
                Вернуться к статьям
              </Link>
            }
          />
        </Container>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Container size="lg" className={styles.container}>
        <Link to={backToPath} className={styles.backLink}>
          Назад к статьям
        </Link>

        {articleQuery.isLoading ? (
          <div className={styles.loadingLayout} aria-hidden="true">
            <Card className={styles.skeletonCard}>
              <div className={styles.skeletonImage} />
            </Card>
            <Card className={styles.skeletonCard}>
              <div className={styles.skeletonLine} />
              <div className={styles.skeletonLine} />
              <div className={styles.skeletonLineShort} />
            </Card>
          </div>
        ) : null}

        {articleQuery.isError ? (
          <ContentState
            tone="error"
            className={styles.stateCard}
            title="Статья временно недоступна"
            description="Попробуйте повторить запрос чуть позже."
            action={
              <div className={styles.stateActions}>
                <Button onClick={() => articleQuery.refetch()}>Повторить</Button>
                <Link to={backToPath} className={styles.backLinkButton}>
                  К списку статей
                </Link>
              </div>
            }
          />
        ) : null}

        {!articleQuery.isLoading && !articleQuery.isError && article ? (
          <>
            <div className={styles.articleShell}>
              <section className={styles.heroImageWrap}>
                {!isHeaderImageBroken ? (
                  <img
                    src={article.headerPhotoLink}
                    alt={article.title}
                    className={styles.heroImage}
                    onError={() => setIsHeaderImageBroken(true)}
                  />
                ) : (
                  <div className={styles.heroImageFallback} aria-hidden="true">
                    {article.title}
                  </div>
                )}
              </section>

              <section className={styles.articleHeader}>
                <div className={styles.articleHeaderText}>
                  <Typography variant="caption" className={styles.kicker}>
                    Публикация
                  </Typography>
                  <Typography variant="h1" className={styles.title}>
                    {article.title}
                  </Typography>
                  <div className={styles.metaRow}>
                    <Typography variant="bodyS" className={styles.meta}>
                      Автор: {article.authorString}
                    </Typography>
                    <span className={styles.metaDot} aria-hidden="true" />
                    <Typography variant="bodyS" className={styles.meta}>
                      {formatReadingTime(article)}
                    </Typography>
                    <Tag tone={getStatusTone(article.status)}>{getStatusLabel(article.status)}</Tag>
                  </div>
                </div>

                <button
                  type="button"
                  className={likeState.isLiked ? `${styles.likeButton} ${styles.likeButtonActive}` : styles.likeButton}
                  onClick={() => {
                    void handleToggleLike();
                  }}
                  disabled={isLiking}
                  aria-label={likeState.isLiked ? 'Убрать статью из избранного' : 'Добавить статью в избранное'}
                >
                  <img src={favoriteIcon} alt="" aria-hidden="true" className={styles.likeIcon} />
                  <span>{isLiking ? 'Обновляем...' : likeState.isLiked ? 'В избранном' : 'В избранное'}</span>
                  <span className={styles.likeCount}>{likeState.likesCount}</span>
                </button>
              </section>
            </div>

            <section className={styles.contentLayout}>
              <article className={styles.articleBody}>
                <div className={styles.paragraphs}>
                  {article.paragraphs.length > 0 ? (
                    article.paragraphs.map((paragraph, index) =>
                      paragraph.isSubtitle ? (
                        <Typography key={paragraph.id} variant="h4" as="h3" className={styles.articleSubtitle}>
                          {paragraph.paragraphText}
                        </Typography>
                      ) : (
                        <Typography
                          key={paragraph.id}
                          variant={index === 0 ? 'bodyL' : 'body'}
                          className={index === 0 ? `${styles.articleParagraph} ${styles.leadParagraph}` : styles.articleParagraph}
                        >
                          {paragraph.paragraphText}
                        </Typography>
                      )
                    )
                  ) : (
                    <Typography variant="bodyS" className={styles.mutedText}>
                      Для этой статьи пока не добавлены параграфы.
                    </Typography>
                  )}
                </div>

                {galleryImages.length > 0 ? (
                  <section className={styles.gallerySection}>
                    <Typography variant="h4">Галерея</Typography>
                    <div className={styles.galleryGrid}>
                      {galleryImages.map((imageUrl) => {
                        const isBroken = brokenGalleryImageByUrl[imageUrl];

                        return (
                          <div key={imageUrl} className={styles.galleryItem}>
                            {!isBroken ? (
                              <img
                                src={imageUrl}
                                alt={article.title}
                                className={styles.galleryImage}
                                onError={() =>
                                  setBrokenGalleryImageByUrl((previousState) => ({
                                    ...previousState,
                                    [imageUrl]: true
                                  }))
                                }
                              />
                            ) : (
                              <div className={styles.galleryFallback} aria-hidden="true">
                                {article.title}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ) : null}

                {nextArticle && !relatedArticlesQuery.isError ? (
                  <div className={styles.nextButtonWrap}>
                    <Button
                      onClick={() => {
                        navigate(`/articles/${nextArticle.id}`);
                      }}
                    >
                      Следующая статья →
                    </Button>
                  </div>
                ) : null}
              </article>

              <aside className={styles.aside} aria-label="Другие публикации">
                <Typography variant="h4" className={styles.asideTitle}>
                  Другие публикации
                </Typography>
                {relatedArticlesQuery.isLoading ? (
                  <div className={styles.relatedGrid} aria-hidden="true">
                    {Array.from({ length: 3 }, (_, index) => (
                      <Card key={index} className={styles.relatedSkeletonCard}>
                        <div className={styles.relatedSkeletonImage} />
                        <div className={styles.relatedSkeletonLine} />
                        <div className={styles.relatedSkeletonLineShort} />
                      </Card>
                    ))}
                  </div>
                ) : relatedArticlesQuery.isError ? (
                  <Typography variant="bodyS" className={styles.mutedText}>
                    Другие публикации временно недоступны.
                  </Typography>
                ) : relatedArticles.length > 0 ? (
                  <div className={styles.relatedGrid}>
                    {relatedArticles.map((relatedArticle) => {
                      const relatedLikeState = resolveRelatedArticleLikeState(relatedArticle);
                      const isRelatedArticleLiking = Boolean(isRelatedArticleLikingById[relatedArticle.id]);
                      const isRelatedImageBroken = Boolean(brokenRelatedArticleImageById[relatedArticle.id]);

                      return (
                        <Card
                          key={relatedArticle.id}
                          hoverable
                          className={styles.relatedCard}
                          role="link"
                          tabIndex={0}
                          onClick={() => navigate(`/articles/${relatedArticle.id}`)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              navigate(`/articles/${relatedArticle.id}`);
                            }
                          }}
                        >
                          <div className={styles.relatedImageWrap}>
                            {!isRelatedImageBroken ? (
                              <img
                                src={relatedArticle.headerPhotoLink}
                                alt={relatedArticle.title}
                                className={styles.relatedImage}
                                onError={() =>
                                  setBrokenRelatedArticleImageById((previousState) => ({
                                    ...previousState,
                                    [relatedArticle.id]: true
                                  }))
                                }
                              />
                            ) : (
                              <div className={styles.relatedFallback} aria-hidden="true">
                                {relatedArticle.title}
                              </div>
                            )}
                          </div>
                          <div className={styles.relatedBody}>
                            <div className={styles.relatedTopline}>
                              <Tag tone="info">Новое</Tag>
                              <button
                                type="button"
                                className={
                                  relatedLikeState.isLiked
                                    ? `${styles.relatedLikeButton} ${styles.relatedLikeButtonActive}`
                                    : styles.relatedLikeButton
                                }
                                onClick={(event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  void handleToggleRelatedArticleLike(relatedArticle);
                                }}
                                disabled={isRelatedArticleLiking}
                                aria-label={
                                  relatedLikeState.isLiked
                                    ? 'Убрать публикацию из избранного'
                                    : 'Добавить публикацию в избранное'
                                }
                              >
                                <img src={favoriteIcon} alt="" aria-hidden="true" className={styles.relatedLikeIcon} />
                              </button>
                            </div>
                            <Typography variant="bodyS" className={styles.relatedTitle}>
                              {relatedArticle.title}
                            </Typography>
                            <div className={styles.relatedMetaRow}>
                              <span>{formatReadingTime(relatedArticle)}</span>
                              <span>•</span>
                              <span>В избранном: {relatedLikeState.likesCount}</span>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                ) : null}
              </aside>
            </section>
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
