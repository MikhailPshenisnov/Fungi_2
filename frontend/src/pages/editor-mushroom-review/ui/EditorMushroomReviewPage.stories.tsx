import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider, type SessionUser } from '@entities/session';
import { EditorMushroomReviewPage } from './EditorMushroomReviewPage';
import type { EditorMushroomRevision } from '@features/mushroom-editor';

const meta = {
  title: 'Pages/Editor/EditorMushroomReviewPage',
  component: EditorMushroomReviewPage
} satisfies Meta<typeof EditorMushroomReviewPage>;

export default meta;

type Story = StoryObj<typeof meta>;

function createSessionUser(overrides: Partial<SessionUser> = {}): SessionUser {
  return {
    id: '1',
    name: 'Moderator User',
    email: 'moderator@example.com',
    avatarUrl: null,
    roleId: 'role-moderator',
    roleName: 'Moderator',
    roleAccessLevel: 10,
    permissions: ['content.mushrooms.review', 'content.mushrooms.publish'],
    ...overrides
  };
}

const storybookQueue: EditorMushroomRevision[] = [
  {
    revisionId: 'rev-queue-1',
    sourceMushroomId: null,
    name: 'Лисичка',
    synonymousName: null,
    latinName: 'Cantharellus cibarius',
    family: 'Cantharellaceae',
    redBook: false,
    eatable: 'Съедобный',
    hasStem: true,
    stemSizeFrom: 4,
    stemSizeTo: 9,
    stemType: 'Тонкая',
    stemColor: 'Жёлтая',
    capType: 'Воронкообразная',
    capColor: 'Оранжевая',
    capUndersideType: 'Складчатый',
    description: 'Промо карточка очереди.',
    headerPhotoLink: 'https://example.com/chanterelle.jpg',
    extraPhotoLinks: [],
    doppelgangerNames: [],
    status: 'InReview',
    createdByUserId: '1',
    updatedByUserId: '1',
    createdAt: '2026-03-31T08:00:00.000Z',
    updatedAt: '2026-03-31T09:00:00.000Z',
    submittedAt: '2026-03-31T09:05:00.000Z',
    publishedAt: null,
    reviewedAt: null,
    reviewedByUserId: null,
    reviewNote: null,
    archivedAt: null,
    likesCount: 0
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
        <EditorMushroomReviewPage storybookQueue={storybookQueue} />
      </SessionProvider>
    </QueryClientProvider>
  );
}

export const ReviewQueue: Story = {
  render: () => renderPage()
};
