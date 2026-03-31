import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider, type SessionUser } from '@entities/session';
import { EditorMushroomsPage } from './EditorMushroomsPage';
import type { EditorMushroomRevision } from '@features/mushroom-editor';

const meta = {
  title: 'Pages/Editor/EditorMushroomsPage',
  component: EditorMushroomsPage
} satisfies Meta<typeof EditorMushroomsPage>;

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

const storybookRevisions: EditorMushroomRevision[] = [
  {
    revisionId: 'rev-1',
    sourceMushroomId: null,
    name: 'Белый гриб',
    synonymousName: 'Боровик',
    latinName: 'Boletus edulis',
    family: 'Boletaceae',
    redBook: false,
    eatable: 'Съедобный',
    hasStem: true,
    stemSizeFrom: 8,
    stemSizeTo: 15,
    stemType: 'Цилиндрическая',
    stemColor: 'Белая',
    capType: 'Выпуклая',
    capColor: 'Коричневая',
    capUndersideType: 'Трубчатый',
    description: 'Классическая ревизия для stories.',
    headerPhotoLink: 'https://example.com/white-mushroom.jpg',
    extraPhotoLinks: [],
    doppelgangerNames: ['Желчный гриб'],
    status: 'Draft',
    createdByUserId: '1',
    updatedByUserId: '1',
    createdAt: '2026-03-30T12:00:00.000Z',
    updatedAt: '2026-03-31T12:00:00.000Z',
    submittedAt: null,
    publishedAt: null,
    reviewedAt: null,
    reviewedByUserId: null,
    reviewNote: null,
    archivedAt: null,
    likesCount: 12
  },
  {
    revisionId: 'rev-2',
    sourceMushroomId: 'mush-2',
    name: 'Подберёзовик',
    synonymousName: null,
    latinName: 'Leccinum scabrum',
    family: 'Boletaceae',
    redBook: false,
    eatable: 'Съедобный',
    hasStem: true,
    stemSizeFrom: 7,
    stemSizeTo: 13,
    stemType: 'Цилиндрическая',
    stemColor: 'Серая',
    capType: 'Шляпка',
    capColor: 'Бурая',
    capUndersideType: 'Трубчатый',
    description: 'Опубликованная ревизия.',
    headerPhotoLink: 'https://example.com/bolete.jpg',
    extraPhotoLinks: [],
    doppelgangerNames: [],
    status: 'Published',
    createdByUserId: '1',
    updatedByUserId: '1',
    createdAt: '2026-03-20T12:00:00.000Z',
    updatedAt: '2026-03-31T08:30:00.000Z',
    submittedAt: '2026-03-31T09:00:00.000Z',
    publishedAt: '2026-03-31T10:00:00.000Z',
    reviewedAt: '2026-03-31T09:40:00.000Z',
    reviewedByUserId: '2',
    reviewNote: null,
    archivedAt: null,
    likesCount: 18
  }
];

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
        <EditorMushroomsPage storybookRevisions={storybookRevisions} />
      </SessionProvider>
    </QueryClientProvider>
  );
}

export const Drafts: Story = {
  render: () => renderPage()
};

export const Materials: Story = {
  render: () => renderPage()
};
