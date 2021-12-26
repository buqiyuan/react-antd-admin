import { Menu } from 'antd';
import { observer } from 'mobx-react-lite';
import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { IconFont } from '@/components/iconfont';
import type { MenuList } from '@/routes/types';
import { tagsViewStore } from '@/stores/tags-view';
import { userStore } from '@/stores/user';
import { isExternal } from '@/utils/validate';

const { SubMenu, Item } = Menu;

interface MenuProps {
  menuList: MenuList;
  prefix?: string;
}

const MenuComponent: FC<MenuProps> = ({ menuList }) => {
  const [openKeys, setOpenkeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const { collapsed, device, locale, routeList } = userStore;
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const getTitie = (menu: MenuList[0]) => {
    return (
      <span style={{ display: 'flex', alignItems: 'center' }}>
        {menu.meta?.icon && <IconFont type={menu.meta?.icon} />}
        <span>{menu.meta?.title?.[locale]}</span>
      </span>
    );
  };

  const onMenuClick = (menu: MenuList[0]) => {
    const fullPath = menu.key || menu.path;
    if (fullPath === pathname) return;
    const { key, meta } = menu;
    if (device !== 'DESKTOP') {
      userStore.collapsed = true;
    }
    if (isExternal(menu.path)) {
      return window.open(menu.path);
    }
    tagsViewStore.addTag({
      id: key,
      title: meta?.title || '',
      path: fullPath,
      closable: true
    });
    setSelectedKeys([fullPath]);
    navigate(fullPath, { state: { fullPath } });
  };

  useEffect(() => {
    const currentRoute = routeList.find(m => m.key === pathname);
    console.log('currentRoute', currentRoute);
    setSelectedKeys([pathname]);
    setOpenkeys(collapsed ? [] : currentRoute?.keyPath || [pathname]);
  }, [collapsed, pathname, routeList]);

  const onOpenChange = (keys: string[]) => {
    setOpenkeys(keys);
  };

  const getMenus = (menuList: MenuList) => {
    return menuList
      ?.filter(item => !item.meta?.hidden)
      ?.map(menu => {
        return menu.children ? (
          <SubMenu key={menu.key || menu.path} title={getTitie(menu)}>
            {getMenus(menu.children)}
          </SubMenu>
        ) : (
          <Item key={menu.key || menu.path} onClick={() => onMenuClick(menu)}>
            {getTitie(menu)}
          </Item>
        );
      });
  };

  return (
    <Menu
      mode="inline"
      theme="light"
      selectedKeys={selectedKeys}
      openKeys={openKeys}
      onOpenChange={onOpenChange as any}
      className="layout-page-sider-menu"
    >
      {getMenus(menuList)}
    </Menu>
  );
};

export default observer(MenuComponent);
