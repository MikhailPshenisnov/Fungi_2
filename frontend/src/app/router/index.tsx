import type { ReactElement } from 'react';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import { HomePage } from '@pages/home';
import { LandingPage } from '@pages/landing';
import { LoginPage } from '@pages/auth/login';
import { RegisterPage } from '@pages/auth/register';
import { ProfilePage } from '@pages/profile';
import { AboutPage } from '@pages/about';
import { MushroomsPage } from '@pages/mushrooms';
import { MushroomDetailPage } from '@pages/mushroom-detail';
import { ArticlesPage } from '@pages/articles';
import { ArticleDetailPage } from '@pages/article-detail';
import { EditorArticlesPage } from '@pages/editor-articles';
import { EditorArticleFormPage } from '@pages/editor-article-form';
import { EditorReviewPage } from '@pages/editor-review';
import { EditorMushroomFormPage } from '@pages/editor-mushroom-form';
import { EditorMushroomReviewPage } from '@pages/editor-mushroom-review';
import { EditorMushroomsPage } from '@pages/editor-mushrooms';
import { hasAnyPermission, hasPermission, PERMISSION_CODES, useSession } from '@entities/session';
import { RouteHead } from './RouteHead';

function RouteLayout() {
  return (
    <>
      <RouteHead />
      <Outlet />
    </>
  );
}

interface ProtectedRouteProps {
  children: ReactElement;
  requiredPermission?: string;
  requiredAnyPermissions?: string[];
}

function ProtectedRoute({ children, requiredPermission, requiredAnyPermissions }: ProtectedRouteProps) {
  const { isSessionLoading, isAuthenticated, user } = useSession();

  if (isSessionLoading) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const hasRequiredPermission = !requiredPermission || hasPermission(user.permissions, requiredPermission);
  const hasRequiredAnyPermissions =
    !requiredAnyPermissions?.length || hasAnyPermission(user.permissions, requiredAnyPermissions);

  if (!hasRequiredPermission || !hasRequiredAnyPermissions) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}

const router = createBrowserRouter([
  {
    element: <RouteLayout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: '/foundation',
        element: <HomePage />,
        handle: {
          title: 'Foundation'
        }
      },
      {
        path: '/about',
        element: <AboutPage />,
        handle: {
          title: 'О нас'
        }
      },
      {
        path: '/mushrooms',
        element: <MushroomsPage />,
        handle: {
          title: 'Грибы'
        }
      },
      {
        path: '/mushrooms/:id',
        element: <MushroomDetailPage />,
        handle: {
          title: 'Карточка гриба'
        }
      },
      {
        path: '/articles',
        element: <ArticlesPage />,
        handle: {
          title: 'Статьи'
        }
      },
      {
        path: '/articles/:id',
        element: <ArticleDetailPage />,
        handle: {
          title: 'Карточка статьи'
        }
      },
      {
        path: '/login',
        element: <LoginPage />,
        handle: {
          title: 'Вход'
        }
      },
      {
        path: '/register',
        element: <RegisterPage />,
        handle: {
          title: 'Регистрация'
        }
      },
      {
        path: '/profile',
        element: <ProfilePage />,
        handle: {
          title: 'Профиль'
        }
      },
      {
        path: '/profile/favorites',
        element: <Navigate to="/profile?tab=favorites" replace />,
        handle: {
          title: 'Избранное'
        }
      },
      {
        path: '/profile/history',
        element: <Navigate to="/profile?tab=history" replace />,
        handle: {
          title: 'История просмотров'
        }
      },
      {
        path: '/editor/articles',
        element: (
          <ProtectedRoute requiredPermission={PERMISSION_CODES.articlesWrite}>
            <EditorArticlesPage />
          </ProtectedRoute>
        ),
        handle: {
          title: 'Редактор: статьи'
        }
      },
      {
        path: '/editor/articles/new',
        element: (
          <ProtectedRoute requiredPermission={PERMISSION_CODES.articlesWrite}>
            <EditorArticleFormPage />
          </ProtectedRoute>
        ),
        handle: {
          title: 'Редактор: новая статья'
        }
      },
      {
        path: '/editor/articles/:id/edit',
        element: (
          <ProtectedRoute requiredPermission={PERMISSION_CODES.articlesWrite}>
            <EditorArticleFormPage />
          </ProtectedRoute>
        ),
        handle: {
          title: 'Редактор: редактирование'
        }
      },
      {
        path: '/editor/review',
        element: (
          <ProtectedRoute requiredPermission={PERMISSION_CODES.articlesReview}>
            <EditorReviewPage />
          </ProtectedRoute>
        ),
        handle: {
          title: 'Редактор: модерация'
        }
      },
      {
        path: '/editor/mushrooms',
        element: (
          <ProtectedRoute
            requiredAnyPermissions={[
              PERMISSION_CODES.mushroomsWrite,
              PERMISSION_CODES.mushroomsManageAny,
              PERMISSION_CODES.mushroomsReview,
              PERMISSION_CODES.mushroomsPublish,
              PERMISSION_CODES.mushroomsArchive
            ]}
          >
            <EditorMushroomsPage />
          </ProtectedRoute>
        ),
        handle: {
          title: 'Редактор: грибы'
        }
      },
      {
        path: '/editor/mushrooms/new',
        element: (
          <ProtectedRoute
            requiredAnyPermissions={[
              PERMISSION_CODES.mushroomsWrite,
              PERMISSION_CODES.mushroomsManageAny,
              PERMISSION_CODES.mushroomsReview,
              PERMISSION_CODES.mushroomsPublish,
              PERMISSION_CODES.mushroomsArchive
            ]}
          >
            <EditorMushroomFormPage />
          </ProtectedRoute>
        ),
        handle: {
          title: 'Редактор: новый гриб'
        }
      },
      {
        path: '/editor/mushrooms/:revisionId/edit',
        element: (
          <ProtectedRoute
            requiredAnyPermissions={[
              PERMISSION_CODES.mushroomsWrite,
              PERMISSION_CODES.mushroomsManageAny,
              PERMISSION_CODES.mushroomsReview,
              PERMISSION_CODES.mushroomsPublish,
              PERMISSION_CODES.mushroomsArchive
            ]}
          >
            <EditorMushroomFormPage />
          </ProtectedRoute>
        ),
        handle: {
          title: 'Редактор: редактирование гриба'
        }
      },
      {
        path: '/editor/mushrooms/review',
        element: (
          <ProtectedRoute requiredAnyPermissions={[PERMISSION_CODES.mushroomsReview, PERMISSION_CODES.mushroomsPublish]}>
            <EditorMushroomReviewPage />
          </ProtectedRoute>
        ),
        handle: {
          title: 'Редактор: модерация грибов'
        }
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
        handle: {
          title: 'Fungi'
        }
      }
    ]
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
