import './index.less';

import { Card, Layout } from 'antd';
import { throttle } from 'lodash';
import type React from 'react';
import type { FC } from 'react';
import { useCallback } from 'react';

const { Sider, Content } = Layout;

interface TabsViewLayoutProps {
  /** 默认插槽 */
  children?: React.ReactNode;
  /** 侧边栏 */
  assideRender?: React.ReactNode;
  /** 侧边栏宽度 */
  assideWidth?: number;
  /** 拖拽侧边栏回调函数 */
  onSeparatorDrag?: (width: number) => void;
}

export const TabsViewLayout: FC<TabsViewLayoutProps> = ({
  children,
  assideRender,
  assideWidth = 280,
  onSeparatorDrag
}) => {
  let startX: number;

  /**
   * @description 正在拖拽
   */
  const onDrag = throttle((e: MouseEvent) => {
    requestAnimationFrame(() => {
      const width = assideWidth + e.clientX - startX;
      onSeparatorDrag?.(Math.max(width, 10));
    });
  }, 20);

  /**
   * @description 拖拽结束
   */
  const onDragEnd = useCallback(() => {
    document.documentElement.style.userSelect = 'unset';
    document.documentElement.removeEventListener('mousemove', onDrag);
    document.documentElement.removeEventListener('mouseup', onDragEnd);
  }, [onDrag]);

  /**
   * @description 鼠标按下样式
   */
  const onDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    startX = e.clientX;
    document.documentElement.style.userSelect = 'none';
    document.documentElement.addEventListener('mousemove', onDrag);
    document.documentElement.addEventListener('mouseup', onDragEnd);
  };

  return (
    <Card style={{ margin: '20px' }} bordered={false}>
      <Layout>
        {assideRender ? (
          <Sider width={assideWidth} theme={'light'} style={{ paddingRight: '20px' }}>
            {assideRender}
            <div className="separator" onMouseDown={onDragStart}>
              <i></i>
              <i></i>
            </div>
          </Sider>
        ) : null}
        <Layout>
          <Content>{children}</Content>
        </Layout>
      </Layout>
    </Card>
  );
};
