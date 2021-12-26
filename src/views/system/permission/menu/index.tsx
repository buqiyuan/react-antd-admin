import { CheckOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm, Tag } from 'antd';
import { useRef, useState } from 'react';

import { getMenuList } from '@/api/system/menu';
import { deleteMenu } from '@/api/system/menu';

import { OperateFormModal } from './components/OperateFormModal';

type TableListItem = API.MenuListResultItem;

const filterMenuListToTable = (menus: API.MenuListResult, parentId: number | null = null): API.MenuListResult => {
  return menus
    .filter(item => item.parentId === parentId)
    .map(item => {
      const children = filterMenuListToTable(menus, item.id);
      return children.length
        ? {
            ...item,
            children
          }
        : item;
    });
};

const menuTypeMap = {
  0: '目录',
  1: '菜单',
  2: '权限'
};

const Menu = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<TableListItem | undefined>(undefined);

  const actionRef = useRef<ActionType>();

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
   * @param {API.RoleListResultItem} record
   */
  const delRowConfirm = (record: API.MenuListResultItem) => {
    deleteMenu({ menuId: record.id }).finally(refreshTable);
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      width: 300,
      align: 'left'
    },
    {
      title: '图标',
      dataIndex: 'icon',
      width: 80,
      align: 'center'
    },
    {
      title: '节点路由',
      dataIndex: 'router',
      width: 240,
      align: 'center'
    },
    {
      title: '类型',
      dataIndex: 'type',
      align: 'center',
      width: 80,
      render: (_, { type }) => <Tag color="#1890ff">{menuTypeMap[type]}</Tag>
    },
    {
      title: '路由缓存',
      dataIndex: 'keepalive',
      width: 140,
      align: 'center',
      render: (_, { keepalive, type }) => (keepalive && type === 1 ? <CheckOutlined /> : null)
    },
    {
      title: '文件路由',
      dataIndex: 'viewPath',
      width: 180,
      align: 'center'
    },
    {
      title: '权限',
      dataIndex: 'perms',
      width: 300,
      align: 'center',
      render: (_, { perms }) =>
        perms?.split(',')?.map(item => (
          <Tag color="#1890ff" key={item}>
            {item}
          </Tag>
        ))
    },
    {
      title: '排序号',
      dataIndex: 'orderNum',
      width: 80,
      align: 'center'
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      width: 300,
      align: 'center'
    },
    {
      title: '操作',
      width: 150,
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      align: 'center',
      render: (_, record) => [
        <a
          key={'edit'}
          onClick={() => {
            setCurrentRow(record);
            setModalVisible(true);
          }}
        >
          编辑
        </a>,
        <Popconfirm key="del" placement="left" title="你确定要删除该菜单吗?" onConfirm={() => delRowConfirm(record)}>
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
        size="small"
        request={async _ => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const list = await getMenuList();
          const tableData = filterMenuListToTable(list);
          return {
            data: tableData,
            success: true
          };
        }}
        sticky={true}
        rowKey="id"
        scroll={{ x: 1500, y: 600 }}
        pagination={{
          showQuickJumper: true
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
      />
      <OperateFormModal
        visible={modalVisible}
        detail={currentRow}
        onCancel={handleModalOnCancel}
        onSuccess={handleModalOnSuccess}
      />
    </>
  );
};

export default Menu;
