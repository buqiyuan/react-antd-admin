import 'moment/locale/zh-cn';

import { ConfigProvider } from 'antd';
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import React, { useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import { HashRouter } from 'react-router-dom';

import { userStore } from '@/stores/user';

import { localeConfig } from './locales';
import RenderRouter from './routes';

const App: React.FC = () => {
  const { locale } = userStore;

  // set the locale for the user
  // more languages options can be added here
  useEffect(() => {
    if (locale === 'en_US') {
      moment.locale('en');
    } else if (locale === 'zh_CN') {
      moment.locale('zh-cn');
    }
  }, [locale]);

  /**
   * handler function that passes locale
   * information to ConfigProvider for
   * setting language across text components
   */
  const getAntdLocale = () => {
    if (locale === 'en_US') {
      return enUS;
    } else if (locale === 'zh_CN') {
      return zhCN;
    }
  };

  return (
    // <React.StrictMode>
    <ConfigProvider locale={getAntdLocale()} componentSize="middle">
      <IntlProvider locale={locale.split('_')[0]} messages={localeConfig[locale]}>
        <HashRouter>
          {/* <Suspense fallback={'loa'}> */}
          <RenderRouter />
          {/* </Suspense> */}
        </HashRouter>
      </IntlProvider>
    </ConfigProvider>
    // </React.StrictMode>
  );
};

export default observer(App);
