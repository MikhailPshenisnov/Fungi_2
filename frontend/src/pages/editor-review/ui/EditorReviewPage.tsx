import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '@entities/session';
import { getModerationQueue, moderateArticle } from '@features/articles';
import { ApiError } from '@shared/api';
import { Button, Card, Container, ContentState, Stack, Typography, useToast } from '@shared/ui';
import { PageLayout } from '@widgets/layout';
import styles from './EditorReviewPage.module.css';

type ReviewAction = 'approve' | 'reject' | 'none';

function formatDate(value: string | null): string {
  if (!value) {
    return '—';
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return '—';
  }

  return parsedDate.toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function EditorReviewPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token, signOut } = useSession();
  const { showError } = useToast();

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [reviewNoteByArticleId, setReviewNoteByArticleId] = useState<Record<string, string>>({});
  const [pendingActionByArticleId, setPendingActionByArticleId] = useState<Record<string, ReviewAction>>({});

  const queueQuery = useQuery({
    queryKey: ['editor', 'moderation-queue', token ?? 'missing-token'],
    enabled: Boolean(token),
    queryFn: () => getModerationQueue(token!)
  });

  const handleSessionExpired = useCallback(() => {
    signOut();
    navigate('/login', { replace: true, state: { reason: 'session-expired' } });
  }, [navigate, signOut]);

  const queueItems = useMemo(() => {
    const source = queueQuery.data ?? [];
    return [...source].sort((left, right) => {
      const leftDate = left.submittedAt ?? left.updatedAt;
      const rightDate = right.submittedAt ?? right.updatedAt;
      return leftDate.localeCompare(rightDate);
    });
  }, [queueQuery.data]);

  useEffect(() => {
    if (!queueQuery.error) {
      return;
    }

    if (queueQuery.error instanceof ApiError && queueQuery.error.status === 401) {
      handleSessionExpired();
      return;
    }

    showError(queueQuery.error instanceof Error ? queueQuery.error.message : 'Не удалось загрузить очередь модерации.', {
      title: 'Модерация'
    });
  }, [handleSessionExpired, queueQuery.error, showError]);

  async function handleModerationAction(articleId: string, action: ReviewAction) {
    if (!token || action === 'none') {
      return;
    }

    const decision = action === 'approve' ? 'Approve' : 'Reject';
    const reviewNote = (reviewNoteByArticleId[articleId] ?? '').trim();

    setFeedbackMessage(null);
    setPendingActionByArticleId((previousState) => ({ ...previousState, [articleId]: action }));

    try {
      await moderateArticle(articleId, decision, reviewNote, token);
      setFeedbackMessage(action === 'approve' ? 'Статья одобрена.' : 'Статья отклонена.');
      await queryClient.invalidateQueries({ queryKey: ['editor', 'moderation-queue'] });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        handleSessionExpired();
        return;
      }

      showError(error instanceof Error ? error.message : 'Не удалось применить решение модерации.', {
        title: 'Модерация'
      });
    } finally {
      setPendingActionByArticleId((previousState) => ({ ...previousState, [articleId]: 'none' }));
    }
  }

  return (
    <PageLayout>
      <Container size="lg" className={styles.container}>
        <section className={styles.hero}>
          <Stack gap={10}>
            <Typography variant="h1">Очередь модерации</Typography>
            <Typography variant="bodyS" className={styles.heroText}>
              Проверяйте статьи в статусе «На модерации» и принимайте решение публикации.
            </Typography>
          </Stack>
          <Link to="/editor/articles?scope=drafts" className={styles.backLink}>
            К рабочему столу редактора
          </Link>
        </section>

        {feedbackMessage ? (
          <Card className={styles.noticeCard}>
            <Typography variant="bodyS" className={styles.successText}>
              {feedbackMessage}
            </Typography>
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
          <div className={styles.queueGrid}>
            {queueItems.length > 0 ? (
              queueItems.map((article) => {
                const pendingAction = pendingActionByArticleId[article.id] ?? 'none';
                const isBusy = pendingAction !== 'none';

                return (
                  <Card key={article.id} className={styles.queueCard}>
                    <Stack gap={12}>
                      <div className={styles.cardTop}>
                        <div>
                          <Typography variant="h4">{article.title}</Typography>
                          <Typography variant="bodyS" className={styles.metaText}>
                            Автор: {article.authorString}
                          </Typography>
                          <Typography variant="caption" className={styles.metaText}>
                            Отправлено: {formatDate(article.submittedAt)}
                          </Typography>
                        </div>
                        <Link to={`/editor/articles/${article.id}/edit`} className={styles.openLink}>
                          Открыть материал
                        </Link>
                      </div>

                      <label className={styles.noteField}>
                        <span>Комментарий (для отклонения или внутренней заметки)</span>
                        <textarea
                          rows={3}
                          value={reviewNoteByArticleId[article.id] ?? ''}
                          onChange={(event) =>
                            setReviewNoteByArticleId((previousState) => ({
                              ...previousState,
                              [article.id]: event.target.value
                            }))
                          }
                          placeholder="Причина отклонения или замечание"
                        />
                      </label>

                      <div className={styles.cardActions}>
                        <Button
                          disabled={isBusy}
                          onClick={() => {
                            void handleModerationAction(article.id, 'approve');
                          }}
                        >
                          {pendingAction === 'approve' ? 'Подтверждаем...' : 'Одобрить'}
                        </Button>
                        <Button
                          variant="secondary"
                          disabled={isBusy}
                          onClick={() => {
                            void handleModerationAction(article.id, 'reject');
                          }}
                        >
                          {pendingAction === 'reject' ? 'Отклоняем...' : 'Отклонить'}
                        </Button>
                      </div>
                    </Stack>
                  </Card>
                );
              })
            ) : (
              <ContentState tone="empty" className={styles.stateCard} title="Очередь модерации сейчас пустая." />
            )}
          </div>
        ) : null}
      </Container>
    </PageLayout>
  );
}
