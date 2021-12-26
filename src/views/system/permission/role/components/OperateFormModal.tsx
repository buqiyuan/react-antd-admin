import ProForm, { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { Col, Form, message, Row, Tree } from 'antd';
import React, { Key, useEffect, useRef } from 'react';
import { useAsync } from 'react-use';

import { getDeptList } from '@/api/system/dept';
import { getMenuList } from '@/api/system/menu';
import { createRole, getRoleInfo, updateRole } from '@/api/system/role';
import { TreeDataItem } from '@/core/permission/utils';

interface OperateUserFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  detail?: Partial<API.RoleListResultItem & API.CreateRoleParams>;
}

interface TreeItem {
  parent?: TreeItem;
  title: string;
  key: Key;
  children: TreeItem[];
}

const generateTreeData = (list: API.MenuListResult | API.SysDeptListResult[], parent?: TreeItem): TreeItem[] => {
  return list
    .filter(item => Object.is(item.parentId, parent?.key ?? null))
    .map(item => {
      const treeItem: TreeItem = {
        parent,
        title: item.name,
        key: item.id,
        children: []
      };
      treeItem.children = generateTreeData(list, treeItem);
      return treeItem;
    });
};

const getCheckedKeys = (checkedList: Key[] = [], options: TreeDataItem[] = [], total = []) => {
  return options.reduce<Key[]>((prev, curr) => {
    if (curr.children?.length) {
      getCheckedKeys(checkedList, curr.children, total);
    } else {
      if (checkedList.includes(curr.key)) {
        prev.push(curr.key);
      }
    }
    return prev;
  }, total);
};

export const OperateFormModal: React.FC<OperateUserFormModalProps> = props => {
  const { visible, onCancel, detail, onSuccess } = props;

  const formRef = useRef<FormInstance>();
  // const [menuIds, setMenuIds] = useState<Key[]>([]);

  const menuTreeData = useAsync(async () => {
    if (visible) {
      const response = await getMenuList();
      return generateTreeData(response);
    }
  }, [visible]);
  const deptTreeData = useAsync(async () => {
    if (visible) {
      const response = await getDeptList();
      return generateTreeData(response);
    }
  }, [visible]);

  useEffect(() => {
    const fetchRoleInfo = async () => {
      if (visible) {
        formRef?.current?.resetFields();
        if (detail?.id) {
          const data = await getRoleInfo({ roleId: detail?.id });
          const menus = data.menus.map(n => n.menuId);
          const depts = data.depts.map(n => n.departmentId);
          setTimeout(() => {
            formRef?.current?.setFieldsValue({
              menus: getCheckedKeys(menus, menuTreeData.value!),
              depts: getCheckedKeys(depts, deptTreeData.value!)
            });
          });
        }
        // setMenuIds(menus);
      }
    };
    fetchRoleInfo();
  }, [detail, visible, menuTreeData, deptTreeData]);

  return (
    <ModalForm<API.CreateRoleParams & API.UpdateRoleParams>
      formRef={formRef}
      title={`${detail?.id ? '编辑' : '新增'}角色`}
      visible={visible}
      width={850}
      layout="horizontal"
      modalProps={{ onCancel }}
      onFinish={async values => {
        console.log(values);
        if (detail?.id) {
          values.roleId = detail.id;
          const data = await updateRole(values);
          console.log(values, data);
          message.success('修改成功');
        } else {
          const data = await createRole(values);
          message.success('创建成功');
          console.log(values, data);
        }
        onSuccess();
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormText
          width="md"
          name="name"
          label="名称"
          placeholder="请输入角色名称"
          rules={[{ required: true, message: '请输入角色名称!' }]}
        />
        <ProFormText
          width="md"
          name="label"
          label="标识"
          placeholder="请输入标识"
          rules={[{ required: true, message: '请输入标识!' }]}
        />
      </ProForm.Group>
      <ProFormTextArea name="remark" label="备注" />
      <Row>
        <Col span={12}>
          <Form.Item name="menus" label="菜单权限" valuePropName="checkedKeys" trigger="onCheck">
            <Tree checkable treeData={menuTreeData.value} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="depts" label="部门权限" valuePropName="checkedKeys" trigger="onCheck">
            <Tree checkable treeData={deptTreeData.value} />
          </Form.Item>
        </Col>
      </Row>
    </ModalForm>
  );
};

export default OperateFormModal;
