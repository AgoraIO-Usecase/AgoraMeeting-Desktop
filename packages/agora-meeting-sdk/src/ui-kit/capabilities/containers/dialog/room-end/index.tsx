import { BaseDialogProps } from '../index';
import { observer } from 'mobx-react';
import { Button, Modal, t, transI18n } from '~ui-kit';
import { useUIStore } from '@/infra/hooks';
import { useRoomContext } from 'agora-meeting-core';

export const RoomEndDialog: React.FC<BaseDialogProps> = observer(({ id }) => {
  const { removeDialog } = useUIStore();
  const { leaveRoom } = useRoomContext();

  const onCancel = () => {
    removeDialog(id);
    leaveRoom();
  };

  const footer = [
    <Button type={'primary'} onClick={onCancel}>
      {t('know')}
    </Button>,
  ];

  return (
    <Modal width={362} title="" onCancel={onCancel} footer={footer}>
      <div> {t('main.close_title')}</div>
    </Modal>
  );
});
