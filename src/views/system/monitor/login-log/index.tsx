import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useRef } from 'react';

import { getLoginLogList } from '@/api/system/log';

type TableListItem = API.LoginLogListItemResult;

export default function SystemMonitorLoginLog() {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      width: 280,
      align: 'center'
    },
    {
      title: '登录IP',
      dataIndex: 'ip',
      width: 150,
      align: 'center'
    },
    {
      title: '登录时间',
      dataIndex: 'time',
      align: 'center'
    },
    {
      title: '操作系统',
      dataIndex: 'os',
      align: 'center'
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
      align: 'center'
    }
  ];

  return (
    <ProTable<TableListItem>
      actionRef={actionRef}
      columns={columns}
      request={async params => {
        // 表单搜索项会从 params 传入，传递给后端接口。
        const { list, pagination } = await getLoginLogList({ limit: params.pageSize, page: params.current });
        return {
          data: list,
          success: true,
          total: pagination?.total
        };
      }}
      sticky={true}
      rowKey="id"
      scroll={{ x: 1300, y: 500 }}
      pagination={{
        showQuickJumper: true
      }}
      search={false}
      dateFormatter="string"
    />
  );
}
