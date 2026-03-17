import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AuthGuard, AdminGuard } from './guards';
import { UserLayout } from '@/layouts/UserLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { PageLoading } from '@/components/PageLoading';

const LoginPage = lazy(() => import('@/pages/user/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/user/RegisterPage'));
const HomePage = lazy(() => import('@/pages/user/HomePage'));
const ProductListPage = lazy(() => import('@/pages/user/ProductListPage'));
const ProductDetailPage = lazy(() => import('@/pages/user/ProductDetailPage'));
const SearchPage = lazy(() => import('@/pages/user/SearchPage'));
const CartPage = lazy(() => import('@/pages/user/CartPage'));
const OrderConfirmPage = lazy(() => import('@/pages/user/OrderConfirmPage'));
const MyOrdersPage = lazy(() => import('@/pages/user/MyOrdersPage'));
const OrderDetailPage = lazy(() => import('@/pages/user/OrderDetailPage'));
const ProfilePage = lazy(() => import('@/pages/user/ProfilePage'));
const AiSearchPage = lazy(() => import('@/pages/user/AiSearchPage'));

const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminProductsPage = lazy(() => import('@/pages/admin/AdminProductsPage'));
const AdminProductCreatePage = lazy(() => import('@/pages/admin/AdminProductCreatePage'));
const AdminProductEditPage = lazy(() => import('@/pages/admin/AdminProductEditPage'));
const AdminOrdersPage = lazy(() => import('@/pages/admin/AdminOrdersPage'));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'));

const NotFoundPage = lazy(() => import('@/pages/common/NotFoundPage'));

const withSuspense = (element: JSX.Element) => <Suspense fallback={<PageLoading />}>{element}</Suspense>;

export const router = createBrowserRouter([
  {
    path: '/login',
    element: withSuspense(<LoginPage />)
  },
  {
    path: '/register',
    element: withSuspense(<RegisterPage />)
  },
  {
    path: '/admin/login',
    element: withSuspense(<AdminLoginPage />)
  },
  {
    element: <AuthGuard />,
    children: [
      {
        path: '/',
        element: <UserLayout />,
        children: [
          { index: true, element: withSuspense(<HomePage />) },
          { path: 'products', element: withSuspense(<ProductListPage />) },
          { path: 'products/:id', element: withSuspense(<ProductDetailPage />) },
          { path: 'search', element: withSuspense(<SearchPage />) },
          { path: 'cart', element: withSuspense(<CartPage />) },
          { path: 'order/confirm', element: withSuspense(<OrderConfirmPage />) },
          { path: 'orders', element: withSuspense(<MyOrdersPage />) },
          { path: 'orders/:id', element: withSuspense(<OrderDetailPage />) },
          { path: 'profile', element: withSuspense(<ProfilePage />) },
          { path: 'ai-search', element: withSuspense(<AiSearchPage />) }
        ]
      }
    ]
  },
  {
    element: <AdminGuard />,
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: withSuspense(<AdminDashboardPage />) },
          { path: 'products', element: withSuspense(<AdminProductsPage />) },
          { path: 'products/new', element: withSuspense(<AdminProductCreatePage />) },
          { path: 'products/:id/edit', element: withSuspense(<AdminProductEditPage />) },
          { path: 'orders', element: withSuspense(<AdminOrdersPage />) },
          { path: 'users', element: withSuspense(<AdminUsersPage />) }
        ]
      }
    ]
  },
  {
    path: '*',
    element: withSuspense(<NotFoundPage />)
  }
]);
