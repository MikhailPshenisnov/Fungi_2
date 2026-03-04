import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import { HomePage } from '@pages/home';
import { LandingPage } from '@pages/landing';
import { LoginPage } from '@pages/auth/login';
import { RegisterPage } from '@pages/auth/register';
import { ProfilePage } from '@pages/profile';
import { RouteHead } from './RouteHead';

function RouteLayout() {
  return (
    <>
      <RouteHead />
      <Outlet />
    </>
  );
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
