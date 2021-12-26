import LogApi from '@/core/permission/modules/sys/log';
import { request } from '@/utils/request';

export function getReqLogList(query: API.PageParams) {
  return request<API.TableListResult>(
    {
      url: LogApi.req,
      method: 'get',
      params: query
    },
    {
      isMock: true
    }
  );
}

export function getLoginLogList(query: API.PageParams) {
  return request<API.TableListResult<API.LoginLogListResult>>({
    url: LogApi.login,
    method: 'get',
    params: query
  });
}

export function getTaskLogList(query: API.PageParams) {
  return request<API.TableListResult<API.TaskLogListResult>>({
    url: LogApi.task,
    method: 'get',
    params: query
  });
}
