import { ModalForm, ProFormDigit, ProFormText } from '@ant-design/pro-form';
import { Form, FormInstance, message, TreeSelect } from 'antd';
import { DataNode } from 'antd/lib/tree';
import React, { useEffect, useRef } from 'react';

import { createDept, getDeptInfo, updateDept } from '@/api/system/dept';

type FormDetail = API.CreateDeptParams & API.UpdateDeptParams;

interface OperateUserFormModalProps {
  visible: boolean;
  deptTree: DataNode[];
  currentDept?: DataNode | undefined;
  onCancel: () => void;
  onSuccess: () => void;
}

export const OperateDeptFormModal: React.FC<OperateUserFormModalProps> = props => {
  const { currentDept, deptTree, onCancel, onSuccess, visible } = props;
  const formRef = useRef<FormInstance<FormDetail>>();

  useEffect(() => {
    const fetchDeptInfo = async () => {
      if (currentDept?.key && Number.isInteger(currentDept.key)) {
        const { department } = await getDeptInfo({ departmentId: currentDept.key });
        formRef.current?.setFieldsValue({
          parentId: department.parentId ?? -1,
          name: department.name,
          orderNum: department.orderNum
        });
      }
    };
    if (visible) {
      fetchDeptInfo();
    }
  }, [currentDept, visible]);

  return (
    <ModalForm<FormDetail>
      formRef={formRef}
      title={`${currentDept?.key ? '编辑' : '新增'}部门`}
      visible={visible}
      modalProps={{ onCancel }}
      onFinish={async values => {
        if (currentDept?.key && Number.isInteger(currentDept.key)) {
          const params = {
            ...values,
            id: currentDept?.key
          };
          const data = await updateDept(params);
          console.log(data, values);
          message.success('修改部门成功');
        } else {
          const data = await createDept(values);
          console.log(data, values);
          message.success('新增部门成功');
        }
        formRef.current?.resetFields();
        onSuccess();
        return true;
      }}
    >
      <ProFormText
        name="name"
        label="部门名称"
        placeholder="请输入部门名称"
        rules={[{ required: true, message: '请输入部门名称!' }]}
      />
      <Form.Item name="parentId" label="上级部门" rules={[{ required: true, message: '请选择上级部门!' }]}>
        <TreeSelect
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={[{ key: -1, title: '#', children: deptTree }]}
          placeholder="请选择所属部门"
          treeDefaultExpandAll
        />
      </Form.Item>
      <ProFormDigit label="排序" name="orderNum" min={0} />
    </ModalForm>
  );
};

export default OperateDeptFormModal;
