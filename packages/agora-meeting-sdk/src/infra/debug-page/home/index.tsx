import { useHomeStore } from '@/infra/hooks';
import { changeLanguage } from '~ui-kit';
import { MettingHome } from '../../../ui-kit/capabilities/containers/home';
import { observer } from 'mobx-react';
import React, { useState, useMemo, useEffect } from 'react';
import { useHistory } from 'react-router';
import MD5 from 'js-md5';
import { useLayoutEffect } from 'react';
import { GlobalStorage } from '../../storage';

const DEFAULT_IN_OUT_NOTIFICATION_LIMIT_COUNT = 50;

export const HomePage = observer(() => {
  const homeStore = useHomeStore();
  const [language, setLanguage] = useState<string>(
    'zh',
    // sessionStorage.getItem('language') || 'zh',
  );

  useLayoutEffect(() => {
    changeLanguage(language);
    setLanguage(language);
  }, [language]);

  // 语言切换
  const onChangeLanguage = (language: string) => {
    // sessionStorage.setItem('language', language);
    changeLanguage(language);
    setLanguage(language);
  };

  const text = {
    userName: '',
    roomName: '',
    password: '',
    openMic: true,
    openCamera: true,
    userInOutNotificationLimitCount: DEFAULT_IN_OUT_NOTIFICATION_LIMIT_COUNT,
  };

  const history = useHistory();

  const onClickJoin = async () => {
    homeStore.setLaunchConfig({
      pretest: true,
      language: language,
      token: '',
      isRobot: false,
      roomName: text.roomName,
      roomId: MD5(text.roomName),
      userName: text.userName,
      userId: MD5(text.userName),
      rtmUid: MD5(text.userName),
      roomPassword: text.password,
      openMic: text.openMic,
      openCamera: text.openCamera,
      duration: 2700,
      totalPeople: 1000,
      userInOutNotificationLimitCount:
        GlobalStorage.read('inOutLimitCount') ||
        text.userInOutNotificationLimitCount,
      sdkDomain: `${REACT_APP_AGORA_APP_SDK_DOMAIN}`,
    });
    history.push('/launch');
  };

  return (
    <MettingHome
      language={language}
      defaultOpenMic={text.openMic}
      defaultOpenCamera={text.openCamera}
      onChangeRoomName={(v) => (text.roomName = v)}
      onChangeRoomPassword={(v) => (text.password = v)}
      onChangeUserName={(v) => (text.userName = v)}
      onChangeMic={(v) => {
        text.openMic = v;
      }}
      onChangeCamera={(v) => (text.openCamera = v)}
      join={onClickJoin}></MettingHome>
  );
});
