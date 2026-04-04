import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders label', () => {
    render(<Button>Сохранить</Button>);
    expect(screen.getByRole('button', { name: 'Сохранить' })).toBeInTheDocument();
  });

  it('supports variants', () => {
    const { rerender } = render(<Button variant="primary">Кнопка</Button>);
    const primaryClass = screen.getByRole('button').className;

    rerender(<Button variant="secondary">Кнопка</Button>);
    const secondaryClass = screen.getByRole('button').className;

    rerender(<Button variant="tertiary">Кнопка</Button>);
    const tertiaryClass = screen.getByRole('button').className;

    expect(primaryClass).not.toBe(secondaryClass);
    expect(secondaryClass).not.toBe(tertiaryClass);
  });

  it('calls onClick when enabled and ignores click when disabled', () => {
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Нажать</Button>);

    fireEvent.click(screen.getByRole('button', { name: 'Нажать' }));
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <Button disabled onClick={onClick}>
        Нажать
      </Button>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Нажать' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
