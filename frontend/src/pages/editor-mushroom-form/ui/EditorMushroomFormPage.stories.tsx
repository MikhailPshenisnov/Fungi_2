import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider, type SessionUser } from '@entities/session';
import { EditorMushroomFormPage } from './EditorMushroomFormPage';
import type { EditorMushroomRevision } from '@features/mushroom-editor';
import type { Mushroom } from '@entities/mushroom';

const meta = {
  title: 'Pages/Editor/EditorMushroomFormPage',
  component: EditorMushroomFormPage
} satisfies Meta<typeof EditorMushroomFormPage>;

export default meta;

type Story = StoryObj<typeof meta>;

function createSessionUser(overrides: Partial<SessionUser> = {}): SessionUser {
  return {
    id: '1',
    name: 'Editor User',
    email: 'editor@example.com',
    avatarUrl: null,
    roleId: 'role-editor',
    roleName: 'Editor',
    roleAccessLevel: 19,
    permissions: ['content.mushrooms.write', 'content.mushroom-media.write', 'content.mushrooms.archive'],
    ...overrides
  };
}

const storybookRevision: EditorMushroomRevision = {
  revisionId: 'rev-1',
  sourceMushroomId: 'source-1',
  name: 'Белый гриб',
  synonymousName: 'Боровик',
  latinName: 'Boletus edulis',
  family: 'Boletaceae',
  redBook: false,
  eatable: 'Съедобный',
  hasStem: true,
  stemSizeFrom: 8,
  stemSizeTo: 14,
  stemType: 'Цилиндрическая',
  stemColor: 'Белая',
  capType: 'Выпуклая',
  capColor: 'Коричневая',
  capUndersideType: 'Трубчатый',
  description: 'Исторический и вкусный.',
  headerPhotoLink: 'https://example.com/white-mushroom.jpg',
  extraPhotoLinks: ['https://example.com/white-1.jpg'],
  doppelgangerNames: ['Желчный гриб'],
  status: 'Rejected',
  createdByUserId: '1',
  updatedByUserId: '1',
  createdAt: '2026-03-25T10:00:00.000Z',
  updatedAt: '2026-03-31T10:00:00.000Z',
  submittedAt: '2026-03-31T09:00:00.000Z',
  publishedAt: null,
  reviewedAt: '2026-03-31T10:10:00.000Z',
  reviewedByUserId: '2',
  reviewNote: 'Добавьте более точное описание ножки.',
  archivedAt: null,
  likesCount: 4
};

const storybookSource: Mushroom = {
  id: 'source-2',
  name: 'Подосиновик',
  synonymousName: null,
  latinName: 'Leccinum aurantiacum',
  family: 'Boletaceae',
  redBook: false,
  eatable: 'Съедобный',
  hasStem: true,
  stemSizeFrom: 9,
  stemSizeTo: 16,
  stemType: 'Цилиндрическая',
  stemColor: 'Светлая',
  capType: 'Плоско-выпуклая',
  capColor: 'Оранжевая',
  capUndersideType: 'Трубчатый',
  description: 'Пример источника для новой ревизии.',
  headerPhotoLink: 'https://example.com/source.jpg',
  extraPhotoLinks: ['https://example.com/source-extra.jpg'],
  doppelgangers: []
};

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false
      }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider initialUser={createSessionUser()} initialToken="storybook-token">
        <EditorMushroomFormPage storybookRevision={storybookRevision} />
      </SessionProvider>
    </QueryClientProvider>
  );
}

function renderNewFromSource() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false
      }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider initialUser={createSessionUser()} initialToken="storybook-token">
        <EditorMushroomFormPage storybookSource={storybookSource} />
      </SessionProvider>
    </QueryClientProvider>
  );
}

export const EditRejectedRevision: Story = {
  render: () => renderPage()
};

export const NewRevisionFromSource: Story = {
  render: () => renderNewFromSource()
};
