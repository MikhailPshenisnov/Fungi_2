import type { Meta, StoryObj } from '@storybook/react-vite';
import { LandingReviews } from './LandingReviews';

const meta = {
  title: 'Widgets/Landing/LandingReviews',
  component: LandingReviews
} satisfies Meta<typeof LandingReviews>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
