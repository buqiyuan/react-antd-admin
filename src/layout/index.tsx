import './index.less';

import { Layout } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { RouteView } from '@/routes/routeView';
import { userStore } from '@/stores/user';

import HeaderComponent from './header';
import MenuComponent from './menu';
import TagsView from './tagView';

const { Sider, Content } = Layout;

const LayoutPage: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [navigate, location]);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className="layout-page">
      <HeaderComponent collapsed={collapsed} toggle={toggle} />
      <Layout>
        <Sider className="layout-page-sider" trigger={null} collapsible collapsed={collapsed} breakpoint="md">
          <MenuComponent menuList={userStore.menuList} />
        </Sider>
        <Content className="layout-page-content">
          <TagsView />
          <RouteView />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutPage;
