import { NotifyMessageType, UserInfo } from 'agora-meeting-core';
import { transI18n } from '~ui-kit';

// NotifyMessageType => 转换成内容
export function transformNotifyMessageContent(
  type: NotifyMessageType,
  sender: UserInfo,
  payload: any,
) {
  switch (type) {
    case NotifyMessageType.ADMIN_MUTE_ALL_MIC:
      // 关闭全员麦克风
      return transI18n('toast.mute_all_mic');
    case NotifyMessageType.ADMIN_MUTE_ALL_CAM:
      // 关闭全员摄像头
      return transI18n('toast.mute_all_cam');
    case NotifyMessageType.ACCESS_CHANGE_CAM_ON:
      // 可以自由打开摄像头
      return transI18n('toast.cam_permission_off');
    case NotifyMessageType.ACCESS_CHANGE_MIC_ON:
      // 可以自由打开麦克风
      return transI18n('toast.mic_permission_off');
    case NotifyMessageType.ACCESS_CHANGE_CAM_OFF:
      // 打开摄像头需审批
      return transI18n('toast.cam_permission_on');
    case NotifyMessageType.ACCESS_CHANGE_MIC_OFF:
      // 打开麦克风需审批
      return transI18n('toast.mic_permission_on');
    case NotifyMessageType.ADMIN_MUTE_YOUR_CAM:
      // 主持人关闭你的摄像头
      return transI18n('toast.admin_turn_off_cam');
    case NotifyMessageType.ADMIN_MUTE_YOUR_MIC:
      // 主持人关闭你的麦克风
      return transI18n('toast.admin_turn_off_mic');
    case NotifyMessageType.ADMIN_CHANGE_BE_HOST:
      // xxx成为主持人
      return transI18n('toast.new_admin', { name: sender.userName });
    case NotifyMessageType.ADMIN_CHANGE_NO_HOST:
      // 房间内没有主持人
      return transI18n('toast.action_no_host');
    case NotifyMessageType.USER_CHANGE_ENTER:
      // xxx进入房间
      return transI18n('toast.enter_room', { name: sender.userName });
    case NotifyMessageType.USER_CHANGE_LEFT:
      // xxx离开房间
      return transI18n('toast.leave_room', { name: sender.userName });
    case NotifyMessageType.SCREEN_CHNAGE_ON:
      // xxx打开屏幕共享
      return transI18n('toast.screen_start', { name: sender.userName });
    case NotifyMessageType.SCREEN_CHANGE_OFF:
      // 屏幕共享已结束
      return transI18n('toast.screen_end');
    case NotifyMessageType.BOARD_CHANGE_ON:
      // xxx开始白板分享
      return transI18n('toast.whiteboard_start', { name: sender.userName });
    case NotifyMessageType.BOARD_CHANGE_OFF:
      // xxx的白板已结束
      return transI18n('toast.whiteboard_end', { name: sender.userName });
    case NotifyMessageType.BOARD_INTERACT_ON:
      // xxx加入白板互动
      return transI18n('toast.whiteboard_join', { name: sender.userName });
    case NotifyMessageType.USER_APPROVE_APPLY_CAM:
      // xxx申请打开摄像头
      return transI18n('notify.popup_apply_video_title', {
        name: sender.userName,
      });
    case NotifyMessageType.USER_APPROVE_APPLY_MIC:
      // xxx申请打开麦克风
      return transI18n('notify.popup_apply_audio_title', {
        name: sender.userName,
      });
    case NotifyMessageType.USER_APPROVE_ACCEPT_CAM:
      // xxx同意了你打开摄像头的申请
      return transI18n('notify.popup_accept_video_apply_title', {
        name: sender.userName,
      });
    case NotifyMessageType.USER_APPROVE_ACCEPT_MIC:
      // xxx同意了你打开麦克风的申请
      return transI18n('notify.popup_accept_audio_apply_title', {
        name: sender.userName,
      });
    case NotifyMessageType.NOTIFY_IN_OUT_OVER_MAX_LIMIT:
      // 超过xx人，成员进出通知关闭
      // TODO:qinzhen:num
      return transI18n('toast.action_toast_over_max_num', {
        num: payload.num,
      });
    case NotifyMessageType.NOTIFY_IN_OUT_CLOSED:
      // 所有成员进出通知都已关闭
      return transI18n('toast.action_notify_mute_always');
    case NotifyMessageType.RECORD_CLOSED:
      // 所有成员进出通知都已关闭
      return transI18n('record.record_success');
    default:
      return '';
  }
}

export function sleep(number: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, number);
  });
}

// 复制文字
export function copyText(text: string) {
  let txa = document.createElement('textarea');
  txa.value = text;
  document.body.appendChild(txa);
  txa.select();
  document.execCommand('Copy');
  document.body.removeChild(txa);
}

