import { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Stack } from '@shared/ui';
import { ToastProvider } from './ToastProvider';
import { useToast } from './use-toast';

function ToastDemo() {
  const { showError, showInfo, showSuccess, clear } = useToast();

  useEffect(() => {
    showInfo('Система уведомлений готова к работе.', { title: 'Toast' });
  }, [showInfo]);

  return (
    <Stack direction="horizontal" gap={12}>
      <Button onClick={() => showError('Не удалось сохранить изменения.', { title: 'Ошибка' })}>
        Показать ошибку
      </Button>
      <Button
        variant="secondary"
        onClick={() => showInfo('Обновление началось.', { title: 'Информация' })}
      >
        Показать info
      </Button>
      <Button
        variant="secondary"
        onClick={() => showSuccess('Изменения успешно применены.', { title: 'Готово' })}
      >
        Показать success
      </Button>
      <Button variant="tertiary" onClick={clear}>
        Очистить
      </Button>
    </Stack>
  );
}

const meta = {
  title: 'Shared/UI/Composites/Toast',
  render: () => (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  )
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
