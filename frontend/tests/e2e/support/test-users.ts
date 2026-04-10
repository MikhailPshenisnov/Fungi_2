export type E2EUserRole = 'admin' | 'editor' | 'regular';

const defaultPassword = process.env.E2E_TEST_PASSWORD ?? 'Fungi123!';

export const E2E_USERS: Record<E2EUserRole, { email: string; password: string }> = {
  admin: {
    email: process.env.E2E_ADMIN_EMAIL ?? 'admin@mushroomproject.com',
    password: process.env.E2E_ADMIN_PASSWORD ?? defaultPassword
  },
  editor: {
    email: process.env.E2E_EDITOR_EMAIL ?? 'editor@mushroomproject.com',
    password: process.env.E2E_EDITOR_PASSWORD ?? defaultPassword
  },
  regular: {
    email: process.env.E2E_REGULAR_EMAIL ?? 'user@mushroomproject.com',
    password: process.env.E2E_REGULAR_PASSWORD ?? defaultPassword
  }
};
