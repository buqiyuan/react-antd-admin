import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Tag } from 'antd';
import { useRef } from 'react';

import { getTaskLogList } from '@/api/system/log';

type TableListItem = API.TaskLogListItemResult;

const getStatusType = (status: number) => {
  switch (status) {
    case 0:
      return 'danger';
    case 1:
      return 'success';
  }
};

const getStatusTip = (status: number) => {
  switch (status) {
    case 0:
      return '失败';
    case 1:
      return '成功';
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

export const SystemScheduleTaskLog = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '#',
      dataIndex: 'id',
      width: 80,
      align: 'center'
    },
    {
      title: '任务编号',
      dataIndex: 'taskId',
      align: 'center',
      width: 100
    },
    {
      title: '任务名称',
      dataIndex: 'name',
      align: 'center',
      ellipsis: true,
      width: 200
    },
    {
      title: '异常信息',
      dataIndex: 'detail',
      align: 'center',
      width: 150
    },
    {
      title: '耗时',
      dataIndex: 'consumeTime',
      align: 'center',
      width: 120,
      render: (_, { consumeTime }) => <Tag color={getConsumeTimeType(consumeTime)}>{consumeTime + 'ms'}</Tag>
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      render: (_, { status }) => <Tag color={getStatusType(status)}>{getStatusTip(status)}</Tag>
    },
    {
      title: '执行时间',
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
        const { list, pagination } = await getTaskLogList({ limit: params.pageSize, page: params.current });
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
};

export default SystemScheduleTaskLog;
