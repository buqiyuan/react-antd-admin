import type { SysDeptPerms } from './dept';
import type { SysLogPerms } from './log';
import type { SysMenuPerms } from './menu';
import type { SysOnlinePerms } from './online';
import type { SysRolePerms } from './role';
import type { SysServePerms } from './serve';
import type { SysTaskPerms } from './task';
import type { SysUserPerms } from './user';

export type SysPermissionType =
  | SysLogPerms
  | SysDeptPerms
  | SysMenuPerms
  | SysOnlinePerms
  | SysRolePerms
  | SysTaskPerms
  | SysServePerms
  | SysUserPerms;
