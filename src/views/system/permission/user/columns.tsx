import type { ProColumns } from '@ant-design/pro-table';
import { Avatar, Space, Tag } from 'antd';

export type TableListItem = API.UserListPageResultItem;
export type ColumnItem = ProColumns<TableListItem>;

export const baseColumns: ColumnItem[] = [
  {
    title: '头像',
    width: 80,
    dataIndex: 'headImg',
    render: (_, record) => <Avatar src={record.headImg} />
  },
  {
    title: '姓名',
    width: 120,
    dataIndex: 'name',
    align: 'center'
  },
  {
    title: '用户名',
    width: 120,
    align: 'center',
    dataIndex: 'username'
  },
  {
    title: '所在部门',
    dataIndex: 'departmentName',
    align: 'center',
    width: 180
  },
  {
    title: '所属角色',
    dataIndex: 'roleNames',
    align: 'center',
    width: 220,
    render: (_, record) => (
      <Space>
        {record.roleNames.map(item => (
          <Tag color={'success'} key={item}>
            {item}
          </Tag>
        ))}
      </Space>
    )
  },
  {
    title: '呢称',
    width: 120,
    align: 'center',
    dataIndex: 'nickName'
  },
  {
    title: '邮箱',
    width: 120,
    align: 'center',
    dataIndex: 'email'
  },
  {
    title: '手机',
    width: 120,
    align: 'center',
    dataIndex: 'phone'
  },
  {
    title: '备注',
    width: 120,
    align: 'center',
    dataIndex: 'remark'
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    render: (_, record) => {
      const isEnable = record.status === 1;
      return <Tag color={isEnable ? 'success' : 'red'}>{isEnable ? '启用' : '禁用'}</Tag>;
    }
  }
];
