import {
  DeviceTypeEnum,
  useMediaContext,
  useGlobalContext,
  useBoardContext,
  useScreenContext,
} from 'agora-meeting-core';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { useCallback, useEffect, useState } from 'react';
import { Button, Modal, t, transI18n } from '~ui-kit';
import { NotifyMessageDialog } from './notify/notify-dialog';
import { CloseAllDeviceDialog } from './close-all-device/index';
import { DisclaimerDialog } from './disclaimer/index';
import { useUIStore } from '@/infra/hooks';
import { SettingDialog } from './setting/index';
import { CloseRoomDialog } from './close-room/index';
import { RoomEndDialog } from './room-end/index';
import { BeKickedOutDialog } from './be-kicked-out/index';

export type BaseDialogProps = {
  id: string;
};

// ------------------------ 会议相关的  -----------------------------

export const ApplyTurnOnDeviceDialog: React.FC<
  BaseDialogProps & { device: DeviceTypeEnum; applyOpenLocalDevice: () => void }
> = observer(({ id, device }) => {
  const { removeDialog } = useUIStore();
  const { applyOpenLocalDevice } = useMediaContext();

  const onOk = async () => {
    applyOpenLocalDevice(device);
    removeDialog(id);
  };

  const onCancel = () => {
    removeDialog(id);
  };

  return (
    <Modal
      width={362}
      title=""
      onOk={onOk}
      onCancel={onCancel}
      footer={[
        <Button type={'primary'} action="ok">
          {t('yes')}
        </Button>,
        <Button type={'secondary'} action="cancel">
          {t('no')}
        </Button>,
      ]}>
      <div>
        {device === DeviceTypeEnum.camera
          ? t('notify.popup_request_to_turn_cam_on')
          : t('notify.popup_request_to_turn_mic_on')}
      </div>
    </Modal>
  );
});

// 关闭白板
export const BoardCloseDialog: React.FC<BaseDialogProps> = observer(
  ({ id }) => {
    const { removeDialog } = useUIStore();
    const { closeBoardSharing } = useBoardContext();

    const onOk = async () => {
      await closeBoardSharing();
      removeDialog(id);
    };

    const onCancel = () => {
      removeDialog(id);
    };

    return (
      <Modal
        width={362}
        title=""
        onOk={onOk}
        onCancel={onCancel}
        footer={[
          <Button type={'primary'} action="ok">
            {t('yes')}
          </Button>,
          <Button type={'secondary'} action="cancel">
            {t('no')}
          </Button>,
        ]}>
        <div>{t('notify.popup_leave_with_whiteboard_on')}</div>
      </Modal>
    );
  },
);

// 关闭屏幕共享
export const ScreensharingCloseDialog: React.FC<BaseDialogProps> = observer(
  ({ id }) => {
    const { removeDialog } = useUIStore();
    const { closeScreenSharing } = useScreenContext();

    const onOk = async () => {
      await closeScreenSharing();
      removeDialog(id);
    };

    const onCancel = () => {
      removeDialog(id);
    };

    return (
      <Modal
        width={362}
        title=""
        onOk={onOk}
        onCancel={onCancel}
        footer={[
          <Button type={'primary'} action="ok">
            {t('yes')}
          </Button>,
          <Button type={'secondary'} action="cancel">
            {t('no')}
          </Button>,
        ]}>
        <div>{t('notify.popup_leave_with_screenshare_on')}</div>
      </Modal>
    );
  },
);

// ------------------------- 会议相关的 --------------------------------

export type DialogName =
  | 'apply-turn-on-device'
  | 'close-room'
  | 'notify-message'
  | 'close-all-device'
  | 'disclaimer'
  | 'board-close'
  | 'screensharing-close'
  | 'setting'
  | 'room-end'
  | 'be-kicked-out';

// DialogContainer
export const DialogContainer: React.FC<any> = observer(() => {
  const { dialogQueue, addDialog } = useUIStore();
  const { dialogEventObserver } = useGlobalContext();

  const dialogMap = {
    'apply-turn-on-device': (props: any) =>
      addDialog(ApplyTurnOnDeviceDialog, { ...props }),
    // 主动关闭房间
    'close-room': () => addDialog(CloseRoomDialog),
    // 房间被关闭
    'room-end': () => addDialog(RoomEndDialog),
    setting: (props: any) => addDialog(SettingDialog, { ...props }),
    'notify-message': () => addDialog(NotifyMessageDialog),
    'close-all-device': (props: any) =>
      addDialog(CloseAllDeviceDialog, { ...props }),
    disclaimer: (props: any) => addDialog(DisclaimerDialog, { ...props }),
    'board-close': (props: any) => addDialog(BoardCloseDialog, { ...props }),
    'screensharing-close': (props: any) =>
      addDialog(ScreensharingCloseDialog, { ...props }),
    'be-kicked-out': (props: any) => addDialog(BeKickedOutDialog, { ...props }),
  };

  useEffect(() => {
    dialogEventObserver.subscribe((evt: any) => {
      console.log('dialogEventObserver # evt ', evt);
      const dialogOperation = dialogMap[evt.eventName];
      if (dialogOperation) {
        dialogOperation(evt.props);
      }
    });
    return () => {
      dialogEventObserver.complete();
    };
  }, [dialogEventObserver]);

  const cls = classnames({
    [`rc-mask`]: !!dialogQueue.length,
  });

  return (
    <div className={cls}>
      {dialogQueue.map(({ id, component: Component, props }: any) => (
        <div key={id} className="fixed-container">
          <Component {...props} id={id} />
        </div>
      ))}
    </div>
  );
});
