import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import type { Mushroom } from '@entities/mushroom';
import { useSession } from '@entities/session';
import {
  AuthRequiredPopup,
  DEFAULT_MUSHROOM_CATALOG_QUERY,
  getFilteredMushrooms,
  hasUserLikedMushroom,
  mapEatableFilterToApiValue,
  parseMushroomCatalogQuery,
  serializeMushroomCatalogQuery,
  toggleMushroomLike,
  useDebouncedValue,
  type MushroomCatalogQueryState,
  type MushroomEatableFilterValue,
  type MushroomSortMode
} from '@features/mushrooms';
import { ApiError } from '@shared/api';
import { favoriteIcon } from '@shared/assets/icons';
import { Button, Card, Checkbox, Container, ContentState, Input, Select, Tag, Typography, useToast } from '@shared/ui';
import { PageLayout } from '@widgets/layout';
import styles from './MushroomsPage.module.css';

const PAGE_SIZE = 12;

const eatableOptions = [
  { label: 'Все', value: 'all' },
  { label: 'Съедобные', value: 'edible' },
  { label: 'Несъедобные', value: 'inedible' }
];

const sortOptions = [
  { label: 'По названию', value: 'name' },
  { label: 'По лайкам', value: 'likes' }
];

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

function formatResultCount(totalItems: number): string {
  if (totalItems === 1) {
    return '1 гриб';
  }

  if (totalItems >= 2 && totalItems <= 4) {
    return `${totalItems} гриба`;
  }

  return `${totalItems} грибов`;
}

function toMushroomsFilters(queryState: MushroomCatalogQueryState) {
  return {
    partOfName: queryState.q || undefined,
    family: queryState.family || undefined,
    eatable: mapEatableFilterToApiValue(queryState.eatable),
    redBook: queryState.redBook ? true : undefined
  };
}

function mapMushroomIds(mushrooms: Mushroom[]): string[] {
  return mushrooms.map((mushroom) => mushroom.id);
}

export function MushroomsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { showError } = useToast();
  const { isAuthenticated, token, signOut } = useSession();

  const [searchDraft, setSearchDraft] = useState('');
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const [brokenImageById, setBrokenImageById] = useState<Record<string, boolean>>({});
  const [isLikingById, setIsLikingById] = useState<Record<string, boolean>>({});
  const [likeOverridesById, setLikeOverridesById] = useState<Record<string, { likesCount: number; isLiked: boolean }>>(
    {}
  );

  const queryState = useMemo(() => parseMushroomCatalogQuery(searchParams), [searchParams]);
  const debouncedSearch = useDebouncedValue(searchDraft, 400);

  const filters = useMemo(() => toMushroomsFilters(queryState), [queryState]);

  const mushroomsQuery = useQuery({
    queryKey: ['mushrooms', 'filtered', filters, queryState.sort, queryState.page, PAGE_SIZE],
    queryFn: () =>
      getFilteredMushrooms({
        ...filters,
        sort: queryState.sort,
        page: queryState.page,
        pageSize: PAGE_SIZE
      })
  });

  const mushroomsResult = mushroomsQuery.data;
  const pageMushrooms = useMemo(() => mushroomsResult?.mushrooms ?? [], [mushroomsResult?.mushrooms]);
  const totalCount = mushroomsResult?.totalCount ?? 0;
  const resolvedPage = mushroomsResult?.page ?? queryState.page;
  const resolvedPageSize = mushroomsResult?.pageSize ?? PAGE_SIZE;
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(1, resolvedPageSize)));
  const likesCountById = useMemo(
    () =>
      Object.fromEntries(pageMushrooms.map((mushroom) => [mushroom.id, mushroom.likesCount])) as Record<string, number>,
    [pageMushrooms]
  );
  const pageMushroomIds = useMemo(() => mapMushroomIds(pageMushrooms), [pageMushrooms]);
  const pageMushroomIdsKey = pageMushroomIds.join(',');

  const hasLikedQuery = useQuery({
    queryKey: ['mushrooms', 'has-liked', token ?? 'guest', pageMushroomIdsKey],
    enabled: Boolean(isAuthenticated && token && pageMushroomIds.length > 0),
    queryFn: async () => {
      const rows = await Promise.all(
        pageMushroomIds.map(async (mushroomId) => {
          const hasLiked = await hasUserLikedMushroom(mushroomId, token!);
          return { mushroomId, hasLiked };
        })
      );

      return Object.fromEntries(rows.map((row) => [row.mushroomId, row.hasLiked])) as Record<string, boolean>;
    }
  });

  const hasLikedById = useMemo(() => hasLikedQuery.data ?? {}, [hasLikedQuery.data]);

  const handleSessionExpired = useCallback(() => {
    signOut();
    navigate('/login', { replace: true, state: { reason: 'session-expired' } });
  }, [navigate, signOut]);

  const updateQueryState = useCallback(
    (patch: Partial<MushroomCatalogQueryState>, replace = true) => {
      setSearchParams(
        (previousSearchParams) => {
          const currentState = parseMushroomCatalogQuery(previousSearchParams);
          const nextState: MushroomCatalogQueryState = {
            ...currentState,
            ...patch,
            page: Math.max(1, patch.page ?? currentState.page)
          };

          return serializeMushroomCatalogQuery(nextState);
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
    if (queryState.page !== resolvedPage) {
      updateQueryState({ page: resolvedPage });
    }
  }, [queryState.page, resolvedPage, updateQueryState]);

  useEffect(() => {
    setLikeOverridesById((previousState) => {
      const allowedMushroomIds = new Set(pageMushroomIds);
      const nextState: Record<string, { likesCount: number; isLiked: boolean }> = {};
      let isChanged = false;

      for (const [mushroomId, value] of Object.entries(previousState)) {
        if (allowedMushroomIds.has(mushroomId)) {
          nextState[mushroomId] = value;
          continue;
        }

        isChanged = true;
      }

      return isChanged ? nextState : previousState;
    });
  }, [pageMushroomIds]);

  useEffect(() => {
    if (!hasLikedQuery.error) {
      return;
    }

    if (hasLikedQuery.error instanceof ApiError && hasLikedQuery.error.status === 401) {
      handleSessionExpired();
      return;
    }

    showError(hasLikedQuery.error instanceof Error ? hasLikedQuery.error.message : 'Не удалось получить лайки пользователя.', {
      title: 'Лайки',
      dedupeKey: 'mushrooms-has-liked-error'
    });
  }, [handleSessionExpired, hasLikedQuery.error, showError]);

  useEffect(() => {
    if (!mushroomsQuery.error) {
      return;
    }

    if (mushroomsQuery.error instanceof ApiError && mushroomsQuery.error.status === 401) {
      handleSessionExpired();
      return;
    }

    showError(mushroomsQuery.error instanceof Error ? mushroomsQuery.error.message : 'Каталог грибов временно недоступен.', {
      title: 'Каталог грибов',
      dedupeKey: 'mushrooms-catalog-error'
    });
  }, [handleSessionExpired, mushroomsQuery.error, showError]);

  function handleSearchInputChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchDraft(event.target.value);
  }

  function handleFamilyFilterChange(event: ChangeEvent<HTMLInputElement>) {
    updateQueryState({ family: event.target.value, page: 1 });
  }

  function handleEatableFilterChange(event: ChangeEvent<HTMLSelectElement>) {
    updateQueryState({
      eatable: event.target.value as MushroomEatableFilterValue,
      page: 1
    });
  }

  function handleRedBookFilterChange(event: ChangeEvent<HTMLInputElement>) {
    updateQueryState({
      redBook: event.target.checked,
      page: 1
    });
  }

  function handleSortChange(event: ChangeEvent<HTMLSelectElement>) {
    updateQueryState({
      sort: event.target.value as MushroomSortMode,
      page: 1
    });
  }

  function handleResetFilters() {
    setSearchDraft(DEFAULT_MUSHROOM_CATALOG_QUERY.q);
    setSearchParams(serializeMushroomCatalogQuery(DEFAULT_MUSHROOM_CATALOG_QUERY));
  }

  function handleGoToPreviousPage() {
    updateQueryState({ page: Math.max(1, resolvedPage - 1) });
  }

  function handleGoToNextPage() {
    updateQueryState({ page: Math.min(totalPages, resolvedPage + 1) });
  }

  function openMushroomDetails(mushroomId: string) {
    navigate(`/mushrooms/${mushroomId}`, { state: { backTo: backToCatalogPath } });
  }

  function handleMushroomCardKeyDown(event: KeyboardEvent<HTMLDivElement>, mushroomId: string) {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    openMushroomDetails(mushroomId);
  }

  function handleOpenRegisterFromPopup() {
    setIsAuthPopupOpen(false);
    navigate('/register');
  }

  function resolveLikeState(mushroomId: string): { likesCount: number; isLiked: boolean } {
    const override = likeOverridesById[mushroomId];
    if (override) {
      return override;
    }

    return {
      likesCount: likesCountById[mushroomId] ?? 0,
      isLiked: Boolean(hasLikedById[mushroomId])
    };
  }

  async function handleToggleLike(mushroomId: string) {
    if (!isAuthenticated || !token) {
      setIsAuthPopupOpen(true);
      return;
    }

    if (isLikingById[mushroomId]) {
      return;
    }

    const previousState = resolveLikeState(mushroomId);
    const optimisticIsLiked = !previousState.isLiked;
    const optimisticLikesCount = Math.max(0, previousState.likesCount + (optimisticIsLiked ? 1 : -1));

    setIsLikingById((previousMap) => ({ ...previousMap, [mushroomId]: true }));
    setLikeOverridesById((previousMap) => ({
      ...previousMap,
      [mushroomId]: {
        isLiked: optimisticIsLiked,
        likesCount: optimisticLikesCount
      }
    }));

    try {
      const confirmedIsLiked = await toggleMushroomLike(mushroomId, token);
      const confirmedLikesCount = Math.max(0, previousState.likesCount + (confirmedIsLiked ? 1 : -1));

      setLikeOverridesById((previousMap) => ({
        ...previousMap,
        [mushroomId]: {
          isLiked: confirmedIsLiked,
          likesCount: confirmedLikesCount
        }
      }));
    } catch (error) {
      setLikeOverridesById((previousMap) => ({
        ...previousMap,
        [mushroomId]: previousState
      }));

      if (error instanceof ApiError && error.status === 401) {
        handleSessionExpired();
        return;
      }

      showError(error instanceof Error ? error.message : 'Не удалось обновить лайк.', {
        title: 'Лайки',
        dedupeKey: 'mushrooms-like-toggle-error'
      });
    } finally {
      setIsLikingById((previousMap) => {
        const nextMap = { ...previousMap };
        delete nextMap[mushroomId];
        return nextMap;
      });

      void queryClient.invalidateQueries({ queryKey: ['mushrooms', 'filtered'] });
      if (token) {
        void queryClient.invalidateQueries({ queryKey: ['mushrooms', 'has-liked', token] });
      }
    }
  }

  const hasLoadingState = mushroomsQuery.isLoading;
  const hasErrorState = mushroomsQuery.isError;
  const hasEmptyState = !hasLoadingState && !hasErrorState && totalCount === 0;
  const backToCatalogPath = `${location.pathname}${location.search}`;

  return (
    <PageLayout>
      <Container size="lg" className={styles.container}>
        <section className={styles.hero}>
          <div>
            <Typography variant="h2">Грибы</Typography>
            <Typography variant="bodyS" className={styles.heroText}>
              Каталог с быстрым поиском, фильтрами и персональными лайками.
            </Typography>
          </div>
          <Input
            label="Поиск по названию"
            name="mushrooms-search"
            value={searchDraft}
            onChange={handleSearchInputChange}
            placeholder="Например: белый гриб"
          />
        </section>

        <div className={styles.layout}>
          <aside className={styles.filtersPanel}>
            <Typography variant="h5">Фильтры</Typography>

            <Input
              label="Семейство"
              name="mushrooms-family"
              value={queryState.family}
              onChange={handleFamilyFilterChange}
              placeholder="Например: Аманитовые"
            />

            <Select
              label="Съедобность"
              name="mushrooms-eatable"
              options={eatableOptions}
              value={queryState.eatable}
              onChange={handleEatableFilterChange}
            />

            <Checkbox
              label="Только из Красной книги"
              name="mushrooms-redbook"
              checked={queryState.redBook}
              onChange={handleRedBookFilterChange}
            />

            <Button variant="secondary" onClick={handleResetFilters}>
              Сбросить фильтры
            </Button>
          </aside>

          <section className={styles.resultsPanel}>
            <div className={styles.resultsHeader}>
              <Typography variant="bodyS" className={styles.resultsMeta}>
                {formatResultCount(totalCount)}
              </Typography>
              <Select
                label="Сортировка"
                name="mushrooms-sort"
                options={sortOptions}
                value={queryState.sort}
                onChange={handleSortChange}
              />
            </div>

            {hasLoadingState ? (
              <div className={styles.grid}>
                {Array.from({ length: 6 }, (_, index) => (
                  <Card key={`loading-${index}`} className={styles.skeletonCard} aria-hidden="true">
                    <div className={styles.skeletonCover} />
                    <div className={styles.skeletonLine} />
                    <div className={styles.skeletonLineShort} />
                  </Card>
                ))}
              </div>
            ) : null}

            {hasErrorState ? (
              <ContentState
                tone="error"
                className={styles.stateCard}
                title="Каталог временно недоступен"
                description="Попробуйте повторить запрос чуть позже."
                action={<Button onClick={() => mushroomsQuery.refetch()}>Повторить</Button>}
              />
            ) : null}

            {hasEmptyState ? (
              <ContentState
                tone="empty"
                className={styles.stateCard}
                title="Ничего не найдено"
                description="Попробуйте изменить поисковый запрос или сбросить фильтры."
              />
            ) : null}

            {!hasLoadingState && !hasErrorState && !hasEmptyState ? (
              <>
                <div className={styles.grid}>
                  {pageMushrooms.map((mushroom) => {
                    const likeState = resolveLikeState(mushroom.id);
                    const isImageBroken = Boolean(brokenImageById[mushroom.id]);
                    const isLiking = Boolean(isLikingById[mushroom.id]);

                    return (
                      <Card
                        key={mushroom.id}
                        className={`${styles.mushroomCard} ${styles.clickableCard}`}
                        hoverable
                        role="link"
                        tabIndex={0}
                        aria-label={`Открыть карточку гриба ${mushroom.name}`}
                        onClick={() => openMushroomDetails(mushroom.id)}
                        onKeyDown={(event) => handleMushroomCardKeyDown(event, mushroom.id)}
                      >
                        <div className={styles.imageWrap}>
                          {!isImageBroken ? (
                            <img
                              src={mushroom.headerPhotoLink}
                              alt={mushroom.name}
                              className={styles.coverImage}
                              onError={() => {
                                setBrokenImageById((previousMap) => ({
                                  ...previousMap,
                                  [mushroom.id]: true
                                }));
                              }}
                            />
                          ) : (
                            <div className={styles.coverFallback} aria-hidden="true">
                              {mushroom.name}
                            </div>
                          )}
                        </div>

                        <Typography variant="h5">{mushroom.name}</Typography>
                        <Typography variant="caption" className={styles.latinName}>
                          {mushroom.latinName ?? 'Латинское название отсутствует'}
                        </Typography>
                        <Typography variant="bodyS" className={styles.family}>
                          {mushroom.family}
                        </Typography>

                        <div className={styles.tags}>
                          <Tag tone={getEatableTone(mushroom.eatable)} size="s">
                            {mushroom.eatable}
                          </Tag>
                          {mushroom.redBook ? (
                            <Tag tone="warning" size="s">
                              Красная книга
                            </Tag>
                          ) : null}
                        </div>

                        <div className={styles.cardActions}>
                          <button
                            type="button"
                            className={likeState.isLiked ? `${styles.likeButton} ${styles.likeButtonActive}` : styles.likeButton}
                            aria-label={likeState.isLiked ? 'Убрать из понравившихся' : 'Добавить в понравившиеся'}
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              void handleToggleLike(mushroom.id);
                            }}
                            disabled={isLiking}
                          >
                            <img src={favoriteIcon} width={18} height={18} alt="" aria-hidden="true" className={styles.likeIcon} />
                            <span className={styles.likeCount}>{likeState.likesCount}</span>
                          </button>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                {totalPages > 1 ? (
                  <div className={styles.pagination}>
                    <Button variant="secondary" onClick={handleGoToPreviousPage} disabled={resolvedPage <= 1}>
                      Назад
                    </Button>
                    <Typography variant="bodyS" className={styles.pageInfo}>
                      Страница {resolvedPage} из {totalPages}
                    </Typography>
                    <Button variant="secondary" onClick={handleGoToNextPage} disabled={resolvedPage >= totalPages}>
                      Вперед
                    </Button>
                  </div>
                ) : null}
              </>
            ) : null}
          </section>
        </div>
      </Container>

      <AuthRequiredPopup
        isOpen={isAuthPopupOpen}
        onClose={() => setIsAuthPopupOpen(false)}
        onRegister={handleOpenRegisterFromPopup}
      />
    </PageLayout>
  );
}
