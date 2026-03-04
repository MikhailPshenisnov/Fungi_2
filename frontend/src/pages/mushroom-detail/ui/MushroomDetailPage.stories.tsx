import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider, type SessionUser } from '@entities/session';
import { MushroomDetailPage } from './MushroomDetailPage';

const meta = {
  title: 'Pages/Mushrooms/MushroomDetailPage',
  component: MushroomDetailPage
} satisfies Meta<typeof MushroomDetailPage>;

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

function renderPage(user: SessionUser | null, mushroomId = 'story-mushroom-id') {
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
        <MushroomDetailPage mushroomId={mushroomId} />
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
