import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import type { Article } from '@entities/article';
import { useSession } from '@entities/session';
import { archiveArticle, getMyDrafts, getMyMaterials, submitForReview } from '@features/articles';
import { ApiError } from '@shared/api';
import { Button, Card, Container, Stack, Tag, Typography, useToast } from '@shared/ui';
import { PageLayout } from '@widgets/layout';
import styles from './EditorArticlesPage.module.css';

type EditorArticlesScope = 'drafts' | 'materials';
type PendingAction = 'submit' | 'archive' | 'none';

function resolveScope(value: string | null): EditorArticlesScope {
  return value === 'materials' ? 'materials' : 'drafts';
}

function formatDate(value: string): string {
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

function canSubmitForReview(article: Article): boolean {
  return article.status === 'Draft' || article.status === 'Rejected';
}

function canArchive(article: Article): boolean {
  return article.status !== 'Archived';
}

export function EditorArticlesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token, signOut } = useSession();
  const { showError } = useToast();

  const [pendingActionById, setPendingActionById] = useState<Record<string, PendingAction>>({});

  const scope = resolveScope(searchParams.get('scope'));
  const queryKey = ['editor', 'articles', scope, token ?? 'missing-token'];

  const articlesQuery = useQuery({
    queryKey,
    enabled: Boolean(token),
    queryFn: () => (scope === 'materials' ? getMyMaterials(token!) : getMyDrafts(token!))
  });

  const handleSessionExpired = useCallback(() => {
    signOut();
    navigate('/login', { replace: true, state: { reason: 'session-expired' } });
  }, [navigate, signOut]);

  const sortedArticles = useMemo(() => {
    const source = articlesQuery.data ?? [];
    return [...source].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  }, [articlesQuery.data]);

  useEffect(() => {
    if (!articlesQuery.error) {
      return;
    }

    if (articlesQuery.error instanceof ApiError && articlesQuery.error.status === 401) {
      handleSessionExpired();
      return;
    }

    showError(
      articlesQuery.error instanceof Error
        ? articlesQuery.error.message
        : 'Не удалось загрузить редакторский список.',
      { title: 'Редактор' }
    );
  }, [articlesQuery.error, handleSessionExpired, showError]);

  function handleScopeChange(nextScope: EditorArticlesScope) {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set('scope', nextScope);
    setSearchParams(nextSearchParams, { replace: true });
  }

  async function handleSubmitForReview(articleId: string) {
    if (!token) {
      return;
    }

    setPendingActionById((previousState) => ({ ...previousState, [articleId]: 'submit' }));

    try {
      await submitForReview(articleId, token);
      await queryClient.invalidateQueries({ queryKey });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        handleSessionExpired();
        return;
      }

      showError(error instanceof Error ? error.message : 'Не удалось отправить статью на модерацию.', {
        title: 'Редактор'
      });
    } finally {
      setPendingActionById((previousState) => ({ ...previousState, [articleId]: 'none' }));
    }
  }

  async function handleArchive(articleId: string) {
    if (!token) {
      return;
    }

    setPendingActionById((previousState) => ({ ...previousState, [articleId]: 'archive' }));

    try {
      await archiveArticle(articleId, token);
      await queryClient.invalidateQueries({ queryKey });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        handleSessionExpired();
        return;
      }

      showError(error instanceof Error ? error.message : 'Не удалось архивировать статью.', {
        title: 'Редактор'
      });
    } finally {
      setPendingActionById((previousState) => ({ ...previousState, [articleId]: 'none' }));
    }
  }

  return (
    <PageLayout>
      <Container size="lg" className={styles.container}>
        <section className={styles.hero}>
          <Stack gap={12}>
            <Typography variant="h1">Редакторский кабинет</Typography>
            <Typography variant="bodyS" className={styles.heroText}>
              Управляйте черновиками, отправляйте материалы на модерацию и отслеживайте статус публикаций.
            </Typography>
          </Stack>
          <Link to="/editor/articles/new" className={styles.createLink}>
            Создать статью
          </Link>
        </section>

        <div className={styles.scopeTabs} role="tablist" aria-label="Список материалов">
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
            Мои материалы
          </button>
        </div>

        {articlesQuery.isLoading ? (
          <Card className={styles.stateCard}>
            <Typography variant="body">Загружаем список статей...</Typography>
          </Card>
        ) : null}

        {articlesQuery.isError ? (
          <Card className={styles.stateCard}>
            <Stack gap={10}>
              <Typography variant="h4">Список материалов временно недоступен</Typography>
              <Button
                onClick={() => {
                  void articlesQuery.refetch();
                }}
              >
                Повторить
              </Button>
            </Stack>
          </Card>
        ) : null}

        {!articlesQuery.isLoading && !articlesQuery.isError ? (
          <div className={styles.grid}>
            {sortedArticles.length > 0 ? (
              sortedArticles.map((article) => {
                const pendingAction = pendingActionById[article.id] ?? 'none';
                const isBusy = pendingAction !== 'none';

                return (
                  <Card key={article.id} className={styles.articleCard}>
                    <Stack gap={12}>
                      <div className={styles.cardHeader}>
                        <div>
                          <Typography variant="h4">{article.title}</Typography>
                          <Typography variant="caption" className={styles.cardMeta}>
                            Обновлено: {formatDate(article.updatedAt)} • Лайков: {article.likesCount}
                          </Typography>
                        </div>
                        <Tag tone={getStatusTone(article.status)}>{getStatusLabel(article.status)}</Tag>
                      </div>

                      <Typography variant="bodyS" className={styles.cardMeta}>
                        Автор: {article.authorString}
                      </Typography>

                      <div className={styles.cardActions}>
                        <Link to={`/editor/articles/${article.id}/edit`} className={styles.actionLink}>
                          Редактировать
                        </Link>
                        {canSubmitForReview(article) ? (
                          <Button
                            variant="secondary"
                            disabled={isBusy}
                            onClick={() => {
                              void handleSubmitForReview(article.id);
                            }}
                          >
                            {pendingAction === 'submit' ? 'Отправляем...' : 'На модерацию'}
                          </Button>
                        ) : null}
                        {canArchive(article) ? (
                          <Button
                            variant="secondary"
                            disabled={isBusy}
                            onClick={() => {
                              void handleArchive(article.id);
                            }}
                          >
                            {pendingAction === 'archive' ? 'Архивируем...' : 'Архивировать'}
                          </Button>
                        ) : null}
                      </div>
                    </Stack>
                  </Card>
                );
              })
            ) : (
              <Card className={styles.stateCard}>
                <Typography variant="bodyS" className={styles.stateText}>
                  {scope === 'drafts'
                    ? 'Пока нет черновиков. Создайте первую статью.'
                    : 'Пока нет опубликованных/архивных материалов.'}
                </Typography>
              </Card>
            )}
          </div>
        ) : null}
      </Container>
    </PageLayout>
  );
}
