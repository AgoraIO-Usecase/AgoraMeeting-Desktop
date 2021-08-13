import { BaseDialogProps } from '../index';
import { observer } from 'mobx-react';
import { Button, Modal, t, transI18n } from '~ui-kit';
import {
  useMessagesContext,
  NotifyMessageType,
  NotifyMessage,
} from 'agora-meeting-core';
import { NotifyItem } from './notify-item';
import './notify.css';
import { useUIStore } from '@/infra/hooks';
import { useMemo } from 'react';
import dayjs from 'dayjs';

const SECONDS_GAP = 60 * 10;

export const NotifyMessageDialog: React.FC<BaseDialogProps> = observer(
  ({ id }) => {
    const { removeDialog } = useUIStore();
    const {
      toggleNotifyMessageDialog,
      notifyMessageList,
    } = useMessagesContext();

    const calcShowTime = (cur: NotifyMessage, pre: NotifyMessage) => {
      const now = dayjs(cur.timestamp);
      const start = dayjs(pre.timestamp);
      let seconds = now.diff(start, 'seconds');
      return seconds > SECONDS_GAP;
    };

    const finNotifyMessageList = useMemo(() => {
      return notifyMessageList.map((item, index) => {
        const showTime =
          index === 0 ? true : calcShowTime(item, notifyMessageList[index - 1]);
        return {
          ...item,
          showTime: showTime,
        };
      });
    }, [notifyMessageList]);

    const onCancel = async () => {
      toggleNotifyMessageDialog(false);
      removeDialog(id);
    };

    const onOk = async () => {
      removeDialog(id);
    };

    return (
      <Modal
        width={600}
        onOk={onOk}
        onCancel={onCancel}
        contentClassName="notice-content"
        title={transI18n('main.notification')}>
        <div>
          {finNotifyMessageList.map((item) => (
            <NotifyItem
              key={item.messageId}
              {...item}
              btnCountdown={
                item.type === NotifyMessageType.USER_APPROVE_APPLY_CAM ||
                item.type === NotifyMessageType.USER_APPROVE_APPLY_MIC
                  ? 20000
                  : 0
              }></NotifyItem>
          ))}
        </div>
      </Modal>
    );
  },
);
