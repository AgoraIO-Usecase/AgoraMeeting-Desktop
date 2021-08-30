import React, { FC, useState } from 'react';
import classnames from 'classnames';
import { BaseProps } from '~components/interface/base-props';
import { Select } from '~components/select';
import './index.css';
import { transI18n } from '~components/i18n';
import { GlobalStorage } from '@/infra/storage';

const DEFAULT_IN_OUT_NOTIFICATION_LIMIT_COUNT = 50;

export interface PersonSettingProps extends BaseProps {
  setUserInOutNotificationLimitCount?: (num: number) => void;
  inOutNotificationLimitCount?: number;
}

export const PersonSetting: FC<PersonSettingProps> = ({
  setUserInOutNotificationLimitCount,
  inOutNotificationLimitCount = DEFAULT_IN_OUT_NOTIFICATION_LIMIT_COUNT,
}) => {
  const [value, setValue] = useState(
    GlobalStorage.read('inOutLimitCount') || inOutNotificationLimitCount,
  );

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

  return (
    <div className="person-setting">
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
    </div>
  );
};
