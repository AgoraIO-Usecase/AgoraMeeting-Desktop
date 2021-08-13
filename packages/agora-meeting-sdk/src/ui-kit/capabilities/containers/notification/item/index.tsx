import React, {
  FC,
  useState,
  MouseEvent,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import { BaseProps } from '~components/interface/base-props';
import classnames from 'classnames';
import './index.css';
import {
  NotifyMessage,
  NotifyMessageType,
  useMessagesContext,
} from 'agora-meeting-core';
import { transI18n, changeLanguage } from '~ui-kit';
import { observer } from 'mobx-react';
import { transformNotifyMessageContent } from '@/ui-kit/utils';

export interface MettingNotificationItemProps extends BaseProps, NotifyMessage {
  duration?: number; // 持续的时间
  btnCountdown?: number; // 按钮开的的倒计时
}

export const MettingNotificationItem: FC<MettingNotificationItemProps> = observer(
  ({
    type,
    sender,
    payload = {},
    duration = 10000,
    btnCountdown = 20000,
    style,
    messageId,
    timestamp,
  }) => {
    const { dealNotifyMessageEvent } = useMessagesContext();
    const content = transformNotifyMessageContent(type, sender, payload);
    const [curTime, setCurTime] = useState<number>(new Date().getTime());
    const [disable, setDisable] = useState(false);
    const [isRender, finBtnCountdown] = useMemo(() => {
      let isRender = false;
      let finBtnCountdown = btnCountdown;
      if (curTime - timestamp < duration) {
        isRender = true;
      } else {
        isRender = false;
      }
      let diff = Math.floor((btnCountdown - (curTime - timestamp)) / 1000);
      finBtnCountdown = diff > 0 ? diff : 0;
      if (disable) {
        finBtnCountdown = 0;
      }
      return [isRender, finBtnCountdown];
    }, [curTime, btnCountdown, duration, timestamp, disable]);

    useEffect(() => {
      if (btnCountdown && finBtnCountdown <= 0) {
        setDisable(true);
      }
    }, [setDisable, btnCountdown, finBtnCountdown]);

    useEffect(() => {
      let timer: any = null;
      if (isRender) {
        timer = setTimeout(() => {
          setCurTime(new Date().getTime());
        }, 1000);
      }

      return () => {
        timer && clearTimeout(timer);
      };
    }, [curTime, isRender]);

    const btnCls = classnames('btn', {
      disable: disable,
    });

    const handleClick = async () => {
      if (!disable) {
        //允许只能点一次
        if (type !== NotifyMessageType.RECORD_CLOSED) {
          setDisable(true);
        }
        await dealNotifyMessageEvent(messageId);
      }
    };

    const finalStyle = {
      ...style,
      display: isRender ? 'block' : 'none',
    };

    const btnText = useMemo(() => {
      switch (type) {
        case NotifyMessageType.USER_APPROVE_APPLY_CAM:
          return transI18n('allow');
        case NotifyMessageType.USER_APPROVE_APPLY_MIC:
          return transI18n('allow');
        case NotifyMessageType.RECORD_CLOSED:
          return transI18n('record.copy_address');
        case NotifyMessageType.ADMIN_CHANGE_NO_HOST:
          return transI18n('main.become_host');
        default:
          return null;
      }
    }, [type]);

    return (
      <div className="metting-notification-item" style={finalStyle}>
        {content ? <span className="content">{content}</span> : null}
        {btnText ? (
          <span className={btnCls} onClick={(e) => handleClick()}>
            <span className="btn-text">{btnText}</span>
            {btnCountdown ? (
              <span className="btn-time">({finBtnCountdown})</span>
            ) : null}
          </span>
        ) : null}
      </div>
    );
  },
);
