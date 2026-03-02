import type { Meta, StoryObj } from '@storybook/react-vite';
import { LandingMushrooms } from './LandingMushrooms';

const meta = {
  title: 'Widgets/Landing/LandingMushrooms',
  component: LandingMushrooms
} satisfies Meta<typeof LandingMushrooms>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
