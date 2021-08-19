import { SettingValue } from '../../setting/declare';
import { observer } from 'mobx-react';
import { BaseDialogProps } from '../index';
import { Modal, transI18n } from '~ui-kit';
import { Setting } from '../../setting/index';
import { useUIStore } from '@/infra/hooks';
import { UpoladLogState } from '@/infra/api';

interface SettingDialogProps extends BaseDialogProps {
  exclude?: SettingValue[];
  defaultHighlight?: SettingValue;
}

// 房间内设置dialog
export const SettingDialog: React.FC<SettingDialogProps> = observer(
  ({ id, exclude, defaultHighlight }) => {
    const { removeDialog, setUploadLogState } = useUIStore();

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
        <Setting exclude={exclude} defaultHighlight={defaultHighlight} />
      </Modal>
    );
  },
);
