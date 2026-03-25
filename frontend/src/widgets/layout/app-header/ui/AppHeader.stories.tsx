import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { SessionProvider, type SessionUser } from '@entities/session';
import { AppHeader } from './AppHeader';

const demoAvatarUrl =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 128 128%22%3E%3Crect width=%22128%22 height=%22128%22 fill=%22%23f8c173%22/%3E%3Ccircle cx=%2264%22 cy=%2248%22 r=%2224%22 fill=%22%23fff4e8%22/%3E%3Crect x=%2226%22 y=%2280%22 width=%2276%22 height=%2232%22 rx=%2216%22 fill=%22%23fff4e8%22/%3E%3C/svg%3E';

const meta = {
  title: 'Widgets/Layout/AppHeader',
  component: AppHeader
} satisfies Meta<typeof AppHeader>;

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

function renderAuthorizedHeader(user: SessionUser) {
  return (
    <SessionProvider initialUser={user} initialToken="storybook-token">
      <AppHeader />
    </SessionProvider>
  );
}

export const Guest: Story = {
  render: () => (
    <SessionProvider>
      <AppHeader />
    </SessionProvider>
  )
};

export const AuthorizedCommonFallback: Story = {
  render: () => renderAuthorizedHeader(createSessionUser())
};

export const AuthorizedWithAvatar: Story = {
  render: () => renderAuthorizedHeader(createSessionUser({ avatarUrl: demoAvatarUrl }))
};

export const EditorMenu: Story = {
  render: () =>
    renderAuthorizedHeader(
      createSessionUser({
        roleId: 'role-editor',
        roleName: 'Editor',
        roleAccessLevel: 19,
        permissions: [
          'content.articles.write',
          'content.article-media.write'
        ],
        avatarUrl: demoAvatarUrl
      })
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Открыть меню профиля' }));
  }
};

export const AdministratorMenu: Story = {
  render: () =>
    renderAuthorizedHeader(
      createSessionUser({
        roleId: 'role-admin',
        roleName: 'Administrator',
        roleAccessLevel: 1,
        permissions: [
          'profile.admin.users-roles.read',
          'profile.admin.action-logs.read'
        ],
        avatarUrl: demoAvatarUrl
      })
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Открыть меню профиля' }));
  }
};

export const SuperUserMenu: Story = {
  render: () =>
    renderAuthorizedHeader(
      createSessionUser({
        roleId: 'role-superuser',
        roleName: 'SuperUser',
        roleAccessLevel: 0,
        permissions: [
          'profile.su.system.read',
          'profile.su.audit.read',
          'profile.su.config.read'
        ],
        avatarUrl: demoAvatarUrl
      })
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Открыть меню профиля' }));
  }
};

export const AuthorizedBrokenAvatarFallback: Story = {
  render: () =>
    renderAuthorizedHeader(createSessionUser({ avatarUrl: 'https://example.invalid/broken-avatar.webp' }))
};
