import { Modal } from 'antd';
import { makeAutoObservable } from 'mobx';

import { EVENT_KICK } from '@/core/socket/event-type';
import type { SocketIOWrapperType, SocketStatusType } from '@/core/socket/socket-io';
import { SocketIOWrapper, SocketStatus } from '@/core/socket/socket-io';
import { userStore } from '@/stores/user';

export const wsStore = makeAutoObservable({
  // socket wrapper 实例
  client: null as SocketIOWrapperType | null,
  // socket 连接状态
  status: SocketStatus.CLOSE as SocketStatusType,
  setClient(client: SocketIOWrapperType | null) {
    this.client = client as any;
  },
  setStatus(status: SocketStatusType) {
    if (this.status === status) {
      return;
    }
    this.status = status;
  },
  // 初始化Socket
  initSocket() {
    // check is init
    if (this.client?.isConnected?.()) {
      return;
    }
    const ws = new SocketIOWrapper();
    ws.subscribe(EVENT_KICK, async data => {
      // reset token
      userStore.resetToken();
      Modal.warning({
        title: '警告',
        content: `您已被管理员${data.operater}踢下线！`,
        centered: true,
        okText: '重新登录',
        onOk() {
          // 刷新页面
          window.location.reload();
        }
      });
    });
    this.setClient(ws);
  },

  // 关闭Socket连接
  closeSocket() {
    this.client?.close?.();
    this.setClient(null);
  }
});

export default wsStore;
