import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container } from './Container';

const meta = {
  title: 'Shared/UI/Primitives/Container',
  component: Container
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Container
        size="sm"
        style={{ border: '1px solid var(--color-border-default)', background: 'var(--color-surface-default)' }}
      >
        sm container
      </Container>
      <Container
        size="md"
        style={{ border: '1px solid var(--color-border-default)', background: 'var(--color-surface-default)' }}
      >
        md container
      </Container>
      <Container
        size="lg"
        style={{ border: '1px solid var(--color-border-default)', background: 'var(--color-surface-default)' }}
      >
        lg container
      </Container>
      <Container
        size="xl"
        style={{ border: '1px solid var(--color-border-default)', background: 'var(--color-surface-default)' }}
      >
        xl container
      </Container>
      <Container
        size="full-width"
        style={{ border: '1px solid var(--color-border-default)', background: 'var(--color-surface-default)' }}
      >
        full-width container
      </Container>
    </div>
  )
};
