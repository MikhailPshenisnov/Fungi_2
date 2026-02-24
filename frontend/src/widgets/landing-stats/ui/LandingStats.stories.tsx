import type { Meta, StoryObj } from '@storybook/react-vite';
import { LandingStats } from './LandingStats';

const meta = {
  title: 'Widgets/Landing/LandingStats',
  component: LandingStats
} satisfies Meta<typeof LandingStats>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
