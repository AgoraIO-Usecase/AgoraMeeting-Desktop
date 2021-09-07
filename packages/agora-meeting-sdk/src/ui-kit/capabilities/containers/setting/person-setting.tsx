import React, { FC, useState } from 'react';
import classnames from 'classnames';
import { BaseProps } from '~components/interface/base-props';
import { Select } from '~components/select';
import './index.css';
import { LanguageEnum, transI18n } from '~components/i18n';
import { GlobalStorage } from '@/infra/storage';
import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useUIStore } from '@/infra/hooks';

const DEFAULT_IN_OUT_NOTIFICATION_LIMIT_COUNT = 50;

export interface PersonSettingProps extends BaseProps {
  setUserInOutNotificationLimitCount?: (num: number) => void;
  inOutNotificationLimitCount?: number;
}

export const PersonSetting: FC<PersonSettingProps> = observer(
  ({
    setUserInOutNotificationLimitCount,
    inOutNotificationLimitCount = DEFAULT_IN_OUT_NOTIFICATION_LIMIT_COUNT,
  }) => {
    const [value, setValue] = useState(
      GlobalStorage.read('inOutLimitCount') || inOutNotificationLimitCount,
    );
    const { language, setLanguage } = useUIStore();

    const inOutOptions = [
      {
        label: transI18n('inout.always_on'),
        value: '-1',
      },
      {
        label: transI18n('inout.always_off'),
        value: '0',
      },
      {
        label: transI18n('inout.num_above', { num: 10 }),
        value: '10',
      },
      {
        label: transI18n('inout.num_above', { num: 20 }),
        value: '20',
      },
      {
        label: transI18n('inout.num_above', { num: 30 }),
        value: '30',
      },
      {
        label: transI18n('inout.num_above', { num: 40 }),
        value: '40',
      },
      {
        label: transI18n('inout.num_above', { num: 50 }),
        value: '50',
      },
      {
        label: transI18n('inout.num_above', { num: 60 }),
        value: '60',
      },
      {
        label: transI18n('inout.num_above', { num: 70 }),
        value: '70',
      },
      {
        label: transI18n('inout.num_above', { num: 80 }),
        value: '80',
      },
      {
        label: transI18n('inout.num_above', { num: 90 }),
        value: '90',
      },
      {
        label: transI18n('inout.num_above', { num: 100 }),
        value: '100',
      },
    ];

    const languageOptions = [
      {
        label: transI18n('language.zh'),
        value: 'zh',
      },
      {
        label: transI18n('language.en'),
        value: 'en',
      },
    ];

    return (
      <div className="person-setting">
        {/* 进出通知选择 */}
        <section className="select-item">
          <div className="inout—text">{transI18n('inout.close_max_num')}</div>
          <Select
            value={value + ''}
            onChange={(value) => {
              setValue(+value);
              GlobalStorage.save('inOutLimitCount', value);
              setUserInOutNotificationLimitCount &&
                setUserInOutNotificationLimitCount(+value);
            }}
            options={inOutOptions}></Select>
        </section>
        {/* 语言选择 */}
        <section className="select-item">
          <div className="inout—text">{transI18n('language.select')}</div>
          <Select
            value={language + ''}
            onChange={(value) => {
              setLanguage(value as LanguageEnum);
            }}
            options={languageOptions}></Select>
        </section>
      </div>
    );
  },
);
