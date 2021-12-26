import { Alert, Spin } from 'antd';
import { FC } from 'react';

interface FallbackMessageProps {
  message: string;
  description?: string;
}

export const SuspendFallbackLoading: FC<FallbackMessageProps> = ({ message, description }) => {
  return (
    <Spin tip="加载中...">
      <Alert message={message} description={description} type="info" />
    </Spin>
  );
};

export default SuspendFallbackLoading;
