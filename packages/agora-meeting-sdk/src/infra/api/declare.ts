import { RenderInfo,AgoraEvent } from 'agora-meeting-core';

export enum RoleTypeEnum {
  none = -1,
  invisible = 0,
  teacher = 1,
  student = 2,
  assistant = 3,
}

export const regionMap = {
  AP: 'sg',
  CN: 'cn-hz',
  EU: 'gb-lon',
  NS: 'us-sv',
} as const;

export type RoomConfigProps<T> = {
  store: T;
};

export interface RoomComponentConfigProps<T> {
  store: T;
  dom: Element;
}


export type MeetingConfig = {
  appId: string;
};

export interface RoomParameters {
  roomUuid: string;
  userUuid: string;
  roomName: string;
  userName: string;
  userRole: RoleTypeEnum;
}

export type ListenerCallback = (evt: AgoraEvent) => void;

export type SDKConfig = {
  configParams: MeetingConfig;
};

export type LanguageEnum = 'en' | 'zh';

export type LaunchConfig = {
  userId: string; // 用户id
  userName: string; // 用户昵称
  roomId: string; // 房间id
  roomName: string; // 房间名称
  roomPassword: string; // 密码
  openMic: boolean; // 是否打开麦克风
  openCamera: boolean; // 是否打开摄像头
  listener: ListenerCallback; // launch状态
  pretest: boolean; // 开启设备检测
  token: string; // rtmToken
  duration: number; // 课程时长
  totalPeople: number; // 最大人数
  userInOutNotificationLimitCount?: number; // 进出通知的限制人数
  recordUrl?: string; // 录制页地址
  isRobot?: boolean; // 是否机器人
  userProperties?: Object;
  sdkDomain?: string;
  // TODO:qinzhen:other params
  // language: LanguageEnum; // 国际化
};

// 视图展示模式
export enum RenderLayout {
  tile = 1,
  audio = 2,
  lecturer = 3,
}

// 最终渲染信息
export type FinalRnderInfo = RenderInfo & {
  isTop: boolean; // 是否置顶
  order: number; // 权重
  isSelected?: boolean; // 是否选中
};

// log 上传的状态
export enum UpoladLogState {
  init = 1,
  uploading = 2,
  success = 3,
  fail = 4,
}
