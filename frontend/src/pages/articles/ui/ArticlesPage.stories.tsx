import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider, type SessionUser } from '@entities/session';
import { ArticlesPage } from './ArticlesPage';

const meta = {
  title: 'Pages/Articles/ArticlesPage',
  component: ArticlesPage
} satisfies Meta<typeof ArticlesPage>;

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
    permissions: ['content.articles.write', 'content.article-media.write'],
    ...overrides
  };
}

function renderPage(user: SessionUser | null) {
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
      <SessionProvider initialUser={user} initialToken={user ? 'storybook-token' : null}>
        <ArticlesPage />
      </SessionProvider>
    </QueryClientProvider>
  );
}

export const Guest: Story = {
  render: () => renderPage(null)
};

export const AuthorizedEditor: Story = {
  render: () => renderPage(createSessionUser())
};
