import {
  DeviceTypeEnum,
  useGlobalContext,
  useMediaContext,
  useRoomContext,
  UserOperation,
  useUsersContext,
} from 'agora-meeting-core';
import { BaseDialogProps } from '../index';
import { observer } from 'mobx-react';
import { Button, Modal, t, transI18n } from '~ui-kit';
import './index.css';
import { useUIStore } from '@/infra/hooks';

export const CloseAllDeviceDialog: React.FC<
  BaseDialogProps & { type: DeviceTypeEnum }
> = observer(({ id, type }) => {
  const { removeDialog } = useUIStore();
  const {
    hasCameraAccess,
    hasMicAccess,
    changeUserPermission,
  } = useRoomContext();
  const { dealUserOperation } = useUsersContext();
  const { localUserInfo } = useUsersContext();

  const onOK = async () => {
    if (type === DeviceTypeEnum.camera) {
      dealUserOperation(localUserInfo.userId, UserOperation.closeAllCamera);
    } else if (type === DeviceTypeEnum.mic) {
      dealUserOperation(localUserInfo.userId, UserOperation.closeAllMic);
    }
    removeDialog(id);
  };

  const onCancel = () => {
    removeDialog(id);
  };

  const content =
    type === DeviceTypeEnum.camera
      ? transI18n('more.mute_all_camera')
      : transI18n('more.mute_all_mic');

  const checkedContent =
    type === DeviceTypeEnum.camera
      ? transI18n('setting.camera_approve')
      : transI18n('setting.mic_approve');

  const checked =
    type === DeviceTypeEnum.camera ? !hasCameraAccess : !hasMicAccess;

  const footer = [
    <Button type={'ghost'} action="cancel">
      {t('cancel')}
    </Button>,
    <Button type={'primary'} action="ok">
      {t('confirm')}
    </Button>,
  ];

  return (
    <Modal
      width={362}
      title=""
      onOk={onOK}
      onCancel={onCancel}
      className="close-all-device-dialog"
      footer={footer}>
      <p className="content">{content}</p>
      <div className="item">
        <input
          checked={checked}
          type="checkbox"
          onChange={(e) => changeUserPermission(type, !e.target.checked)}
        />
        <span className="checkbox-text">{checkedContent}</span>
      </div>
    </Modal>
  );
});
