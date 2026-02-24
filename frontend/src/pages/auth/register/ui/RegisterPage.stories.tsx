import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
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
      <MemoryRouter>
        <SessionProvider>
          <Story />
        </SessionProvider>
      </MemoryRouter>
    )
  ]
} satisfies Meta<typeof RegisterPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
