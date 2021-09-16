import { useHomeStore, useUIStore } from '@/infra/hooks';
import { MettingHome } from '../../../ui-kit/capabilities/containers/home';
import { observer } from 'mobx-react';
import React, { useState, useMemo, useEffect } from 'react';
import { useHistory } from 'react-router';
import MD5 from 'js-md5';
import { GlobalStorage } from '../../storage';
import { UIContextProvider } from '../../../infra/api/index';

const DEFAULT_IN_OUT_NOTIFICATION_LIMIT_COUNT = 50;

export const HomePage = observer(() => {
  const homeStore = useHomeStore();

  const text = {
    userName: '',
    roomName: '',
    password: '',
    openMic: true,
    openCamera: true,
    userInOutNotificationLimitCount: DEFAULT_IN_OUT_NOTIFICATION_LIMIT_COUNT,
    language: 'zh',
  };

  const history = useHistory();

  const onClickJoin = async () => {
    homeStore.setLaunchConfig({
      pretest: true,
      token: '',
      isRobot: false,
      roomName: text.roomName,
      roomId: MD5(text.roomName),
      userName: text.userName,
      userId: MD5(text.userName),
      roomPassword: text.password,
      openMic: text.openMic,
      openCamera: text.openCamera,
      duration: 2700,
      totalPeople: 1000,
      userInOutNotificationLimitCount:
        GlobalStorage.read('inOutLimitCount') ||
        text.userInOutNotificationLimitCount,
      sdkDomain: `${REACT_APP_AGORA_APP_SDK_DOMAIN}`,
      language: text.language,
    });
    history.push('/launch');
  };

  return (
    <UIContextProvider>
      <MettingHome
        defaultOpenMic={text.openMic}
        defaultOpenCamera={text.openCamera}
        onChangeRoomName={(v) => (text.roomName = v)}
        onChangeRoomPassword={(v) => (text.password = v)}
        onChangeUserName={(v) => (text.userName = v)}
        onChangeMic={(v) => {
          text.openMic = v;
        }}
        onChangeLanguage={(v) => (text.language = v)}
        onChangeCamera={(v) => (text.openCamera = v)}
        join={onClickJoin}></MettingHome>
    </UIContextProvider>
  );
});
