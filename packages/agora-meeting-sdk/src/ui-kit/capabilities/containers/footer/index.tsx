import React, { FC, useState } from 'react';
import { BaseProps } from '~components/interface/base-props';
import { FooterItemProps, FooterItem } from './footer-item';
import { PopoverScreen } from './popover-screen';
import { Popover, t } from '~ui-kit';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import {
  LocalDeviceState,
  useUsersContext,
  useScreenContext,
  useBoardContext,
  useRecordContext,
  DevicePermission,
  RecordState,
} from 'agora-meeting-core';

import './index.css';
import {
  DeviceTypeEnum,
  useGlobalContext,
  useMediaContext,
  useMessagesContext,
} from 'agora-meeting-core';
import { useMemo } from 'react';
import { useUIStore } from '@/infra/hooks';

export interface FooterProps extends BaseProps {}

export const MettingFooter: FC<FooterProps> = observer(({}) => {
  const { memberVisible, setMemberVisible } = useUIStore();
  const { fireDialog } = useGlobalContext();
  const { chatVisible, toggleChatVisible } = useMessagesContext();
  const {
    unreadChatMessageCount,
    setUnreadChatMessageCount,
  } = useMessagesContext();
  const {
    cameraLocalDeviceState,
    micLocalDeviceState,
    closeLocalDevice,
    openLocalDevice,
    micApprovingCountdown,
    cameraApprovingCountdown,
    checkDevicePermission,
  } = useMediaContext();
  const { isHost } = useUsersContext();
  const { isScreenSharing } = useScreenContext();
  const { isWhiteBoardOpening } = useBoardContext();
  const {
    recordState,
    startRecording,
    stopRecording,
    isRecordingByMyself,
  } = useRecordContext();
  const { fireToast } = useGlobalContext();

  const shareState = useMemo(() => {
    return isScreenSharing || isWhiteBoardOpening;
  }, [isScreenSharing, isWhiteBoardOpening]);

  const handleCameraClick = async () => {
    if (cameraLocalDeviceState === LocalDeviceState.open) {
      // 关闭摄像头
      await closeLocalDevice(DeviceTypeEnum.camera);
    } else if (cameraLocalDeviceState === LocalDeviceState.close) {
      // 打开摄像头
      const permission = checkDevicePermission(DeviceTypeEnum.camera);
      if (permission === DevicePermission.approveNeed) {
        // 需要申请
        fireDialog('apply-turn-on-device', { device: DeviceTypeEnum.camera });
      } else if (permission === DevicePermission.granted) {
        // 直接打开
        await openLocalDevice(DeviceTypeEnum.camera);
      }
    }
  };

  const handleMicClick = async () => {
    if (micLocalDeviceState === LocalDeviceState.open) {
      // 关闭麦克风
      await closeLocalDevice(DeviceTypeEnum.mic);
    } else if (micLocalDeviceState === LocalDeviceState.close) {
      // 打开麦克风
      const permission = checkDevicePermission(DeviceTypeEnum.mic);
      if (permission === DevicePermission.approveNeed) {
        // 需要申请
        fireDialog('apply-turn-on-device', { device: DeviceTypeEnum.mic });
      } else if (permission === DevicePermission.granted) {
        // 直接打开
        await openLocalDevice(DeviceTypeEnum.mic);
      }
    }
  };

  const handleRecord = () => {
    if (recordState === RecordState.end) {
      if (isHost) {
        startRecording();
      } else {
        fireToast('record.tip');
      }
    } else {
      // 自己发起的录制只有自己结束
      if (isRecordingByMyself) {
        stopRecording();
      } else if (isHost) {
        // 其他主持人
        fireToast('record.is_not_host');
      }
    }
  };

  const handleChat = () => {
    const curVisible = !chatVisible;
    toggleChatVisible(curVisible);
    if (curVisible) {
      setUnreadChatMessageCount(0);
    }
  };

  const handleMember = () => {
    setMemberVisible(!memberVisible);
  };

  const handleRoomEnd = () => {
    fireDialog('close-room');
  };

  return (
    <section className="metting-footer">
      <div className="footer__center">
        <FooterItem
          status={micLocalDeviceState}
          type="audio"
          onClick={handleMicClick}
          countdown={micApprovingCountdown}></FooterItem>
        <FooterItem
          status={cameraLocalDeviceState}
          type="video"
          onClick={handleCameraClick}
          countdown={cameraApprovingCountdown}></FooterItem>
        <Popover
          trigger="click"
          overlayClassName="screen-popover"
          placement="top"
          content={<PopoverScreen></PopoverScreen>}>
          <FooterItem status={shareState} type="screen-share"></FooterItem>
        </Popover>
        <FooterItem
          status={recordState}
          type="record"
          onClick={handleRecord}></FooterItem>
        <FooterItem
          status={chatVisible}
          type="chat"
          num={unreadChatMessageCount}
          onClick={handleChat}></FooterItem>
        <FooterItem
          status={memberVisible}
          type="members"
          onClick={handleMember}></FooterItem>
      </div>
      <div className="footer__right" onClick={(e) => handleRoomEnd()}>
        {t('main.exit_meeting')}
      </div>
    </section>
  );
});
