import React, { FC, useEffect, useState } from 'react';
import classnames from 'classnames';
import { BaseProps } from '~components/interface/base-props';
import './index.css';
import { t, transI18n } from '~components/i18n';
import { Button } from '~components';
import {
  DeviceTypeEnum,
  useRoomContext,
  useUsersContext,
} from 'agora-meeting-core';
import './index.css';
import { observer } from 'mobx-react';
import { useUIStore } from '@/infra/hooks';

export interface RoomSettingProps extends BaseProps {}

export const RoomSetting: FC<RoomSettingProps> = observer(() => {
  const {
    hasCameraAccess,
    hasMicAccess,
    changeUserPermission,
    roomInfo,
    isChangingUserPermission,
  } = useRoomContext();
  const {
    isHost,
    hasHost,
    applyToBeHost,
    giveUpHost,
    localUserInfo,
  } = useUsersContext();
  const { setLoading, addToast } = useUIStore();

  useEffect(() => {
    setLoading(isChangingUserPermission);
  }, [isChangingUserPermission, setLoading]);

  const onChangeDeviceAccess = async (
    device: DeviceTypeEnum,
    value: boolean,
  ) => {
    if (isHost) {
      try {
        if (isChangingUserPermission) {
          return;
        }
        await changeUserPermission(device, !value);
      } catch (err) {
        throw err;
      } finally {
      }
    }
  };

  const onClickGiveUpHost = async () => {
    try {
      await giveUpHost();
    } catch (err) {
      if (err.message) {
        addToast(err.message, 'error');
      }
    }
  };

  const onClickApplyToBeHost = async () => {
    try {
      await applyToBeHost();
    } catch (err) {
      if (err.message) {
        addToast(err.message, 'error');
      }
    }
  };

  return (
    <div className="room-setting">
      <section className="body">
        <div className="item">
          <span className="props">{transI18n('login.name')}</span>
          <span className="text">{localUserInfo.userName}</span>
        </div>
        <div className="item">
          <span className="props">{transI18n('login.room_name')}</span>
          <span className="text">{roomInfo.roomName}</span>
        </div>
        <div className="item">
          <span className="props">{transI18n('login.room_pwd')}</span>
          <span className="text">{roomInfo.roomPassword}</span>
        </div>
        <div className="item">
          <span className="props">{transI18n('login.role')}</span>
          <span className="text">
            {isHost ? transI18n('host') : transI18n('member')}
          </span>
        </div>
        <div className="item">
          <span className="props">{transI18n('host')}</span>
          {isHost ? (
            <Button onClick={(e) => onClickGiveUpHost()}>
              {transI18n('more.renounce_admin')}
            </Button>
          ) : (
            <Button onClick={(e) => onClickApplyToBeHost()}>
              {transI18n('more.become_admin')}
            </Button>
          )}
        </div>
      </section>
      <section className="footer">
        <div className="item">
          <input
            checked={!hasMicAccess}
            disabled={!isHost}
            type="checkbox"
            onChange={(e) =>
              onChangeDeviceAccess(DeviceTypeEnum.mic, e.target.checked)
            }
          />
          <span className="checkbox-text">{t('setting.mic_approve')}</span>
        </div>
        <div className="item">
          <input
            checked={!hasCameraAccess}
            disabled={!isHost}
            type="checkbox"
            onChange={(e) =>
              onChangeDeviceAccess(DeviceTypeEnum.camera, e.target.checked)
            }
          />
          <span className="checkbox-text">{t('setting.camera_approve')}</span>
        </div>
      </section>
    </div>
  );
});
