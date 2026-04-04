import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const options = [
  { label: 'Сортировка по дате', value: 'date' },
  { label: 'Сортировка по популярности', value: 'popularity' }
];

const meta = {
  title: 'Shared/UI/Primitives/Select',
  component: Select,
  args: {
    label: 'Сортировка',
    options
  }
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithHelperText: Story = { args: { helperText: 'Выберите режим отображения' } };
export const Error: Story = { args: { errorText: 'Поле обязательно' } };
export const Disabled: Story = { args: { disabled: true } };
