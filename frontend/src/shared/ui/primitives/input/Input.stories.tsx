import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';

const meta = {
  title: 'Shared/UI/Primitives/Input',
  component: Input,
  args: {
    label: 'Email',
    placeholder: 'name@example.com'
  }
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithHelperText: Story = { args: { helperText: 'Используйте рабочую почту' } };
export const Error: Story = { args: { errorText: 'Некорректный формат email' } };
export const Disabled: Story = { args: { disabled: true, value: 'readonly@example.com' } };
