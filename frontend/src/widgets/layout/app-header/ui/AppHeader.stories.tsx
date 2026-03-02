import type { Meta, StoryObj } from '@storybook/react-vite';
import { SessionProvider } from '@entities/session';
import { AppHeader } from './AppHeader';

const meta = {
  title: 'Widgets/Layout/AppHeader',
  component: AppHeader
} satisfies Meta<typeof AppHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Guest: Story = {
  render: () => (
    <SessionProvider>
      <AppHeader />
    </SessionProvider>
  )
};

export const Authorized: Story = {
  render: () => (
    <SessionProvider
      initialUser={{
        id: '1',
        name: 'test',
        email: 'example@example.com'
      }}
    >
      <AppHeader />
    </SessionProvider>
  )
};
