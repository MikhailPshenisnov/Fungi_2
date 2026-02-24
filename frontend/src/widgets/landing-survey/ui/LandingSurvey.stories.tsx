import type { Meta, StoryObj } from '@storybook/react-vite';
import { LandingSurvey } from './LandingSurvey';

const meta = {
  title: 'Widgets/Landing/LandingSurvey',
  component: LandingSurvey
} satisfies Meta<typeof LandingSurvey>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
