/**
 * example
 * path -> ./modules/user
 * <a-button v-if="$auth('user.add')">Button</a-button>
 * path -> ./modules/sys/user
 * <a-button v-if="$auth('sysUser.add')">Button</a-button>
 */
// import type { DataNode } from 'rc-tree-select/lib/interface'

import type { DataNode } from 'rc-cascader/lib/interface';

import { userStore } from '@/stores/user';

import { permissions, permissionValues } from './modules/';
import type { PermissionType } from './modules/types';

/**
 * @description 将权限列表转成级联选择器要求的数据格式
 */
export const formarPermsToCascader = () => {
  return Object.keys(permissions).reduce<DataNode[]>((prev, moduleKey) => {
    const module = permissions[moduleKey];
    Object.keys(module).forEach(key => {
      module[key].split(':').reduce((p, k, currentIndex, arr) => {
        const value = arr.slice(0, currentIndex + 1).join(':');
        const index = p.findIndex(item => item?.value === value);
        if (Number.isInteger(index) && index !== -1) {
          return p[index].children;
        } else {
          const item: DataNode = {
            // key: k,
            title: k,
            label: k,
            value: value,
            children: []
          };
          p.push(item);
          return item.children!;
        }
      }, prev);
    });
    return prev;
  }, []);
};

/**
 * 验证权限
 * @param {PermissionType} perm  权限码
 * @returns {boolean} true | false
 */
export const verifyAuth = (perm: PermissionType) => {
  const permCode = perm.split('/').join(':');
  const permissionList = userStore.perms;

  return permissionList.some(n => n === permCode);
};

export {
  permissions,
  permissionValues
  // install(app) {
  //   app.config.globalProperties.$auth = verifyAuth;
  // }
};
