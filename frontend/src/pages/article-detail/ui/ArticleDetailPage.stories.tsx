import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider, type SessionUser } from '@entities/session';
import { ArticleDetailPage } from './ArticleDetailPage';

const meta = {
  title: 'Pages/Articles/ArticleDetailPage',
  component: ArticleDetailPage
} satisfies Meta<typeof ArticleDetailPage>;

export default meta;

type Story = StoryObj<typeof meta>;

function createSessionUser(overrides: Partial<SessionUser> = {}): SessionUser {
  return {
    id: '1',
    name: 'Алексей Воронов',
    email: 'alexey.voronov@fungi.local',
    avatarUrl: null,
    roleId: 'role-common',
    roleName: 'CommonUser',
    roleAccessLevel: 20,
    permissions: [],
    ...overrides
  };
}

function renderPage(user: SessionUser | null, articleId = 'story-article-id') {
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
        <ArticleDetailPage articleId={articleId} />
      </SessionProvider>
    </QueryClientProvider>
  );
}

export const Guest: Story = {
  render: () => renderPage(null)
};

export const Authorized: Story = {
  render: () => renderPage(createSessionUser())
};

export const InvalidId: Story = {
  render: () => renderPage(null, '')
};
