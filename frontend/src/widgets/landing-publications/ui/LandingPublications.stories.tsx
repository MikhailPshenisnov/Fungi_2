import type { Meta, StoryObj } from '@storybook/react-vite';
import { LandingPublications } from './LandingPublications';

const meta = {
  title: 'Widgets/Landing/LandingPublications',
  component: LandingPublications
} satisfies Meta<typeof LandingPublications>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
