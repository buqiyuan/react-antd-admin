import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Layout, Menu } from 'antd';
import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import UserAvatar from '@/assets/header/avatar.jpg';
import { ReactComponent as EnUsSvg } from '@/assets/header/en_US.svg';
import { ReactComponent as LanguageSvg } from '@/assets/header/language.svg';
import { ReactComponent as ZhCnSvg } from '@/assets/header/zh_CN.svg';
import AntdSvg from '@/assets/logo/antd.svg';
import ReactSvg from '@/assets/logo/react.svg';
import { useLocale } from '@/locales';
import { userStore } from '@/stores/user';

import HeaderNoticeComponent from './notice';

const { Header } = Layout;

interface HeaderProps {
  collapsed: boolean;
  toggle: () => void;
}

type Action = 'userInfo' | 'userSetting' | 'logout';

const HeaderComponent: FC<HeaderProps> = ({ collapsed, toggle }) => {
  const { name, locale } = userStore;
  const navigate = useNavigate();
  const { formatMessage } = useLocale();

  const onActionClick = async (action: Action) => {
    switch (action) {
      case 'userInfo':
        return;
      case 'userSetting':
        return;
      case 'logout':
        // eslint-disable-next-line no-case-declarations
        const res = Boolean(await userStore.logout());
        res && navigate('/login');
        return;
    }
  };

  const selectLocale = ({ key }: { key: any }) => {
    userStore.setLocale(key);
  };
  const menu = (
    <Menu>
      <Menu.Item key="1">
        <UserOutlined className="align-baseline" />
        {formatMessage({ id: 'header.avator.account' })}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="2" onClick={() => onActionClick('logout')}>
        <LogoutOutlined className="align-baseline" />
        {formatMessage({ id: 'header.avator.logout' })}
      </Menu.Item>
    </Menu>
  );
  return (
    <Header className="layout-page-header">
      <div className="logo" style={{ width: collapsed ? 80 : 200 }}>
        <img src={ReactSvg} alt="" style={{ marginRight: collapsed ? '2px' : '20px' }} />
        <img src={AntdSvg} alt="" />
      </div>
      <div className="layout-page-header-main">
        <div onClick={toggle}>
          <span id="sidebar-trigger">{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</span>
        </div>
        <div className="actions">
          <HeaderNoticeComponent />
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu onClick={selectLocale}>
                <Menu.Item style={{ textAlign: 'left' }} disabled={locale === 'zh_CN'} key="zh_CN">
                  <ZhCnSvg /> 简体中文
                </Menu.Item>
                <Menu.Item style={{ textAlign: 'left' }} disabled={locale === 'en_US'} key="en_US">
                  <EnUsSvg /> English
                </Menu.Item>
              </Menu>
            }
          >
            <span>
              <LanguageSvg id="language-change" />
            </span>
          </Dropdown>
          <div>
            <Dropdown overlay={menu} trigger={['click']}>
              <span className="user-action">
                <Avatar src={UserAvatar} />
              </span>
            </Dropdown>
            <span>{name}</span>
          </div>
        </div>
      </div>
    </Header>
  );
};

export default observer(HeaderComponent);
