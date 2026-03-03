import type { Meta, StoryObj } from '@storybook/react-vite';
import { SessionProvider } from '@entities/session';
import { LoginPage } from './LoginPage';

const meta = {
  title: 'Pages/Auth/Login',
  component: LoginPage,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    (Story) => (
      <SessionProvider>
        <Story />
      </SessionProvider>
    )
  ]
} satisfies Meta<typeof LoginPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
