import { BaseDialogProps } from '../index';
import { observer } from 'mobx-react';
import { Button, Modal, t, transI18n } from '~ui-kit';
import { useUIStore } from '@/infra/hooks';

export const DisclaimerDialog: React.FC<BaseDialogProps> = observer(
  ({ id }) => {
    const { removeDialog } = useUIStore();

    const onCancel = async () => {
      removeDialog(id);
    };

    return (
      <Modal
        width={612}
        onCancel={onCancel}
        title={transI18n('disclaimer.title')}>
        <div
          style={{
            whiteSpace: 'pre-wrap',
          }}>
          {transI18n('disclaimer.content')}
        </div>
      </Modal>
    );
  },
);
