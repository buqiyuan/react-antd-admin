import { cloneDeep } from 'lodash';
import { observer } from 'mobx-react-lite';
import { FC, lazy, Suspense, useEffect, useMemo } from 'react';
import type { RouteObject } from 'react-router';
import { useLocation, useNavigate, useRoutes } from 'react-router-dom';

import LayoutPage from '@/layout';
import { SuspendFallbackLoading } from '@/layout/suspendFallbackLoading';
import type { MenuList } from '@/routes/types';
import { userStore } from '@/stores/user';

import WrapperRouteComponent from './config';

export const NotFound = lazy(() => import('@/views/error/404'));
const LoginPage = lazy(() => import('@/views/login'));
const Dashboard = lazy(() => import('@/views/dashboard'));

const defaultRouteList: RouteObject[] = [
  {
    path: 'login',
    element: <WrapperRouteComponent element={<LoginPage />} titleId="title.login" />
  },
  {
    path: '/',
    element: <WrapperRouteComponent element={<LayoutPage />} titleId="" />,
    children: []
  }
];

/**
 * @description 默认的菜单项
 */
export const defaultMenuRoutes: MenuList = [
  {
    path: '/dashboard',
    key: '/dashboard',
    element: <WrapperRouteComponent element={<Dashboard />} titleId="title.dashboard" />,
    meta: {
      title: {
        zh_CN: '首页',
        en_US: 'dashboard'
      }
    }
  }
];

const errorPages = [
  {
    path: '*',
    element: <WrapperRouteComponent element={<NotFound />} titleId="title.notFount" />
  }
];

const DynamicRouter: FC = () => {
  const { token, menuList = [] } = userStore;
  const navigate = useNavigate();
  const { pathname, state } = useLocation();

  useEffect(() => {
    console.log('logged', !!token, state);
    if (!token && pathname !== '/login') {
      return navigate({ pathname: 'login' }, { replace: true, state: { from: pathname } });
    }

    if (token && !menuList.length) {
      userStore.afterLogin();
    }
  }, [menuList, token, navigate, pathname, state]);

  const newRoutes = useMemo(() => {
    const routes = cloneDeep(defaultRouteList);
    const layoutRoute = routes.find(item => item.path === '/')?.children;
    layoutRoute?.push(...cloneDeep([...defaultMenuRoutes, ...menuList]), ...errorPages);
    return routes;
  }, [menuList]);

  return <RenderRouter routerList={newRoutes} />;
};

interface RenderRouterProps {
  routerList: RouteObject[];
}

const RenderRouter: FC<RenderRouterProps> = ({ routerList }) => {
  console.log('routerList', routerList);
  const element = useRoutes(routerList);
  return <Suspense fallback={<SuspendFallbackLoading message="页面加载失败" />}>{element}</Suspense>;
};

export default observer(DynamicRouter);
