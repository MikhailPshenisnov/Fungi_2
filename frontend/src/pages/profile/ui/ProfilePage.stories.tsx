import type { Meta, StoryObj } from '@storybook/react-vite';
import { SessionProvider, type ProfileTabKey, type SessionUser } from '@entities/session';
import { ProfilePage } from './ProfilePage';

const demoAvatarUrl =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 160 160%22%3E%3Cdefs%3E%3ClinearGradient id=%22g%22 x1=%220%22 y1=%220%22 x2=%221%22 y2=%221%22%3E%3Cstop offset=%220%25%22 stop-color=%22%23f59f5b%22/%3E%3Cstop offset=%22100%25%22 stop-color=%22%232aa17c%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=%22160%22 height=%22160%22 fill=%22url(%23g)%22/%3E%3Ccircle cx=%2280%22 cy=%2262%22 r=%2232%22 fill=%22%23fff4e8%22/%3E%3Crect x=%2234%22 y=%22104%22 width=%2292%22 height=%2238%22 rx=%2219%22 fill=%22%23fff4e8%22/%3E%3C/svg%3E';

const meta = {
  title: 'Pages/Profile/ProfilePage',
  component: ProfilePage
} satisfies Meta<typeof ProfilePage>;

export default meta;

type Story = StoryObj<typeof meta>;

function createSessionUser(overrides: Partial<SessionUser> = {}): SessionUser {
  return {
    id: '1',
    name: 'Test User',
    email: 'example@example.com',
    avatarUrl: null,
    roleId: 'role-common',
    roleName: 'CommonUser',
    roleAccessLevel: 20,
    permissions: [],
    ...overrides
  };
}

interface RenderOptions {
  section?: ProfileTabKey;
  user?: SessionUser;
}

function renderProfile({ section = 'profile', user = createSessionUser() }: RenderOptions = {}) {
  return (
    <SessionProvider initialUser={user} initialToken="storybook-token">
      <ProfilePage section={section} />
    </SessionProvider>
  );
}

export const CommonUser: Story = {
  render: () => renderProfile({ section: 'profile' })
};

export const CommonUserFavorites: Story = {
  render: () => renderProfile({ section: 'favorites' })
};

export const EditorRoleTabs: Story = {
  render: () =>
    renderProfile({
      section: 'editor-materials',
      user: createSessionUser({
        roleId: 'role-editor',
        roleName: 'Editor',
        roleAccessLevel: 19,
        permissions: [
          'content.articles.write',
          'content.article-media.write'
        ],
        avatarUrl: demoAvatarUrl
      })
    })
};

export const AdministratorRoleTabs: Story = {
  render: () =>
    renderProfile({
      section: 'admin-users-roles',
      user: createSessionUser({
        roleId: 'role-admin',
        roleName: 'Administrator',
        roleAccessLevel: 1,
        permissions: [
          'profile.admin.users-roles.read',
          'profile.admin.action-logs.read'
        ]
      })
    })
};

export const SuperUserRoleTabs: Story = {
  render: () =>
    renderProfile({
      section: 'su-system',
      user: createSessionUser({
        roleId: 'role-superuser',
        roleName: 'SuperUser',
        roleAccessLevel: 0,
        permissions: [
          'profile.su.system.read',
          'profile.su.audit.read',
          'profile.su.config.read'
        ]
      })
    })
};

export const BrokenAvatarFallback: Story = {
  render: () =>
    renderProfile({
      section: 'profile',
      user: createSessionUser({ avatarUrl: 'https://example.invalid/broken-avatar.webp' })
    })
};
