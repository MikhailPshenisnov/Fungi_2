import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders checked state', () => {
    render(<Checkbox label="Запомнить меня" checked onChange={() => undefined} />);
    expect(screen.getByLabelText('Запомнить меня')).toBeChecked();
  });

  it('calls onChange', () => {
    const onChange = vi.fn();
    render(<Checkbox label="Запомнить меня" onChange={onChange} />);

    fireEvent.click(screen.getByLabelText('Запомнить меня'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('supports disabled state', () => {
    render(<Checkbox label="Запомнить меня" disabled />);
    expect(screen.getByLabelText('Запомнить меня')).toBeDisabled();
  });
});
