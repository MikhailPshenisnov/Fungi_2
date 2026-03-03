import type { Meta, StoryObj } from '@storybook/react-vite';
import { SessionProvider } from '@entities/session';
import { RegisterPage } from './RegisterPage';

const meta = {
  title: 'Pages/Auth/Register',
  component: RegisterPage,
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
} satisfies Meta<typeof RegisterPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
