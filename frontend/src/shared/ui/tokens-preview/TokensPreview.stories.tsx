import type { Meta, StoryObj } from '@storybook/react-vite';
import { TokensPreview } from './TokensPreview';

const meta = {
  title: 'Shared/UI/Composites/TokensPreview',
  component: TokensPreview,
  parameters: {
    layout: 'padded'
  }
} satisfies Meta<typeof TokensPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {};
