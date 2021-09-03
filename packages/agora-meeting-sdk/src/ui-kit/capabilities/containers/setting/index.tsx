import React, { FC, useState, ReactNode, useMemo } from 'react';
import classnames from 'classnames';
import { BaseProps } from '~components/interface/base-props';
import './index.css';
import { transI18n } from '~components/i18n';
import { MediaSetting } from './media-setting';
import { RoomSetting } from './room-setting';
import { PersonSetting } from './person-setting';
import { observer } from 'mobx-react';
import { useMessagesContext } from 'agora-meeting-core';
import { LogSetting } from './log-setting';
import { SettingValue } from './declare';
import './index.css';

export interface ISettingTab {
  text: string;
  value: SettingValue;
  component: ReactNode;
}

export interface SettingProps extends BaseProps {
  exclude?: SettingValue[];
  defaultHighlight?: SettingValue;
}

export const Setting: FC<SettingProps> = observer(
  ({ className, exclude, defaultHighlight }) => {
    const {
      setUserInOutNotificationLimitCount,
      inOutNotificationLimitCount,
    } = useMessagesContext();

    const cls = classnames({
      [`meeting-setting`]: 1,
      [`${className}`]: !!className,
    });

    let tabs: ISettingTab[] = [
      {
        text: transI18n('setting.media'),
        value: 'mediaSetting',
        component: <MediaSetting></MediaSetting>,
      },
      {
        text: transI18n('setting.person'),
        value: 'personSetting',
        component: (
          <PersonSetting
            setUserInOutNotificationLimitCount={
              setUserInOutNotificationLimitCount
            }
            inOutNotificationLimitCount={
              inOutNotificationLimitCount
            }></PersonSetting>
        ),
      },
      {
        text: transI18n('setting.room'),
        value: 'roomSetting',
        component: <RoomSetting></RoomSetting>,
      },
      {
        text: transI18n('log.title'),
        value: 'logSetting',
        component: <LogSetting></LogSetting>,
      },
    ];

    if (exclude?.length) {
      tabs = tabs.filter((item) => !(exclude.indexOf(item.value) > -1));
    }

    const [highlight, setHighlight] = useState<SettingValue>(
      defaultHighlight || tabs[0].value,
    );

    const getItemCls = (value: string) => {
      return classnames('tab-item', {
        active: value === highlight,
      });
    };

    const highlightComponent = useMemo(() => {
      const item = tabs.find((item) => item.value === highlight);
      return item?.component;
    }, [highlight]);

    return (
      <div className={cls}>
        <div className="setting__left">
          {tabs.map((item) => (
            <div
              key={item.value}
              className={getItemCls(item.value)}
              onClick={() => {
                setHighlight(item.value);
              }}>
              {item.text}
            </div>
          ))}
        </div>
        <div className="setting__right">{highlightComponent}</div>
      </div>
    );
  },
);
