import { FC } from 'react';
import { useIntl } from 'react-intl';
import { RouteProps } from 'react-router';

import PrivateRoute from './pravateRoute';

export interface WrapperRouteProps extends RouteProps {
  /** document title locale id */
  titleId: string;
  /** authorization？ */
  auth?: boolean;
}

const WrapperRouteComponent: FC<WrapperRouteProps> = ({ titleId, auth, ...props }) => {
  const { formatMessage } = useIntl();
  const WitchRoute = auth ? <PrivateRoute {...props} /> : props.element;
  if (titleId) {
    requestIdleCallback(() => {
      document.title = formatMessage({
        id: titleId
      });
    });
  }
  return WitchRoute || null;
};

export default WrapperRouteComponent;
