import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import { HomePage } from '@pages/home';
import { LandingPage } from '@pages/landing';
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
