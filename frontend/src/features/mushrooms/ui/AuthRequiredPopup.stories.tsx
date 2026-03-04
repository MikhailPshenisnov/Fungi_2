import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AuthRequiredPopup } from './AuthRequiredPopup';

const meta = {
  title: 'Features/Mushrooms/AuthRequiredPopup',
  component: AuthRequiredPopup,
  args: {
    onClose: fn(),
    onRegister: fn()
  }
} satisfies Meta<typeof AuthRequiredPopup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    isOpen: true
  }
};

export const Closed: Story = {
  args: {
    isOpen: false
  }
};
