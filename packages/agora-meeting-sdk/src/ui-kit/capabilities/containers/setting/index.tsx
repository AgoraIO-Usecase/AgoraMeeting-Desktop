import { Button, Modal, transI18n } from '~ui-kit';
import { Setting } from './setting';
import { observer } from 'mobx-react';
import { usePretestContext } from 'agora-meeting-core';
import './index.css';
import { BaseDialogProps } from '../dialog';
import { useUIStore } from '@/infra/hooks';
import { ReactNode } from 'react';
import { UpoladLogState } from '@/infra/api';

export const SettingContainer: React.FC<BaseDialogProps> = observer(
  ({ id }) => {


    const { removeDialog, setUploadLogState, uploadLogState } = useUIStore();

    const onClose = () => {
      removeDialog(id);
      setUploadLogState(UpoladLogState.init);
    };

    return (
      <Modal
        contentClassName="setting-content"
        title={transI18n('setting.setting')}
        width={612}
        onCancel={onClose}
        onOk={onClose}>
        <Setting />
      </Modal>
    );
  },
);
