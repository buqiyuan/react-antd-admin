import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useLocale } from '@/locales';

const NotFoundPage: React.FC<{}> = () => {
  const navigate = useNavigate();
  const { formatMessage } = useLocale();
  return (
    <Result
      title="任务调度页面"
      subTitle={formatMessage({ id: 'gloabal.tips.notfound' })}
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          任务调度页面
        </Button>
      }
    ></Result>
  );
};

export default NotFoundPage;
