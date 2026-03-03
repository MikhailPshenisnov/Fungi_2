import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from '@shared/ui';
import { AuthLayout } from './AuthLayout';

const meta = {
  title: 'Widgets/Layout/AuthLayout',
  component: AuthLayout,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    (Story) => <Story />
  ]
} satisfies Meta<typeof AuthLayout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sideTitle: 'С возвращением в Fungi',
    sideDescription: 'Короткое описание для правой колонки.',
    sideFooter: <Typography variant="caption">Дополнительная заметка</Typography>,
    children: <Typography variant="body">Контент формы авторизации.</Typography>
  }
};
