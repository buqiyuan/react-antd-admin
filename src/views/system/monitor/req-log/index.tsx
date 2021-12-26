import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Tag } from 'antd';
import { useRef } from 'react';

import { getReqLogList } from '@/api/system/log';

type TableListItem = API.ReqLogListItemResult;

const getStatusType = (status: number) => {
  if (status >= 200 && status < 300) {
    return 'success';
  } else if (status >= 300 && status < 400) {
    return 'default';
  } else if (status >= 400 && status < 500) {
    return 'warning';
  } else if (status >= 500) {
    return 'error';
  } else {
    return 'default';
  }
};

const getConsumeTimeType = (time: number) => {
  if (time <= 20) {
    return 'success';
  } else if (time <= 40) {
    return 'warning';
  } else {
    return 'error';
  }
};

export default function SystemMonitorReqLog() {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '请求IP',
      dataIndex: 'ip',
      width: 150,
      align: 'center'
    },
    {
      title: '操作人ID',
      dataIndex: 'userId',
      align: 'center',
      width: 100
    },
    {
      title: '请求方式',
      dataIndex: 'method',
      align: 'center',
      render: (_, { method }) => <Tag color="processing">{method}</Tag>
    },
    {
      title: '请求参数',
      dataIndex: 'params',
      align: 'center',
      ellipsis: true,
      width: 150
    },
    {
      title: '请求地址',
      dataIndex: 'action',
      align: 'center'
    },
    {
      title: '响应状态',
      dataIndex: 'status',
      align: 'center',
      width: 120,
      render: (_, { status }) => <Tag color={getStatusType(status)}>{status}</Tag>
    },
    {
      title: '耗时',
      dataIndex: 'consumeTime',
      align: 'center',
      width: 120,
      render: (_, { consumeTime }) => <Tag color={getConsumeTimeType(consumeTime)}>{consumeTime + 'ms'}</Tag>
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 220
    }
  ];

  return (
    <ProTable<TableListItem>
      actionRef={actionRef}
      columns={columns}
      request={async params => {
        // 表单搜索项会从 params 传入，传递给后端接口。
        const { list, pagination } = await getReqLogList({ limit: params.pageSize, page: params.current });
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
