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
    const [hour, setHour] = useState('00');
    const [minute, setMinute] = useState('00');
    const { resendChatMessage } = useMessagesContext();

    useEffect(() => {
      if (showTime) {
        const time = dayjs(timestamp);
        const curHour = time.get('hour');
        const curMinute = time.get('minute');
        setHour(curHour > 9 ? curHour + '' : `0${curHour}`);
        setMinute(curMinute > 9 ? curMinute + '' : `0${curMinute}`);
      }
    }, [timestamp, showTime]);

    return (
      <div className="chat-message">
        {showTime ? (
          <div className="chat-time">
            {hour}:{minute}
          </div>
        ) : null}
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
