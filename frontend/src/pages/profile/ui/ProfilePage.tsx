import { ChangeEvent, DragEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import type { Article } from '@entities/article';
import {
  getAvailableProfileTabs,
  getProfileTabDefinition,
  isRoleSpecificProfileTab,
  normalizePermissionCodes,
  resolveProfileTabKey,
  useSession,
  type ProfileTabKey
} from '@entities/session';
import { getCurrentUserProfile, removeAvatar, uploadAvatar } from '@features/avatar';
import { getModerationQueue, getMyDrafts, getMyMaterials } from '@features/articles';
import { ApiError } from '@shared/api';
import { PageLayout } from '@widgets/layout';
import { Button, Card, Container, Stack, Tag, Typography, useToast } from '@shared/ui';
import styles from './ProfilePage.module.css';

type AvatarStatus = 'idle' | 'uploading' | 'success';
type ProfileArticlePreviewScope = 'drafts' | 'materials' | 'moderation';

interface ProfilePageProps {
  section?: ProfileTabKey;
}

const STORYBOOK_TOKEN = 'storybook-token';
const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const NO_PERMISSIONS: string[] = [];
const TAB_PREVIEW_POINTS: Partial<Record<ProfileTabKey, string[]>> = {
  'editor-materials': [
    'Список опубликованных, запланированных и архивных материалов.',
    'Быстрый переход к редактированию и обновлению контента.',
    'Контроль статусов публикаций в одном месте.'
  ],
  'editor-drafts': [
    'Все ваши текущие черновики и последние правки.',
    'Быстрый доступ к доработке текста и медиа.',
    'Подготовка материала к отправке на модерацию.'
  ],
  'ja-moderation': [
    'Центральная очередь проверки контента.',
    'Инструменты для оперативной модерации материалов.'
  ]
};

function getUserInitials(name: string): string {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  return initials || 'U';
}

function getFileExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return '';
  }

  return fileName.slice(lastDotIndex).toLowerCase();
}

function validateAvatarFile(file: File): string | null {
  if (file.size <= 0) {
    return 'Выберите непустой файл изображения.';
  }

  if (file.size > MAX_AVATAR_SIZE_BYTES) {
    return 'Размер аватара не должен превышать 5 МБ.';
  }

  const extension = getFileExtension(file.name);
  if (!ALLOWED_EXTENSIONS.has(extension) || !ALLOWED_MIME_TYPES.has(file.type)) {
    return 'Поддерживаются только JPG, PNG и WebP изображения.';
  }

  return null;
}

function formatArticleDate(value: string): string {
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

function getArticleStatusTone(status: string): 'info' | 'success' | 'warning' | 'error' {
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

function getArticleStatusLabel(status: string): string {
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

export function ProfilePage({ section }: ProfilePageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showError } = useToast();
  const { user, token, isAuthenticated, isSessionLoading, signOut, updateUser } = useSession();

  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [isAvatarImageFailed, setIsAvatarImageFailed] = useState(false);
  const [isAvatarDragActive, setIsAvatarDragActive] = useState(false);
  const [avatarStatus, setAvatarStatus] = useState<AvatarStatus>('idle');
  const [avatarProgress, setAvatarProgress] = useState(0);
  const [avatarMessage, setAvatarMessage] = useState<string | null>(null);
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragEnterCounterRef = useRef(0);
  const previewObjectUrlRef = useRef<string | null>(null);
  const confirmedAvatarUrlRef = useRef<string | null>(user?.avatarUrl ?? null);

  const userPermissions = user?.permissions ?? NO_PERMISSIONS;
  const availableTabs = getAvailableProfileTabs(userPermissions);
  const queryTab = searchParams.get('tab');
  const activeSection = resolveProfileTabKey(section ?? queryTab, userPermissions);
  const activeTab = getProfileTabDefinition(activeSection);
  const activeTabPreviewPoints = TAB_PREVIEW_POINTS[activeSection] ?? [];
  const hasActiveTabWorkspaceLink = Boolean(activeTab.routePath);
  const editorPreviewScope: ProfileArticlePreviewScope | null =
    activeSection === 'editor-drafts'
      ? 'drafts'
      : activeSection === 'editor-materials'
        ? 'materials'
        : activeSection === 'ja-moderation'
          ? 'moderation'
          : null;
  const isEditorArticlesPreviewTab = editorPreviewScope !== null;
  const editorPreviewQuery = useQuery({
    queryKey: ['profile', 'editor-preview', editorPreviewScope ?? 'none', token ?? 'missing-token'],
    enabled: Boolean(editorPreviewScope && token && token !== STORYBOOK_TOKEN),
    queryFn: () => {
      if (editorPreviewScope === 'materials') {
        return getMyMaterials(token!);
      }

      if (editorPreviewScope === 'moderation') {
        return getModerationQueue(token!);
      }

      return getMyDrafts(token!);
    }
  });
  const editorPreviewArticles = useMemo(() => {
    const source = editorPreviewQuery.data ?? [];
    return [...source]
      .sort((leftArticle, rightArticle) => rightArticle.updatedAt.localeCompare(leftArticle.updatedAt))
      .slice(0, 4);
  }, [editorPreviewQuery.data]);

  const userName = user?.name ?? '';
  const userEmail = user?.email ?? '';
  const userInitials = getUserInitials(userName);
  const activeAvatarUrl = avatarPreviewUrl ?? user?.avatarUrl ?? null;
  const showAvatarImage = Boolean(activeAvatarUrl) && !isAvatarImageFailed;
  const isUploadingAvatar = avatarStatus === 'uploading';
  const isAvatarOperationLocked = isUploadingAvatar || isRemovingAvatar;
  const hasAvatar = Boolean(activeAvatarUrl);

  const handleSessionExpired = useCallback(() => {
    signOut();
    navigate('/login', { replace: true, state: { reason: 'session-expired' } });
  }, [navigate, signOut]);

  useEffect(() => {
    if (section || isSessionLoading || !user) {
      return;
    }

    const resolvedTab = resolveProfileTabKey(queryTab, userPermissions);

    if (resolvedTab === 'profile' && queryTab !== null) {
      const nextSearchParams = new URLSearchParams(searchParams);
      nextSearchParams.delete('tab');
      setSearchParams(nextSearchParams, { replace: true });
      return;
    }

    if (resolvedTab !== 'profile' && queryTab !== resolvedTab) {
      const nextSearchParams = new URLSearchParams(searchParams);
      nextSearchParams.set('tab', resolvedTab);
      setSearchParams(nextSearchParams, { replace: true });
    }
  }, [isSessionLoading, queryTab, searchParams, section, setSearchParams, user, userPermissions]);

  useEffect(() => {
    if (!isAuthenticated || !token || token === STORYBOOK_TOKEN) {
      return;
    }

    let isActive = true;

    void getCurrentUserProfile(token)
      .then((result) => {
        if (!isActive) {
          return;
        }

        const nextAvatarUrl = result.user.avatarUrl ?? null;
        const roleAccessLevel = result.user.role?.accessLevel ?? 20;
        const roleName =
          typeof result.user.role?.name === 'string' && result.user.role.name.trim().length > 0
            ? result.user.role.name.trim()
            : 'Unknown role';

        updateUser({
          id: result.user.id,
          name: result.user.username,
          email: result.user.email,
          avatarUrl: nextAvatarUrl,
          roleId: result.user.role?.id ?? '',
          roleName,
          roleAccessLevel,
          permissions: normalizePermissionCodes(result.user.role?.permissions)
        });

        confirmedAvatarUrlRef.current = nextAvatarUrl;
      })
      .catch((error) => {
        if (!isActive) {
          return;
        }

        if (error instanceof ApiError && error.status === 401) {
          handleSessionExpired();
          return;
        }

        showError(error instanceof Error ? error.message : 'Не удалось обновить профиль.', {
          title: 'Профиль',
          dedupeKey: 'profile-refresh-error'
        });
      });

    return () => {
      isActive = false;
    };
  }, [handleSessionExpired, isAuthenticated, showError, token, updateUser]);

  useEffect(() => {
    if (!(editorPreviewQuery.error instanceof ApiError)) {
      if (editorPreviewQuery.error) {
        showError(
          editorPreviewQuery.error instanceof Error
            ? editorPreviewQuery.error.message
            : 'Не удалось загрузить предпросмотр материалов.',
          {
            title: 'Предпросмотр материалов',
            dedupeKey: `profile-editor-preview-${editorPreviewScope ?? 'none'}-error`
          }
        );
      }
      return;
    }

    if (editorPreviewQuery.error.status === 401) {
      handleSessionExpired();
      return;
    }

    showError(editorPreviewQuery.error.message, {
      title: 'Предпросмотр материалов',
      dedupeKey: `profile-editor-preview-${editorPreviewScope ?? 'none'}-error`
    });
  }, [editorPreviewQuery.error, editorPreviewScope, handleSessionExpired, showError]);

  useEffect(() => {
    if (avatarPreviewUrl) {
      return;
    }

    confirmedAvatarUrlRef.current = user?.avatarUrl ?? null;
  }, [avatarPreviewUrl, user?.avatarUrl]);

  useEffect(() => {
    setIsAvatarImageFailed(false);
  }, [activeAvatarUrl]);

  useEffect(() => {
    return () => {
      if (!previewObjectUrlRef.current) {
        return;
      }

      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = null;
    };
  }, []);

  if (isSessionLoading) {
    return null;
  }

  if (!isAuthenticated || !user || !token) {
    return <Navigate to="/login" replace />;
  }

  function handleSectionChange(nextSection: ProfileTabKey) {
    if (section) {
      return;
    }

    const nextSearchParams = new URLSearchParams(searchParams);
    if (nextSection === 'profile') {
      nextSearchParams.delete('tab');
    } else {
      nextSearchParams.set('tab', nextSection);
    }

    setSearchParams(nextSearchParams, { replace: true });
  }

  function openFilePicker() {
    if (isAvatarOperationLocked) {
      return;
    }

    fileInputRef.current?.click();
  }

  function replacePreviewObjectUrl(nextUrl: string | null) {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = null;
    }

    if (nextUrl) {
      previewObjectUrlRef.current = nextUrl;
    }

    setAvatarPreviewUrl(nextUrl);
  }

  async function startAvatarUpload(file: File) {
    if (isAvatarOperationLocked || token === STORYBOOK_TOKEN) {
      return;
    }

    const validationMessage = validateAvatarFile(file);
    if (validationMessage) {
      setAvatarStatus('idle');
      setAvatarMessage(null);
      setAvatarProgress(0);
      showError(validationMessage, { title: 'Аватар', dedupeKey: 'profile-avatar-validation-error' });
      return;
    }

    const previousAvatarUrl = confirmedAvatarUrlRef.current;
    const previewUrl = URL.createObjectURL(file);

    replacePreviewObjectUrl(previewUrl);
    setIsAvatarImageFailed(false);
    setAvatarStatus('uploading');
    setAvatarMessage('Загружаем аватар...');
    setAvatarProgress(0);

    try {
      const result = await uploadAvatar(file, token!, (nextProgress) => {
        setAvatarProgress(nextProgress);
      });

      const nextAvatarUrl = result.avatarUrl ?? null;
      confirmedAvatarUrlRef.current = nextAvatarUrl;
      updateUser({ avatarUrl: nextAvatarUrl });

      replacePreviewObjectUrl(null);
      setAvatarStatus('success');
      setAvatarMessage('Аватар успешно обновлён.');
      setAvatarProgress(100);
    } catch (error) {
      replacePreviewObjectUrl(null);
      updateUser({ avatarUrl: previousAvatarUrl ?? null });

      if (error instanceof ApiError && error.status === 401) {
        handleSessionExpired();
        return;
      }

      setAvatarStatus('idle');
      setAvatarMessage(null);
      showError(error instanceof Error ? error.message : 'Не удалось загрузить аватар.', {
        title: 'Аватар',
        dedupeKey: 'profile-avatar-upload-error'
      });
      setAvatarProgress(0);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    event.target.value = '';

    if (!file) {
      return;
    }

    void startAvatarUpload(file);
  }

  function handleAvatarDragEnter(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (isAvatarOperationLocked) {
      return;
    }

    dragEnterCounterRef.current += 1;
    setIsAvatarDragActive(true);
  }

  function handleAvatarDragOver(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
  }

  function handleAvatarDragLeave(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (isAvatarOperationLocked) {
      return;
    }

    dragEnterCounterRef.current = Math.max(0, dragEnterCounterRef.current - 1);
    if (dragEnterCounterRef.current === 0) {
      setIsAvatarDragActive(false);
    }
  }

  function handleAvatarDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    dragEnterCounterRef.current = 0;
    setIsAvatarDragActive(false);

    if (isAvatarOperationLocked) {
      return;
    }

    const file = event.dataTransfer.files?.[0] ?? null;
    if (!file) {
      return;
    }

    void startAvatarUpload(file);
  }

  async function handleAvatarRemove() {
    if (!hasAvatar || isAvatarOperationLocked || token === STORYBOOK_TOKEN) {
      return;
    }

    setIsRemovingAvatar(true);

    try {
      const result = await removeAvatar(token!);
      const nextAvatarUrl = result.avatarUrl ?? null;
      confirmedAvatarUrlRef.current = nextAvatarUrl;
      updateUser({ avatarUrl: nextAvatarUrl });

      replacePreviewObjectUrl(null);
      setIsAvatarImageFailed(false);
      setAvatarProgress(0);
      setAvatarStatus('success');
      setAvatarMessage(result.isDeleted ? 'Аватар удалён.' : 'Аватар уже отсутствует.');
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        handleSessionExpired();
        return;
      }

      showError(error instanceof Error ? error.message : 'Не удалось удалить аватар.', {
        title: 'Аватар',
        dedupeKey: 'profile-avatar-remove-error'
      });
    } finally {
      setIsRemovingAvatar(false);
    }
  }

  return (
    <PageLayout>
      <Container size="lg" className={styles.container}>
        <section className={styles.hero} aria-label="Шапка профиля">
          <button
            type="button"
            className={
              isAvatarDragActive
                ? `${styles.heroAvatarButton} ${styles.heroAvatarDragActive}`
                : styles.heroAvatarButton
            }
            onClick={openFilePicker}
            onDragEnter={handleAvatarDragEnter}
            onDragOver={handleAvatarDragOver}
            onDragLeave={handleAvatarDragLeave}
            onDrop={handleAvatarDrop}
            disabled={isAvatarOperationLocked}
            aria-label="Сменить аватар"
          >
            {showAvatarImage ? (
              <img
                src={activeAvatarUrl ?? ''}
                alt=""
                className={styles.heroAvatarImage}
                onError={() => setIsAvatarImageFailed(true)}
              />
            ) : (
              <span className={styles.heroAvatarFallback} aria-hidden="true">
                {userInitials}
              </span>
            )}
            <span className={styles.heroAvatarOverlay}>Сменить</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className={styles.hiddenFileInput}
            tabIndex={-1}
          />

          <div className={styles.heroContent}>
            <Typography variant="h2">{userName}</Typography>
            <Typography variant="bodyS" className={styles.heroMeta}>
              {user.roleName} · Access {user.roleAccessLevel}
            </Typography>
            <Typography variant="caption" className={styles.heroMetaSecondary}>
              Последний вход: сегодня
            </Typography>

            <div className={styles.heroActions}>
              <Button type="button" onClick={openFilePicker} disabled={isAvatarOperationLocked}>
                {isUploadingAvatar ? `Загрузка ${avatarProgress}%` : 'Сменить аватар'}
              </Button>
              <Button type="button" variant="secondary" onClick={handleAvatarRemove} disabled={!hasAvatar || isAvatarOperationLocked}>
                {isRemovingAvatar ? 'Удаляем...' : 'Удалить аватар'}
              </Button>
            </div>

            {isUploadingAvatar ? (
              <div className={styles.progressTrack} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={avatarProgress}>
                <span className={styles.progressBar} style={{ width: `${avatarProgress}%` }} />
              </div>
            ) : null}

            {avatarMessage ? (
              <Typography
                variant="caption"
                className={
                  avatarStatus === 'success'
                    ? `${styles.avatarMessage} ${styles.avatarMessageSuccess}`
                    : styles.avatarMessage
                }
              >
                {avatarMessage}
              </Typography>
            ) : null}
          </div>
        </section>

        <Card>
          <div className={styles.layout}>
            <aside className={styles.aside} aria-label="Разделы профиля">
              {availableTabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={activeSection === tab.key ? `${styles.asideItem} ${styles.asideItemActive}` : styles.asideItem}
                  onClick={() => handleSectionChange(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </aside>

            <Stack gap={20} className={styles.content}>
              <div>
                <Typography variant="meta">{activeTab.subtitle}</Typography>
                <Typography variant="h2">{activeTab.title}</Typography>
              </div>

              {activeSection === 'profile' ? (
                <>
                  <div className={styles.accountGrid}>
                    <Stack gap={6}>
                      <Typography variant="bodyS" className={styles.label}>
                        Имя
                      </Typography>
                      <Typography variant="body">{userName}</Typography>
                    </Stack>

                    <Stack gap={6}>
                      <Typography variant="bodyS" className={styles.label}>
                        Email
                      </Typography>
                      <Typography variant="body">{userEmail}</Typography>
                    </Stack>

                    <Stack gap={6}>
                      <Typography variant="bodyS" className={styles.label}>
                        Роль
                      </Typography>
                      <Typography variant="body">{user.roleName}</Typography>
                    </Stack>

                    <Stack gap={6}>
                      <Typography variant="bodyS" className={styles.label}>
                        Уровень доступа
                      </Typography>
                      <Typography variant="body">{user.roleAccessLevel}</Typography>
                    </Stack>

                    <Stack gap={6}>
                      <Typography variant="bodyS" className={styles.label}>
                        Дата регистрации
                      </Typography>
                      <Typography variant="body">—</Typography>
                    </Stack>
                  </div>

                  <div className={styles.placeholderCard}>
                    <div className={styles.placeholderHeader}>
                      <Typography variant="body">Дополнительные поля аккаунта</Typography>
                      <span className={styles.soonBadge}>Скоро</span>
                    </div>
                    <Typography variant="bodyS" className={styles.placeholderText}>
                      Телефон, город, биография и дополнительные настройки профиля добавим в следующих итерациях.
                    </Typography>
                  </div>
                </>
              ) : null}

              {activeSection !== 'profile' ? (
                isEditorArticlesPreviewTab ? (
                  <div className={styles.editorTilesSection}>
                    {editorPreviewQuery.isLoading ? (
                      <Typography variant="caption" className={styles.placeholderEmpty}>
                        {editorPreviewScope === 'moderation'
                          ? 'Загружаем очередь модерации...'
                          : 'Загружаем статьи...'}
                      </Typography>
                    ) : null}

                    {editorPreviewQuery.isError && !(editorPreviewQuery.error instanceof ApiError && editorPreviewQuery.error.status === 401) ? (
                      <Card className={styles.editorStateCard}>
                        <Stack gap={10}>
                          <Typography variant="bodyS" className={styles.placeholderEmpty}>
                            {editorPreviewScope === 'moderation'
                              ? 'Не удалось загрузить очередь модерации.'
                              : 'Не удалось загрузить список статей.'}
                          </Typography>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                              void editorPreviewQuery.refetch();
                            }}
                          >
                            Повторить
                          </Button>
                        </Stack>
                      </Card>
                    ) : null}

                    {!editorPreviewQuery.isLoading && !editorPreviewQuery.isError ? (
                      editorPreviewArticles.length > 0 ? (
                        <div className={styles.editorTilesGrid}>
                          {editorPreviewArticles.map((article: Article) => (
                            <Card key={article.id} className={styles.editorTile}>
                              <div className={styles.editorTileTop}>
                                <Typography variant="bodyS" className={styles.editorTileTitle}>
                                  {article.title}
                                </Typography>
                                <Tag tone={getArticleStatusTone(article.status)}>{getArticleStatusLabel(article.status)}</Tag>
                              </div>
                              <Typography variant="caption" className={styles.editorTileMeta}>
                                {editorPreviewScope === 'moderation'
                                  ? `Автор: ${article.authorString} • Отправлено: ${formatArticleDate(article.submittedAt ?? article.updatedAt)}`
                                  : `Обновлено: ${formatArticleDate(article.updatedAt)} • Лайков: ${article.likesCount}`}
                              </Typography>
                              <div className={styles.editorTileActions}>
                                <Link to={`/editor/articles/${article.id}/edit`} className={styles.editorTileActionLink}>
                                  {editorPreviewScope === 'moderation' ? 'Открыть материал' : 'Редактировать'}
                                </Link>
                              </div>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <Card className={styles.editorStateCard}>
                          <Typography variant="caption" className={styles.placeholderEmpty}>
                            {activeTab.emptyState ?? 'Пока нет данных для отображения.'}
                          </Typography>
                        </Card>
                      )
                    ) : null}

                    {hasActiveTabWorkspaceLink ? (
                      <div className={styles.editorSectionActions}>
                        <Link to={activeTab.routePath!} className={styles.placeholderActionLink}>
                          Открыть весь список
                        </Link>
                        {editorPreviewScope !== 'moderation' ? (
                          <Link to="/editor/articles/new" className={styles.placeholderActionLink}>
                            Создать статью
                          </Link>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className={styles.placeholderCard}>
                    <div className={styles.placeholderHeader}>
                      <Typography variant="body">{activeTab.placeholderTitle ?? activeTab.title}</Typography>
                      {isRoleSpecificProfileTab(activeSection) ? (
                        <span className={hasActiveTabWorkspaceLink ? styles.readyBadge : styles.soonBadge}>
                          {hasActiveTabWorkspaceLink ? 'Доступно' : 'Скоро'}
                        </span>
                      ) : null}
                    </div>
                    <Typography variant="bodyS" className={styles.placeholderText}>
                      {activeTab.placeholderDescription ?? 'Раздел находится в разработке.'}
                    </Typography>

                    {activeTabPreviewPoints.length > 0 ? (
                      <ul className={styles.previewList}>
                        {activeTabPreviewPoints.map((point) => (
                          <li key={point} className={styles.previewListItem}>
                            {point}
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    <Typography variant="caption" className={styles.placeholderEmpty}>
                      {activeTab.emptyState ?? 'Пока нет данных для отображения.'}
                    </Typography>

                    {hasActiveTabWorkspaceLink ? (
                      <div className={styles.placeholderActionRow}>
                        <Typography variant="caption" className={styles.placeholderEmpty}>
                          Откройте полный режим, чтобы работать со всем списком и действиями.
                        </Typography>
                        <Link to={activeTab.routePath!} className={styles.placeholderActionLink}>
                          Открыть раздел
                        </Link>
                      </div>
                    ) : null}
                  </div>
                )
              ) : null}
            </Stack>
          </div>
        </Card>
      </Container>
    </PageLayout>
  );
}
