import React, { FC, useRef, useState } from 'react';
import { BaseProps } from '~components/interface/base-props';
import { Input } from '~components/input';
import classnames from 'classnames';
import { HomeSettingDialog } from './dialog/home-setting';
import { Popover } from '~components/popover';
import { isEmpty } from 'lodash';
import logo from '@/ui-kit/assets/logo@2x.png';
import { transI18n } from '~ui-kit';
import Notification from 'rc-notification';

import 'rc-notification/assets/index.css';
import './index.css';


export const checkLaunchOption = (option: any) => {
  if (isEmpty(option)) {
    throw new Error('option parameter cannot is invalid');
  }

  if (option.roomName.length < 3) {
    throw new Error(transI18n('login.tip_room_name_short'));
  }

  if (option.roomName.length > 50) {
    throw new Error(transI18n('login.tip_room_name_over'));
  }

  if (option.userName.length < 3) {
    throw new Error(transI18n('login.tip_user_name_short'));
  }

  if (option.userName.length > 20) {
    throw new Error(transI18n('login.tip_user_name_over'));
  }
};

export interface MettingHomeProps extends BaseProps {
  language: string;
  defaultOpenMic?: boolean;
  defaultOpenCamera?: boolean;
  defaultInOutNotificationLimitCount?: number;
  onChangeRoomName?: (v: string) => void;
  onChangeRoomPassword?: (v: string) => void;
  onChangeUserName?: (v: string) => void;
  onChangeCamera?: (V: boolean) => void;
  onChangeMic?: (v: boolean) => void;
  onChangeUserInOutNotificationLimitCount?: (v: number) => void;
  join?: () => void;
}

export const MettingHome: FC<MettingHomeProps> = ({
  onChangeRoomName = (_) => _,
  onChangeRoomPassword = (_) => _,
  onChangeUserName = (_) => _,
  onChangeCamera = (_) => _,
  onChangeMic = (_) => _,
  join,
  defaultOpenMic = true,
  defaultOpenCamera = true,
  language,
}) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [openMic, setOpenMic] = useState(defaultOpenMic);
  const [openCamera, setOpenCamera] = useState(defaultOpenCamera);


  const showErrToast = (err: any) => {
    Notification.newInstance({}, (notification) => {
      notification.notice({
        duration: 3,
        content: err?.message,
      });
    });
  };

  const handleRoomName = (value: string) => {
    try {
      if (value.length > 50) {
        throw new Error(transI18n('login.tip_room_name_over'));
      }
      setRoomName(value);
      onChangeRoomName(value);
    } catch (err) {
      showErrToast(err);
      throw err;
    }
  };

  const handleRoomPasswordChange = (value: string) => {
    try {
      if (value.length > 20) {
        throw new Error(transI18n('login.tip_room_pass_over'));
      }
      setRoomPassword(value);
      onChangeRoomPassword(value);
    } catch (err) {
      showErrToast(err);
      throw err;
    }
  };

  const handleUserNameChange = (value: string) => {
    try {
      if (value.length > 20) {
        throw new Error(transI18n('login.tip_user_name_over'));
      }
      setUserName(value);
      onChangeUserName(value);
    } catch (err) {
      showErrToast(err);
      throw err;
    }
  };

  const clearRoomName = () => {
    setRoomName('');
    onChangeRoomName('');
  };

  const clearRoomPassword = () => {
    setRoomPassword('');
    onChangeRoomPassword('');
  };

  const clearUserName = () => {
    setUserName('');
    onChangeUserName('');
  };

  const handleCameraChange = (v: boolean) => {
    setOpenCamera(v);
    onChangeCamera(v);
  };

  const handleMicChange = (v: boolean) => {
    setOpenMic(v);
    onChangeMic(v);
  };

  const onClickSetting = () => {
    setDialogVisible(true);
  };

  const onClickJoin = () => {
    try {
      checkLaunchOption({
        roomName,
        userName,
      });
      join && join();
    } catch (err) {
      Notification.newInstance({}, (notification) => {
        notification.notice({
          duration: 3,
          content: err.message,
        });
      });
      throw err;
    }
  };

  return (
    <div className="metting-home">
      <HomeSettingDialog
        visible={dialogVisible}
        onVisibleChange={(val) => {
          setDialogVisible(val);
        }}
        language={language}></HomeSettingDialog>
      <div className="login">
        <section className="login__header">
          <div className="header__right">
            <i
              className="icon icon-setting"
              onClick={(e) => onClickSetting()}></i>
            <span className="text" onClick={(e) => onClickSetting()}>
              {transI18n('setting.setting')}
            </span>
          </div>
        </section>
        <form className="login__center">
          <img className="logo-img" src={logo} alt="" />
          <span className="logo-text">Agora Meeting</span>
          <Input
            style={{ height: '40px' }}
            placeholder={transI18n('login.room_name')}
            value={roomName}
            suffix={<i className="icon icon-close" onClick={clearRoomName} />}
            onChange={(e) => handleRoomName(e.target.value)}></Input>
          <Input
            autoComplete="on"
            type={'password'}
            style={{ height: '40px', marginTop: '20px' }}
            placeholder={transI18n('login.room_pwd')}
            value={roomPassword}
            suffix={
              <span className="room-pwd-icon-wrapper">
                {roomPassword.length ? (
                  <i className="icon icon-close" onClick={clearRoomPassword} />
                ) : null}
                <Popover
                  trigger="hover"
                  placement="right"
                  overlayClassName="home-popover"
                  content={
                    <div className="popover-content">
                      <div>{transI18n('login.pwd_tips')}</div>
                    </div>
                  }>
                  <i className="icon icon-inactive"></i>
                </Popover>
              </span>
            }
            onChange={(e) => handleRoomPasswordChange(e.target.value)}></Input>
          <Input
            style={{ height: '40px', marginTop: '20px' }}
            placeholder={transI18n('login.name')}
            value={userName}
            suffix={<i className="icon icon-close" onClick={clearUserName} />}
            onChange={(e) => handleUserNameChange(e.target.value)}></Input>
          <div className="checkbox-wrapper">
            <input
              checked={openCamera}
              type="checkbox"
              onChange={(e) => handleCameraChange(e.target.checked)}
            />
            <span className="checkbox-text">
              {transI18n('login.open_camera')}
            </span>
          </div>
          <div className="checkbox-wrapper">
            <input
              checked={openMic}
              type="checkbox"
              onChange={(e) => handleMicChange(e.target.checked)}
            />
            <span className="checkbox-text">{transI18n('login.open_mic')}</span>
          </div>
          <div className="btn-add" onClick={(e) => onClickJoin()}>
            {transI18n('login.enter')}
          </div>
          <div className="tip">
            <i className="icon icon-tip"></i>
            <div className="text">{transI18n('login.limit_tip')}</div>
          </div>
        </form>
        <section className="login__bottom"></section>
      </div>
    </div>
  );
};
