import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { Mushroom } from '@entities/mushroom';
import { useSession, hasAnyPermission, PERMISSION_CODES } from '@entities/session';
import { getMushroomById } from '@features/mushrooms';
import {
  archiveMushroom,
  createDraft,
  deleteMushroomImage,
  getEditorMushroom,
  moderateMushroom,
  submitForReview,
  updateDraft,
  uploadMushroomImage,
  type EditorMushroomPayload,
  type EditorMushroomRevision,
  type MushroomModerationDecision,
  type MushroomRevisionStatus
} from '@features/mushroom-editor';
import { ApiError } from '@shared/api';
import { Button, Card, Container, Checkbox, ContentState, Input, Stack, Tag, Typography, useToast } from '@shared/ui';
import { PageLayout } from '@widgets/layout';
import styles from './EditorMushroomFormPage.module.css';

interface EditorMushroomFormPageProps {
  storybookRevision?: EditorMushroomRevision | null;
  storybookSource?: Mushroom | null;
}

interface MushroomFormState {
  revisionId: string | null;
  sourceMushroomId: string | null;
  status: MushroomRevisionStatus;
  name: string;
  synonymousName: string;
  latinName: string;
  family: string;
  redBook: boolean;
  eatable: string;
  hasStem: boolean;
  stemSizeFrom: string;
  stemSizeTo: string;
  stemType: string;
  stemColor: string;
  capType: string;
  capColor: string;
  capUndersideType: string;
  description: string;
  headerPhotoLink: string;
  extraPhotoLinks: string[];
  doppelgangerNames: string[];
}

type SaveMode = 'idle' | 'saving' | 'submitting' | 'archiving' | 'uploading';
type UploadTarget = 'header' | 'extra' | null;

const EATABLE_OPTIONS = ['Съедобный', 'Полусъедобный', 'Несъедобный', 'Неизвестно'];
const STORYBOOK_TOKEN = 'storybook-token';

function splitLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function joinLines(values: string[]): string {
  return values.join('\n');
}

function toNumberOrNull(value: string): number | null {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return null;
  }

  const parsedValue = Number(trimmedValue);
  return Number.isFinite(parsedValue) ? parsedValue : null;
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

function createInitialState(sourceMushroomId: string | null = null): MushroomFormState {
  return {
    revisionId: null,
    sourceMushroomId,
    status: 'Draft',
    name: '',
    synonymousName: '',
    latinName: '',
    family: '',
    redBook: false,
    eatable: 'Съедобный',
    hasStem: true,
    stemSizeFrom: '',
    stemSizeTo: '',
    stemType: '',
    stemColor: '',
    capType: '',
    capColor: '',
    capUndersideType: '',
    description: '',
    headerPhotoLink: '',
    extraPhotoLinks: [],
    doppelgangerNames: []
  };
}

function revisionToState(revision: EditorMushroomRevision): MushroomFormState {
  return {
    revisionId: revision.revisionId,
    sourceMushroomId: revision.sourceMushroomId,
    status: revision.status,
    name: revision.name,
    synonymousName: revision.synonymousName ?? '',
    latinName: revision.latinName ?? '',
    family: revision.family,
    redBook: revision.redBook,
    eatable: revision.eatable,
    hasStem: revision.hasStem,
    stemSizeFrom: revision.stemSizeFrom?.toString() ?? '',
    stemSizeTo: revision.stemSizeTo?.toString() ?? '',
    stemType: revision.stemType ?? '',
    stemColor: revision.stemColor ?? '',
    capType: revision.capType,
    capColor: revision.capColor,
    capUndersideType: revision.capUndersideType,
    description: revision.description,
    headerPhotoLink: revision.headerPhotoLink ?? '',
    extraPhotoLinks: [...revision.extraPhotoLinks],
    doppelgangerNames: [...revision.doppelgangerNames]
  };
}

function mushroomToState(mushroom: Mushroom, sourceMushroomId: string): MushroomFormState {
  return {
    ...createInitialState(sourceMushroomId),
    name: mushroom.name,
    synonymousName: mushroom.synonymousName ?? '',
    latinName: mushroom.latinName ?? '',
    family: mushroom.family,
    redBook: mushroom.redBook,
    eatable: mushroom.eatable,
    hasStem: mushroom.hasStem,
    stemSizeFrom: mushroom.stemSizeFrom?.toString() ?? '',
    stemSizeTo: mushroom.stemSizeTo?.toString() ?? '',
    stemType: mushroom.stemType ?? '',
    stemColor: mushroom.stemColor ?? '',
    capType: mushroom.capType,
    capColor: mushroom.capColor,
    capUndersideType: mushroom.capUndersideType,
    description: mushroom.description,
    headerPhotoLink: mushroom.headerPhotoLink ?? '',
    extraPhotoLinks: [...mushroom.extraPhotoLinks],
    doppelgangerNames: mushroom.doppelgangers.map((doppelganger) => doppelganger.doppelgangerName)
  };
}

function buildPayload(state: MushroomFormState): EditorMushroomPayload {
  return {
    sourceMushroomId: state.sourceMushroomId,
    name: state.name,
    synonymousName: state.synonymousName.trim() || null,
    latinName: state.latinName.trim() || null,
    family: state.family,
    redBook: state.redBook,
    eatable: state.eatable,
    hasStem: state.hasStem,
    stemSizeFrom: toNumberOrNull(state.stemSizeFrom),
    stemSizeTo: toNumberOrNull(state.stemSizeTo),
    stemType: state.stemType.trim() || null,
    stemColor: state.stemColor.trim() || null,
    capType: state.capType,
    capColor: state.capColor,
    capUndersideType: state.capUndersideType,
    description: state.description,
    headerPhotoLink: state.headerPhotoLink.trim() || null,
    extraPhotoLinks: state.extraPhotoLinks,
    doppelgangers: state.doppelgangerNames
  };
}

function toReadableEditorErrorMessage(error: unknown, fallbackMessage: string): string {
  const rawMessage = error instanceof Error ? error.message : fallbackMessage;
  const normalizedMessage = rawMessage.trim();

  if (!normalizedMessage) {
    return fallbackMessage;
  }

  const noFormatPrefix = normalizedMessage.replace(/^Incorrect data format:\s*/i, '').trim();
  const translations: Record<string, string> = {
    "Extra photo links string can't be longer than 1024 characters":
      'Список дополнительных фотографий слишком длинный. Сократите количество ссылок.',
    "Photo link must be a valid image link (absolute URL or /media/mushrooms/* path)":
      'Ссылка на фото должна вести на изображение. Используйте абсолютный URL или путь /media/mushrooms/...',
    "Header photo link must be a valid image link (absolute URL or /media/mushrooms/* path)":
      'Ссылка на главное фото должна вести на изображение. Используйте абсолютный URL или путь /media/mushrooms/...',
    'Header photo link is required for mushroom status other than Draft':
      'Чтобы отправить ревизию на модерацию, добавьте главное фото.',
    'Header photo is required before submitting mushroom revision for review':
      'Перед отправкой на модерацию добавьте главное фото.',
    'Header photo is required before approval':
      'Перед публикацией добавьте главное фото.',
    'Only Draft or Rejected mushroom revision can be submitted for review':
      'На модерацию можно отправить только черновик или отклоненную ревизию.',
    'Mushroom revision status does not allow draft update':
      'Эту ревизию нельзя обновить. Создайте новую версию гриба.',
    'Unable to archive mushroom revision from current status':
      'Архивировать можно только опубликованную или отклоненную ревизию.',
    "If the mushroom doesn't have a stem information about its stem isn't needed":
      'Если у гриба нет ножки, поля ножки можно не заполнять.',
    'If the mushroom has a stem information about its stem is needed':
      'Если у гриба есть ножка, заполните все поля ножки.',
    "Mushroom name can't be longer than 128 characters or empty":
      'Укажите название гриба.',
    "Family can't be longer than 128 characters or empty":
      'Укажите семейство гриба.'
  };

  return (translations[noFormatPrefix] ?? noFormatPrefix) || normalizedMessage;
}

export function EditorMushroomFormPage({ storybookRevision, storybookSource }: EditorMushroomFormPageProps) {
  const { revisionId: routeRevisionId } = useParams();
  const [searchParams] = useSearchParams();
  const sourceMushroomId = searchParams.get('sourceMushroomId');
  const navigate = useNavigate();
  const { token, user, signOut } = useSession();
  const { showError } = useToast();

  const isEditMode = Boolean(routeRevisionId);
  const [formState, setFormState] = useState<MushroomFormState>(() =>
    createInitialState(sourceMushroomId ?? null)
  );
  const [reviewNote, setReviewNote] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [publishedLink, setPublishedLink] = useState<string | null>(null);
  const [moderationNote, setModerationNote] = useState('');
  const [moderatingAction, setModeratingAction] = useState<MushroomModerationDecision | null>(null);
  const [saveMode, setSaveMode] = useState<SaveMode>('idle');
  const [uploadTarget, setUploadTarget] = useState<UploadTarget>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedMediaPathByUrl, setUploadedMediaPathByUrl] = useState<Record<string, string>>({});
  const [isPreviewHeaderBroken, setIsPreviewHeaderBroken] = useState(false);

  const headerFileInputRef = useRef<HTMLInputElement | null>(null);
  const extraFileInputRef = useRef<HTMLInputElement | null>(null);
  const isHydratedRef = useRef(false);

  const editorRevisionQuery = useQuery({
    queryKey: ['editor', 'mushroom', routeRevisionId ?? 'new', token ?? 'missing-token'],
    enabled: Boolean(isEditMode && token && routeRevisionId && !storybookRevision),
    queryFn: () => getEditorMushroom(routeRevisionId!, token!)
  });

  const sourceMushroomQuery = useQuery({
    queryKey: ['editor', 'mushroom-source', sourceMushroomId ?? 'none'],
    enabled: Boolean(!routeRevisionId && sourceMushroomId && !storybookRevision && !storybookSource),
    queryFn: () => getMushroomById(sourceMushroomId!)
  });

  const activePermissions = user?.permissions ?? [];
  const canArchive = hasAnyPermission(activePermissions, [PERMISSION_CODES.mushroomsArchive, PERMISSION_CODES.mushroomsManageAny]);
  const canReject = hasAnyPermission(activePermissions, [PERMISSION_CODES.mushroomsReview]);
  const canPublish = hasAnyPermission(activePermissions, [PERMISSION_CODES.mushroomsPublish]);
  const canEditStatus = !routeRevisionId || formState.status === 'Draft' || formState.status === 'Rejected';
  const canModerateInReview = Boolean(routeRevisionId && formState.status === 'InReview' && (canReject || canPublish));

  useEffect(() => {
    if (isHydratedRef.current) {
      return;
    }

    if (storybookRevision) {
      isHydratedRef.current = true;
      setFormState(revisionToState(storybookRevision));
      setReviewNote(storybookRevision.reviewNote);
      return;
    }

    if (storybookSource && sourceMushroomId) {
      isHydratedRef.current = true;
      setFormState(mushroomToState(storybookSource, sourceMushroomId));
      return;
    }

    if (editorRevisionQuery.data) {
      isHydratedRef.current = true;
      setFormState(revisionToState(editorRevisionQuery.data));
      setReviewNote(editorRevisionQuery.data.reviewNote);
      return;
    }

    if (sourceMushroomQuery.data && sourceMushroomId) {
      isHydratedRef.current = true;
      setFormState(mushroomToState(sourceMushroomQuery.data, sourceMushroomId));
    }
  }, [editorRevisionQuery.data, sourceMushroomId, sourceMushroomQuery.data, storybookRevision, storybookSource]);

  const handleSessionExpired = useCallback(() => {
    signOut();
    navigate('/login', { replace: true, state: { reason: 'session-expired' } });
  }, [navigate, signOut]);

  useEffect(() => {
    if (!editorRevisionQuery.error) {
      return;
    }

    if (editorRevisionQuery.error instanceof ApiError && editorRevisionQuery.error.status === 401) {
      handleSessionExpired();
      return;
    }

    showError(
      toReadableEditorErrorMessage(editorRevisionQuery.error, 'Не удалось загрузить гриб для редактирования.'),
      { title: 'Редактор грибов' }
    );
  }, [editorRevisionQuery.error, handleSessionExpired, showError]);

  useEffect(() => {
    if (!sourceMushroomQuery.error) {
      return;
    }

    showError(
      sourceMushroomQuery.error instanceof Error ? sourceMushroomQuery.error.message : 'Не удалось загрузить источник для новой ревизии.',
      { title: 'Редактор грибов' }
    );
  }, [showError, sourceMushroomQuery.error]);

  function updateField<K extends keyof MushroomFormState>(field: K, value: MushroomFormState[K]) {
    setFormState((previousState) => ({ ...previousState, [field]: value }));
  }

  function handleStemToggle(nextValue: boolean) {
    setFormState((previousState) => ({
      ...previousState,
      hasStem: nextValue,
      stemSizeFrom: nextValue ? previousState.stemSizeFrom : '',
      stemSizeTo: nextValue ? previousState.stemSizeTo : '',
      stemType: nextValue ? previousState.stemType : '',
      stemColor: nextValue ? previousState.stemColor : ''
    }));
  }

  function handleLineListChange(field: 'extraPhotoLinks' | 'doppelgangerNames', value: string) {
    setFormState((previousState) => ({
      ...previousState,
      [field]: splitLines(value)
    }));
  }

  function buildValidationMessage(payload: EditorMushroomPayload, requireHeaderPhoto: boolean): string | null {
    if (!payload.name.trim()) {
      return 'Укажите название гриба.';
    }

    if (!payload.family.trim()) {
      return 'Укажите семейство гриба.';
    }

    if (!payload.capType.trim() || !payload.capColor.trim() || !payload.capUndersideType.trim()) {
      return 'Заполните поля шляпки гриба.';
    }

    if (payload.hasStem && (!payload.stemType || !payload.stemColor || payload.stemSizeFrom === null || payload.stemSizeTo === null)) {
      return 'Заполните все поля ножки гриба.';
    }

    if (requireHeaderPhoto && !payload.headerPhotoLink) {
      return 'Добавьте главное фото перед отправкой на модерацию.';
    }

    return null;
  }

  async function handleUploadImage(target: 'header' | 'extra', file: File) {
    if (!token || token === STORYBOOK_TOKEN) {
      return;
    }

    setFeedbackMessage(null);
    setUploadTarget(target);
    setUploadProgress(0);

    try {
      const result = await uploadMushroomImage(file, token, setUploadProgress);
      const nextUrl = result.mediaUrl.trim();
      if (!nextUrl) {
        throw new Error('Сервер не вернул ссылку на изображение.');
      }

      setUploadedMediaPathByUrl((previousState) => ({
        ...previousState,
        [nextUrl]: result.mediaPath
      }));

      setFormState((previousState) => ({
        ...previousState,
        headerPhotoLink: target === 'header' ? nextUrl : previousState.headerPhotoLink,
        extraPhotoLinks: target === 'extra' && !previousState.extraPhotoLinks.includes(nextUrl)
          ? [...previousState.extraPhotoLinks, nextUrl]
          : previousState.extraPhotoLinks
      }));

      setFeedbackMessage(target === 'header' ? 'Главное фото обновлено.' : 'Фото добавлено в галерею.');
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        handleSessionExpired();
        return;
      }

      showError(toReadableEditorErrorMessage(error, 'Не удалось загрузить изображение.'), { title: 'Редактор грибов' });
    } finally {
      setUploadTarget(null);
      setUploadProgress(0);
    }
  }

  async function handleDeleteImageByUrl(url: string) {
    if (!token || token === STORYBOOK_TOKEN) {
      return;
    }

    const mediaPath = uploadedMediaPathByUrl[url];
    if (!mediaPath) {
      return;
    }

    try {
      await deleteMushroomImage(mediaPath, token);
      setUploadedMediaPathByUrl((previousState) => {
        const nextState = { ...previousState };
        delete nextState[url];
        return nextState;
      });
    } catch {
      // ignore media cleanup failures so the form stays usable
    }
  }

  async function handleHeaderImageRemove() {
    const currentUrl = formState.headerPhotoLink;
    updateField('headerPhotoLink', '');
    await handleDeleteImageByUrl(currentUrl);
  }

  async function handleExtraImageRemove(imageUrl: string) {
    updateField(
      'extraPhotoLinks',
      formState.extraPhotoLinks.filter((url) => url !== imageUrl)
    );
    await handleDeleteImageByUrl(imageUrl);
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

  async function persistDraft(options?: { requireHeaderPhoto?: boolean }): Promise<string | null> {
    if (!token || token === STORYBOOK_TOKEN) {
      return null;
    }

    const payload = buildPayload(formState);
    const validationMessage = buildValidationMessage(payload, Boolean(options?.requireHeaderPhoto));
    if (validationMessage) {
      showError(validationMessage, { title: 'Проверьте форму' });
      return null;
    }

    setFeedbackMessage(null);
    setSaveMode('saving');

    try {
      if (routeRevisionId) {
        const result = await updateDraft(routeRevisionId, payload, token);
        updateField('status', result.status as MushroomRevisionStatus);
        setFeedbackMessage('Черновик сохранён.');
        return routeRevisionId;
      }

      const result = await createDraft(payload, token);
      updateField('status', result.status as MushroomRevisionStatus);
      setFeedbackMessage('Черновик создан.');
      navigate(`/editor/mushrooms/${result.createdRevisionId}/edit`, { replace: true });
      return result.createdRevisionId;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        handleSessionExpired();
        return null;
      }

      showError(toReadableEditorErrorMessage(error, 'Не удалось сохранить черновик.'), { title: 'Редактор грибов' });
      return null;
    } finally {
      setSaveMode('idle');
    }
  }

  async function handleSubmitForReview() {
    if (!token || token === STORYBOOK_TOKEN) {
      return;
    }

    setSaveMode('submitting');
    setFeedbackMessage(null);

    try {
      const revisionId = await persistDraft({ requireHeaderPhoto: true });
      if (!revisionId) {
        return;
      }

      const result = await submitForReview(revisionId, token);
      updateField('status', result.status as MushroomRevisionStatus);
      setFeedbackMessage('Ревизия отправлена на модерацию.');
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        handleSessionExpired();
        return;
      }

      showError(toReadableEditorErrorMessage(error, 'Не удалось отправить ревизию на модерацию.'), {
        title: 'Редактор грибов'
      });
    } finally {
      setSaveMode('idle');
    }
  }

  async function handleArchive() {
    if (!token || token === STORYBOOK_TOKEN || !routeRevisionId || !canArchive) {
      return;
    }

    setSaveMode('archiving');
    setFeedbackMessage(null);

    try {
      const result = await archiveMushroom(routeRevisionId, token);
      updateField('status', result.status as MushroomRevisionStatus);
      setFeedbackMessage('Ревизия отправлена в архив.');
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        handleSessionExpired();
        return;
      }

      showError(toReadableEditorErrorMessage(error, 'Не удалось архивировать ревизию.'), {
        title: 'Редактор грибов'
      });
    } finally {
      setSaveMode('idle');
    }
  }

  async function handleModerationAction(decision: MushroomModerationDecision) {
    if (!token || token === STORYBOOK_TOKEN || !routeRevisionId) {
      return;
    }

    if (decision === 'Approve' && !canPublish) {
      return;
    }

    if (decision === 'Reject' && !canReject) {
      return;
    }

    setFeedbackMessage(null);
    setPublishedLink(null);
    setModeratingAction(decision);

    try {
      const result = await moderateMushroom(routeRevisionId, decision, moderationNote, token);
      updateField('status', result.status as MushroomRevisionStatus);
      setReviewNote(moderationNote.trim() || null);

      if (decision === 'Approve' && result.publishedMushroomId) {
        setPublishedLink(`/mushrooms/${result.publishedMushroomId}`);
      }

      setFeedbackMessage(decision === 'Approve' ? 'Ревизия одобрена.' : 'Ревизия отклонена.');
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        handleSessionExpired();
        return;
      }

      showError(toReadableEditorErrorMessage(error, 'Не удалось применить решение модерации.'), {
        title: 'Редактор грибов'
      });
    } finally {
      setModeratingAction(null);
    }
  }

  const previewHeaderUrl = formState.headerPhotoLink.trim();
  const previewExtraPhotoLinks = formState.extraPhotoLinks;
  const previewDoppelgangers = formState.doppelgangerNames;
  const isBusy = saveMode !== 'idle' || uploadTarget !== null || moderatingAction !== null;

  return (
    <PageLayout>
      <Container size="xl" className={styles.container}>
        <div className={styles.topRow}>
          <Stack gap={8}>
            <Typography variant="h1">{isEditMode ? 'Редактирование гриба' : 'Новая ревизия гриба'}</Typography>
            <Typography variant="bodyS" className={styles.metaText}>
              Статус: {getStatusLabel(formState.status)}
            </Typography>
          </Stack>
          <Link to="/editor/mushrooms?scope=drafts" className={styles.backLink}>
            К списку ревизий
          </Link>
        </div>

        {reviewNote ? (
          <Card className={styles.noticeCard}>
            <Typography variant="bodyS">Комментарий модерации: {reviewNote}</Typography>
          </Card>
        ) : null}

        {feedbackMessage ? (
          <Card className={styles.noticeCard}>
            <Stack gap={8}>
              <Typography variant="bodyS" className={styles.successText}>
                {feedbackMessage}
              </Typography>
              {publishedLink ? (
                <Link to={publishedLink} className={styles.backLink}>
                  Открыть опубликованный гриб
                </Link>
              ) : null}
            </Stack>
          </Card>
        ) : null}

        {editorRevisionQuery.isLoading || sourceMushroomQuery.isLoading ? (
          <ContentState tone="loading" className={styles.stateCard} title="Загружаем ревизию гриба..." />
        ) : null}

        <div className={styles.workspace}>
          <Card className={styles.formCard}>
            <Stack gap={18}>
              <Input
                label="Название"
                value={formState.name}
                onChange={(event) => updateField('name', event.target.value)}
                placeholder="Введите название гриба"
              />

              <div className={styles.formGrid}>
                <Input
                  label="Синоним"
                  value={formState.synonymousName}
                  onChange={(event) => updateField('synonymousName', event.target.value)}
                  placeholder="Синонимичное название"
                />
                <Input
                  label="Латинское название"
                  value={formState.latinName}
                  onChange={(event) => updateField('latinName', event.target.value)}
                  placeholder="Latin name"
                />
              </div>

              <div className={styles.formGrid}>
                <Input
                  label="Семейство"
                  value={formState.family}
                  onChange={(event) => updateField('family', event.target.value)}
                  placeholder="Семейство гриба"
                />
                <Input
                  label="Съедобность"
                  list="eatable-options"
                  value={formState.eatable}
                  onChange={(event) => updateField('eatable', event.target.value)}
                  placeholder="Выберите вариант"
                />
                <datalist id="eatable-options">
                  {EATABLE_OPTIONS.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
                <Checkbox
                  label="Красная книга"
                  checked={formState.redBook}
                  onChange={(event) => updateField('redBook', event.target.checked)}
                />
                <Checkbox
                  label="Есть ножка"
                  checked={formState.hasStem}
                  onChange={(event) => handleStemToggle(event.target.checked)}
                />
              </div>

              <div className={styles.formGrid}>
                <Input
                  type="number"
                  label="Ножка от"
                  value={formState.stemSizeFrom}
                  onChange={(event) => updateField('stemSizeFrom', event.target.value)}
                  disabled={!formState.hasStem}
                />
                <Input
                  type="number"
                  label="Ножка до"
                  value={formState.stemSizeTo}
                  onChange={(event) => updateField('stemSizeTo', event.target.value)}
                  disabled={!formState.hasStem}
                />
                <Input
                  label="Тип ножки"
                  value={formState.stemType}
                  onChange={(event) => updateField('stemType', event.target.value)}
                  disabled={!formState.hasStem}
                />
                <Input
                  label="Цвет ножки"
                  value={formState.stemColor}
                  onChange={(event) => updateField('stemColor', event.target.value)}
                  disabled={!formState.hasStem}
                />
              </div>

              <div className={styles.formGrid}>
                <Input
                  label="Тип шляпки"
                  value={formState.capType}
                  onChange={(event) => updateField('capType', event.target.value)}
                />
                <Input
                  label="Цвет шляпки"
                  value={formState.capColor}
                  onChange={(event) => updateField('capColor', event.target.value)}
                />
                <Input
                  label="Нижняя поверхность шляпки"
                  value={formState.capUndersideType}
                  onChange={(event) => updateField('capUndersideType', event.target.value)}
                />
              </div>

              <label className={styles.fieldBlock}>
                <span className={styles.fieldLabel}>Описание</span>
                <textarea
                  className={styles.textarea}
                  value={formState.description}
                  onChange={(event) => updateField('description', event.target.value)}
                  rows={8}
                  placeholder="Кратко опишите гриб"
                />
              </label>

              <div className={styles.mediaSection}>
                <Typography variant="h4" as="h2">
                  Изображения
                </Typography>
                <div className={styles.mediaControls}>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => headerFileInputRef.current?.click()}
                    disabled={isBusy}
                  >
                    {uploadTarget === 'header' ? `Загрузка ${uploadProgress}%` : 'Загрузить главное фото'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => extraFileInputRef.current?.click()}
                    disabled={isBusy}
                  >
                    {uploadTarget === 'extra' ? `Загрузка ${uploadProgress}%` : 'Добавить фото'}
                  </Button>
                  {formState.headerPhotoLink ? (
                    <Button type="button" variant="secondary" onClick={() => void handleHeaderImageRemove()} disabled={isBusy}>
                      Убрать главное фото
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
                  label="URL главного фото"
                  value={formState.headerPhotoLink}
                  onChange={(event) => updateField('headerPhotoLink', event.target.value)}
                  placeholder="https://... или /media/mushrooms/..."
                />

                <label className={styles.fieldBlock}>
                  <span className={styles.fieldLabel}>Дополнительные фото</span>
                  <textarea
                    className={styles.textarea}
                    rows={4}
                    value={joinLines(formState.extraPhotoLinks)}
                    onChange={(event) => handleLineListChange('extraPhotoLinks', event.target.value)}
                    placeholder="Одна ссылка на строку"
                  />
                </label>

                {formState.extraPhotoLinks.length > 0 ? (
                  <div className={styles.imageList}>
                    {formState.extraPhotoLinks.map((imageUrl) => (
                      <div key={imageUrl} className={styles.imageRow}>
                        <a href={imageUrl} target="_blank" rel="noreferrer" className={styles.imageLink}>
                          {imageUrl}
                        </a>
                        <button
                          type="button"
                          className={styles.removeButton}
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
                    Дополнительных фото пока нет.
                  </Typography>
                )}
              </div>

              <div>
                <Typography variant="h4" as="h2">
                  Двойники
                </Typography>
                <label className={styles.fieldBlock}>
                  <span className={styles.fieldLabel}>Список двойников</span>
                  <textarea
                    className={styles.textarea}
                    rows={4}
                    value={joinLines(formState.doppelgangerNames)}
                    onChange={(event) => handleLineListChange('doppelgangerNames', event.target.value)}
                    placeholder="Одна строка - одно название"
                  />
                </label>
              </div>

              <div className={styles.bottomActions}>
                <Button
                  type="button"
                  onClick={() => {
                    void persistDraft();
                  }}
                  disabled={saveMode !== 'idle' || uploadTarget !== null || !canEditStatus}
                >
                  {saveMode === 'saving' ? 'Сохраняем...' : 'Сохранить черновик'}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    void handleSubmitForReview();
                  }}
                  disabled={saveMode !== 'idle' || uploadTarget !== null || !canEditStatus}
                >
                  {saveMode === 'submitting' ? 'Отправляем...' : 'Отправить на модерацию'}
                </Button>

                {canArchive && routeRevisionId && (formState.status === 'Published' || formState.status === 'Rejected') ? (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      void handleArchive();
                    }}
                    disabled={saveMode !== 'idle' || uploadTarget !== null}
                  >
                    {saveMode === 'archiving' ? 'Архивируем...' : 'Архивировать'}
                  </Button>
                ) : null}
              </div>

              {canModerateInReview ? (
                <div className={styles.mediaSection}>
                  <Typography variant="h4" as="h2">
                    Модерация ревизии
                  </Typography>
                  <label className={styles.fieldBlock}>
                    <span className={styles.fieldLabel}>Комментарий модерации</span>
                    <textarea
                      className={styles.textarea}
                      rows={3}
                      value={moderationNote}
                      onChange={(event) => setModerationNote(event.target.value)}
                      placeholder="Причина отклонения или внутреннее замечание"
                    />
                  </label>

                  <div className={styles.bottomActions}>
                    {canPublish ? (
                      <Button
                        type="button"
                        onClick={() => {
                          void handleModerationAction('Approve');
                        }}
                        disabled={isBusy}
                      >
                        {moderatingAction === 'Approve' ? 'Одобряем...' : 'Одобрить'}
                      </Button>
                    ) : null}

                    {canReject ? (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          void handleModerationAction('Reject');
                        }}
                        disabled={isBusy}
                      >
                        {moderatingAction === 'Reject' ? 'Отклоняем...' : 'Отклонить'}
                      </Button>
                    ) : null}

                    <Link to="/editor/mushrooms/review" className={styles.backLink}>
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
                  <Tag tone={getStatusTone(formState.status)}>{getStatusLabel(formState.status)}</Tag>
                </div>

                {formState.sourceMushroomId ? (
                  <Typography variant="bodyS" className={styles.previewMeta}>
                    Источник: {formState.sourceMushroomId}
                  </Typography>
                ) : null}

                <div className={styles.previewCover}>
                  {previewHeaderUrl && !isPreviewHeaderBroken ? (
                    <img
                      src={previewHeaderUrl}
                      alt="Предпросмотр главного фото гриба"
                      className={styles.previewCoverImage}
                      onError={() => setIsPreviewHeaderBroken(true)}
                    />
                  ) : (
                    <div className={styles.previewCoverFallback}>Главное фото пока не выбрано</div>
                  )}
                </div>

                <Stack gap={6}>
                  <Typography variant="h3">{formState.name || 'Название гриба'}</Typography>
                  <Typography variant="bodyS" className={styles.previewMeta}>
                    {formState.latinName || 'Latin name'} • {formState.family || 'Семейство'}
                  </Typography>
                  <Typography variant="bodyS" className={styles.previewMeta}>
                    {formState.eatable} • {formState.redBook ? 'Красная книга' : 'Обычный вид'}
                  </Typography>
                </Stack>

                <Typography variant="bodyS" className={styles.previewDescription}>
                  {formState.description || 'Описание появится здесь после заполнения формы.'}
                </Typography>

                <div className={styles.previewGrid}>
                  <div>
                    <Typography variant="caption" className={styles.previewLabel}>
                      Ножка
                    </Typography>
                    <Typography variant="bodyS" className={styles.previewMeta}>
                      {formState.hasStem
                        ? `${formState.stemSizeFrom || '—'}–${formState.stemSizeTo || '—'} мм`
                        : 'Не указана'}
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="caption" className={styles.previewLabel}>
                      Шляпка
                    </Typography>
                    <Typography variant="bodyS" className={styles.previewMeta}>
                      {formState.capType || 'Тип'} • {formState.capColor || 'Цвет'}
                    </Typography>
                  </div>
                </div>

                <div className={styles.previewGallery}>
                  <Typography variant="caption" className={styles.previewLabel}>
                    Фото
                  </Typography>
                  {previewExtraPhotoLinks.length > 0 ? (
                    <div className={styles.previewPills}>
                      {previewExtraPhotoLinks.map((imageUrl, index) => (
                        <a key={`${imageUrl}-${index}`} href={imageUrl} target="_blank" rel="noreferrer" className={styles.previewPill}>
                          Фото {index + 1}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <Typography variant="bodyS" className={styles.previewMeta}>
                      Дополнительных фото нет.
                    </Typography>
                  )}
                </div>

                <div className={styles.previewGallery}>
                  <Typography variant="caption" className={styles.previewLabel}>
                    Двойники
                  </Typography>
                  {previewDoppelgangers.length > 0 ? (
                    <div className={styles.previewPills}>
                      {previewDoppelgangers.map((name) => (
                        <span key={name} className={styles.previewPill}>
                          {name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <Typography variant="bodyS" className={styles.previewMeta}>
                      Двойники не указаны.
                    </Typography>
                  )}
                </div>

                {formState.status === 'Rejected' && reviewNote ? (
                  <Card className={styles.reviewNoteCard}>
                    <Typography variant="bodyS">Комментарий модерации: {reviewNote}</Typography>
                  </Card>
                ) : null}
              </Stack>
            </Card>
          </aside>
        </div>
      </Container>
    </PageLayout>
  );
}
