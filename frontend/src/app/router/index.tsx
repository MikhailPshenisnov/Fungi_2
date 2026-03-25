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
import { hasPermission, PERMISSION_CODES, useSession } from '@entities/session';
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
}

function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const { isSessionLoading, isAuthenticated, user } = useSession();

  if (isSessionLoading) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(user.permissions, requiredPermission)) {
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
