import { FC, useState, useMemo, useEffect, MouseEvent } from 'react';
import { observer } from 'mobx-react';
import { Button, Modal, t, transI18n } from '~ui-kit';
import {
  useGlobalContext,
  useMessagesContext,
  NotifyMessage,
  NotifyMessageType,
  useUsersContext,
} from 'agora-meeting-core';
import { BaseProps } from '~components/interface/base-props';
import classnames from 'classnames';
import { transformNotifyMessageContent } from '@/ui-kit/utils';
import './notify.css';
import { useUIStore } from '@/infra/hooks';
import dayjs from 'dayjs';

export interface NotifyItemProps extends BaseProps, NotifyMessage {
  showTime?: boolean; // 是否展示时间
  btnCountdown?: number; // 按钮倒计时
}

export const NotifyItem: FC<NotifyItemProps> = observer(
  ({
    type,
    sender,
    payload = {},
    btnCountdown = 20000,
    style,
    messageId,
    timestamp,
    showTime = false,
  }) => {
    const { localUserInfo } = useUsersContext();
    const { dealNotifyMessageEvent } = useMessagesContext();
    const { addToast } = useUIStore();
    const content = transformNotifyMessageContent(type, sender, payload);
    const [curTime, setCurTime] = useState<number>(new Date().getTime());
    const [disable, setDisable] = useState(false);
    const isRender = true;
    const finTime = useMemo(() => {
      if (showTime) {
        const time = dayjs(timestamp);
        let curHour = time.get('hour');
        let curMinute = time.get('minute');
        let finHour = curHour > 9 ? curHour : `0${curHour}`;
        let finMinute = curMinute > 9 ? curMinute : `0${curMinute}`;
        return `${finHour}:${finMinute}`;
      }
    }, [timestamp, showTime]);

    const [finBtnCountdown] = useMemo(() => {
      let finBtnCountdown = btnCountdown;
      let diff = Math.floor((btnCountdown - (curTime - timestamp)) / 1000);
      finBtnCountdown = diff > 0 ? diff : 0;
      if (disable) {
        finBtnCountdown = 0;
      }
      return [finBtnCountdown];
    }, [curTime, btnCountdown, timestamp, disable]);

    useEffect(() => {
      let timer: any = null;
      if (finBtnCountdown > 0) {
        timer = setTimeout(() => {
          setCurTime(new Date().getTime());
        }, 1000);
      }

      return () => {
        timer && clearTimeout(timer);
      };
    }, [curTime, finBtnCountdown]);

    useEffect(() => {
      if (btnCountdown && finBtnCountdown <= 0) {
        setDisable(true);
      }
    }, [setDisable, btnCountdown, finBtnCountdown]);

    const btnCls = classnames('btn', {
      disable: disable,
    });

    const handleClick = async () => {
      if (!disable) {
        if (
          type !== NotifyMessageType.RECORD_CLOSED &&
          type !== NotifyMessageType.NOTIFY_IN_OUT_OVER_MAX_LIMIT &&
          type !== NotifyMessageType.NOTIFY_IN_OUT_CLOSED
        ) {
          setDisable(true);
        }
        try {
          await dealNotifyMessageEvent(messageId);
        } catch (err) {
          err.message && addToast(err.message, 'error');
          throw err;
        }
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
          if (localUserInfo.userId === payload?.ownerInfo?.userId) {
            // 录制发起者才能复制链接
            return transI18n('record.copy_address');
          }
          return '';
        case NotifyMessageType.ADMIN_CHANGE_NO_HOST:
          return transI18n('main.become_host');
        case NotifyMessageType.NOTIFY_IN_OUT_OVER_MAX_LIMIT:
          return transI18n('edit');
        case NotifyMessageType.NOTIFY_IN_OUT_CLOSED:
          return transI18n('edit');
        default:
          return null;
      }
    }, [type, localUserInfo, payload]);

    return (
      <div className="item-wrapper">
        {showTime ? <div className="time">{finTime}</div> : null}
        <div className="item" style={finalStyle}>
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
      </div>
    );
  },
);
