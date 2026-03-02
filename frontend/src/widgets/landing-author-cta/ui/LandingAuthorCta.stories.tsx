import type { Meta, StoryObj } from '@storybook/react-vite';
import { LandingAuthorCta } from './LandingAuthorCta';

const meta = {
  title: 'Widgets/Landing/LandingAuthorCta',
  component: LandingAuthorCta
} satisfies Meta<typeof LandingAuthorCta>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
