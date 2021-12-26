import { makeAutoObservable, runInAction } from 'mobx';

import { getInfo, logout, permmenu } from '@/api/account';
import { login } from '@/api/login';
import { ACCESS_TOKEN_KEY, LOCALE } from '@/enums/cacheEnum';
import { defaultMenuRoutes } from '@/routes';
import { filterAsyncRoute } from '@/routes/generator-router';
import type { MenuChild } from '@/routes/types';
import { wsStore } from '@/stores/ws';
import { flatArrayObject } from '@/utils';
import { Storage } from '@/utils/Storage';

const device = /(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent) ? 'MOBILE' : 'DESKTOP';

export const userStore = makeAutoObservable({
  token: Storage.get(ACCESS_TOKEN_KEY, null),
  userInfo: {},
  collapsed: device !== 'DESKTOP',
  device: device as 'MOBILE' | 'DESKTOP',
  locale: Storage.get(LOCALE, 'zh_CN'),
  // locale: (localStorage.getItem('locale')! || 'zh_CN') as Locale,
  name: 'amdin',
  avatar: '',
  perms: [] as string[],
  menus: [] as MenuChild[],
  routeList: [] as MenuChild[],
  menuList: [] as MenuChild[],
  // 清空token及用户信息
  resetToken() {
    this.avatar = this.token = this.name = '';
    this.perms = [];
    this.menus = [];
    this.userInfo = {};
    Storage.clear();
  },
  setLocale(locale) {
    this.locale = locale;
    Storage.set(LOCALE, locale);
  },
  // 登录成功保存token
  setToken(token: string) {
    this.token = token ?? '';
    const ex = 7 * 24 * 60 * 60 * 1000;
    Storage.set(ACCESS_TOKEN_KEY, this.token, ex);
  },
  generateRoutes(menus: API.Menu[]) {
    // 后端路由json进行转换成真正的router map
    const routeList = filterAsyncRoute(menus, null);
    // 404 route must be end
    // routeList.push(NotFoundRouter)
    const defaultRoutes = flatArrayObject<MenuChild>(defaultMenuRoutes, ['children']);
    const asyncRoutes = flatArrayObject<MenuChild>(routeList, ['children']);
    // 获取数据后，将赋值操作放到 runInAction 中
    runInAction(() => {
      this.routeList = [...defaultRoutes, ...asyncRoutes];
      this.menuList = [...defaultMenuRoutes, ...routeList];
    });
  },
  // 登录
  async login(params: API.LoginParams) {
    try {
      const { data } = await login(params);
      this.setToken(data.token);
      return this.afterLogin();
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async afterLogin() {
    try {
      const [userInfo, { perms, menus }] = await Promise.all([getInfo(), permmenu()]);
      runInAction(() => {
        this.perms = perms;
        this.name = userInfo.name;
        this.avatar = userInfo.headImg;
        this.userInfo = userInfo;
      });

      this.generateRoutes(menus);
      // 生成路由
      // const routes = generatorDynamicRouter(menus);
      // this.menus = routes;
      wsStore.initSocket();
      // router.push('/sys/permission/role')
      return { menus, perms, userInfo };
    } catch (error) {
      console.log(error);
      // return this.logout();
    }
  },
  // 登出
  async logout() {
    await logout();
    wsStore.closeSocket();
    this.resetToken();
  }
});

export default userStore;
