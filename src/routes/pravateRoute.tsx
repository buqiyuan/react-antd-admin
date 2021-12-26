import { Button, Result } from 'antd';
import { FC } from 'react';
import { useLocation } from 'react-router';
import { RouteProps, useNavigate } from 'react-router-dom';

import { useLocale } from '@/locales';
import { userStore } from '@/stores/user';

const PrivateRoute: FC<RouteProps> = props => {
  const { token } = userStore;
  const navigate = useNavigate();
  const { formatMessage } = useLocale();
  const { pathname } = useLocation();

  return token ? (
    props.element || null
  ) : (
    <Result
      status="403"
      title="403"
      subTitle={formatMessage({ id: 'gloabal.tips.unauthorized' })}
      extra={
        <Button
          type="primary"
          onClick={() => navigate({ pathname: 'login' }, { replace: true, state: { from: pathname } })}
        >
          {formatMessage({ id: 'gloabal.tips.goToLogin' })}
        </Button>
      }
    />
  );
};

export default PrivateRoute;
