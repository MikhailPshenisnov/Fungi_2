import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const iconDot = (
  <span
    style={{
      width: 10,
      height: 10,
      borderRadius: 999,
      background: 'currentColor',
      display: 'inline-block'
    }}
  />
);

const meta = {
  title: 'Shared/UI/Primitives/Button',
  component: Button,
  args: {
    children: 'Действие'
  },
  argTypes: {
    disabled: {
      control: { type: 'boolean' }
    },
    leftIcon: {
      options: ['none', 'dot'],
      mapping: {
        none: undefined,
        dot: iconDot
      },
      control: { type: 'inline-radio' }
    },
    rightIcon: {
      options: ['none', 'dot'],
      mapping: {
        none: undefined,
        dot: iconDot
      },
      control: { type: 'inline-radio' }
    }
  }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Tertiary: Story = { args: { variant: 'tertiary' } };
export const Playground: Story = {
  args: {
    variant: 'primary',
    disabled: false,
    leftIcon: undefined,
    rightIcon: undefined,
    iconOnly: false,
    children: 'Действие',
    'aria-label': 'Кнопка'
  }
};
