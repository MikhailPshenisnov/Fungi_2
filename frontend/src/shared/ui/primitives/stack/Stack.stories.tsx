import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from './Stack';

const blockStyle = {
  border: '1px solid var(--color-border-default)',
  background: 'var(--color-surface-default)',
  borderRadius: 'var(--radius-s)',
  padding: '8px 12px'
};

const meta = {
  title: 'Shared/UI/Primitives/Stack',
  component: Stack
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  render: () => (
    <Stack>
      <div style={blockStyle}>Item 1</div>
      <div style={blockStyle}>Item 2</div>
      <div style={blockStyle}>Item 3</div>
    </Stack>
  )
};

export const Horizontal: Story = {
  render: () => (
    <Stack direction="horizontal" gap={8} align="center">
      <div style={blockStyle}>Item 1</div>
      <div style={blockStyle}>Item 2</div>
      <div style={blockStyle}>Item 3</div>
    </Stack>
  )
};
