import type { Meta, StoryObj } from '@storybook/react-vite';
import { SessionProvider } from '@entities/session';
import { LandingPage } from './LandingPage';

const meta = {
  title: 'Pages/Landing',
  component: LandingPage
} satisfies Meta<typeof LandingPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Guest: Story = {
  render: () => (
    <SessionProvider>
      <LandingPage />
    </SessionProvider>
  )
};

export const Authorized: Story = {
  render: () => (
    <SessionProvider
      initialUser={{
        id: '1',
        name: 'test',
        email: 'example@example.com',
        avatarUrl: null,
        roleId: 'role-common',
        roleName: 'CommonUser',
        roleAccessLevel: 20,
        permissions: []
      }}
      initialToken="storybook-token"
    >
      <LandingPage />
    </SessionProvider>
  )
};
