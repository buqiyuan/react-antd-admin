import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Modal, Space, Tooltip, Tree } from 'antd';
import type { Key } from 'rc-tree/lib/interface';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useAsyncFn } from 'react-use';

import { deleteDept, getDeptList } from '@/api/system/dept';

import styles from './deptTreePanel.module.less';
import { OperateDeptFormModal } from './OperateDeptFormModal';

interface DataNode {
  title: string;
  key: number;
  isLeaf?: boolean;
  children?: DataNode[];
}

interface DeptTreePanelProps {
  onSelect?: (selectedKeys: Key[]) => void;
  onDeptTreeChange?: (treeData: DataNode[]) => void;
}

/**
 * @description 生成符合antd tree组件要求的数据格式
 */
const generateTreeData = (data: API.SysDeptListResult[], parentId: number | null = null): DataNode[] => {
  return data
    .filter(item => item.parentId === parentId)
    .map(item => ({
      title: item.name,
      key: item.id,
      value: item.id,
      children: generateTreeData(data, item.id)
    }));
};

const getChildrenKeys = (nodes: DataNode[], result: number[] = []) => {
  return nodes.reduce((prev, curr) => {
    const arr = [curr.key];
    if (curr.children) {
      arr.push(...getChildrenKeys(curr.children));
    }
    return prev.concat(arr);
  }, result);
};

export const DeptTreePanel: FC<DeptTreePanelProps> = props => {
  const [visible, setVisible] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const [currentDept, setCurrentDept] = useState<DataNode | undefined>();

  const [deptTree, fetchDeptList] = useAsyncFn(async () => {
    const data = await getDeptList();
    const treeData = generateTreeData(data);
    const expandedKeys = treeData.map(n => n.key);
    const selectedKey = data.find(n => Object.is(n.parentId, null))?.id;
    setTimeout(() => {
      setSelectedKeys(selectedKey ? [selectedKey] : []);
      setExpandedKeys(expandedKeys);
      props.onDeptTreeChange?.(treeData);
    });
    return treeData;
  }, []);

  useEffect(() => {
    fetchDeptList();
  }, [fetchDeptList]);

  const onExpand = (expandedKeys: Key[]) => {
    setExpandedKeys(expandedKeys);
  };
  /** 弹窗取消操作的时候 */
  const handleModalOnCancel = () => {
    setCurrentDept(undefined);
    setVisible(false);
  };
  /** 新增或编辑部门成功后回调 */
  const handleModalOnSuccess = () => {
    handleModalOnCancel();
    fetchDeptList();
  };

  /**
   * 选择中某个部门
   * @param selectedKeys
   * @param info
   */
  const onSelect = (selectedKeys: Key[], info: any) => {
    console.log('selectedKeys', getChildrenKeys(info.selectedNodes), info);
    setSelectedKeys(selectedKeys);
    props.onSelect?.(getChildrenKeys(info.selectedNodes));
  };

  const showDelConfirm = (departmentId: number | string) => {
    Modal.confirm({
      title: '您确定要删除该部门吗?',
      icon: <ExclamationCircleOutlined />,
      centered: true,
      onOk: async () => {
        await deleteDept({ departmentId });
        return fetchDeptList();
      }
    });
  };

  return (
    <>
      <div className={styles['dept-tree-panel-container']}>
        <div className={styles.header}>
          <div className={styles.title}>组织架构</div>
          <div className={styles['operate-wrapper']}>
            <div className={styles['tool-item']}>
              <Tooltip title="新增部门">
                <PlusOutlined
                  onClick={() => {
                    setVisible(true);
                    setCurrentDept(undefined);
                  }}
                />
              </Tooltip>
            </div>
            <div className={styles['tool-item']}>
              <Tooltip title="点击刷新">
                <SyncOutlined onClick={fetchDeptList} spin={deptTree.loading} />
              </Tooltip>
            </div>
          </div>
        </div>
        <Tree
          className="draggable-tree"
          selectedKeys={selectedKeys}
          expandedKeys={expandedKeys}
          blockNode
          treeData={deptTree.value}
          onSelect={onSelect}
          onExpand={onExpand}
          titleRender={nodeData => (
            <Dropdown
              overlay={
                <Menu onClick={({ domEvent }) => domEvent.stopPropagation()}>
                  <Menu.Item key="1">
                    <Space
                      size="large"
                      align="center"
                      onClick={() => {
                        setCurrentDept(nodeData);
                        setVisible(true);
                      }}
                    >
                      <span>编辑</span>
                      <EditOutlined style={{ verticalAlign: '0' }} />
                    </Space>
                  </Menu.Item>
                  <Menu.Item onClick={() => showDelConfirm(nodeData.key)} key="2">
                    <Space size="large" align="center">
                      <span>删除</span>
                      <DeleteOutlined style={{ verticalAlign: '0' }} />
                    </Space>
                  </Menu.Item>
                </Menu>
              }
              trigger={['contextMenu']}
            >
              <div>{nodeData.title}</div>
            </Dropdown>
          )}
        />
      </div>
      <OperateDeptFormModal
        visible={visible}
        deptTree={deptTree.value!}
        onSuccess={handleModalOnSuccess}
        onCancel={handleModalOnCancel}
        currentDept={currentDept}
      />
    </>
  );
};
