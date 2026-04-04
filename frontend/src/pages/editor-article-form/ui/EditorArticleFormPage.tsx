import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { Mushroom } from '@entities/mushroom';
import { hasPermission, PERMISSION_CODES, useSession } from '@entities/session';
import {
  archiveArticle,
  createDraft,
  deleteArticleImage,
  getEditorArticle,
  moderateArticle,
  submitForReview,
  updateDraft,
  uploadArticleImage,
  type EditorArticlePayload,
  type EditorParagraphInput
} from '@features/articles';
import { getFilteredMushrooms, getMushroomById, useDebouncedValue } from '@features/mushrooms';
import { ApiError } from '@shared/api';
import { Button, Card, Container, ContentState, Input, Stack, Typography, useToast } from '@shared/ui';
import { PageLayout } from '@widgets/layout';
import styles from './EditorArticleFormPage.module.css';

interface EditorFormState {
  title: string;
  authorString: string;
  publishDateInput: string;
  headerPhotoLink: string;
  extraPhotoLinks: string[];
  paragraphs: EditorParagraphInput[];
  linkedMushroomIds: string[];
}

interface LinkedMushroomOption {
  id: string;
  name: string;
  family: string;
  latinName: string | null;
}

const EDITOR_ERROR_TRANSLATIONS: Record<string, string> = {
  "Extra photo links string can't be longer than 1024 characters":
    'Список дополнительных фото слишком длинный. Сократите количество ссылок.',
  'Photo link must be a valid image link (absolute URL or /media/* path)':
    'Ссылка на фото некорректна. Используйте полный URL или путь вида /media/... .',
  'Header photo link must be a valid image link (absolute URL or /media/* path)':
    'Главное фото задано некорректно. Укажите полный URL или путь вида /media/... .',
  'Header photo link is required for article status other than Draft':
    'Для этой операции нужна обложка статьи.',
  'Header photo is required before submitting article for review':
    'Перед отправкой на модерацию добавьте обложку статьи.',
  'Header photo is required before approval':
    'Одобрить статью без обложки нельзя. Добавьте обложку и повторите.',
  'The article must contain paragraphs': 'Добавьте хотя бы один абзац статьи.'
};

function toReadableEditorErrorMessage(error: unknown, fallbackMessage: string): string {
  const rawMessage = error instanceof Error ? error.message : fallbackMessage;
  const normalizedMessage = rawMessage.trim();

  if (!normalizedMessage) {
    return fallbackMessage;
  }

  const noFormatPrefix = normalizedMessage.replace(/^Incorrect data format:\s*/i, '').trim();

  if (noFormatPrefix in EDITOR_ERROR_TRANSLATIONS) {
    return EDITOR_ERROR_TRANSLATIONS[noFormatPrefix];
  }

  if (noFormatPrefix.length > 0 && noFormatPrefix !== normalizedMessage) {
    return noFormatPrefix;
  }

  return normalizedMessage;
}

function toDateTimeInput(isoDate: string): string {
  const parsedDate = new Date(isoDate);
  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  const timezoneOffsetMs = parsedDate.getTimezoneOffset() * 60_000;
  return new Date(parsedDate.getTime() - timezoneOffsetMs).toISOString().slice(0, 16);
}

function toIsoDate(dateTimeInput: string): string {
  const parsedDate = new Date(dateTimeInput);
  if (Number.isNaN(parsedDate.getTime())) {
    return new Date().toISOString();
  }

  return parsedDate.toISOString();
}

function createInitialState(authorName = ''): EditorFormState {
  return {
    title: '',
    authorString: authorName,
    publishDateInput: toDateTimeInput(new Date().toISOString()),
    headerPhotoLink: '',
    extraPhotoLinks: [],
    paragraphs: [{ text: '', isSubtitle: false }],
    linkedMushroomIds: []
  };
}

function mapMushroomToLinkedOption(mushroom: Mushroom): LinkedMushroomOption {
  return {
    id: mushroom.id,
    name: mushroom.name,
    family: mushroom.family,
    latinName: mushroom.latinName
  };
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
      return 'В архиве';
    default:
      return status;
  }
}

function formatPreviewDate(dateTimeInput: string): string {
  const parsedDate = new Date(dateTimeInput);
  if (Number.isNaN(parsedDate.getTime())) {
    return 'Дата публикации не задана';
  }

  return parsedDate.toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function EditorArticleFormPage() {
  const { id: routeArticleId } = useParams();
  const navigate = useNavigate();
  const { user, token, signOut } = useSession();
  const { showError } = useToast();

  const isEditMode = Boolean(routeArticleId);
  const [formState, setFormState] = useState<EditorFormState>(() => createInitialState(user?.name ?? ''));
  const [status, setStatus] = useState<string>(isEditMode ? 'Loading' : 'Draft');
  const [reviewNote, setReviewNote] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [publishedArticleLink, setPublishedArticleLink] = useState<string | null>(null);
  const [moderationNote, setModerationNote] = useState('');
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSubmittingForReview, setIsSubmittingForReview] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [moderatingDecision, setModeratingDecision] = useState<'Approve' | 'Reject' | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadTarget, setUploadTarget] = useState<'header' | 'extra' | null>(null);
  const [uploadedMediaPathByUrl, setUploadedMediaPathByUrl] = useState<Record<string, string>>({});
  const [mushroomSearchInput, setMushroomSearchInput] = useState('');
  const [linkedMushroomById, setLinkedMushroomById] = useState<Record<string, LinkedMushroomOption>>({});
  const [isPreviewHeaderImageBroken, setIsPreviewHeaderImageBroken] = useState(false);

  const headerFileInputRef = useRef<HTMLInputElement | null>(null);
  const extraFileInputRef = useRef<HTMLInputElement | null>(null);
  const isHydratedFromApiRef = useRef(false);

  const editorArticleQuery = useQuery({
    queryKey: ['editor', 'article', routeArticleId ?? 'new', token ?? 'missing-token'],
    enabled: Boolean(isEditMode && token && routeArticleId),
    queryFn: () => getEditorArticle(routeArticleId!, token!)
  });
  const debouncedMushroomSearchInput = useDebouncedValue(mushroomSearchInput, 350);
  const normalizedMushroomSearchInput = debouncedMushroomSearchInput.trim();

  const mushroomSearchQuery = useQuery<LinkedMushroomOption[]>({
    queryKey: ['editor', 'mushroom-search', normalizedMushroomSearchInput],
    enabled: normalizedMushroomSearchInput.length >= 2,
    queryFn: async () => {
      const result = await getFilteredMushrooms({ partOfName: normalizedMushroomSearchInput });
      return result.mushrooms.slice(0, 20).map(mapMushroomToLinkedOption);
    }
  });

  useEffect(() => {
    if (!editorArticleQuery.data || isHydratedFromApiRef.current) {
      return;
    }

    isHydratedFromApiRef.current = true;
    setFormState({
      title: editorArticleQuery.data.title,
      authorString: editorArticleQuery.data.authorString,
      publishDateInput: toDateTimeInput(editorArticleQuery.data.publishDate),
      headerPhotoLink: editorArticleQuery.data.headerPhotoLink,
      extraPhotoLinks: [...editorArticleQuery.data.extraPhotoLinks],
      paragraphs:
        editorArticleQuery.data.paragraphs.length > 0
          ? editorArticleQuery.data.paragraphs.map((paragraph) => ({
              text: paragraph.paragraphText,
              isSubtitle: paragraph.isSubtitle
            }))
          : [{ text: '', isSubtitle: false }],
      linkedMushroomIds: [...editorArticleQuery.data.linkedMushroomIds]
    });
    setStatus(editorArticleQuery.data.status);
    setReviewNote(editorArticleQuery.data.reviewNote);
    setModerationNote(editorArticleQuery.data.reviewNote ?? '');
  }, [editorArticleQuery.data]);

  useEffect(() => {
    if (!(editorArticleQuery.error instanceof ApiError)) {
      return;
    }

    if (editorArticleQuery.error.status === 401) {
      signOut();
      navigate('/login', { replace: true, state: { reason: 'session-expired' } });
      return;
    }

    if (editorArticleQuery.error.status === 403) {
      navigate('/profile', { replace: true });
      return;
    }

    showError(toReadableEditorErrorMessage(editorArticleQuery.error, 'Не удалось загрузить статью для редактирования.'), {
      title: 'Редактор'
    });
  }, [editorArticleQuery.error, navigate, showError, signOut]);

  const missingLinkedMushroomIds = useMemo(
    () => formState.linkedMushroomIds.filter((mushroomId) => !linkedMushroomById[mushroomId]),
    [formState.linkedMushroomIds, linkedMushroomById]
  );
  const missingLinkedMushroomIdsKey = useMemo(
    () => missingLinkedMushroomIds.slice().sort().join(','),
    [missingLinkedMushroomIds]
  );
  const linkedMushroomLookupQuery = useQuery({
    queryKey: ['editor', 'linked-mushrooms', missingLinkedMushroomIdsKey],
    enabled: missingLinkedMushroomIds.length > 0,
    queryFn: async () => {
      const loadedMushrooms = await Promise.all(
        missingLinkedMushroomIds.map(async (mushroomId) => {
          try {
            const mushroom = await getMushroomById(mushroomId);
            return mapMushroomToLinkedOption(mushroom);
          } catch {
            return null;
          }
        })
      );

      return loadedMushrooms.filter((mushroom): mushroom is LinkedMushroomOption => Boolean(mushroom));
    }
  });

  useEffect(() => {
    if (!mushroomSearchQuery.data || mushroomSearchQuery.data.length === 0) {
      return;
    }

    setLinkedMushroomById((previousState) => {
      const nextState = { ...previousState };
      for (const mushroom of mushroomSearchQuery.data) {
        nextState[mushroom.id] = mushroom;
      }
      return nextState;
    });
  }, [mushroomSearchQuery.data]);

  useEffect(() => {
    if (!linkedMushroomLookupQuery.data || linkedMushroomLookupQuery.data.length === 0) {
      return;
    }

    setLinkedMushroomById((previousState) => {
      const nextState = { ...previousState };
      for (const mushroom of linkedMushroomLookupQuery.data) {
        nextState[mushroom.id] = mushroom;
      }
      return nextState;
    });
  }, [linkedMushroomLookupQuery.data]);

  useEffect(() => {
    if (!mushroomSearchQuery.error) {
      return;
    }

    showError(
      toReadableEditorErrorMessage(mushroomSearchQuery.error, 'Не удалось загрузить список грибов.'),
      { title: 'Редактор' }
    );
  }, [mushroomSearchQuery.error, showError]);

  const canSubmitForReview = useMemo(() => status === 'Draft' || status === 'Rejected', [status]);
  const canArchive = useMemo(() => status !== 'Archived', [status]);
  const canReject = hasPermission(user?.permissions ?? [], PERMISSION_CODES.articlesReview);
  const canPublish = hasPermission(user?.permissions ?? [], PERMISSION_CODES.articlesPublish);
  const canModerateInReview = useMemo(
    () => isEditMode && status === 'InReview' && (canReject || canPublish),
    [canPublish, canReject, isEditMode, status]
  );
  const isAnyActionBusy = isSavingDraft || isSubmittingForReview || isArchiving || moderatingDecision !== null;
  const linkedMushroomIdSet = useMemo(
    () => new Set(formState.linkedMushroomIds),
    [formState.linkedMushroomIds]
  );
  const visibleMushroomSearchResults = useMemo(
    () => (mushroomSearchQuery.data ?? []).filter((mushroom) => !linkedMushroomIdSet.has(mushroom.id)),
    [linkedMushroomIdSet, mushroomSearchQuery.data]
  );
  const previewTitle = formState.title.trim() || 'Заголовок статьи появится здесь';
  const previewAuthor = formState.authorString.trim() || user?.name || 'Автор не указан';
  const previewStatusClassName =
    status === 'Published'
      ? styles.previewStatusPublished
      : status === 'InReview' || status === 'Scheduled'
        ? styles.previewStatusReview
        : status === 'Rejected' || status === 'Archived'
          ? styles.previewStatusMuted
          : styles.previewStatusDraft;
  const previewParagraphs = useMemo(() => {
    const filledParagraphs = formState.paragraphs
      .map((paragraph) => ({
        ...paragraph,
        text: paragraph.text.trim()
      }))
      .filter((paragraph) => paragraph.text.length > 0);

    return {
      visible: filledParagraphs.slice(0, 6),
      hiddenCount: Math.max(0, filledParagraphs.length - 6)
    };
  }, [formState.paragraphs]);
  const previewGalleryImages = useMemo(
    () =>
      formState.extraPhotoLinks
        .map((url) => url.trim())
        .filter((url) => url.length > 0)
        .slice(0, 4),
    [formState.extraPhotoLinks]
  );

  useEffect(() => {
    setIsPreviewHeaderImageBroken(false);
  }, [formState.headerPhotoLink]);

  function setDraftField<Key extends keyof EditorFormState>(key: Key, value: EditorFormState[Key]) {
    setFormState((previousState) => ({ ...previousState, [key]: value }));
  }

  function buildPayload(): EditorArticlePayload {
    return {
      title: formState.title.trim(),
      authorString: formState.authorString.trim(),
      publishDate: toIsoDate(formState.publishDateInput),
      headerPhotoLink: formState.headerPhotoLink.trim(),
      extraPhotoLinks: formState.extraPhotoLinks,
      paragraphs: formState.paragraphs
        .map((paragraph) => ({
          text: paragraph.text.trim(),
          isSubtitle: paragraph.isSubtitle
        }))
        .filter((paragraph) => paragraph.text.length > 0),
      linkedMushroomIds: formState.linkedMushroomIds
    };
  }

  function validatePayload(payload: EditorArticlePayload, options?: { requireHeaderPhoto?: boolean }): string | null {
    const requireHeaderPhoto = Boolean(options?.requireHeaderPhoto);

    if (payload.title.length < 3) {
      return 'Заголовок должен содержать минимум 3 символа.';
    }

    if (payload.authorString.length < 2) {
      return 'Укажите автора статьи.';
    }

    if (requireHeaderPhoto && !payload.headerPhotoLink) {
      return 'Добавьте главное изображение статьи.';
    }

    if (payload.paragraphs.length === 0) {
      return 'Добавьте хотя бы один абзац.';
    }

    return null;
  }

  async function persistDraft(options?: { requireHeaderPhoto?: boolean }): Promise<string | null> {
    if (!token) {
      return null;
    }

    const payload = buildPayload();
    const validationError = validatePayload(payload, options);
    if (validationError) {
      showError(validationError, { title: 'Проверьте форму' });
      return null;
    }

    setFeedbackMessage(null);
    setIsSavingDraft(true);

    try {
      if (routeArticleId) {
        const result = await updateDraft(routeArticleId, payload, token);
        setStatus(result.status);
        setFeedbackMessage('Черновик сохранён.');
        return routeArticleId;
      }

      const result = await createDraft(payload, token);
      setStatus(result.status);
      setFeedbackMessage('Черновик создан.');
      navigate(`/editor/articles/${result.createdArticleId}/edit`, { replace: true });
      return result.createdArticleId;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        signOut();
        navigate('/login', { replace: true, state: { reason: 'session-expired' } });
        return null;
      }

      showError(toReadableEditorErrorMessage(error, 'Не удалось сохранить черновик.'), {
        title: 'Редактор'
      });
      return null;
    } finally {
      setIsSavingDraft(false);
    }
  }

  async function handleSubmitForReview() {
    if (!token) {
      return;
    }

    setIsSubmittingForReview(true);
    setFeedbackMessage(null);

    try {
      const articleId = await persistDraft({ requireHeaderPhoto: true });
      if (!articleId) {
        return;
      }

      const result = await submitForReview(articleId, token);
      setStatus(result.status);
      setFeedbackMessage('Статья отправлена на модерацию.');
    } catch (error) {
      showError(toReadableEditorErrorMessage(error, 'Не удалось отправить статью на модерацию.'), {
        title: 'Редактор'
      });
    } finally {
      setIsSubmittingForReview(false);
    }
  }

  async function handleArchive() {
    if (!token || !routeArticleId || !canArchive) {
      return;
    }

    setFeedbackMessage(null);
    setIsArchiving(true);

    try {
      const result = await archiveArticle(routeArticleId, token);
      setStatus(result.status);
      setFeedbackMessage('Статья переведена в архив.');
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        signOut();
        navigate('/login', { replace: true, state: { reason: 'session-expired' } });
        return;
      }

      showError(toReadableEditorErrorMessage(error, 'Не удалось архивировать статью.'), {
        title: 'Редактор'
      });
    } finally {
      setIsArchiving(false);
    }
  }

  async function handleModerationAction(decision: 'Approve' | 'Reject') {
    if (!token || !routeArticleId) {
      return;
    }

    if (decision === 'Approve' && !canPublish) {
      return;
    }

    if (decision === 'Reject' && !canReject) {
      return;
    }

    setFeedbackMessage(null);
    setPublishedArticleLink(null);
    setModeratingDecision(decision);

    try {
      const result = await moderateArticle(routeArticleId, decision, moderationNote, token);
      const trimmedNote = moderationNote.trim();

      setStatus(result.status);
      setReviewNote(trimmedNote || null);
      setModerationNote(trimmedNote);

      if (decision === 'Approve') {
        if (result.status === 'Published') {
          setPublishedArticleLink(`/articles/${routeArticleId}`);
          setFeedbackMessage('Статья одобрена и опубликована.');
        } else if (result.status === 'Scheduled') {
          setFeedbackMessage('Статья одобрена и запланирована к публикации.');
        } else {
          setFeedbackMessage('Статья одобрена.');
        }
      } else {
        setFeedbackMessage('Статья отклонена.');
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        signOut();
        navigate('/login', { replace: true, state: { reason: 'session-expired' } });
        return;
      }

      showError(toReadableEditorErrorMessage(error, 'Не удалось применить решение модерации.'), {
        title: 'Редактор'
      });
    } finally {
      setModeratingDecision(null);
    }
  }

  async function handleUploadImage(target: 'header' | 'extra', file: File) {
    if (!token) {
      return;
    }

    setFeedbackMessage(null);
    setUploadTarget(target);
    setUploadProgress(0);

    try {
      const result = await uploadArticleImage(file, token, setUploadProgress);
      const nextUrl = result.mediaUrl.trim();

      if (!nextUrl) {
        throw new Error('Сервер не вернул ссылку на изображение.');
      }

      setUploadedMediaPathByUrl((previousState) => ({
        ...previousState,
        [nextUrl]: result.mediaPath
      }));

      if (target === 'header') {
        setDraftField('headerPhotoLink', nextUrl);
        setFeedbackMessage('Главное изображение обновлено.');
        return;
      }

      setDraftField('extraPhotoLinks', [...formState.extraPhotoLinks, nextUrl]);
      setFeedbackMessage('Изображение добавлено в галерею.');
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        signOut();
        navigate('/login', { replace: true, state: { reason: 'session-expired' } });
        return;
      }

      showError(toReadableEditorErrorMessage(error, 'Не удалось загрузить изображение.'), {
        title: 'Редактор'
      });
    } finally {
      setUploadTarget(null);
      setUploadProgress(0);
    }
  }

  async function handleDeleteImageByUrl(url: string) {
    const mediaPath = uploadedMediaPathByUrl[url];
    if (!token || !mediaPath) {
      return;
    }

    try {
      await deleteArticleImage(mediaPath, token);
      setUploadedMediaPathByUrl((previousState) => {
        const nextState = { ...previousState };
        delete nextState[url];
        return nextState;
      });
    } catch {
      // keep UI responsive even if media cleanup failed
    }
  }

  async function handleHeaderImageRemove() {
    const currentUrl = formState.headerPhotoLink;
    setDraftField('headerPhotoLink', '');
    await handleDeleteImageByUrl(currentUrl);
  }

  async function handleExtraImageRemove(imageUrl: string) {
    setDraftField(
      'extraPhotoLinks',
      formState.extraPhotoLinks.filter((url) => url !== imageUrl)
    );
    await handleDeleteImageByUrl(imageUrl);
  }

  function handleParagraphTextChange(index: number, value: string) {
    const nextParagraphs = [...formState.paragraphs];
    nextParagraphs[index] = {
      ...nextParagraphs[index],
      text: value
    };
    setDraftField('paragraphs', nextParagraphs);
  }

  function handleParagraphSubtitleChange(index: number, isSubtitle: boolean) {
    const nextParagraphs = [...formState.paragraphs];
    nextParagraphs[index] = {
      ...nextParagraphs[index],
      isSubtitle
    };
    setDraftField('paragraphs', nextParagraphs);
  }

  function handleParagraphMove(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= formState.paragraphs.length) {
      return;
    }

    const nextParagraphs = [...formState.paragraphs];
    const [currentParagraph] = nextParagraphs.splice(index, 1);
    nextParagraphs.splice(nextIndex, 0, currentParagraph);
    setDraftField('paragraphs', nextParagraphs);
  }

  function handleParagraphDelete(index: number) {
    if (formState.paragraphs.length === 1) {
      setDraftField('paragraphs', [{ text: '', isSubtitle: false }]);
      return;
    }

    setDraftField(
      'paragraphs',
      formState.paragraphs.filter((_, currentIndex) => currentIndex !== index)
    );
  }

  function handleParagraphAdd() {
    setDraftField('paragraphs', [...formState.paragraphs, { text: '', isSubtitle: false }]);
  }

  function handleMushroomLink(mushroom: LinkedMushroomOption) {
    if (linkedMushroomIdSet.has(mushroom.id)) {
      return;
    }

    setDraftField('linkedMushroomIds', [...formState.linkedMushroomIds, mushroom.id]);
    setLinkedMushroomById((previousState) => ({
      ...previousState,
      [mushroom.id]: mushroom
    }));
    setMushroomSearchInput('');
  }

  function handleMushroomUnlink(mushroomId: string) {
    setDraftField(
      'linkedMushroomIds',
      formState.linkedMushroomIds.filter((id) => id !== mushroomId)
    );
  }

  function onHeaderFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    event.target.value = '';

    if (!file) {
      return;
    }

    void handleUploadImage('header', file);
  }

  function onExtraFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    event.target.value = '';

    if (!file) {
      return;
    }

    void handleUploadImage('extra', file);
  }

  return (
    <PageLayout>
      <Container size="xl" className={styles.container}>
        <div className={styles.topRow}>
          <Stack gap={8}>
            <Typography variant="h1">{isEditMode ? 'Редактирование статьи' : 'Новая статья'}</Typography>
            <Typography variant="bodyS" className={styles.metaText}>
              Статус: {getArticleStatusLabel(status)}
            </Typography>
          </Stack>
          <Link to="/editor/articles?scope=drafts" className={styles.backLink}>
            К списку статей
          </Link>
        </div>

        {reviewNote ? (
          <Card className={styles.noticeCard}>
            <Typography variant="bodyS">
              Комментарий модерации: {reviewNote}
            </Typography>
          </Card>
        ) : null}

        {feedbackMessage ? (
          <Card className={styles.noticeCard}>
            <Stack gap={8}>
              <Typography variant="bodyS" className={styles.successText}>
                {feedbackMessage}
              </Typography>
              {publishedArticleLink ? (
                <Link to={publishedArticleLink} className={styles.backLink}>
                  Открыть опубликованную статью
                </Link>
              ) : null}
            </Stack>
          </Card>
        ) : null}

        {editorArticleQuery.isLoading ? (
          <ContentState tone="loading" title="Загружаем статью..." />
        ) : null}

        <div className={styles.workspace}>
          <Card className={styles.formCard}>
            <Stack gap={20}>
            <Input
              label="Заголовок"
              value={formState.title}
              onChange={(event) => setDraftField('title', event.target.value)}
              placeholder="Введите заголовок статьи"
              helperText="Коротко и понятно: это заголовок карточки и детальной страницы."
            />
            <div className={styles.formGrid}>
              <Input
                label="Автор"
                value={formState.authorString}
                onChange={(event) => setDraftField('authorString', event.target.value)}
                placeholder="Имя автора"
                helperText="Можно оставить своё имя или псевдоним."
              />
              <Input
                type="datetime-local"
                label="Дата публикации"
                value={formState.publishDateInput}
                onChange={(event) => setDraftField('publishDateInput', event.target.value)}
                helperText="Будущая дата отправит материал в отложенную публикацию."
              />
            </div>

            <div className={styles.mediaSection}>
              <Typography variant="h4" as="h2">
                Изображения
              </Typography>
              <div className={styles.mediaControls}>
                <Button
                  variant="secondary"
                  onClick={() => headerFileInputRef.current?.click()}
                  disabled={uploadTarget !== null}
                >
                  {uploadTarget === 'header' ? `Загрузка ${uploadProgress}%` : 'Загрузить обложку'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => extraFileInputRef.current?.click()}
                  disabled={uploadTarget !== null}
                >
                  {uploadTarget === 'extra' ? `Загрузка ${uploadProgress}%` : 'Добавить фото в галерею'}
                </Button>
                {formState.headerPhotoLink ? (
                  <Button variant="secondary" onClick={() => {
                    void handleHeaderImageRemove();
                  }}>
                    Убрать обложку
                  </Button>
                ) : null}
              </div>
              <input
                ref={headerFileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                className={styles.hiddenInput}
                onChange={onHeaderFileInputChange}
              />
              <input
                ref={extraFileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                className={styles.hiddenInput}
                onChange={onExtraFileInputChange}
              />

              <Input
                label="URL обложки"
                value={formState.headerPhotoLink}
                onChange={(event) => setDraftField('headerPhotoLink', event.target.value)}
                placeholder="https://... или /media/articles/..."
                helperText="Можно вставить внешний URL или путь из загрузчика media."
              />

              {formState.extraPhotoLinks.length > 0 ? (
                <div className={styles.imageChips}>
                  {formState.extraPhotoLinks.map((imageUrl) => (
                    <div key={imageUrl} className={styles.imageChip}>
                      <a href={imageUrl} target="_blank" rel="noreferrer" className={styles.imageChipLink}>
                        {imageUrl}
                      </a>
                      <button
                        type="button"
                        className={styles.imageChipButton}
                        onClick={() => {
                          void handleExtraImageRemove(imageUrl);
                        }}
                      >
                        Удалить
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <Typography variant="bodyS" className={styles.metaText}>
                  Дополнительные изображения пока не добавлены.
                </Typography>
              )}
            </div>

            <div>
              <Typography variant="h4" as="h2">
                Абзацы статьи
              </Typography>
              <div className={styles.paragraphList}>
                {formState.paragraphs.map((paragraph, index) => (
                  <div key={`${index}-${paragraph.isSubtitle ? 'subtitle' : 'body'}`} className={styles.paragraphItem}>
                    <div className={styles.paragraphHeader}>
                      <Typography variant="bodyS">Блок {index + 1}</Typography>
                      <div className={styles.paragraphActions}>
                        <label className={styles.subtitleToggle}>
                          <input
                            type="checkbox"
                            checked={paragraph.isSubtitle}
                            onChange={(event) => handleParagraphSubtitleChange(index, event.target.checked)}
                          />
                          Подзаголовок
                        </label>
                        <button type="button" className={styles.paragraphActionButton} onClick={() => handleParagraphMove(index, -1)}>
                          Вверх
                        </button>
                        <button type="button" className={styles.paragraphActionButton} onClick={() => handleParagraphMove(index, 1)}>
                          Вниз
                        </button>
                        <button type="button" className={styles.paragraphActionButtonDanger} onClick={() => handleParagraphDelete(index)}>
                          Удалить
                        </button>
                      </div>
                    </div>
                    <textarea
                      className={styles.paragraphTextarea}
                      value={paragraph.text}
                      onChange={(event) => handleParagraphTextChange(index, event.target.value)}
                      rows={paragraph.isSubtitle ? 3 : 8}
                      placeholder={paragraph.isSubtitle ? 'Текст подзаголовка' : 'Текст абзаца'}
                    />
                  </div>
                ))}
              </div>
              <Button variant="secondary" onClick={handleParagraphAdd}>
                Добавить блок
              </Button>
            </div>

            <div>
              <Typography variant="h4" as="h2">
                Связанные грибы
              </Typography>
              <div className={styles.mushroomPicker}>
                <Input
                  label="Поиск гриба"
                  value={mushroomSearchInput}
                  onChange={(event) => setMushroomSearchInput(event.target.value)}
                  placeholder="Введите название гриба"
                  helperText="Начните вводить название и добавьте гриб в статью одним кликом."
                />
                <div className={styles.mushroomSearchResults}>
                  {normalizedMushroomSearchInput.length < 2 ? (
                    <Typography variant="bodyS" className={styles.metaText}>
                      Введите минимум 2 символа, чтобы найти грибы.
                    </Typography>
                  ) : mushroomSearchQuery.isLoading ? (
                    <Typography variant="bodyS" className={styles.metaText}>
                      Ищем грибы...
                    </Typography>
                  ) : mushroomSearchQuery.isError ? (
                    <Typography variant="bodyS" className={styles.metaText}>
                      Список грибов временно недоступен. Попробуйте позже.
                    </Typography>
                  ) : visibleMushroomSearchResults.length > 0 ? (
                    visibleMushroomSearchResults.map((mushroom) => (
                      <div key={mushroom.id} className={styles.mushroomSearchResultRow}>
                        <div className={styles.mushroomSearchResultInfo}>
                          <Typography variant="bodyS">{mushroom.name}</Typography>
                          <Typography variant="bodyS" className={styles.metaText}>
                            {mushroom.latinName ? `${mushroom.latinName} • ` : ''}
                            {mushroom.family}
                          </Typography>
                        </div>
                        <Button
                          variant="secondary"
                          onClick={() => handleMushroomLink(mushroom)}
                        >
                          Добавить
                        </Button>
                      </div>
                    ))
                  ) : (
                    <Typography variant="bodyS" className={styles.metaText}>
                      По запросу ничего не найдено.
                    </Typography>
                  )}
                </div>
              </div>
              {formState.linkedMushroomIds.length > 0 ? (
                <div className={styles.mushroomChips}>
                  {formState.linkedMushroomIds.map((mushroomId) => (
                    <div key={mushroomId} className={styles.mushroomChip}>
                      <div className={styles.mushroomChipInfo}>
                        <span className={styles.mushroomChipTitle}>
                          {linkedMushroomById[mushroomId]?.name ?? 'Гриб'}
                        </span>
                        <span className={styles.mushroomChipMeta}>
                          {linkedMushroomById[mushroomId]?.latinName ?? mushroomId}
                        </span>
                      </div>
                      <button type="button" onClick={() => handleMushroomUnlink(mushroomId)}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <Typography variant="bodyS" className={styles.metaText}>
                  Связи с грибами не добавлены.
                </Typography>
              )}
              {linkedMushroomLookupQuery.isLoading ? (
                <Typography variant="bodyS" className={styles.metaText}>
                  Подтягиваем названия уже привязанных грибов...
                </Typography>
              ) : null}
            </div>

            <div className={styles.bottomActions}>
              <Button
                onClick={() => {
                  void persistDraft();
                }}
                disabled={isAnyActionBusy}
              >
                {isSavingDraft ? 'Сохраняем...' : 'Сохранить черновик'}
              </Button>

              <Button
                variant="secondary"
                onClick={() => {
                  void handleSubmitForReview();
                }}
                disabled={!canSubmitForReview || isAnyActionBusy}
              >
                {isSubmittingForReview ? 'Отправляем...' : 'Отправить на модерацию'}
              </Button>

              <Button
                variant="secondary"
                onClick={() => {
                  void handleArchive();
                }}
                disabled={!isEditMode || !canArchive || isAnyActionBusy}
              >
                {isArchiving ? 'Архивируем...' : 'Архивировать'}
              </Button>
            </div>

            {canModerateInReview ? (
              <div className={styles.mediaSection}>
                <Typography variant="h4" as="h2">
                  Модерация статьи
                </Typography>

                <label className={styles.fieldBlock}>
                  <span className={styles.fieldLabel}>Комментарий модерации</span>
                  <textarea
                    className={styles.moderationTextarea}
                    rows={3}
                    value={moderationNote}
                    onChange={(event) => setModerationNote(event.target.value)}
                    placeholder="Причина отклонения или внутреннее замечание"
                  />
                </label>

                <div className={styles.bottomActions}>
                  {canPublish ? (
                    <Button
                      onClick={() => {
                        void handleModerationAction('Approve');
                      }}
                      disabled={isAnyActionBusy}
                    >
                      {moderatingDecision === 'Approve' ? 'Одобряем...' : 'Одобрить'}
                    </Button>
                  ) : null}

                  {canReject ? (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        void handleModerationAction('Reject');
                      }}
                      disabled={isAnyActionBusy}
                    >
                      {moderatingDecision === 'Reject' ? 'Отклоняем...' : 'Отклонить'}
                    </Button>
                  ) : null}

                  <Link to="/editor/review" className={styles.backLink}>
                    Открыть очередь модерации
                  </Link>
                </div>
              </div>
            ) : null}
            </Stack>
          </Card>

          <aside className={styles.previewColumn}>
            <Card className={styles.previewCard}>
              <Stack gap={14}>
                <div className={styles.previewHeader}>
                  <Typography variant="h4" as="h2">
                    Предпросмотр
                  </Typography>
                  <span className={`${styles.previewStatus} ${previewStatusClassName}`}>
                    {getArticleStatusLabel(status)}
                  </span>
                </div>

                <Typography variant="bodyS" className={styles.previewMeta}>
                  Публикация: {formatPreviewDate(formState.publishDateInput)}
                </Typography>

                <div className={styles.previewCover}>
                  {formState.headerPhotoLink.trim().length > 0 && !isPreviewHeaderImageBroken ? (
                    <img
                      src={formState.headerPhotoLink}
                      alt="Предпросмотр обложки статьи"
                      className={styles.previewCoverImage}
                      onError={() => setIsPreviewHeaderImageBroken(true)}
                    />
                  ) : (
                    <div className={styles.previewCoverFallback}>
                      Обложка пока не выбрана
                    </div>
                  )}
                </div>

                <Stack gap={6}>
                  <Typography variant="h3">{previewTitle}</Typography>
                  <Typography variant="bodyS" className={styles.previewMeta}>
                    Автор: {previewAuthor}
                  </Typography>
                  <Typography variant="bodyS" className={styles.previewMeta}>
                    Связанные грибы: {formState.linkedMushroomIds.length}
                  </Typography>
                </Stack>

                <div className={styles.previewParagraphs}>
                  {previewParagraphs.visible.length > 0 ? (
                    previewParagraphs.visible.map((paragraph, index) => (
                      <Typography
                        key={`${index}-${paragraph.isSubtitle ? 'subtitle' : 'body'}`}
                        variant={paragraph.isSubtitle ? 'h4' : 'bodyS'}
                        className={paragraph.isSubtitle ? styles.previewSubtitle : styles.previewBody}
                      >
                        {paragraph.text}
                      </Typography>
                    ))
                  ) : (
                    <Typography variant="bodyS" className={styles.previewMeta}>
                      Начните писать текст, и здесь появится живой предпросмотр.
                    </Typography>
                  )}
                </div>

                {previewParagraphs.hiddenCount > 0 ? (
                  <Typography variant="bodyS" className={styles.previewMeta}>
                    Еще блоков: {previewParagraphs.hiddenCount}
                  </Typography>
                ) : null}

                {previewGalleryImages.length > 0 ? (
                  <div className={styles.previewGallery}>
                    <Typography variant="bodyS" className={styles.previewMeta}>
                      Галерея ({formState.extraPhotoLinks.length})
                    </Typography>
                    <div className={styles.previewGalleryGrid}>
                      {previewGalleryImages.map((imageUrl, index) => (
                        <a
                          key={`${imageUrl}-${index}`}
                          href={imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.previewGalleryChip}
                        >
                          Фото {index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}
              </Stack>
            </Card>
          </aside>
        </div>
      </Container>
    </PageLayout>
  );
}
