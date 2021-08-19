import AgoraMeetingSDK, { AgoraEvent } from '../../api';
import {
  ClassRoom,
  ClassRoomAbstractStore,
  controller,
} from '../../api/controller';
import { useHomeStore } from '@/infra/hooks';
import { isEmpty } from 'lodash';
import { observer } from 'mobx-react';
import { useCallback, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { GlobalStorage } from '@/infra/utils';

import { Rating } from './rating/index';
import { Modal } from '~components/modal';
import Notification from 'rc-notification';
import 'rc-notification/assets/index.css';

import { RtmTokenBuilder, RtmRole } from 'agora-access-token';
import { transI18n } from '~ui-kit';

//@ts-ignore
window.controller = controller;

export const LaunchPage = observer(() => {
  const homeStore = useHomeStore();
  const history = useHistory();
  const launchOption = homeStore.launchOption;
  const roomRef = useRef<ClassRoom<ClassRoomAbstractStore> | null>(null);

  useEffect(() => {
    if (!launchOption || isEmpty(launchOption)) {
      history.push('/');
      return;
    }
  }, []);

  const showRatingDialog = () => {
    Modal.show({
      width: 420,
      title: transI18n('rating.title'),
      children: (
        <Rating
          launchOption={launchOption}
          onSubmit={() => {
            Modal.hide();
            history.push('/');
          }}></Rating>
      ),
      onCancel: () => {
        history.push('/');
      },
    });
  };

  const handleError = (err: any) => {
    console.error(err);
    Notification.newInstance({}, (notification) => {
      notification.notice({
        duration: 3,
        content: err.message,
      });
    });
  };

  const mountLaunch = useCallback(
    async (dom: any) => {
      try {
        if (dom) {
          AgoraMeetingSDK.init({
            appId: `${REACT_APP_AGORA_APP_ID}`,
          });
          // this is for DEBUG PURPOSE only. please do not store certificate in client, it's not safe.
          // 此处仅为开发调试使用, token应该通过服务端生成, 请确保不要把证书保存在客户端
          const appCertificate = `${REACT_APP_AGORA_APP_CERTIFICATE}`;
          if (appCertificate) {
            launchOption.token = RtmTokenBuilder.buildToken(
              `${REACT_APP_AGORA_APP_ID}`,
              appCertificate,
              launchOption.userId,
              RtmRole.Rtm_User,
              0,
            );
          }
          roomRef.current = await AgoraMeetingSDK.launch(dom, {
            ...launchOption,
            // TODO:  这里需要传递开发者自己发布的录制页面地址
            recordUrl: REACT_APP_AGORA_APP_RECORD_URL
              ? `${REACT_APP_AGORA_APP_RECORD_URL}`
              : `https://webdemo.agora.io/agorameeting/test/dev_apaas_meeting_1.0.1/record_page`,

            listener: (evt: AgoraEvent) => {
              console.log('launch#listener ', evt);
              if (evt === AgoraEvent.destroyed) {
                showRatingDialog();
                GlobalStorage.clear();
              }
            },
          });
        }
      } catch (err) {
        handleError(err);
      }
      return () => {
        if (roomRef.current) {
          roomRef.current.destroy();
        }
      };
    },
    [AgoraMeetingSDK],
  );

  return (
    <div
      ref={mountLaunch}
      id="app"
      style={{ width: '100%', height: '100%', background: '#F9F9FC' }}></div>
  );
});
