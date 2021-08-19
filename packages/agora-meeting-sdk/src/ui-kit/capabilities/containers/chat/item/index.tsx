import React, { FC, useEffect, useState } from 'react';
import { transI18n } from '~components/i18n';
import {
  ChatMessage,
  MessageSendState,
  useMessagesContext,
} from 'agora-meeting-core';
import dayjs from 'dayjs';
import './index.css';
import { observer } from 'mobx-react';

export interface ChatMessageItemProps extends ChatMessage {
  showTime?: boolean; // 是否显示时间
}

export const ChatMessageItem: FC<ChatMessageItemProps> = observer(
  ({
    isFromMyself,
    content,
    fromUser,
    showTime = false,
    timestamp,
    sendState,
    messageId,
  }) => {
    const [finalTime, setinalTime] = useState('00:00');
    const { resendChatMessage } = useMessagesContext();

    useEffect(() => {
      if (showTime) {
        const time = dayjs(timestamp);
        let curHour = time.get('hour');
        let curMinute = time.get('minute');
        let finHour = curHour > 9 ? curHour + '' : `0${curHour}`;
        let finMinute = curMinute > 9 ? curMinute + '' : `0${curMinute}`;
        setinalTime(`${finHour}:${finMinute}`);
      }
    }, [timestamp, showTime]);

    return (
      <div className="chat-message">
        {showTime ? <div className="chat-time">{finalTime}</div> : null}
        <div className={`chat-message-${isFromMyself ? 'right' : 'left'}`}>
          <div className="chat-message-username">{fromUser.userName}</div>
          <div className="chat-message-item">
            {isFromMyself && sendState === MessageSendState.fail ? (
              <span
                className="icon icon-send-fail"
                onClick={(e) => resendChatMessage(messageId)}></span>
            ) : null}
            {sendState === MessageSendState.sending ? (
              <span className="icon icon-loading rotate"></span>
            ) : null}
            <span
              className={`chat-message-content ${
                isFromMyself ? 'blue' : 'ghost'
              }`}>
              {content}
            </span>
          </div>
        </div>
      </div>
    );
  },
);
