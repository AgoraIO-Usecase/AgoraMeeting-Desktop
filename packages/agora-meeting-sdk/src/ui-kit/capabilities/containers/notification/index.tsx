import React, {
  FC,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  CSSProperties,
} from 'react';
import { BaseProps } from '~components/interface/base-props';
import { MettingNotificationItem } from './item/index';
import classnames from 'classnames';
import './index.css';
import { observer } from 'mobx-react';
import { NotifyMessageType, useMessagesContext } from 'agora-meeting-core';

const itemStyles: CSSProperties[] = [
  { opacity: 0.8 },
  { opacity: 0.65 },
  { opacity: 0.5 },
  { opacity: 0.35 },
  { opacity: 0.15 },
];

export interface MettingNotificationProps extends BaseProps {
  /** 最多显示几条消息 */
  max?: number;
}

export const MettingNotification: FC<MettingNotificationProps> = observer(
  ({ max = 5 }) => {
    const { notifyMessageList } = useMessagesContext();
    const notices = notifyMessageList.slice(-max).reverse();
    return (
      <div className="metting-notification-wrapper">
        {notices.map((item, index) => (
          <MettingNotificationItem
            key={item.messageId}
            {...item}
            btnCountdown={
              item.type === NotifyMessageType.USER_APPROVE_APPLY_CAM ||
              item.type === NotifyMessageType.USER_APPROVE_APPLY_MIC
                ? 20000
                : 0
            }
            style={itemStyles[index]}></MettingNotificationItem>
        ))}
      </div>
    );
  },
);
