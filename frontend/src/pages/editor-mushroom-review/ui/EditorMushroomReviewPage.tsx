import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useSession, hasPermission, PERMISSION_CODES } from '@entities/session';
import { getModerationQueue, moderateMushroom, type EditorMushroomRevision, type MushroomModerationDecision } from '@features/mushroom-editor';
import { ApiError } from '@shared/api';
import { Button, Card, Container, ContentState, Stack, Tag, Typography, useToast } from '@shared/ui';
import { PageLayout } from '@widgets/layout';
import styles from './EditorMushroomReviewPage.module.css';

type ReviewAction = MushroomModerationDecision | 'none';

interface EditorMushroomReviewPageProps {
  storybookQueue?: EditorMushroomRevision[] | null;
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

function getStatusTone(status: string): 'info' | 'success' | 'warning' | 'error' {
  if (status === 'Published') {
    return 'success';
  }

  if (status === 'InReview') {
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

export function EditorMushroomReviewPage({ storybookQueue }: EditorMushroomReviewPageProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token, signOut, user } = useSession();
  const { showError } = useToast();

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [publishedLink, setPublishedLink] = useState<string | null>(null);
  const [reviewNoteById, setReviewNoteById] = useState<Record<string, string>>({});
  const [pendingActionById, setPendingActionById] = useState<Record<string, ReviewAction>>({});

  const canReject = hasPermission(user?.permissions ?? [], PERMISSION_CODES.mushroomsReview);
  const canPublish = hasPermission(user?.permissions ?? [], PERMISSION_CODES.mushroomsPublish);

  const queueQuery = useQuery({
    queryKey: ['editor', 'mushrooms', 'moderation-queue', token ?? 'missing-token'],
    enabled: Boolean(token && !storybookQueue),
    queryFn: () => getModerationQueue(token!)
  });

  const handleSessionExpired = useCallback(() => {
    signOut();
    navigate('/login', { replace: true, state: { reason: 'session-expired' } });
  }, [navigate, signOut]);

  const queueItems = useMemo(() => {
    const source = storybookQueue ?? queueQuery.data ?? [];
    return [...source].sort((left, right) => {
      const leftDate = left.submittedAt ?? left.updatedAt;
      const rightDate = right.submittedAt ?? right.updatedAt;
      return rightDate.localeCompare(leftDate);
    });
  }, [queueQuery.data, storybookQueue]);

  useEffect(() => {
    if (!queueQuery.error) {
      return;
    }

    if (queueQuery.error instanceof ApiError && queueQuery.error.status === 401) {
      handleSessionExpired();
      return;
    }

    showError(
      queueQuery.error instanceof Error ? queueQuery.error.message : 'Не удалось загрузить очередь модерации грибов.',
      { title: 'Модерация грибов' }
    );
  }, [handleSessionExpired, queueQuery.error, showError]);

  async function handleModerationAction(revisionId: string, action: MushroomModerationDecision) {
    if (!token) {
      return;
    }

    const reviewNote = (reviewNoteById[revisionId] ?? '').trim();
    setFeedbackMessage(null);
    setPublishedLink(null);
    setPendingActionById((previousState) => ({ ...previousState, [revisionId]: action }));

    try {
      const result = await moderateMushroom(revisionId, action, reviewNote, token);

      if (action === 'Approve' && result.publishedMushroomId) {
        setPublishedLink(`/mushrooms/${result.publishedMushroomId}`);
      }

      setFeedbackMessage(action === 'Approve' ? 'Ревизия одобрена.' : 'Ревизия отклонена.');
      await queryClient.invalidateQueries({ queryKey: ['editor', 'mushrooms', 'moderation-queue'] });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        handleSessionExpired();
        return;
      }

      showError(error instanceof Error ? error.message : 'Не удалось применить решение модерации.', {
        title: 'Модерация грибов'
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
            <Typography variant="h1">Очередь модерации грибов</Typography>
            <Typography variant="bodyS" className={styles.heroText}>
              Проверяйте ревизии, отправленные на модерацию, и принимайте решение публикации.
            </Typography>
          </Stack>
          <Link to="/editor/mushrooms?scope=drafts" className={styles.backLink}>
            К редактору грибов
          </Link>
        </section>

        {feedbackMessage ? (
          <Card className={styles.noticeCard}>
            <Stack gap={8}>
              <Typography variant="bodyS" className={styles.successText}>
                {feedbackMessage}
              </Typography>
              {publishedLink ? (
                <Link to={publishedLink} className={styles.publishedLink}>
                  Открыть опубликованный гриб
                </Link>
              ) : null}
            </Stack>
          </Card>
        ) : null}

        {queueQuery.isLoading ? (
          <ContentState tone="loading" className={styles.stateCard} title="Загружаем очередь модерации..." />
        ) : null}

        {queueQuery.isError ? (
          <ContentState
            tone="error"
            className={styles.stateCard}
            title="Очередь модерации временно недоступна"
            action={
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  void queueQuery.refetch();
                }}
              >
                Повторить
              </Button>
            }
          />
        ) : null}

        {!queueQuery.isLoading && !queueQuery.isError ? (
          queueItems.length > 0 ? (
            <div className={styles.queueGrid}>
              {queueItems.map((revision) => {
                const pendingAction = pendingActionById[revision.revisionId] ?? 'none';
                const isBusy = pendingAction !== 'none';

                return (
                  <Card key={revision.revisionId} className={styles.queueCard}>
                    <Stack gap={12}>
                      <div className={styles.cardTop}>
                        <div>
                          <Typography variant="h4" as="h2">
                            {revision.name}
                          </Typography>
                          <Typography variant="bodyS" className={styles.metaText}>
                            {revision.family}
                            {revision.latinName ? ` • ${revision.latinName}` : ''}
                          </Typography>
                          <Typography variant="caption" className={styles.metaText}>
                            Отправлено: {formatDate(revision.submittedAt)}
                          </Typography>
                        </div>
                        <Tag tone={getStatusTone(revision.status)}>{getStatusLabel(revision.status)}</Tag>
                      </div>

                      <Typography variant="bodyS" className={styles.metaText}>
                        {revision.description}
                      </Typography>

                      <label className={styles.noteField}>
                        <span>Комментарий модерации</span>
                        <textarea
                          rows={3}
                          value={reviewNoteById[revision.revisionId] ?? ''}
                          onChange={(event) =>
                            setReviewNoteById((previousState) => ({
                              ...previousState,
                              [revision.revisionId]: event.target.value
                            }))
                          }
                          placeholder="Причина отклонения или внутреннее замечание"
                        />
                      </label>

                      <div className={styles.cardActions}>
                        {canPublish ? (
                          <Button
                            type="button"
                            disabled={isBusy}
                            onClick={() => {
                              void handleModerationAction(revision.revisionId, 'Approve');
                            }}
                          >
                            {pendingAction === 'Approve' ? 'Одобряем...' : 'Одобрить'}
                          </Button>
                        ) : null}

                        {canReject ? (
                          <Button
                            type="button"
                            variant="secondary"
                            disabled={isBusy}
                            onClick={() => {
                              void handleModerationAction(revision.revisionId, 'Reject');
                            }}
                          >
                            {pendingAction === 'Reject' ? 'Отклоняем...' : 'Отклонить'}
                          </Button>
                        ) : null}

                        <Link to={`/editor/mushrooms/${revision.revisionId}/edit`} className={styles.openLink}>
                          Открыть ревизию
                        </Link>
                      </div>
                    </Stack>
                  </Card>
                );
              })}
            </div>
          ) : (
            <ContentState tone="empty" className={styles.stateCard} title="Очередь модерации сейчас пустая." />
          )
        ) : null}
      </Container>
    </PageLayout>
  );
}
