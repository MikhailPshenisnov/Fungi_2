import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { HomePage } from '@pages/home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
