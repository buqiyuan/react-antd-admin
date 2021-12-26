import {
  ModalForm,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormSwitch,
  ProFormText
} from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { Cascader, Form, message, Tag, TreeSelect } from 'antd';
import type { DataNode } from 'rc-tree-select/lib/interface';
import React, { useEffect, useRef } from 'react';
import { useAsync } from 'react-use';

import { getMenuList } from '@/api/system/menu';
import { createMenu, getMenuInfo, updateMenu } from '@/api/system/menu';
import { IconSelect } from '@/components/icons-select';
import { formarPermsToCascader, permissionValues } from '@/core/permission/';
import { constantRouterComponents } from '@/routes/modules';

// 节点路径
const viewPathOptions = Object.keys(constantRouterComponents).map((item: string) => ({ label: item, value: item }));
// 权限级联选择器
const cascaderOptions = formarPermsToCascader();

interface OperateFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  detail: Partial<API.MenuListResultItem & API.MenuAddParams> | undefined;
}

const generateTreeData = (
  list: (API.MenuListResultItem | API.SysDeptListResult)[],
  parentId: null | number = null
): DataNode[] => {
  return list
    .filter(item => Object.is(item.parentId, parentId))
    .map(item => ({
      title: item.name,
      value: item.id,
      children: generateTreeData(list, item.id)
    }));
};

export const OperateFormModal: React.FC<OperateFormModalProps> = props => {
  const { visible, detail, onCancel, onSuccess } = props;

  const formRef = useRef<FormInstance>();

  const menuTreeData = useAsync(async () => {
    if (visible) {
      const response = await getMenuList();
      return [
        {
          title: '一级菜单',
          value: -1,
          children: generateTreeData(response)
        }
      ];
    }
  }, [visible]);

  useEffect(() => {
    const fetchMenuInfo = async () => {
      if (detail?.id) {
        const { menu } = await getMenuInfo({ menuId: detail.id });

        formRef?.current?.setFieldsValue({
          ...menu,
          perms: menu.perms?.split(',')?.map(n => n.split(':')),
          parentId: menu.parentId ?? -1
        });
      }
    };
    if (visible) {
      formRef.current?.resetFields();
      fetchMenuInfo();
    }
  }, [detail, visible]);

  const tagRender = props => {
    const v = props.value.split('__RC_CASCADER_SPLIT__').map(n => n.split(':').at(-1));
    return <Tag {...props}>{v.join(':')}</Tag>;
  };

  return (
    <ModalForm<API.MenuAddParams & API.MenuUpdateParams>
      formRef={formRef}
      title={`${detail?.id ? '编辑' : '新增'}菜单`}
      visible={visible}
      initialValues={{
        type: 0
      }}
      layout="horizontal"
      modalProps={{ onCancel }}
      onFinish={async values => {
        console.log(values);
        const params = {
          ...values
        };
        if (values.type === 2) {
          const perms = (params.perms as unknown as string[][]).flatMap(n => n.join(':'));
          params.perms = permissionValues.filter(n => perms.some(m => n.includes(m))).join(',');
        }

        if (detail?.id) {
          params.menuId = detail.id;
          await updateMenu(params);
          message.success('修改成功');
        } else {
          await createMenu(params);
          message.success('创建成功');
        }
        onSuccess();
        return true;
      }}
    >
      <ProFormRadio.Group
        name="type"
        label="菜单类型"
        options={[
          {
            label: '目录',
            value: 0
          },
          {
            label: '菜单',
            value: 1
          },
          {
            label: '权限',
            value: 2
          }
        ]}
      />
      <ProFormText
        name="name"
        label="节点名称"
        placeholder="请输入节点名称"
        rules={[{ required: true, message: '请输入节点名称!' }]}
      />
      <Form.Item name="parentId" label="上级节点" rules={[{ required: true, message: '请选择上级节点!' }]}>
        <TreeSelect
          treeDefaultExpandedKeys={detail?.parentId ? [detail?.parentId] : []}
          treeData={menuTreeData.value}
        />
      </Form.Item>
      {/*  ProFormDependency 会自动注入并且 进行 shouldUpdate 的比对  */}
      <ProFormDependency name={['type']}>
        {({ type }) => {
          return type === 2 ? null : (
            <ProFormText
              name="router"
              label="节点路由"
              rules={[
                {
                  required: true,
                  message: '请输入正确的节点路由'
                }
              ]}
            />
          );
        }}
      </ProFormDependency>

      <ProFormDependency name={['type']}>
        {({ type }) => {
          return type === 2 ? (
            <Form.Item name="perms" label="权限">
              <Cascader multiple={true} options={cascaderOptions} tagRender={tagRender}></Cascader>
            </Form.Item>
          ) : null;
        }}
      </ProFormDependency>

      <ProFormDependency name={['type']}>
        {({ type }) => {
          return type === 2 ? null : (
            <Form.Item name="icon" label="节点图标">
              <IconSelect></IconSelect>
            </Form.Item>
          );
        }}
      </ProFormDependency>

      <ProFormDependency name={['type']}>
        {({ type }) => {
          return type === 1 ? <ProFormSelect options={viewPathOptions} name="viewPath" label="节点路径" /> : null;
        }}
      </ProFormDependency>
      <ProFormDependency name={['type']}>
        {({ type }) => {
          return type === 1 ? <ProFormSwitch name="keepalive" label="是否缓存" /> : null;
        }}
      </ProFormDependency>
      <ProFormDependency name={['type']}>
        {({ type }) => {
          return type === 2 ? <ProFormSwitch name="isShow" label="是否显示" /> : null;
        }}
      </ProFormDependency>
      <ProFormDigit name="orderNum" label="排序号" initialValue={255} />
    </ModalForm>
  );
};

export default OperateFormModal;
