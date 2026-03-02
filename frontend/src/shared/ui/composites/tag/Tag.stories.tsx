import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag } from './Tag';

const meta = {
  title: 'Shared/UI/Composites/Tag',
  component: Tag,
  args: {
    children: 'Тег',
    tone: 'neutral',
    size: 'm'
  }
} satisfies Meta<typeof Tag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Tag tone="neutral">neutral</Tag>
      <Tag tone="info">info</Tag>
      <Tag tone="success">success</Tag>
      <Tag tone="warning">warning</Tag>
      <Tag tone="error">error</Tag>
    </div>
  )
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
      <Tag size="s" tone="info">size s</Tag>
      <Tag size="m" tone="info">size m</Tag>
      <Tag size="l" tone="info">size l</Tag>
    </div>
  )
};
