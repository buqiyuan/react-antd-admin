import type { ReactNode } from 'react';
// interface MenuItem {
//   /** menu item name */
//   name: string;
//   /** menu labels */
//   label: {
//     zh_CN: string;
//     en_US: string;
//   };
//   /** 图标名称
//    *
//    * 子子菜单不需要图标
//    */
//   icon?: string;
//   /** 菜单id */
//   key: string;
//   /** 菜单路由 */
//   path: string;
//   /** 子菜单 */
//   children?: MenuItem[];
// }

export type MenuChild = Omit<MenuItem, 'children'>;

export type MenuList = MenuItem[];
export interface MenuItem {
  path: string;
  /** 菜单唯一的key */
  key: string;
  name?: string;
  keyPath?: string[];
  auth?: boolean;
  redirect?: string;
  element?: ReactNode;
  alwaysShow?: boolean;
  children?: MenuItem[];
  meta?: {
    hidden?: boolean;
    title: {
      zh_CN: string;
      en_US: string;
    };
    icon?: string;
    noCache?: boolean;
  };
}
