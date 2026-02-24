import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Shared/UI/Checkbox',
  component: Checkbox,
  args: {
    label: 'Показывать только съедобные'
  }
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithHelperText: Story = { args: { helperText: 'Можете изменить фильтр позже' } };
export const Error: Story = { args: { errorText: 'Нужно подтвердить согласие' } };
export const Disabled: Story = { args: { disabled: true } };
