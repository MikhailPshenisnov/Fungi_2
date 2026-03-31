import { PERMISSION_CODES } from './permission-codes';

export type BaseProfileTabKey = 'profile' | 'favorites' | 'history';
export type RoleProfileTabKey =
  | 'editor-materials'
  | 'editor-drafts'
  | 'ja-moderation'
  | 'mushroom-materials'
  | 'mushroom-drafts'
  | 'mushroom-moderation'
  | 'ja-reports'
  | 'ja-users-read'
  | 'admin-users-roles'
  | 'admin-action-logs'
  | 'su-system'
  | 'su-audit'
  | 'su-config';
export type ProfileTabKey = BaseProfileTabKey | RoleProfileTabKey;

export interface ProfileTabDefinition {
  key: ProfileTabKey;
  label: string;
  title: string;
  subtitle: string;
  routePath?: string;
  requiredPermission?: string;
  requiredAnyPermissions?: string[];
  placeholderTitle?: string;
  placeholderDescription?: string;
  emptyState?: string;
}

const tabByKey: Record<ProfileTabKey, ProfileTabDefinition> = {
  profile: {
    key: 'profile',
    label: 'Профиль',
    title: 'Профиль пользователя',
    subtitle: 'Личный кабинет'
  },
  favorites: {
    key: 'favorites',
    label: 'Избранное',
    title: 'Избранное',
    subtitle: 'Сохраненные грибы и статьи',
    placeholderTitle: 'Избранное скоро появится в полном формате',
    placeholderDescription: 'Здесь будут карточки грибов и статьи, которые вы отметили как важные.',
    emptyState: 'Пока нет сохранений.'
  },
  history: {
    key: 'history',
    label: 'История просмотров',
    title: 'История просмотров',
    subtitle: 'Недавно открытые материалы',
    placeholderTitle: 'История просмотров пока в разработке',
    placeholderDescription: 'Здесь будет список материалов, которые вы открывали последними.',
    emptyState: 'Пока нет просмотренных материалов.'
  },
  'editor-materials': {
    key: 'editor-materials',
    label: 'Мои материалы',
    title: 'Мои материалы',
    subtitle: 'Раздел редактора',
    routePath: '/editor/articles?scope=materials',
    requiredPermission: PERMISSION_CODES.articlesWrite,
    placeholderTitle: 'Рабочий список публикаций',
    placeholderDescription: 'Вкладка будет содержать созданные и опубликованные вами материалы.',
    emptyState: 'Пока нет созданных публикаций.'
  },
  'editor-drafts': {
    key: 'editor-drafts',
    label: 'Черновики',
    title: 'Черновики',
    subtitle: 'Раздел редактора',
    routePath: '/editor/articles?scope=drafts',
    requiredPermission: PERMISSION_CODES.articlesWrite,
    placeholderTitle: 'Черновики редактора',
    placeholderDescription: 'Здесь появятся ваши незавершенные материалы и черновые версии.',
    emptyState: 'Черновиков пока нет.'
  },
  'ja-moderation': {
    key: 'ja-moderation',
    label: 'Модерация',
    title: 'Модерация',
    subtitle: 'Раздел модератора',
    routePath: '/editor/review',
    requiredPermission: PERMISSION_CODES.articlesReview,
    placeholderTitle: 'Панель модерации',
    placeholderDescription: 'Будут доступны действия по проверке контента и пользователей.',
    emptyState: 'Активных задач нет.'
  },
  'mushroom-materials': {
    key: 'mushroom-materials',
    label: 'Материалы грибов',
    title: 'Материалы грибов',
    subtitle: 'Раздел редактора грибов',
    routePath: '/editor/mushrooms?scope=materials',
    requiredAnyPermissions: [
      PERMISSION_CODES.mushroomsWrite,
      PERMISSION_CODES.mushroomsManageAny,
      PERMISSION_CODES.mushroomsReview,
      PERMISSION_CODES.mushroomsPublish,
      PERMISSION_CODES.mushroomsArchive
    ],
    placeholderTitle: 'Материалы редактора грибов',
    placeholderDescription: 'Здесь будут опубликованные, запланированные и архивные версии грибов.',
    emptyState: 'Пока нет материалов грибов.'
  },
  'mushroom-drafts': {
    key: 'mushroom-drafts',
    label: 'Черновики грибов',
    title: 'Черновики грибов',
    subtitle: 'Раздел редактора грибов',
    routePath: '/editor/mushrooms?scope=drafts',
    requiredAnyPermissions: [
      PERMISSION_CODES.mushroomsWrite,
      PERMISSION_CODES.mushroomsManageAny,
      PERMISSION_CODES.mushroomsReview,
      PERMISSION_CODES.mushroomsPublish,
      PERMISSION_CODES.mushroomsArchive
    ],
    placeholderTitle: 'Черновики грибов',
    placeholderDescription: 'В этом разделе появятся ваши незавершенные revision-версии грибов.',
    emptyState: 'Черновиков грибов пока нет.'
  },
  'mushroom-moderation': {
    key: 'mushroom-moderation',
    label: 'Модерация грибов',
    title: 'Модерация грибов',
    subtitle: 'Раздел модерации грибов',
    routePath: '/editor/mushrooms/review',
    requiredAnyPermissions: [PERMISSION_CODES.mushroomsReview, PERMISSION_CODES.mushroomsPublish],
    placeholderTitle: 'Очередь модерации грибов',
    placeholderDescription: 'Здесь будут заявки на проверку и решения по публикации грибов.',
    emptyState: 'Очередь модерации грибов пока пуста.'
  },
  'ja-reports': {
    key: 'ja-reports',
    label: 'Жалобы',
    title: 'Жалобы',
    subtitle: 'Раздел младшего администратора',
    requiredPermission: 'profile.ja.reports.read',
    placeholderTitle: 'Поток пользовательских жалоб',
    placeholderDescription: 'В этой вкладке появятся жалобы и их статусы обработки.',
    emptyState: 'Жалоб пока нет.'
  },
  'ja-users-read': {
    key: 'ja-users-read',
    label: 'Пользователи',
    title: 'Пользователи',
    subtitle: 'Раздел младшего администратора',
    requiredPermission: 'profile.ja.users.read',
    placeholderTitle: 'Просмотр пользователей',
    placeholderDescription: 'Будет доступен read-only список пользователей и базовые фильтры.',
    emptyState: 'Список скоро появится.'
  },
  'admin-users-roles': {
    key: 'admin-users-roles',
    label: 'Пользователи и роли',
    title: 'Пользователи и роли',
    subtitle: 'Раздел администратора',
    requiredPermission: 'profile.admin.users-roles.read',
    placeholderTitle: 'Управление ролями',
    placeholderDescription: 'Вкладка для назначения ролей и управления доступами.',
    emptyState: 'Изменений ролей пока нет.'
  },
  'admin-action-logs': {
    key: 'admin-action-logs',
    label: 'Логи действий',
    title: 'Логи действий',
    subtitle: 'Раздел администратора',
    requiredPermission: 'profile.admin.action-logs.read',
    placeholderTitle: 'Журнал административных действий',
    placeholderDescription: 'Здесь будут отображаться ключевые действия администраторов.',
    emptyState: 'Логи появятся после первых операций.'
  },
  'su-system': {
    key: 'su-system',
    label: 'Система',
    title: 'Система',
    subtitle: 'Раздел суперпользователя',
    requiredPermission: 'profile.su.system.read',
    placeholderTitle: 'Состояние системы',
    placeholderDescription: 'Будет показана сводка по сервисам и внутренним состояниям.',
    emptyState: 'Данные системы пока не загружены.'
  },
  'su-audit': {
    key: 'su-audit',
    label: 'Аудит',
    title: 'Аудит',
    subtitle: 'Раздел суперпользователя',
    requiredPermission: 'profile.su.audit.read',
    placeholderTitle: 'Аудит безопасности',
    placeholderDescription: 'Здесь появится детальный аудит операций и событий.',
    emptyState: 'Событий аудита пока нет.'
  },
  'su-config': {
    key: 'su-config',
    label: 'Конфигурация',
    title: 'Конфигурация',
    subtitle: 'Раздел суперпользователя',
    requiredPermission: 'profile.su.config.read',
    placeholderTitle: 'Глобальные конфигурации',
    placeholderDescription: 'Будет доступно централизованное управление параметрами платформы.',
    emptyState: 'Конфигурации пока не редактировались.'
  }
};

export const baseProfileTabs: ProfileTabDefinition[] = [
  tabByKey.profile,
  tabByKey.favorites,
  tabByKey.history
];

export const roleProfileTabs: ProfileTabDefinition[] = [
  tabByKey['editor-materials'],
  tabByKey['editor-drafts'],
  tabByKey['ja-moderation'],
  tabByKey['mushroom-materials'],
  tabByKey['mushroom-drafts'],
  tabByKey['mushroom-moderation'],
  tabByKey['ja-reports'],
  tabByKey['ja-users-read'],
  tabByKey['admin-users-roles'],
  tabByKey['admin-action-logs'],
  tabByKey['su-system'],
  tabByKey['su-audit'],
  tabByKey['su-config']
];

const baseTabKeys = new Set<BaseProfileTabKey>(['profile', 'favorites', 'history']);
const legacyTabAliases: Record<string, ProfileTabKey> = {
  'editor-moderation-queue': 'ja-moderation'
};

function normalizePermissionCode(code: string): string {
  return code.trim().toLowerCase();
}

function buildPermissionSet(permissionCodes: readonly string[]): Set<string> {
  return new Set(permissionCodes.map(normalizePermissionCode));
}

function isTabAllowed(tab: ProfileTabDefinition, permissionSet: Set<string>): boolean {
  const hasRequiredPermission =
    !tab.requiredPermission || permissionSet.has(normalizePermissionCode(tab.requiredPermission));
  const hasAnyRequiredPermission =
    !tab.requiredAnyPermissions?.length ||
    tab.requiredAnyPermissions.some((permissionCode) => permissionSet.has(normalizePermissionCode(permissionCode)));

  return hasRequiredPermission && hasAnyRequiredPermission;
}

export function getRoleSpecificProfileTabs(permissionCodes: readonly string[]): ProfileTabDefinition[] {
  const permissionSet = buildPermissionSet(permissionCodes);
  return roleProfileTabs.filter((tab) => isTabAllowed(tab, permissionSet));
}

export function getAvailableProfileTabs(permissionCodes: readonly string[]): ProfileTabDefinition[] {
  return [...baseProfileTabs, ...getRoleSpecificProfileTabs(permissionCodes)];
}

export function getProfileTabDefinition(tabKey: ProfileTabKey): ProfileTabDefinition {
  return tabByKey[tabKey];
}

export function isRoleSpecificProfileTab(tabKey: ProfileTabKey): tabKey is RoleProfileTabKey {
  return !baseTabKeys.has(tabKey as BaseProfileTabKey);
}

export function resolveProfileTabKey(value: string | null | undefined, permissionCodes: readonly string[]): ProfileTabKey {
  if (typeof value !== 'string' || value.length === 0) {
    return 'profile';
  }

  const requestedRawTab = legacyTabAliases[value] ?? value;
  if (!Object.prototype.hasOwnProperty.call(tabByKey, requestedRawTab)) {
    return 'profile';
  }

  const requestedTab = requestedRawTab as ProfileTabKey;
  const availableTabs = getAvailableProfileTabs(permissionCodes);
  const isAllowed = availableTabs.some((tab) => tab.key === requestedTab);

  return isAllowed ? requestedTab : 'profile';
}

export function getProfileTabHref(tabKey: ProfileTabKey): string {
  const tab = tabByKey[tabKey];

  if (tab.routePath) {
    return tab.routePath;
  }

  if (tabKey === 'profile') {
    return '/profile';
  }

  return `/profile?tab=${tabKey}`;
}
