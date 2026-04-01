import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSession } from '@entities/session';
import {
  AuthRequiredPopup,
  getMushroomById,
  getMushroomLikesCount,
  hasUserLikedMushroom,
  toggleMushroomLike
} from '@features/mushrooms';
import { ApiError } from '@shared/api';
import { Button, Card, Container, ContentState, Stack, Tag, Typography, useToast } from '@shared/ui';
import { PageLayout } from '@widgets/layout';
import styles from './MushroomDetailPage.module.css';

interface LocationState {
  backTo?: string;
}

interface MushroomDetailPageProps {
  mushroomId?: string;
}

function getEatableTone(value: string): 'success' | 'warning' | 'error' {
  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue.includes('несъедоб')) {
    return 'error';
  }

  if (normalizedValue.includes('съедоб')) {
    return 'success';
  }

  return 'warning';
}

function formatStemSize(stemSizeFrom: number | null, stemSizeTo: number | null): string {
  if (stemSizeFrom === null && stemSizeTo === null) {
    return 'Нет данных';
  }

  if (stemSizeFrom !== null && stemSizeTo !== null) {
    return `${stemSizeFrom} - ${stemSizeTo} см`;
  }

  if (stemSizeFrom !== null) {
    return `от ${stemSizeFrom} см`;
  }

  return `до ${stemSizeTo} см`;
}

function resolveBackToPath(state: unknown): string {
  if (typeof state !== 'object' || state === null) {
    return '/mushrooms';
  }

  const locationState = state as LocationState;
  if (typeof locationState.backTo !== 'string') {
    return '/mushrooms';
  }

  const trimmedBackTo = locationState.backTo.trim();
  if (!trimmedBackTo.startsWith('/')) {
    return '/mushrooms';
  }

  return trimmedBackTo;
}

export function MushroomDetailPage({ mushroomId: mushroomIdProp }: MushroomDetailPageProps = {}) {
  const { id: routeMushroomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showError } = useToast();
  const { isAuthenticated, token, signOut } = useSession();

  const mushroomId = mushroomIdProp ?? routeMushroomId ?? '';
  const backToPath = useMemo(() => resolveBackToPath(location.state), [location.state]);

  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const [isHeaderImageBroken, setIsHeaderImageBroken] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [likeOverride, setLikeOverride] = useState<{ likesCount: number; isLiked: boolean } | null>(null);
  const [brokenGalleryImageByUrl, setBrokenGalleryImageByUrl] = useState<Record<string, boolean>>({});

  const mushroomQuery = useQuery({
    queryKey: ['mushroom', 'detail', mushroomId],
    enabled: mushroomId.length > 0,
    queryFn: () => getMushroomById(mushroomId)
  });

  const likesCountQuery = useQuery({
    queryKey: ['mushroom', 'detail', mushroomId, 'likes-count'],
    enabled: mushroomId.length > 0,
    queryFn: () => getMushroomLikesCount(mushroomId)
  });

  const hasLikedQuery = useQuery({
    queryKey: ['mushroom', 'detail', mushroomId, 'has-liked', token ?? 'guest'],
    enabled: Boolean(mushroomId.length > 0 && isAuthenticated && token),
    queryFn: () => hasUserLikedMushroom(mushroomId, token!)
  });

  const mushroom = mushroomQuery.data;

  const galleryImages = useMemo(() => {
    if (!mushroom) {
      return [];
    }

    const combinedImages = [mushroom.headerPhotoLink, ...mushroom.extraPhotoLinks]
      .map((value) => value.trim())
      .filter((value) => value.length > 0);

    return Array.from(new Set(combinedImages));
  }, [mushroom]);

  const likeState = likeOverride ?? {
    likesCount: likesCountQuery.data ?? 0,
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

    showError(hasLikedQuery.error instanceof Error ? hasLikedQuery.error.message : 'Не удалось получить статус лайка.', {
      title: 'Лайки',
      dedupeKey: 'mushroom-detail-has-liked-error'
    });
  }, [handleSessionExpired, hasLikedQuery.error, showError]);

  useEffect(() => {
    if (!mushroomQuery.error) {
      return;
    }

    if (mushroomQuery.error instanceof ApiError && mushroomQuery.error.status === 401) {
      handleSessionExpired();
      return;
    }

    showError(mushroomQuery.error instanceof Error ? mushroomQuery.error.message : 'Не удалось загрузить карточку гриба.', {
      title: 'Карточка гриба',
      dedupeKey: `mushroom-detail-load-error-${mushroomId}`
    });
  }, [handleSessionExpired, mushroomId, mushroomQuery.error, showError]);

  useEffect(() => {
    if (!likesCountQuery.error) {
      return;
    }

    showError(likesCountQuery.error instanceof Error ? likesCountQuery.error.message : 'Не удалось загрузить счётчик лайков.', {
      title: 'Лайки',
      dedupeKey: `mushroom-detail-like-count-error-${mushroomId}`
    });
  }, [likesCountQuery.error, mushroomId, showError]);

  useEffect(() => {
    setLikeOverride(null);
    setIsLiking(false);
    setIsHeaderImageBroken(false);
    setBrokenGalleryImageByUrl({});
  }, [mushroomId]);

  async function handleToggleLike() {
    if (!mushroomId || isLiking) {
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
      const confirmedIsLiked = await toggleMushroomLike(mushroomId, token);
      const confirmedLikesCount = await getMushroomLikesCount(mushroomId);

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

      showError(error instanceof Error ? error.message : 'Не удалось обновить лайк.', {
        title: 'Лайки',
        dedupeKey: `mushroom-detail-like-toggle-error-${mushroomId}`
      });
    } finally {
      setIsLiking(false);
      void queryClient.invalidateQueries({ queryKey: ['mushrooms', 'likes-counts'] });
      if (token) {
        void queryClient.invalidateQueries({ queryKey: ['mushrooms', 'has-liked', token] });
      }
    }
  }

  function handleOpenRegisterFromPopup() {
    setIsAuthPopupOpen(false);
    navigate('/register');
  }

  if (!mushroomId) {
    return (
      <PageLayout>
        <Container size="lg" className={styles.container}>
          <ContentState
            tone="error"
            className={styles.stateCard}
            title="Некорректный идентификатор гриба"
            description="Проверьте адрес страницы и попробуйте снова."
            action={
              <Link to="/mushrooms" className={styles.backLinkButton}>
                Вернуться в каталог
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
          Назад к каталогу
        </Link>

        {mushroomQuery.isLoading ? (
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

        {mushroomQuery.isError ? (
          <ContentState
            tone="error"
            className={styles.stateCard}
            title="Карточка временно недоступна"
            description="Попробуйте повторить запрос чуть позже."
            action={
              <div className={styles.stateActions}>
                <Button onClick={() => mushroomQuery.refetch()}>Повторить</Button>
                <Link to={backToPath} className={styles.backLinkButton}>
                  К каталогу
                </Link>
              </div>
            }
          />
        ) : null}

        {!mushroomQuery.isLoading && !mushroomQuery.isError && mushroom ? (
          <>
            <section className={styles.hero}>
              <div className={styles.heroImageWrap}>
                {!isHeaderImageBroken ? (
                  <img
                    src={mushroom.headerPhotoLink}
                    alt={mushroom.name}
                    className={styles.heroImage}
                    onError={() => setIsHeaderImageBroken(true)}
                  />
                ) : (
                  <div className={styles.heroImageFallback} aria-hidden="true">
                    {mushroom.name}
                  </div>
                )}
              </div>

              <div className={styles.heroContent}>
                <Typography variant="h1" className={styles.title}>
                  {mushroom.name}
                </Typography>
                <Typography variant="bodyS" className={styles.latinName}>
                  {mushroom.latinName ?? 'Латинское название отсутствует'}
                </Typography>
                <Typography variant="bodyS" className={styles.family}>
                  Семейство: {mushroom.family}
                </Typography>

                <div className={styles.tags}>
                  <Tag tone={getEatableTone(mushroom.eatable)}>{mushroom.eatable}</Tag>
                  {mushroom.redBook ? <Tag tone="warning">Красная книга</Tag> : null}
                </div>

                <div className={styles.likeSection}>
                  <button
                    type="button"
                    className={likeState.isLiked ? `${styles.likeButton} ${styles.likeButtonActive}` : styles.likeButton}
                    onClick={() => {
                      void handleToggleLike();
                    }}
                    disabled={isLiking}
                  >
                    {isLiking ? 'Обновляем...' : likeState.isLiked ? 'Вам нравится' : 'Нравится'}
                    <span className={styles.likeCount}>{likeState.likesCount}</span>
                  </button>
                </div>

                <Typography variant="body" className={styles.description}>
                  {mushroom.description}
                </Typography>
              </div>
            </section>

            <section className={styles.contentGrid}>
              <Card className={styles.sectionCard}>
                <Stack gap={12}>
                  <Typography variant="h4">Морфология</Typography>

                  <dl className={styles.metaList}>
                    <div className={styles.metaItem}>
                      <dt>Тип шляпки</dt>
                      <dd>{mushroom.capType}</dd>
                    </div>
                    <div className={styles.metaItem}>
                      <dt>Цвет шляпки</dt>
                      <dd>{mushroom.capColor}</dd>
                    </div>
                    <div className={styles.metaItem}>
                      <dt>Тип подшляпки</dt>
                      <dd>{mushroom.capUndersideType}</dd>
                    </div>
                    <div className={styles.metaItem}>
                      <dt>Ножка</dt>
                      <dd>{mushroom.hasStem ? 'Есть' : 'Отсутствует'}</dd>
                    </div>
                    <div className={styles.metaItem}>
                      <dt>Форма ножки</dt>
                      <dd>{mushroom.stemType ?? 'Нет данных'}</dd>
                    </div>
                    <div className={styles.metaItem}>
                      <dt>Цвет ножки</dt>
                      <dd>{mushroom.stemColor ?? 'Нет данных'}</dd>
                    </div>
                    <div className={styles.metaItem}>
                      <dt>Размер ножки</dt>
                      <dd>{formatStemSize(mushroom.stemSizeFrom, mushroom.stemSizeTo)}</dd>
                    </div>
                    <div className={styles.metaItem}>
                      <dt>Синоним</dt>
                      <dd>{mushroom.synonymousName ?? 'Нет данных'}</dd>
                    </div>
                  </dl>
                </Stack>
              </Card>

              <Card className={styles.sectionCard}>
                <Stack gap={12}>
                  <Typography variant="h4">Двойники</Typography>

                  {mushroom.doppelgangers.length > 0 ? (
                    <ul className={styles.doppelgangerList}>
                      {mushroom.doppelgangers.map((doppelganger) => (
                        <li key={doppelganger.id} className={styles.doppelgangerItem}>
                          <Typography variant="bodyS">{doppelganger.doppelgangerName}</Typography>
                          <Tag tone={doppelganger.isContainedInDatabase ? 'success' : 'warning'} size="s">
                            {doppelganger.isContainedInDatabase ? 'Есть в каталоге' : 'Вне каталога'}
                          </Tag>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Typography variant="bodyS" className={styles.sectionMuted}>
                      Двойники для этого гриба пока не указаны.
                    </Typography>
                  )}
                </Stack>
              </Card>
            </section>

            <section className={styles.gallerySection}>
              <Typography variant="h3">Фотографии</Typography>
              {galleryImages.length > 0 ? (
                <div className={styles.galleryGrid}>
                  {galleryImages.map((imageUrl) => {
                    const isBroken = Boolean(brokenGalleryImageByUrl[imageUrl]);

                    return (
                      <div key={imageUrl} className={styles.galleryItem}>
                        {!isBroken ? (
                          <img
                            src={imageUrl}
                            alt={mushroom.name}
                            className={styles.galleryImage}
                            onError={() => {
                              setBrokenGalleryImageByUrl((previousMap) => ({
                                ...previousMap,
                                [imageUrl]: true
                              }));
                            }}
                          />
                        ) : (
                          <div className={styles.galleryFallback} aria-hidden="true">
                            {mushroom.name}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <ContentState
                  tone="empty"
                  className={styles.stateCard}
                  title="Для этого гриба пока нет дополнительных фотографий."
                />
              )}
            </section>
          </>
        ) : null}
      </Container>

      <AuthRequiredPopup
        isOpen={isAuthPopupOpen}
        onClose={() => setIsAuthPopupOpen(false)}
        onRegister={handleOpenRegisterFromPopup}
      />
    </PageLayout>
  );
}
