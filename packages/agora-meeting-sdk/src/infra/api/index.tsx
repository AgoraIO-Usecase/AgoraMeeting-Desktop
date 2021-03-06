import { CoreContextProvider, GenericErrorWrapper } from 'agora-meeting-core';
import { LiveRoom } from '../monolithic/live-room';
import { BizPagePath } from '../types';
import { controller } from './controller';
import { MeetingConfig, LaunchConfig } from './declare';
import { checkConfigParams, checkLaunchOption } from './validator';
import { UIStore } from '@/infra/stores/app/ui';
import { useState, ReactChild } from 'react';
import { UIContext } from '@/infra/hooks';
import packagejson from '../../../package.json';
import { setLanguage, LanguageEnum } from '~ui-kit';

export const UIContextProvider = ({
  language,
  children,
}: {
  language?: LanguageEnum;
  children: ReactChild;
}) => {
  const [store] = useState<UIStore>(() => new UIStore({ language }));

  return <UIContext.Provider value={store}>{children}</UIContext.Provider>;
};

export default class AgoraMeetingSDK {
  // 平台相关信息
  static readonly perform = {
    version: packagejson.version,
    rtcVersion: '4.5.0',
    rtmVersion: '1.4.2',
    whiteBoardVersion: '2.12.21',
  };

  static config = {
    appId: '',
  };

  static init(params: MeetingConfig) {
    checkConfigParams(params);
    Object.assign(AgoraMeetingSDK.config, params);
    console.log('# set config ', AgoraMeetingSDK.config, ' params ', params);
  }

  static setParameters(params: string) {
    try {
      let parseParams = JSON.parse(params);
      Object.assign(this.config, parseParams);
      console.info(`setParameters ${params}`);
    } catch (e) {
      console.error(`parse private params failed ${params}`);
    }
  }

  /**
   * 开启场景
   * @param dom DOM元素
   * @param option LaunchConfig
   */
  static async launch(dom: HTMLElement, option: LaunchConfig) {
    console.log('launch ', dom, ' option ', option);

    if (controller.appController.hasCalled) {
      throw GenericErrorWrapper('already launched');
    }

    const unlock = controller.appController.acquireLock();
    try {
      // 检查启动参数
      checkLaunchOption(dom, option);
      //@ts-ignore
      let mainPath = '/metting';
      console.log('mainPath ', mainPath);
      //@ts-ignore
      let roomPath = mainPath;
      console.log('main Path', mainPath, ' room Path', roomPath);
      if (option.pretest) {
        mainPath = BizPagePath.PretestPagePath;
      }
      const sdkDomain = option.sdkDomain
        ? option.sdkDomain
        : 'https://api.agora.io';

      const params = {
        config: {
          agoraAppId: AgoraMeetingSDK.config.appId,
          agoraNetlessAppId: '',
          enableLog: true,
          sdkDomain: sdkDomain,
          rtmUid: option.userId,
          token: option.token,
          recordUrl: option.recordUrl!,
          isRobot: !!option?.isRobot,
          userProperties: option?.userProperties,
          flexRoomProps: option?.flexRoomProps,
          recordConfig: option?.recordConfig,
        },
        // 初始化的房间信息
        roomInfoParams: {
          roomName: option.roomName,
          roomId: option.roomId,
          userId: option.userId,
          userName: option.userName,
          roomPassword: option.roomPassword,
          openMic: option.openMic,
          openCamera: option.openCamera,
          duration: option.duration,
          totalPeople: option.totalPeople,
          userInOutNotificationLimitCount:
            option.userInOutNotificationLimitCount,
          maxHost: option.maxHost,
        },
        resetRoomInfo: false,
        mainPath: mainPath,
        roomPath: roomPath,
        pretest: option.pretest,
      };
      // 设置语言
      if (option.language) {
        setLanguage(option.language);
      }

      controller.appController.create(
        <CoreContextProvider
          params={params}
          dom={dom}
          controller={controller.appController}>
          <UIContextProvider language={option.language}>
            <LiveRoom />
          </UIContextProvider>
        </CoreContextProvider>,
        dom,
        option.listener,
      );

      unlock();
    } catch (err) {
      unlock();
      throw GenericErrorWrapper(err);
    }

    return controller.appController.getRoom();
  }
}

export * from './declare';
