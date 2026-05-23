import type { Meta, StoryObj } from '@storybook/react-vite';
import { SessionProvider } from '@entities/session';
import { PersonalDataConsentPage } from './PersonalDataConsentPage';

const meta = {
  title: 'Pages/Legal/PersonalDataConsentPage',
  component: PersonalDataConsentPage
} satisfies Meta<typeof PersonalDataConsentPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <SessionProvider>
      <PersonalDataConsentPage />
    </SessionProvider>
  )
};
