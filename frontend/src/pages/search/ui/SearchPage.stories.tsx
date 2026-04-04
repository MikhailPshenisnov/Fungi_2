import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider, type SessionUser } from '@entities/session';
import { SearchPage } from './SearchPage';

const meta = {
  title: 'Pages/Search/SearchPage',
  component: SearchPage
} satisfies Meta<typeof SearchPage>;

export default meta;

type Story = StoryObj<typeof meta>;

function createSessionUser(overrides: Partial<SessionUser> = {}): SessionUser {
  return {
    id: '1',
    name: 'Search User',
    email: 'search@example.com',
    avatarUrl: null,
    roleId: 'role-common',
    roleName: 'CommonUser',
    roleAccessLevel: 20,
    permissions: [],
    ...overrides
  };
}

function renderPage(user: SessionUser | null = createSessionUser()) {
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
        <SearchPage />
      </SessionProvider>
    </QueryClientProvider>
  );
}

export const Default: Story = {
  render: () => renderPage()
};

export const Guest: Story = {
  render: () => renderPage(null)
};
