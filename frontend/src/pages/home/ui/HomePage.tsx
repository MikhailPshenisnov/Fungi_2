import { Button, Card, Container, Stack, Typography } from '@shared/ui';

export function HomePage() {
  return (
    <Container size="md" style={{ paddingTop: 40, paddingBottom: 40 }}>
      <Card>
        <Stack gap={16}>
          <Typography variant="meta">Переписывание Fungi</Typography>
          <Typography variant="h2">Foundation-слой в процессе</Typography>
          <Typography variant="body">
            Компоненты первой волны уже доступны в Storybook и могут использоваться как база для переноса фич.
          </Typography>
          <Stack direction="horizontal" gap={12}>
            <Button>Основное действие</Button>
            <Button variant="tertiary">Вторичное действие</Button>
          </Stack>
        </Stack>
      </Card>
    </Container>
  );
}
