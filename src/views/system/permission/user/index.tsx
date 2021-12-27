import { ModalForm, ProFormText } from '@ant-design/pro-form';
import ProTable, { ActionType } from '@ant-design/pro-table';
import { Button, message, Popconfirm, Space, Table } from 'antd';
import type { DataNode } from 'antd/lib/tree';
import React, { useRef, useState } from 'react';

import { deleteUsers, getUserListPage, updateUserPassword } from '@/api/system/user';
import { TabsViewLayout } from '@/components/tabsViewLayout';

import type { TableListItem } from './columns';
import { type ColumnItem, baseColumns } from './columns';
import { DeptTreePanel } from './components/deptTreePanel';
import { type ListItemDataType, OperateUserFormModal } from './components/OperateUserFormModal';

type Params = {
  departmentIds: React.Key[] | undefined;
};

const User: React.FC<{}> = () => {
  const [currentRow, setCurrentRow] = useState<Partial<ListItemDataType | undefined>>();
  const [userModalVisible, setUserModalVisible] = useState<boolean>(false);
  const [updatePswModalVisible, setUpdatePswModalVisible] = useState<boolean>(false);
  const [assideWidth, setAssideWidth] = useState(260);
  const [deptTree, setDeptTree] = useState<DataNode[]>([]);
  const [params, setParams] = useState<Params>();
  const actionRef = useRef<ActionType>();

  const refreshTable = () => actionRef?.current?.reload();

  /**
   * @description 表格删除行
   */
  const delRowConfirm = (record: API.UserListPageResultItem | API.UserListPageResultItem[]) => {
    const userIds = Array.isArray(record) ? record.map(n => n.id) : [record.id];
    deleteUsers({ userIds }).finally(refreshTable);
  };

  /** 隐藏并且将currentRow的值设为undefined */
  const hideAndResetPswModal = () => {
    setUpdatePswModalVisible(false);
    setCurrentRow(undefined);
  };

  const onSelect = (selectedKeys: React.Key[]) => {
    console.log('selectedKeys', selectedKeys);
    setParams({ departmentIds: selectedKeys.length ? selectedKeys : undefined });
  };

  const onDeptTreeChange = (treeData: DataNode[]) => {
    setDeptTree(treeData);
  };

  const columns: ColumnItem[] = [
    ...baseColumns,
    {
      title: '操作',
      width: 200,
      key: 'option',
      valueType: 'option',
      align: 'center',
      fixed: 'right',
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            setCurrentRow(record);
            setUserModalVisible(true);
          }}
        >
          编辑
        </a>,
        <a
          key={'update.psw'}
          onClick={() => {
            setCurrentRow(record);
            setUpdatePswModalVisible(true);
          }}
        >
          改密
        </a>,
        <Popconfirm key="del" placement="left" title="你确定要删除该用户吗?" onConfirm={() => delRowConfirm(record)}>
          <a>删除</a>
        </Popconfirm>
      ]
    }
  ];

  return (
    <TabsViewLayout
      onSeparatorDrag={width => setAssideWidth(width)}
      assideWidth={assideWidth}
      assideRender={<DeptTreePanel onDeptTreeChange={onDeptTreeChange} onSelect={onSelect} />}
    >
      <ProTable<TableListItem, Params>
        // 这个参数优先级更高，会覆盖查询表单的参数
        actionRef={actionRef}
        params={params}
        columns={columns}
        size="small"
        toolbar={{
          title: '用户管理',
          tooltip: '请不要随意删除用户，避免到影响其他用户的使用。'
        }}
        request={async params => {
          const { list, pagination } = await getUserListPage({
            page: params.current,
            limit: params.pageSize,
            departmentIds: params.departmentIds as number[]
          });
          console.log('list', list);
          return {
            data: list,
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: true,
            // 不传会使用 data 的长度，如果是分页一定要传
            total: pagination?.total
          };
        }}
        rowSelection={{
          // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
          // 注释该行则默认不显示下拉选项
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT]
        }}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space>
            <span>已选 {selectedRowKeys.length} 项</span>
            <a onClick={onCleanSelected}>取消选择</a>
          </Space>
        )}
        tableAlertOptionRender={({ selectedRows }) => {
          return (
            <Popconfirm key="del" title="你确定要删除所选角色吗?" onConfirm={() => delRowConfirm(selectedRows)}>
              <a>删除</a>
            </Popconfirm>
          );
        }}
        scroll={{ x: 1300 }}
        search={false}
        rowKey="id"
        headerTitle={
          <Button
            type="primary"
            onClick={() => {
              setCurrentRow(undefined);
              setUserModalVisible(true);
            }}
          >
            新增
          </Button>
        }
      />
      <OperateUserFormModal
        deptTree={deptTree}
        detail={currentRow}
        visible={userModalVisible}
        onSuccess={() => {
          setUserModalVisible(false);
          setCurrentRow(undefined);
          refreshTable();
        }}
        onCancel={() => {
          setUserModalVisible(false);
          setCurrentRow(undefined);
        }}
      />
      <ModalForm
        key="up"
        visible={updatePswModalVisible}
        title={`更改管理员(${currentRow?.username})密码`}
        layout="horizontal"
        modalProps={{ onCancel: hideAndResetPswModal }}
        onFinish={async values => {
          if (currentRow?.id) {
            await updateUserPassword({
              userId: currentRow.id,
              password: values.password
            });
            message.success('更改成功！');
            hideAndResetPswModal();
            return true;
          }
          return false;
        }}
      >
        <ProFormText
          name="password"
          label="新密码"
          placeholder="请输入新密码"
          rules={[{ required: true, message: '请输入新密码!' }]}
        />
      </ModalForm>
    </TabsViewLayout>
  );
};

export default User;
