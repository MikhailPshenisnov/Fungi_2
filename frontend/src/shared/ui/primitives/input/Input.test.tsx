import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('renders label and value', () => {
    render(<Input label="Email" value="admin@fungi.app" readOnly />);
    expect(screen.getByLabelText('Email')).toHaveValue('admin@fungi.app');
  });

  it('calls onChange', () => {
    const onChange = vi.fn();
    render(<Input label="Имя" onChange={onChange} />);

    fireEvent.change(screen.getByLabelText('Имя'), { target: { value: 'Редактор' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('supports disabled state', () => {
    render(<Input label="Пароль" disabled />);
    expect(screen.getByLabelText('Пароль')).toBeDisabled();
  });
});
