import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta = {
  title: 'Shared/UI/Button',
  component: Button,
  args: {
    children: 'Нажми меня'
  }
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary'
  }
};

export const Ghost: Story = {
  args: {
    variant: 'ghost'
  }
};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};
