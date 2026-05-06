import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import type { Mushroom } from '@entities/mushroom';
import { useSession } from '@entities/session';
import {
  AuthRequiredPopup,
  getArticleLikesCount,
  getArticleMushroomIds,
  getPublicArticleById,
  hasUserLikedArticle,
  toggleArticleLike
} from '@features/articles';
import { getMushroomById } from '@features/mushrooms';
import { ApiError } from '@shared/api';
import { favoriteIcon } from '@shared/assets/icons';
import { Button, Card, Container, ContentState, Stack, Tag, Typography, useToast } from '@shared/ui';
import { PageLayout } from '@widgets/layout';
import styles from './ArticleDetailPage.module.css';

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

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
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
  const [brokenRelatedImageById, setBrokenRelatedImageById] = useState<Record<string, boolean>>({});

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

  const linkedMushroomsQuery = useQuery({
    queryKey: ['articles', 'detail', articleId, 'mushrooms'],
    enabled: articleId.length > 0,
    queryFn: () => getArticleMushroomIds(articleId)
  });

  const relatedMushroomsQuery = useQuery({
    queryKey: ['articles', 'detail', articleId, 'mushroom-cards', linkedMushroomsQuery.data?.join(',') ?? 'none'],
    enabled: Boolean(articleId.length > 0 && linkedMushroomsQuery.data && linkedMushroomsQuery.data.length > 0),
    queryFn: async () => {
      const mushroomIds = linkedMushroomsQuery.data ?? [];
      const mushrooms = await Promise.all(mushroomIds.map((mushroomId) => getMushroomById(mushroomId)));
      return mushrooms;
    }
  });

  const hasLikedQuery = useQuery({
    queryKey: ['articles', 'detail', articleId, 'has-liked', token ?? 'guest'],
    enabled: Boolean(articleId.length > 0 && isAuthenticated && token),
    queryFn: () => hasUserLikedArticle(articleId, token!)
  });

  const article = articleQuery.data;
  const linkedMushroomIds = linkedMushroomsQuery.data ?? [];
  const relatedMushrooms = relatedMushroomsQuery.data ?? [];

  const galleryImages = useMemo(() => {
    if (!article) {
      return [];
    }

    const entries = [article.headerPhotoLink, ...article.extraPhotoLinks]
      .map((value) => value.trim())
      .filter((value) => value.length > 0);

    return Array.from(new Set(entries));
  }, [article]);

  const likeState = likeOverride ?? {
    likesCount: likesCountQuery.data ?? article?.likesCount ?? 0,
    isLiked: Boolean(hasLikedQuery.data)
  };

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
    if (!linkedMushroomsQuery.error) {
      return;
    }

    showError(
      linkedMushroomsQuery.error instanceof Error
        ? linkedMushroomsQuery.error.message
        : 'Не удалось загрузить связанные грибы.',
      {
        title: 'Связанные грибы',
        dedupeKey: `article-detail-linked-mushrooms-error-${articleId}`
      }
    );
  }, [articleId, linkedMushroomsQuery.error, showError]);

  useEffect(() => {
    if (!relatedMushroomsQuery.error) {
      return;
    }

    showError(
      relatedMushroomsQuery.error instanceof Error
        ? relatedMushroomsQuery.error.message
        : 'Не удалось загрузить карточки связанных грибов.',
      {
        title: 'Связанные грибы',
        dedupeKey: `article-detail-related-mushrooms-error-${articleId}`
      }
    );
  }, [articleId, relatedMushroomsQuery.error, showError]);

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
    setBrokenRelatedImageById({});
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
            <section className={styles.hero}>
              <div className={styles.heroImageWrap}>
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
              </div>

              <div className={styles.heroContent}>
                <Typography variant="h1" className={styles.title}>
                  {article.title}
                </Typography>
                <Typography variant="bodyS" className={styles.meta}>
                  {article.authorString} • {formatDate(article.publishDate)}
                </Typography>
                <div className={styles.tags}>
                  <Tag tone={getStatusTone(article.status)}>{getStatusLabel(article.status)}</Tag>
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
              </div>
            </section>

            <section className={styles.contentLayout}>
              <article className={styles.articleBody}>
                <Typography variant="h3" as="h2" className={styles.sectionTitle}>
                  Содержание
                </Typography>
                <div className={styles.paragraphs}>
                  {article.paragraphs.length > 0 ? (
                    article.paragraphs.map((paragraph) =>
                      paragraph.isSubtitle ? (
                        <Typography key={paragraph.id} variant="h4" as="h3" className={styles.articleSubtitle}>
                          {paragraph.paragraphText}
                        </Typography>
                      ) : (
                        <Typography key={paragraph.id} variant="bodyL" className={styles.articleParagraph}>
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
              </article>

              <aside className={styles.aside} aria-label="Дополнительная информация о статье">
                <Card className={styles.asideCard}>
                  <Stack gap={12}>
                    <Typography variant="h4">О материале</Typography>
                    <div className={styles.metaList}>
                      <span>Автор</span>
                      <strong>{article.authorString}</strong>
                      <span>Дата публикации</span>
                      <strong>{formatDate(article.publishDate)}</strong>
                      <span>Статус</span>
                      <strong>{getStatusLabel(article.status)}</strong>
                    </div>
                  </Stack>
                </Card>

                <Card className={styles.asideCard}>
                  <Stack gap={12}>
                    <Typography variant="h4">Связанные грибы</Typography>
                    {linkedMushroomsQuery.isLoading || relatedMushroomsQuery.isLoading ? (
                      <Typography variant="bodyS" className={styles.mutedText}>
                        Загружаем связанные грибы...
                      </Typography>
                    ) : linkedMushroomsQuery.isError || relatedMushroomsQuery.isError ? (
                      <Typography variant="bodyS" className={styles.mutedText}>
                        Связанные грибы временно недоступны.
                      </Typography>
                    ) : linkedMushroomIds.length > 0 && relatedMushrooms.length > 0 ? (
                      <div className={styles.relatedGrid}>
                        {relatedMushrooms.map((mushroom: Mushroom) => {
                          const isBroken = Boolean(brokenRelatedImageById[mushroom.id]);

                          return (
                            <Link key={mushroom.id} to={`/mushrooms/${mushroom.id}`} className={styles.relatedCard}>
                              <div className={styles.relatedImageWrap}>
                                {!isBroken ? (
                                  <img
                                    src={mushroom.headerPhotoLink}
                                    alt={mushroom.name}
                                    className={styles.relatedImage}
                                    onError={() =>
                                      setBrokenRelatedImageById((previousState) => ({
                                        ...previousState,
                                        [mushroom.id]: true
                                      }))
                                    }
                                  />
                                ) : (
                                  <div className={styles.relatedFallback} aria-hidden="true">
                                    {mushroom.name}
                                  </div>
                                )}
                              </div>
                              <span className={styles.relatedTitle}>{mushroom.name}</span>
                              <span className={styles.relatedMeta}>{mushroom.family}</span>
                            </Link>
                          );
                        })}
                      </div>
                    ) : (
                      <Typography variant="bodyS" className={styles.mutedText}>
                        Связанные грибы не указаны.
                      </Typography>
                    )}
                  </Stack>
                </Card>
              </aside>
            </section>

            {galleryImages.length > 1 ? (
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
