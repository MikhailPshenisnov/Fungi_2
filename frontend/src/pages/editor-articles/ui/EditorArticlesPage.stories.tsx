import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider, type SessionUser } from '@entities/session';
import { EditorArticlesPage } from './EditorArticlesPage';

const meta = {
  title: 'Pages/Editor/EditorArticlesPage',
  component: EditorArticlesPage
} satisfies Meta<typeof EditorArticlesPage>;

export default meta;

type Story = StoryObj<typeof meta>;

function createSessionUser(overrides: Partial<SessionUser> = {}): SessionUser {
  return {
    id: '1',
    name: 'Editor User',
    email: 'editor@example.com',
    avatarUrl: null,
    roleId: 'role-editor',
    roleName: 'Editor',
    roleAccessLevel: 19,
    permissions: ['content.articles.write', 'content.article-media.write', 'content.article-mushrooms.write'],
    ...overrides
  };
}

function renderPage(user: SessionUser) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false
      }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider initialUser={user} initialToken="storybook-token">
        <EditorArticlesPage />
      </SessionProvider>
    </QueryClientProvider>
  );
}

export const EditorDrafts: Story = {
  render: () => renderPage(createSessionUser())
};

export const AdminView: Story = {
  render: () =>
    renderPage(
      createSessionUser({
        roleId: 'role-admin',
        roleName: 'Administrator',
        roleAccessLevel: 1,
        permissions: [
          'content.articles.write',
          'content.articles.review',
          'content.articles.publish',
          'content.articles.archive',
          'content.articles.manage-any'
        ]
      })
    )
};
