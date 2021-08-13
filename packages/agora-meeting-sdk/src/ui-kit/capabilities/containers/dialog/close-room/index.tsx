import { BaseDialogProps } from '../index';
import { observer } from 'mobx-react';
import { Button, Modal, t, transI18n } from '~ui-kit';
import { useUIStore } from '@/infra/hooks';
import {
  BoardPermission,
  useBoardContext,
  useGlobalContext,
  useRoomContext,
  useScreenContext,
  useUsersContext,
} from 'agora-meeting-core';

export const CloseRoomDialog: React.FC<BaseDialogProps> = observer(({ id }) => {
  const { closeRoom, leaveRoom } = useRoomContext();
  const { removeDialog } = useUIStore();
  const { fireDialog } = useGlobalContext();
  const { isHost } = useUsersContext();
  const { boardPermission } = useBoardContext();
  const { isScreenSharingByMyself } = useScreenContext();

  const onCancel = () => {
    removeDialog(id);
  };

  // 检查白板是否开启且是自己开启
  const checkBoardOpendByMyself = () => {
    if (boardPermission === BoardPermission.admin) {
      return true;
    }
    return false;
  };

  // 检查屏幕共享是否开启且是自己开启
  const checkScreenSharingByMyself = () => {
    if (isScreenSharingByMyself) {
      return true;
    }
    return false;
  };

  const footer = [
    <Button type={'secondary'} action="cancel">
      {t('cancel')}
    </Button>,
    <Button
      type={'primary'}
      onClick={async () => {
        removeDialog(id);
        if (checkBoardOpendByMyself()) {
          fireDialog('board-close');
          return;
        }
        if (checkScreenSharingByMyself()) {
          fireDialog('screensharing-close');
          return;
        }
        await leaveRoom();
      }}>
      {t('main.exit_meeting')}
    </Button>,
  ];

  if (isHost) {
    footer.push(
      <Button
        type={'primary'}
        onClick={async () => {
          removeDialog(id);
          if (checkBoardOpendByMyself()) {
            fireDialog('board-close');
            return;
          }
          if (checkScreenSharingByMyself()) {
            fireDialog('screensharing-close');
            return;
          }
          await closeRoom();
        }}>
        {t('main.close_meeting')}
      </Button>,
    );
  }

  return (
    <Modal width={362} title="" onCancel={onCancel} footer={footer}>
      <p>{t('main.exit_title')}</p>
    </Modal>
  );
});
