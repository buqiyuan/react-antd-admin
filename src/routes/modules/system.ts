import { lazy } from 'react';

/**
 * system module
 */
export default {
  'views/system/permission/user': lazy(() => import('@/views/system/permission/user')),
  'views/system/permission/menu': lazy(() => import('@/views/system/permission/menu')),
  'views/system/permission/role': lazy(() => import('@/views/system/permission/role')),
  'views/system/monitor/req-log': lazy(() => import('@/views/system/monitor/req-log')),
  'views/system/monitor/online': lazy(() => import('@/views/system/monitor/online')),
  'views/system/monitor/login-log': lazy(() => import('@/views/system/monitor/login-log')),
  'views/system/schedule/task': lazy(() => import('@/views/system/schedule/task')),
  'views/system/schedule/log': lazy(() => import('@/views/system/schedule/log'))
};
