import type { Meta, StoryObj } from '@storybook/react-vite';
import { SessionProvider } from '@entities/session';
import { ProfilePage } from './ProfilePage';

const meta = {
  title: 'Pages/Profile/ProfilePage',
  component: ProfilePage
} satisfies Meta<typeof ProfilePage>;

export default meta;

type Story = StoryObj<typeof meta>;

function renderProfile(section?: 'profile' | 'favorites' | 'history') {
  return (
    <SessionProvider
      initialUser={{
        id: '1',
        name: 'test',
        email: 'example@example.com'
      }}
    >
      <ProfilePage section={section} />
    </SessionProvider>
  );
}

export const Default: Story = {
  render: () => renderProfile('profile')
};

export const Favorites: Story = {
  render: () => renderProfile('favorites')
};

export const History: Story = {
  render: () => renderProfile('history')
};
