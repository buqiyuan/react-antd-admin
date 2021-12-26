import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Tag } from 'antd';
import { useRef } from 'react';

import { getOnlineList } from '@/api/system/online';

type TableListItem = API.OnlineUserListItem;

export default function SystemMonitorOnline() {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '#',
      dataIndex: 'id',
      width: 80,
      align: 'center'
    },
    {
      title: '用户名',
      dataIndex: 'username',
      width: 280,
      align: 'center',
      render: (_, { username, isCurrent }) => (
        <>
          <span>{username}</span>
          {isCurrent ? <Tag color="error">当前</Tag> : null}
        </>
      )
    },
    {
      title: '登录IP',
      dataIndex: 'ip',
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
      request={async _ => {
        // 表单搜索项会从 params 传入，传递给后端接口。
        const list = await getOnlineList();
        return {
          data: list,
          success: true
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
