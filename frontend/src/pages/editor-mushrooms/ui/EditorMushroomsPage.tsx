import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useSession, hasAnyPermission, PERMISSION_CODES } from '@entities/session';
import {
  archiveMushroom,
  getMyDrafts,
  getMyMaterials,
  submitForReview,
  type EditorMushroomRevision,
  type MushroomRevisionStatus
} from '@features/mushroom-editor';
import { ApiError } from '@shared/api';
import { Button, Card, Container, Stack, Tag, Typography, useToast } from '@shared/ui';
import { PageLayout } from '@widgets/layout';
import styles from './EditorMushroomsPage.module.css';

type EditorMushroomsScope = 'drafts' | 'materials';
type PendingAction = 'submit' | 'archive' | 'none';

interface EditorMushroomsPageProps {
  storybookRevisions?: EditorMushroomRevision[] | null;
}

function resolveScope(value: string | null): EditorMushroomsScope {
  return value === 'materials' ? 'materials' : 'drafts';
}

function formatDate(value: string | null): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getStatusTone(status: MushroomRevisionStatus): 'info' | 'success' | 'warning' | 'error' {
  if (status === 'Published') {
    return 'success';
  }

  if (status === 'InReview') {
    return 'warning';
  }

  if (status === 'Rejected') {
    return 'error';
  }

  if (status === 'Archived') {
    return 'info';
  }

  return 'info';
}

function getStatusLabel(status: MushroomRevisionStatus): string {
  switch (status) {
    case 'Draft':
      return 'Черновик';
    case 'InReview':
      return 'На модерации';
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

function canEditRevision(status: MushroomRevisionStatus): boolean {
  return status === 'Draft' || status === 'Rejected';
}

function canSubmitRevision(status: MushroomRevisionStatus): boolean {
  return status === 'Draft' || status === 'Rejected';
}

function canArchiveRevision(status: MushroomRevisionStatus): boolean {
  return status === 'Published' || status === 'Rejected';
}

function getRevisionSourceId(revision: EditorMushroomRevision): string | null {
  return revision.sourceMushroomId ?? null;
}

export function EditorMushroomsPage({ storybookRevisions }: EditorMushroomsPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token, signOut, user } = useSession();
  const { showError } = useToast();

  const [pendingActionById, setPendingActionById] = useState<Record<string, PendingAction>>({});
  const scope = resolveScope(searchParams.get('scope'));
  const canArchiveAny = hasAnyPermission(user?.permissions ?? [], [
    PERMISSION_CODES.mushroomsArchive,
    PERMISSION_CODES.mushroomsManageAny
  ]);

  const revisionsQuery = useQuery({
    queryKey: ['editor', 'mushrooms', scope, token ?? 'missing-token'],
    enabled: Boolean(token && !storybookRevisions),
    queryFn: () => (scope === 'materials' ? getMyMaterials(token!) : getMyDrafts(token!))
  });

  const handleSessionExpired = useCallback(() => {
    signOut();
    navigate('/login', { replace: true, state: { reason: 'session-expired' } });
  }, [navigate, signOut]);

  const revisions = useMemo(() => {
    const source = storybookRevisions ?? revisionsQuery.data ?? [];
    return [...source].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  }, [revisionsQuery.data, storybookRevisions]);

  useEffect(() => {
    if (!revisionsQuery.error) {
      return;
    }

    if (revisionsQuery.error instanceof ApiError && revisionsQuery.error.status === 401) {
      handleSessionExpired();
      return;
    }

    showError(
      revisionsQuery.error instanceof Error ? revisionsQuery.error.message : 'Не удалось загрузить список ревизий.',
      { title: 'Редактор грибов' }
    );
  }, [handleSessionExpired, revisionsQuery.error, showError]);

  function handleScopeChange(nextScope: EditorMushroomsScope) {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set('scope', nextScope);
    setSearchParams(nextSearchParams, { replace: true });
  }

  async function handleSubmitForReview(revisionId: string) {
    if (!token) {
      return;
    }

    setPendingActionById((previousState) => ({ ...previousState, [revisionId]: 'submit' }));

    try {
      await submitForReview(revisionId, token);
      await queryClient.invalidateQueries({ queryKey: ['editor', 'mushrooms'] });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        handleSessionExpired();
        return;
      }

      showError(error instanceof Error ? error.message : 'Не удалось отправить гриб на модерацию.', {
        title: 'Редактор грибов'
      });
    } finally {
      setPendingActionById((previousState) => ({ ...previousState, [revisionId]: 'none' }));
    }
  }

  async function handleArchive(revisionId: string) {
    if (!token) {
      return;
    }

    setPendingActionById((previousState) => ({ ...previousState, [revisionId]: 'archive' }));

    try {
      await archiveMushroom(revisionId, token);
      await queryClient.invalidateQueries({ queryKey: ['editor', 'mushrooms'] });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        handleSessionExpired();
        return;
      }

      showError(error instanceof Error ? error.message : 'Не удалось архивировать ревизию гриба.', {
        title: 'Редактор грибов'
      });
    } finally {
      setPendingActionById((previousState) => ({ ...previousState, [revisionId]: 'none' }));
    }
  }

  return (
    <PageLayout>
      <Container size="lg" className={styles.container}>
        <section className={styles.hero}>
          <Stack gap={10}>
            <Typography variant="h1">Редактор грибов</Typography>
            <Typography variant="bodyS" className={styles.heroText}>
              Управляйте черновиками, рабочими материалами и ревизиями, которые ушли в публикацию или архив.
            </Typography>
          </Stack>
          <Link to="/editor/mushrooms/new" className={styles.createLink}>
            Новая ревизия
          </Link>
        </section>

        <div className={styles.scopeTabs} role="tablist" aria-label="Список ревизий грибов">
          <button
            type="button"
            role="tab"
            aria-selected={scope === 'drafts'}
            className={scope === 'drafts' ? `${styles.scopeTab} ${styles.scopeTabActive}` : styles.scopeTab}
            onClick={() => handleScopeChange('drafts')}
          >
            Черновики
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={scope === 'materials'}
            className={scope === 'materials' ? `${styles.scopeTab} ${styles.scopeTabActive}` : styles.scopeTab}
            onClick={() => handleScopeChange('materials')}
          >
            Материалы
          </button>
        </div>

        {revisionsQuery.isLoading ? (
          <Card className={styles.stateCard}>
            <Typography variant="body">Загружаем список ревизий...</Typography>
          </Card>
        ) : null}

        {revisionsQuery.isError ? (
          <Card className={styles.stateCard}>
            <Stack gap={10}>
              <Typography variant="h4">Список ревизий временно недоступен</Typography>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  void revisionsQuery.refetch();
                }}
              >
                Повторить
              </Button>
            </Stack>
          </Card>
        ) : null}

        {!revisionsQuery.isLoading && !revisionsQuery.isError ? (
          revisions.length > 0 ? (
            <div className={styles.revisionsGrid}>
              {revisions.map((revision) => {
                const pendingAction = pendingActionById[revision.revisionId] ?? 'none';
                const isBusy = pendingAction !== 'none';
                const canEdit = canEditRevision(revision.status);
                const canSubmit = canSubmitRevision(revision.status);
                const canArchive = canArchiveAny && canArchiveRevision(revision.status);
                const sourceId = getRevisionSourceId(revision);
                const previewActionHref = sourceId ? `/editor/mushrooms/new?sourceMushroomId=${encodeURIComponent(sourceId)}` : null;

                return (
                  <Card key={revision.revisionId} className={styles.revisionCard}>
                    <Stack gap={12}>
                      <div className={styles.cardTop}>
                        <div className={styles.cardHeadline}>
                          <Typography variant="h4">{revision.name}</Typography>
                          <Typography variant="bodyS" className={styles.metaText}>
                            {revision.family}
                            {revision.latinName ? ` • ${revision.latinName}` : ''}
                          </Typography>
                          <Typography variant="caption" className={styles.metaText}>
                            Обновлено: {formatDate(revision.updatedAt)}
                          </Typography>
                        </div>
                        <Tag tone={getStatusTone(revision.status)}>{getStatusLabel(revision.status)}</Tag>
                      </div>

                      <div className={styles.metaChips}>
                        <Tag tone={revision.redBook ? 'warning' : 'info'}>{revision.redBook ? 'Красная книга' : 'Обычный вид'}</Tag>
                        <Tag tone="info">{revision.eatable}</Tag>
                        <Tag tone="info">{revision.hasStem ? 'Есть ножка' : 'Без ножки'}</Tag>
                        <Tag tone="info">Лайков: {revision.likesCount}</Tag>
                      </div>

                      <Typography variant="bodyS" className={styles.description}>
                        {revision.description}
                      </Typography>

                      <Typography variant="caption" className={styles.metaText}>
                        Создано: {formatDate(revision.createdAt)}
                        {revision.submittedAt ? ` • Отправлено: ${formatDate(revision.submittedAt)}` : ''}
                        {revision.publishedAt ? ` • Опубликовано: ${formatDate(revision.publishedAt)}` : ''}
                        {revision.archivedAt ? ` • Архивировано: ${formatDate(revision.archivedAt)}` : ''}
                      </Typography>

                      <div className={styles.cardActions}>
                        {canEdit ? (
                          <Link to={`/editor/mushrooms/${revision.revisionId}/edit`} className={styles.actionLink}>
                            Редактировать
                          </Link>
                        ) : null}

                        {canSubmit ? (
                          <Button
                            type="button"
                            disabled={isBusy}
                            onClick={() => {
                              void handleSubmitForReview(revision.revisionId);
                            }}
                          >
                            {pendingAction === 'submit' ? 'Отправляем...' : 'Отправить'}
                          </Button>
                        ) : null}

                        {previewActionHref ? (
                          <Link to={previewActionHref} className={styles.actionLink}>
                            Создать ревизию
                          </Link>
                        ) : null}

                        {canArchive ? (
                          <Button
                            type="button"
                            variant="secondary"
                            disabled={isBusy}
                            onClick={() => {
                              void handleArchive(revision.revisionId);
                            }}
                          >
                            {pendingAction === 'archive' ? 'Архивируем...' : 'Архивировать'}
                          </Button>
                        ) : null}
                      </div>

                      <Typography variant="caption" className={styles.metaText}>
                        {revision.doppelgangerNames.length > 0
                          ? `Двойники: ${revision.doppelgangerNames.join(', ')}`
                          : 'Двойники не указаны'}
                      </Typography>
                    </Stack>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className={styles.stateCard}>
              <Typography variant="bodyS" className={styles.metaText}>
                Пока нет ревизий в этом разделе.
              </Typography>
            </Card>
          )
        ) : null}
      </Container>
    </PageLayout>
  );
}
