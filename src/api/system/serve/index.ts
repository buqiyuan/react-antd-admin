import ServeApi from '@/core/permission/modules/sys/serve';
import { request } from '@/utils/request';

export function getServeStat() {
  return request<API.SysServeStat>({
    url: ServeApi.stat,
    method: 'get'
  });
}
