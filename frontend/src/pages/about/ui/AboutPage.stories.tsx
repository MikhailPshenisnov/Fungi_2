import type { Meta, StoryObj } from '@storybook/react-vite';
import { SessionProvider } from '@entities/session';
import { AboutPage } from './AboutPage';

const meta = {
  title: 'Pages/About',
  component: AboutPage
} satisfies Meta<typeof AboutPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Guest: Story = {
  render: () => (
    <SessionProvider>
      <AboutPage />
    </SessionProvider>
  )
};

export const Authorized: Story = {
  render: () => (
    <SessionProvider
      initialUser={{
        id: '1',
        name: 'Алексей Воронов',
        email: 'alexey.voronov@fungi.local',
        avatarUrl: null,
        roleId: 'role-common',
        roleName: 'CommonUser',
        roleAccessLevel: 20,
        permissions: []
      }}
      initialToken="storybook-token"
    >
      <AboutPage />
    </SessionProvider>
  )
};
