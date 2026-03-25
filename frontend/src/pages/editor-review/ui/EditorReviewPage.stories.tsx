import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider, type SessionUser } from '@entities/session';
import { EditorReviewPage } from './EditorReviewPage';

const meta = {
  title: 'Pages/Editor/EditorReviewPage',
  component: EditorReviewPage
} satisfies Meta<typeof EditorReviewPage>;

export default meta;

type Story = StoryObj<typeof meta>;

function createSessionUser(overrides: Partial<SessionUser> = {}): SessionUser {
  return {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    avatarUrl: null,
    roleId: 'role-admin',
    roleName: 'Administrator',
    roleAccessLevel: 1,
    permissions: ['content.articles.write', 'content.articles.review', 'content.articles.publish', 'content.articles.archive'],
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
        <EditorReviewPage />
      </SessionProvider>
    </QueryClientProvider>
  );
}

export const ModerationQueue: Story = {
  render: () => renderPage(createSessionUser())
};
