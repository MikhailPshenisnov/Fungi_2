import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';

const meta = {
  title: 'Shared/UI/Card',
  component: Card,
  args: {
    children: 'Карточка контента'
  }
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Hoverable: Story = { args: { hoverable: true } };
