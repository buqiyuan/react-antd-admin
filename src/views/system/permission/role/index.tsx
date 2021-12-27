import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';

import { getRoleList } from '@/api/system/role';
import { deleteRole } from '@/api/system/role';

import { OperateFormModal } from './components/OperateFormModal';

type TableListItem = API.RoleListResultItem;

export const SystemPermissionRole = () => {
  const actionRef = useRef<ActionType>();

  const [modalVisible, setModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<TableListItem | undefined>(undefined);

  const refreshTable = () => {
    actionRef?.current?.reload();
  };

  const handleModalOnCancel = () => {
    setCurrentRow(undefined);
    setModalVisible(false);
  };

  const handleModalOnSuccess = () => {
    handleModalOnCancel();
    refreshTable();
  };

  /**
   * @description 表格删除行
   */
  const delRowConfirm = (record: API.RoleListResultItem) => {
    deleteRole({ roleIds: [record.id] }).finally(actionRef?.current?.reload);
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '#',
      width: 60,
      dataIndex: 'id'
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 200,
      align: 'center'
    },
    {
      title: '标识',
      dataIndex: 'label',
      width: 200,
      align: 'center'
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      width: 180,
      ellipsis: true
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 180,
      align: 'center'
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      width: 180,
      align: 'center'
    },
    {
      title: '操作',
      width: 120,
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      align: 'center',
      render: (_, record) => [
        <Button
          type="link"
          key={'edit'}
          onClick={() => {
            setCurrentRow(record);
            setModalVisible(true);
          }}
        >
          编辑
        </Button>,
        <Popconfirm key="del" placement="left" title="你确定要删除该角色吗?" onConfirm={() => delRowConfirm(record)}>
          <a>删除</a>
        </Popconfirm>
      ]
    }
  ];

  return (
    <>
      <ProTable<TableListItem>
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        scroll={{ x: 1300 }}
        pagination={{
          showQuickJumper: true
        }}
        toolbar={{
          title: '角色管理'
        }}
        search={false}
        dateFormatter="string"
        headerTitle={
          <Button
            type="primary"
            onClick={() => {
              setCurrentRow(undefined);
              setModalVisible(true);
            }}
          >
            新增
          </Button>
        }
        request={async params => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const list = await getRoleList({ limit: params.pageSize, page: params.current });
          return {
            data: list,
            success: true
          };
        }}
      />
      <OperateFormModal
        detail={currentRow}
        visible={modalVisible}
        onCancel={handleModalOnCancel}
        onSuccess={handleModalOnSuccess}
      />
    </>
  );
};

export default SystemPermissionRole;
