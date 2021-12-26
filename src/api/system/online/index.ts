import OnlineApi from '@/core/permission/modules/sys/online';
import { request } from '@/utils/request';

export function getOnlineList() {
  return request<API.TableListResult<API.OnlineUserListResult>>({
    url: OnlineApi.list,
    method: 'get'
  });
}

export function kickUser(data: { id: number }) {
  return request({
    url: OnlineApi.kick,
    method: 'post',
    data
  });
}
