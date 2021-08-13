import { observer } from 'mobx-react';
import { Toast } from '~ui-kit';
import { useGlobalContext } from 'agora-meeting-core';
import { useEffect } from 'react';
import { transI18n } from '~ui-kit';

import { useUIStore } from '@/infra/hooks';

type ToastType = any;

export const ToastContainer = observer(() => {
  const { toastQueue, addToast, removeToast } = useUIStore();
  const { toastEventObserver } = useGlobalContext();

  const toast = (
    desc: string,
    props?: any,
    toastType: 'success' | 'warning' | 'error' = 'success',
  ) => addToast(transI18n(desc, props), toastType);

  const toastMap = {
    'error.cannot_join': (props: any) =>
      toast('error.cannot_join', props, 'error'),
    'error.unknown': (props: any) => toast('error.unknown', props, 'error'),
    'toast.audio_equipment_has_changed': (props: any) =>
      toast('toast.audio_equipment_has_changed', props),
    'toast.video_equipment_has_changed': (props: any) =>
      toast('toast.video_equipment_has_changed', props),
    // ----------------- 会议 -------------------------
    'toast.board_ongoing': (props: any) =>
      toast('toast.board_ongoing', props, 'error'),
    'toast.screen_ongoing': (props: any) =>
      toast('toast.screen_ongoing', props, 'error'),
    'toast.host_max': (props: any) => toast('toast.host_max', props, 'error'),
    'toast.password_error': (props: any) =>
      toast('toast.password_error', props, 'error'),
    'toast.room_has_host': (props: any) =>
      toast('toast.room_has_host', props, 'error'),
    'toast.board_max': (props: any) => toast('toast.board_max', props, 'error'),
    'toast.room_max_member': (props: any) =>
      toast('toast.room_max_member', props, 'error'),
    'toast.room_max_broadcaster': (props: any) =>
      toast('toast.room_max_broadcaster', props, 'error'),
    'toast.action_toast_over_max_num': (props: any) =>
      toast('toast.action_toast_over_max_num', props, 'error'),
    'login.tip_room_name_short': (props: any) =>
      toast('login.tip_room_name_short', props, 'error'),
    'login.tip_room_pass_over': (props: any) =>
      toast('login.tip_room_pass_over', props, 'error'),
    'login.tip_user_name_over': (props: any) =>
      toast('login.tip_user_name_over', props, 'error'),
    'login.tip_user_name_short': (props: any) =>
      toast('login.tip_user_name_short', props, 'error'),
    'invite.meeting_info_copy_success': (props: any) =>
      toast('invite.meeting_info_copy_success', props),
    'record.tip': (props: any) => toast('record.tip', props, 'error'),
    'record.is_not_host': (props: any) =>
      toast('record.is_not_host', props, 'error'),
    'toast.copy_success': (props: any) => toast('toast.copy_success', props),
  };

  useEffect(() => {
    toastEventObserver.subscribe((evt: any) => {
      console.log('toastEventObserver evt', evt);
      const toastOperation = toastMap[evt.eventName];

      if (toastOperation) {
        toastOperation(evt.props);
      }
    });
    return () => {
      toastEventObserver.complete();
    };
  }, [toastEventObserver]);

  return (
    <div style={{ justifyContent: 'center', display: 'flex' }}>
      {toastQueue.map((value: ToastType, idx: number) => (
        <Toast
          style={{ position: 'absolute', top: 50 * (idx + 1), zIndex: 9999 }}
          key={`${value.id}`}
          type={value.type}
          closeToast={() => {
            removeToast(`${value.id}`);
          }}>
          {value.desc}
        </Toast>
      ))}
    </div>
  );
});
