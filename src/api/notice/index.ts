import { request } from '@/utils/request';

export function getNoticeList() {
  return request<API.Notice<'all'>[]>(
    {
      url: '/user/notice',
      method: 'get'
    },
    {
      isMock: true
    }
  );
}
