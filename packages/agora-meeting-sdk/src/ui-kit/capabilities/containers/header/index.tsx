import React, { FC, useState, useEffect, useMemo } from 'react';
import { RenderLayout } from '@/infra/api/declare';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import {
  useRoomContext,
  useMessagesContext,
  useBoardContext,
  useScreenContext,
  useGlobalContext,
  useRecordContext,
  RecordState,
} from 'agora-meeting-core';
import { SharePopover } from '../share-popover/index';
import dayjs from 'dayjs';
import './index.css';
import { useUIStore } from '@/infra/hooks';
import { transI18n } from '~ui-kit';
import { useLayoutEffect } from 'react';

export interface HeaderProps {}

export const MettingHeader: FC<HeaderProps> = observer(({}) => {
  const {
    hasUnreadNotifyMessage,
    toggleNotifyMessageDialog,
  } = useMessagesContext();

  const iconNotificationCls = classnames('icon', 'icon-notification', {
    [`has-notice`]: hasUnreadNotifyMessage,
  });

  const { fireDialog } = useGlobalContext();
  const { fullScreen, setFullScreen } = useUIStore();
  const { isWhiteBoardOpening } = useBoardContext();
  const { isScreenSharing } = useScreenContext();
  const { renderLayout, setLayout } = useUIStore();
  const { roomInfo } = useRoomContext();
  const { recordState, recordStartTime } = useRecordContext();

  const [roomTime, setRoomTime] = useState('00:00:00');
  const [finRecordTime, setFinRecordTime] = useState('00:00:00');

  const iconFullScreenCls = classnames('icon', {
    'icon-fullscreen': !fullScreen,
    'icon-narrow': fullScreen,
  });

  useEffect(() => {
    let interval: any;
    // 开始倒计时
    if (roomInfo.startTime) {
      interval = setInterval(() => {
        const now = dayjs();
        const start = dayjs(roomInfo.startTime);
        let minutes = now.diff(start, 'minutes') % 60;
        let seconds = now.diff(start, 'seconds') % 60;
        let hours = now.diff(start, 'hours');
        let finalMinutes = minutes > 9 ? minutes : `0${minutes}`;
        let finalSeconds = seconds > 9 ? seconds : `0${seconds}`;
        let finalHours = hours > 9 ? hours : `0${hours}`;
        setRoomTime(`${finalHours}:${finalMinutes}:${finalSeconds}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [roomInfo.startTime]);

  useEffect(() => {
    let interval: any;
    // 开始倒计时
    if (recordStartTime) {
      interval = setInterval(() => {
        const now = dayjs();
        const start = dayjs(recordStartTime);
        let minutes = now.diff(start, 'minutes') % 60;
        let seconds = now.diff(start, 'seconds') % 60;
        let hours = now.diff(start, 'hours');
        let finalMinutes = minutes > 9 ? minutes : `0${minutes}`;
        let finalSeconds = seconds > 9 ? seconds : `0${seconds}`;
        let finalHours = hours > 9 ? hours : `0${hours}`;
        setFinRecordTime(`${finalHours}:${finalMinutes}:${finalSeconds}`);
      }, 1000);
    } else {
      setFinRecordTime('00:00:00');
    }
    return () => clearInterval(interval);
  }, [recordStartTime]);

  const onLayoutClick = () => {
    if (renderLayout === RenderLayout.tile) {
      // 切换到演讲者视图
      setLayout(RenderLayout.lecturer);
    } else if (renderLayout === RenderLayout.lecturer) {
      // 切换到平铺视图
      if (isWhiteBoardOpening || isScreenSharing) {
        return;
      }
      setLayout(RenderLayout.tile);
    }
  };

  const handleFullScreen = () => {
    setFullScreen(!fullScreen);
  };

  const onSettingClick = () => {
    fireDialog('setting');
  };

  const onNoticeClick = () => {
    fireDialog('notify-message');
  };

  return (
    <section className="meeting-header">
      <div className="header__left">
        <span className="room-name">{roomInfo.roomName}</span>
        <span className="room-time">{roomTime}</span>
        <SharePopover>
          <i className="icon icon-invite" />
        </SharePopover>
        <i className="icon icon-setting" onClick={onSettingClick} />
      </div>
      <div className="header__cener">
        {recordState === RecordState.recording ? (
          <div className="record__wrapper">
            <i className="icon icon-recording" />
            <span className="text">录制中 {finRecordTime} </span>
          </div>
        ) : null}
      </div>
      <div className="header__right">
        <i className={iconNotificationCls} onClick={onNoticeClick} />
        {renderLayout !== RenderLayout.audio ? (
          <span className="layout-wrapper" onClick={(e) => onLayoutClick()}>
            {renderLayout === RenderLayout.lecturer ? (
              <>
                <i className="icon layout-speech" />
                <span className="text">{transI18n('view_lecturer')}</span>
              </>
            ) : (
              <>
                <i className="icon layout-flat" />
                <span className="text">{transI18n('view_tile')}</span>
              </>
            )}
          </span>
        ) : null}
        {renderLayout === RenderLayout.lecturer ? (
          <i
            className={iconFullScreenCls}
            onClick={(e) => handleFullScreen()}
          />
        ) : null}
      </div>
    </section>
  );
});
