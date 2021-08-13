import { transI18n } from '~ui-kit';
import {
  isBoolean,
  isEmpty,
  isString,
  isFunction,
  isNumber,
  isArray,
} from 'lodash';
import { MeetingConfig } from './declare';
import {
  LaunchConfig,
} from './index';


export class AgoraSDKError extends Error {
  message: string;
  code?: string;

  constructor(args: any | string) {
    super(args);
    if (typeof args === 'string') {
      this.message = args;
    } else {
      this.message = args.message;
      this.code = args.code;
    }
  }

  [Symbol.toPrimitive](hint: string) {
    if (hint === 'string') {
      return `SDKError: ${JSON.stringify({
        name: this.name,
        code: this.code,
        message: this.message,
        stack: this.stack,
      })}`;
    }
  }
}

export const checkLaunchOption = (dom: Element, option: LaunchConfig) => {
  // TODO:qinzhen:参数校验
  if (!dom) {
    throw new AgoraSDKError('dom parameter cannot be empty');
  }

  if (isEmpty(option)) {
    throw new AgoraSDKError('option parameter cannot is invalid');
  }

  if (!isBoolean(option.pretest)) {
    throw new AgoraSDKError('pretest parameter is invalid should be boolean');
  }

  if (option.roomName.length < 3) {
    throw new AgoraSDKError(transI18n('login.tip_room_name_short'));
  }

  if (option.roomName.length > 50) {
    throw new AgoraSDKError(transI18n('login.tip_room_name_over'));
  }

  if (option.userName.length < 3) {
    throw new AgoraSDKError(transI18n('login.tip_user_name_short'));
  }

  if (option.userName.length > 20) {
    throw new AgoraSDKError(transI18n('login.tip_user_name_over'));
  }
};

export const checkConfigParams = (params: MeetingConfig) => {
  if (isEmpty(params)) {
    throw new AgoraSDKError('config parameter cannot be empty');
  }
  if (isEmpty(params.appId)) {
    throw new AgoraSDKError('appId parameter cannot be empty');
  }
  if (params.appId.length !== 32) {
    throw new AgoraSDKError('appId parameter is invalid');
  }
};
