import React, { FC, useState, useRef, useEffect, useMemo } from 'react';
import { BaseProps } from '~components/interface/base-props';
import { ChatMessageItem } from './item';
import { Placeholder } from '~components/placeholder';
import { Button } from '~components/button';
import { useMessagesContext, ChatMessage } from 'agora-meeting-core';
import { observer } from 'mobx-react';
import { useUIStore } from '@/infra/hooks';
import './index.css';
import dayjs from 'dayjs';
import { transI18n } from '~ui-kit';

const SECONDS_GAP = 60 * 2;

export interface ChatProps extends BaseProps {}

export const MettingChat: FC<ChatProps> = observer(() => {
  const { language } = useUIStore();
  const [chatText, setChatText] = useState('');
  const [focused, setFocused] = useState<boolean>(false);
  const handleFocus = () => setFocused(true);
  const handleBlur = () => {
    if (!!chatText) {
      return;
    }
    setFocused(false);
  };

  const chatHistoryRef = useRef<HTMLDivElement | null>(null);
  const currentHeight = useRef<number>(0);
  const scrollDirection = useRef<string>('bottom');

  const { chatMessageList, sendChatMessage } = useMessagesContext();
  const { setChatVisible } = useMessagesContext();

  const handleScrollDown = (current: HTMLDivElement) => {
    current.scrollTop = current.scrollHeight;
  };

  const onPullFresh = () => {};

  const handleScroll = (event: any) => {
    const { target } = event;
    if (target?.scrollTop === 0) {
      onPullFresh && onPullFresh();
      currentHeight.current = target.scrollHeight;
      scrollDirection.current = 'top';
    }
  };

  const handleKeypress = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === 'Enter') {
      if (event.ctrlKey) {
        event.currentTarget.value += '\n';
      } else if (!event.shiftKey && !event.altKey) {
        // send message if enter is hit
        event.preventDefault();
        await handleSend();
      }
    }
  };

  const handleSend = async () => {
    await sendChatMessage(chatText);
    scrollDirection.current = 'bottom';
    setChatText('');
  };

  const onClose = () => {
    setChatVisible(false);
  };

  const calcShowTime = (cur: ChatMessage, pre: ChatMessage) => {
    const now = dayjs(cur.timestamp);
    const start = dayjs(pre.timestamp);
    let seconds = now.diff(start, 'seconds');
    return seconds > SECONDS_GAP;
  };

  const finChatMessageList = chatMessageList.map((item, index) => {
    return {
      ...item,
      showTime:
        index === 0 ? true : calcShowTime(item, chatMessageList[index - 1]),
    };
  });

  useEffect(() => {
    if (scrollDirection.current === 'bottom') {
      chatHistoryRef.current && handleScrollDown(chatHistoryRef.current);
    }
    if (scrollDirection.current === 'top' && chatHistoryRef.current) {
      const position =
        chatHistoryRef?.current.scrollHeight - currentHeight.current;
      chatHistoryRef.current.scrollTo(0, position);
    }
  }, [chatMessageList, chatHistoryRef, scrollDirection]);

  return (
    <div className="metting-chat">
      <div className="chat-header">
        <span className="chat-header-title">{transI18n('main.chat')}</span>
        <i className="icon icon-close" onClick={(e) => onClose()}></i>
      </div>
      <div
        className="chat-history"
        ref={chatHistoryRef}
        onScroll={handleScroll}>
        {!finChatMessageList?.length ? (
          <Placeholder placeholderDesc={transI18n('chat.no_mgs')} />
        ) : (
          finChatMessageList.map((message: ChatMessage) => (
            <ChatMessageItem key={message.messageId} {...message} />
          ))
        )}
      </div>
      <div className={`chat-texting ${!!chatText && focused ? 'focus' : ''}`}>
        <textarea
          value={chatText}
          className="chat-texting-message"
          placeholder={transI18n('chat.input')}
          disabled={false}
          onChange={(e) => {
            setChatText(e.currentTarget.value);
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyPress={handleKeypress}
        />
        <Button
          disabled={false}
          onClick={handleSend}
          style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
          }}>
          {transI18n('chat.send')}
        </Button>
      </div>
    </div>
  );
});
