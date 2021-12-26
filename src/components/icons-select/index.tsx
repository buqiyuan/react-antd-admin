import './index.less';

import { Input, Popover } from 'antd';
import { type FC, useState } from 'react';

import { IconFont } from '@/components/iconfont';

import icons from './icons.json';

const { glyphs } = icons;

interface IconSelectProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

export const IconSelect: FC<IconSelectProps> = props => {
  const { value, placeholder = '请选择', onChange } = props;

  const [modelValue, setModelValue] = useState(value);

  const selectIcon = (iconItem: typeof glyphs[number]) => {
    setModelValue(iconItem.font_class);
    onChange?.(iconItem.font_class);
  };

  return (
    <Popover
      placement="bottomLeft"
      overlayClassName="icon-select"
      content={
        <div className="select-box">
          {glyphs.map(iconItem => (
            <div
              key={iconItem.font_class}
              title={iconItem.name}
              className={[
                'select-box-item',
                modelValue?.replace('icon-', '') == iconItem.font_class ? 'active' : null
              ].join(' ')}
              onClick={() => selectIcon(iconItem)}
            >
              <IconFont type={iconItem.font_class} size="20" />
            </div>
          ))}
        </div>
      }
      trigger="focus"
    >
      <Input
        value={modelValue}
        placeholder={placeholder}
        addonBefore={modelValue ? <IconFont type={modelValue} size="22" /> : null}
      ></Input>
    </Popover>
  );
};
