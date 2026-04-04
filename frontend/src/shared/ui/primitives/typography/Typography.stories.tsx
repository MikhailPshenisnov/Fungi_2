import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from './Typography';

const meta = {
  title: 'Shared/UI/Primitives/Typography',
  component: Typography,
  args: {
    children: 'Sample text'
  }
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Headings: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 8 }}>
      <Typography variant="h0" as="h1">
        H0 Display
      </Typography>
      <Typography variant="h1">H1 Заголовок</Typography>
      <Typography variant="h2">H2 Заголовок</Typography>
      <Typography variant="h3">H3 Заголовок</Typography>
      <Typography variant="h4">H4 Заголовок</Typography>
      <Typography variant="h5">H5 Заголовок</Typography>
    </div>
  )
};

export const BodyScale: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 8 }}>
      <Typography variant="bodyL">Body L 18px</Typography>
      <Typography variant="body">Body 16px</Typography>
      <Typography variant="bodyS">Body S 14px</Typography>
      <Typography variant="caption">Caption 13px</Typography>
      <Typography variant="meta">Small / meta 12px</Typography>
    </div>
  )
};
