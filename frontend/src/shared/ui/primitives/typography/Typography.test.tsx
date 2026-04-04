import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Typography } from './Typography';

describe('Typography', () => {
  it('renders semantic tag by variant', () => {
    render(<Typography variant="h2">Заголовок</Typography>);
    const heading = screen.getByRole('heading', { level: 2, name: 'Заголовок' });
    expect(heading.tagName).toBe('H2');
  });

  it('supports custom as tag', () => {
    render(
      <Typography variant="h2" as="span">
        Подпись
      </Typography>
    );
    expect(screen.getByText('Подпись').tagName).toBe('SPAN');
  });
});
