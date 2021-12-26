import ProForm, { ModalForm, ProFormRadio, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Form, FormInstance, message, TreeSelect } from 'antd';
import { DataNode } from 'antd/lib/tree';
import React, { useEffect, useRef } from 'react';

import { getRoleList } from '@/api/system/role';
import { createUser, getUserInfo, updateUser } from '@/api/system/user';

export type ListItemDataType = API.UserListPageResultItem & API.CreateUserParams;
interface OperateUserFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  detail: Partial<ListItemDataType> | undefined;
  deptTree: DataNode[];
}

export const OperateUserFormModal: React.FC<OperateUserFormModalProps> = props => {
  const { visible, deptTree, detail, onCancel, onSuccess } = props;
  const formRef = useRef<FormInstance<ListItemDataType>>();

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (detail?.id) {
        const { roles } = await getUserInfo({ userId: detail.id });
        formRef.current?.setFieldsValue({
          roles: roles
        });
      }
    };
    if (visible) {
      fetchUserInfo();
    }
    formRef.current?.resetFields();
    formRef.current?.setFieldsValue({
      ...detail
    });
  }, [detail, visible]);

  return (
    <ModalForm<ListItemDataType>
      formRef={formRef}
      title={`${detail?.id ? '编辑' : '新增'}用户`}
      width={840}
      visible={visible}
      layout="horizontal"
      modalProps={{ onCancel }}
      onFinish={async values => {
        if (detail?.id) {
          const params = {
            ...values!,
            id: detail.id
          };
          const data = await updateUser(params);
          console.log(data, values);
          message.success('修改用户成功');
        } else {
          const data = await createUser(values);
          console.log(data, values);
          message.success('新增用户成功');
        }
        onSuccess();
        return true;
      }}
    >
      <Form.Item name="departmentId" label="所属部门" rules={[{ required: true, message: '请选择所属部门!' }]}>
        <TreeSelect
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={deptTree}
          placeholder="请选择所属部门"
          treeDefaultExpandAll
        />
      </Form.Item>
      <ProFormSelect
        mode="multiple"
        name="roles"
        label="所属角色"
        rules={[{ required: true, message: '请选择所属角色!' }]}
        request={async () => {
          const response = await getRoleList();
          return response.map(item => ({ label: item.name, value: item.id }));
        }}
      />
      <ProFormText
        name="username"
        label="用户名"
        tooltip="由6位以上的数字和字母组成"
        placeholder="请输入用户名"
        rules={[{ required: true, message: '请输入用户名!' }]}
      />
      <ProForm.Group>
        <ProFormText
          width="md"
          name="name"
          label="姓名"
          placeholder="请输入姓名"
          rules={[{ required: true, message: '请输入姓名!' }]}
        />
        <ProFormText width="md" name="nickName" label="昵称" placeholder="请输入昵称" />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText width="md" name="email" label="邮箱" placeholder="请输入邮箱" />
        <ProFormText width="md" name="phone" label="手机" placeholder="请输入手机" />
      </ProForm.Group>
      <ProFormTextArea name="remark" label="备注" />
      <ProFormRadio.Group
        name="status"
        label="状态"
        initialValue={detail?.status || 1}
        options={[
          {
            label: '启用',
            value: 1
          },
          {
            label: '禁用',
            value: 0
          }
        ]}
      />
    </ModalForm>
  );
};

export default OperateUserFormModal;
