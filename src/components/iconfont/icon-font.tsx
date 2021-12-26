import { createFromIconfontCN } from '@ant-design/icons';
import { omit } from 'lodash';
import { useMemo } from 'react';

import { isString } from '@/utils/is';

let scriptUrls = [`${import.meta.env.BASE_URL}iconfont.js`];

let MyIconFont = createFromIconfontCN({
  // scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
  // scriptUrl: '//at.alicdn.com/t/font_2184398_zflo1kjcemp.js',
  // iconfont字体图标本地化，详见：/public/iconfont.js
  scriptUrl: scriptUrls
});

export type IconFontProps = {
  type: string;
  prefix?: string;
  color?: string;
  size?: number | string;
  scriptUrl?: string | string[];
};

export const IconFont = (props: IconFontProps) => {
  const { type, prefix = 'icon-', color = 'unset', size = 14, scriptUrl } = props;

  // 如果外部传进来字体图标路径，则覆盖默认的
  if (scriptUrl) {
    scriptUrls = [...new Set(scriptUrls.concat(scriptUrl))];
    MyIconFont = createFromIconfontCN({
      scriptUrl: scriptUrls
    });
  }

  const wrapStyleRef = useMemo(() => {
    const fs = isString(size) ? parseFloat(size) : size;
    return {
      color,
      fontSize: `${fs}px`
    };
  }, [size]);

  return type ? (
    <MyIconFont
      {...omit(props, ['size'])}
      type={type.startsWith(prefix) ? type : `${prefix}${type}`}
      style={wrapStyleRef}
    />
  ) : null;
};

export default IconFont;
