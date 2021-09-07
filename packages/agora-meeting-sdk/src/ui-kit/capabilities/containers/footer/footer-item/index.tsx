import React, { FC, MouseEvent, useEffect, useState, useMemo } from 'react';
import { BaseProps } from '~components/interface/base-props';
import classnames from 'classnames';
import { LocalDeviceState, RecordState } from 'agora-meeting-core';
import './index.css';
import { transI18n } from '~ui-kit';
import { observer } from 'mobx-react';

/** 每一项的类型 */
export type FooterItemType =
  | 'audio'
  | 'video'
  | 'screen-share'
  | 'record'
  | 'chat'
  | 'members';

export interface FooterItemProps extends BaseProps {
  type: FooterItemType;
  status: LocalDeviceState | RecordState | boolean;
  /** 右上角数字 */
  num?: number;
  /** 倒计时持续时间 */
  countdown?: number;
  /** 文字 */
  text: string;
  onClick?: () => void;
}

export const FooterItem: FC<FooterItemProps> = observer(
  ({
    type,
    status = LocalDeviceState.close,
    num,
    countdown,
    onClick,
    text = '',
  }) => {
    const finText = useMemo(() => {
      if (type === 'record') {
        if (status === RecordState.recording) {
          return transI18n('end');
        }
      }
      return text;
    }, [type, status, text]);

    const active = useMemo(() => {
      if (type === 'audio' || type === 'video') {
        return status === LocalDeviceState.open;
      } else if (type === 'record') {
        return status === RecordState.recording;
      } else {
        return status === true;
      }
    }, [status, type]);

    const iconCLs = classnames('icon', {
      [`icon-${type}`]: type !== 'record' || (type === 'record' && !active),
      'icon-record-end': active && type === 'record',
    });

    const cls = classnames('footer-item', {
      active: active && type !== 'record',
    });

    return (
      <span className={cls} onClick={(e) => onClick && onClick()}>
        <span className="icon-wrapper">
          <i className={iconCLs}></i>
          {num ? <span className="number">{num}</span> : null}
          {status === LocalDeviceState.approving && countdown ? (
            <div className="countdown">
              <span className="countdown-text">{countdown}s</span>
            </div>
          ) : null}
        </span>
        <span className="text">{finText}</span>
      </span>
    );
  },
);
