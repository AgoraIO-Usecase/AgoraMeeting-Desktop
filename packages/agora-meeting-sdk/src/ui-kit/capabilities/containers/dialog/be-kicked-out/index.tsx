import { BaseDialogProps } from '../index';
import { observer } from 'mobx-react';
import { Button, Modal, t, transI18n } from '~ui-kit';
import { useUIStore } from '@/infra/hooks';
import { useRoomContext } from 'agora-meeting-core';

export const BeKickedOutDialog: React.FC<BaseDialogProps> = observer(
  ({ id }) => {
    const { removeDialog } = useUIStore();
    const { leaveRoom } = useRoomContext();

    const onCancel = () => {
      leaveRoom();
      removeDialog(id);
    };

    const footer = [
      <Button type={'primary'} onClick={onCancel}>
        {t('know')}
      </Button>,
    ];

    return (
      <Modal width={362} title="" onCancel={onCancel} footer={footer}>
        <p>{t('main.removed_from_room')}</p>
      </Modal>
    );
  },
);
