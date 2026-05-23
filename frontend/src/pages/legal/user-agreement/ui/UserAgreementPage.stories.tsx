import type { Meta, StoryObj } from '@storybook/react-vite';
import { SessionProvider } from '@entities/session';
import { UserAgreementPage } from './UserAgreementPage';

const meta = {
  title: 'Pages/Legal/UserAgreementPage',
  component: UserAgreementPage
} satisfies Meta<typeof UserAgreementPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <SessionProvider>
      <UserAgreementPage />
    </SessionProvider>
  )
};
