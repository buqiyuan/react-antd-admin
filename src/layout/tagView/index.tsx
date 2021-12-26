import { Tabs } from 'antd';
import { observer } from 'mobx-react-lite';
import { FC, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { tagsViewStore } from '@/stores/tags-view';
import { userStore } from '@/stores/user';

import TagsViewAction from './tagViewAction';

const { TabPane } = Tabs;

const TagsView: FC = () => {
  const { tags, activeTagId } = tagsViewStore;
  const { locale, routeList } = userStore;
  const navigate = useNavigate();
  const location = useLocation();

  // onClick tag
  const onChange = (key: string) => {
    const tag = tags.find(tag => tag.id === key);
    if (tag) {
      setCurrentTag(tag.id);
      navigate(tag.path);
    }
  };

  // onRemove tag
  const onClose = (targetKey: string) => {
    tagsViewStore.removeTag(targetKey);
  };

  const setCurrentTag = useCallback(
    (id?: string) => {
      const tag = tags.find(item => {
        if (id) {
          return item.id === id;
        } else {
          return item.path === location.pathname;
        }
      });

      if (tag) {
        tagsViewStore.setActiveTag(tag.id);
      }
    },
    [location.pathname, tags]
  );

  useEffect(() => {
    if (routeList.length) {
      const menu = routeList.find(m => m.key === location.pathname);
      if (menu) {
        // Initializes dashboard page.
        const dashboard = routeList[0];
        tagsViewStore.addTag({
          path: dashboard.key,
          title: dashboard.meta?.title || '',
          id: dashboard.key,
          closable: false
        });
        // Initializes the tag generated for the current page
        // Duplicate tag will be ignored in redux.
        tagsViewStore.addTag({
          path: menu.key,
          title: menu.meta?.title || '',
          id: menu.key,
          closable: true
        });
      }
    }
  }, [location.pathname, routeList]);

  //fix: remove tab route back auto
  useEffect(() => {
    if (tags && activeTagId) {
      const target = tags.find(e => e.id === activeTagId);
      if (target) {
        navigate(target.path);
      } else {
        setCurrentTag(tags[1].id);
      }
    }
  }, [tags, activeTagId, navigate, setCurrentTag]);

  return (
    <div id="pageTabs" style={{ background: '#fff', padding: '6px 4px' }}>
      <Tabs
        tabBarStyle={{ margin: 0 }}
        onChange={onChange}
        activeKey={activeTagId}
        type="editable-card"
        hideAdd
        onEdit={(targetKey, action) => action === 'remove' && onClose(targetKey as string)}
        tabBarExtraContent={<TagsViewAction activeTagId={activeTagId} />}
      >
        {tags.map(tag => (
          <TabPane
            key={tag.id}
            tab={
              <TagsViewAction destroyPopupOnHide={true} activeTagId={activeTagId} trigger={['contextMenu']}>
                {tag.title[locale]}
              </TagsViewAction>
            }
            closable={tag.closable}
          />
        ))}
      </Tabs>
    </div>
  );
};

export default observer(TagsView);
