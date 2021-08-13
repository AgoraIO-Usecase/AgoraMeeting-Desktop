import { SceneDefinition } from 'agora-meeting-core';

export declare type ListenerCallbackType<T> = [T] extends [
  (...args: infer U) => any,
]
  ? U
  : [T] extends [void]
  ? []
  : [T];

export enum BizPageRouter {
  Setting = 'setting',
  Metting = 'metting',
  LaunchPage = 'launch',
  PretestPage = 'pretest',
  TestHomePage = 'test_home',
  Incognito = 'Incognito',
  TestRecordPage = 'test_record',
}

export enum BizPagePath {
  PretestPagePath = '/pretest',
}

export type NetlessTaskProgress = {
  totalPageSize: number;
  convertedPageSize: number;
  convertedPercentage: number;
  convertedFileList: readonly SceneDefinition[];
};


export enum QuickTypeEnum {
  Kick = 'kick',
  Kicked = 'kicked',
  End = 'end',
}

export enum AgoraMediaDeviceEnum {
  Default = '',
  Unknown = 'unknown',
}

