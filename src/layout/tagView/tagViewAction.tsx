import { SettingOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import type { DropDownProps } from 'antd/lib/dropdown/dropdown';
import { observer } from 'mobx-react-lite';
import { FC } from 'react';

import { LocaleFormatter } from '@/locales';
import { tagsViewStore } from '@/stores/tags-view';

interface TagsViewActionProps extends Partial<DropDownProps> {
  activeTagId: string;
}

const TagsViewAction: FC<TagsViewActionProps> = props => {
  const { activeTagId } = props;
  return (
    <Dropdown
      {...props}
      overlay={
        <Menu>
          <Menu.Item key="0" onClick={() => tagsViewStore.removeTag(activeTagId)}>
            <LocaleFormatter id="tagsView.operation.closeCurrent" />
          </Menu.Item>
          <Menu.Item key="1" onClick={() => tagsViewStore.removeOtherTag()}>
            <LocaleFormatter id="tagsView.operation.closeOther" />
          </Menu.Item>
          <Menu.Item key="2" onClick={() => tagsViewStore.removeAllTag()}>
            <LocaleFormatter id="tagsView.operation.closeAll" />
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="3" onClick={() => tagsViewStore.removeAllTag()}>
            <LocaleFormatter id="tagsView.operation.dashboard" />
          </Menu.Item>
        </Menu>
      }
    >
      <span id="pageTabs-actions">{props.children ?? <SettingOutlined className="tagsView-extra" />}</span>
    </Dropdown>
  );
};

export default observer(TagsViewAction);
