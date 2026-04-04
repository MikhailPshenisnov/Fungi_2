import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@shared/ui/primitives';
import { ContentState } from './ContentState';

const meta = {
  title: 'Shared/UI/Composites/ContentState',
  component: ContentState,
  args: {
    title: 'Состояние экрана',
    description: 'Описание состояния и подсказка пользователю.'
  }
} satisfies Meta<typeof ContentState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const Loading: Story = {
  args: {
    tone: 'loading',
    title: 'Загружаем данные...'
  }
};

export const Empty: Story = {
  args: {
    tone: 'empty',
    title: 'Ничего не найдено'
  }
};

export const Error: Story = {
  args: {
    tone: 'error',
    title: 'Что-то пошло не так',
    action: <Button>Повторить</Button>
  }
};
