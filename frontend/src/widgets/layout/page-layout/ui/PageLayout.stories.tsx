import type { Meta, StoryObj } from '@storybook/react-vite';
import { SessionProvider } from '@entities/session';
import { Card, Container, Stack, Typography } from '@shared/ui';
import { PageLayout } from './PageLayout';

const meta = {
  title: 'Widgets/Layout/PageLayout',
  component: PageLayout
} satisfies Meta<typeof PageLayout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: null
  },
  render: () => (
    <SessionProvider>
      <PageLayout>
        <Container style={{ paddingTop: 24, paddingBottom: 24 }}>
          <Card>
            <Stack gap={12}>
              <Typography variant="h3">Контент страницы</Typography>
              <Typography variant="body">Layout-обертка с общими header и footer.</Typography>
            </Stack>
          </Card>
        </Container>
      </PageLayout>
    </SessionProvider>
  )
};
