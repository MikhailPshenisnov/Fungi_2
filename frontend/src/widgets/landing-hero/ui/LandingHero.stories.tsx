import type { Meta, StoryObj } from '@storybook/react-vite';
import { LandingHero } from './LandingHero';

const meta = {
  title: 'Widgets/Landing/LandingHero',
  component: LandingHero,
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof LandingHero>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
