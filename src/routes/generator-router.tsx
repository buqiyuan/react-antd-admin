import { Result } from 'antd';

import { NotFound } from '@/routes';
import WrapperRouteComponent from '@/routes/config';
import { constantRouterComponents } from '@/routes/modules';
import RouteView from '@/routes/routeView';
import { isExternal } from '@/utils/validate';

import { MenuItem } from './types';

export function filterAsyncRoute(routes: API.Menu[], parentRoute: API.Menu | null, lastKeyPath: string[] = []) {
  return (
    routes
      // eslint-disable-next-line
      .filter(item => item.type !== 2 && item.isShow && item.parentId == parentRoute?.id)
      .map(item => {
        const { router, viewPath, name, icon, keepalive } = item;
        let fullPath = '';
        const pathPrefix = lastKeyPath.slice(-1)[0] || '';
        if (/http(s)?:/.test(router)) {
          fullPath = router;
        } else {
          fullPath = router.startsWith('/') ? router : '/' + router;
          fullPath = router.startsWith(pathPrefix) ? fullPath : pathPrefix + fullPath;
          fullPath = [...new Set(fullPath.split('/'))].join('/');
        }
        let realRoutePath = router;
        if (parentRoute) {
          if (fullPath.startsWith(parentRoute?.router)) {
            realRoutePath = fullPath.split(parentRoute.router)[1];
          } else if (!isExternal(parentRoute.router) && !isExternal(router)) {
            realRoutePath = router;
          }
        }
        realRoutePath = realRoutePath.startsWith('/') ? realRoutePath.slice(1) : realRoutePath;
        const route: MenuItem = {
          path: realRoutePath,
          key: fullPath,
          keyPath: lastKeyPath.concat(fullPath),
          // name: toHump(viewPath),
          meta: {
            title: {
              zh_CN: name,
              en_US: name
            },
            icon: icon,
            noCache: !keepalive
          }
        };

        if (item.type === 0) {
          // 如果是目录
          const children = filterAsyncRoute(routes, item, route.keyPath);
          if (children?.length) {
            route.element = <WrapperRouteComponent element={<RouteView />} auth={true} titleId="title.dashboard" />;
            route.children = children;
          } else {
            route.element = (
              <Result
                status="500"
                title={name}
                subTitle="目录类型菜单不是真实页面，请为当前目录添加页面级子菜单或更改当前菜单类型."
              />
            );
          }
          return route;
        } else if (item.type === 1) {
          // 如果是页面
          const Component = constantRouterComponents[viewPath.replace('.vue', '')] || NotFound;
          route.element = <WrapperRouteComponent element={<Component />} auth={true} titleId="title.dashboard" />;
          return route;
        }
        return undefined;
      })
      .filter((item): item is MenuItem => !!item)
  );
}
