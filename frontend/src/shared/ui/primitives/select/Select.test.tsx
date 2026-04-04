import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './Select';

const options = [
  { label: 'Все', value: 'all' },
  { label: 'Съедобные', value: 'edible' },
  { label: 'Несъедобные', value: 'inedible' }
];

describe('Select', () => {
  it('renders options and selected value', () => {
    render(<Select label="Тип" options={options} value="edible" onChange={() => undefined} />);

    const select = screen.getByLabelText('Тип');
    expect(select).toHaveValue('edible');
    expect(screen.getByRole('option', { name: 'Все' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Съедобные' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Несъедобные' })).toBeInTheDocument();
  });

  it('calls onChange', () => {
    const onChange = vi.fn();
    render(<Select label="Тип" options={options} value="all" onChange={onChange} />);

    fireEvent.change(screen.getByLabelText('Тип'), { target: { value: 'inedible' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('supports disabled state', () => {
    render(<Select label="Тип" options={options} value="all" onChange={() => undefined} disabled />);
    expect(screen.getByLabelText('Тип')).toBeDisabled();
  });
});
