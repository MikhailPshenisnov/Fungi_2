import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider, type SessionUser } from '@entities/session';
import { EditorArticleFormPage } from './EditorArticleFormPage';

const meta = {
  title: 'Pages/Editor/EditorArticleFormPage',
  component: EditorArticleFormPage
} satisfies Meta<typeof EditorArticleFormPage>;

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
        <EditorArticleFormPage />
      </SessionProvider>
    </QueryClientProvider>
  );
}

export const NewArticle: Story = {
  render: () => renderPage(createSessionUser())
};
