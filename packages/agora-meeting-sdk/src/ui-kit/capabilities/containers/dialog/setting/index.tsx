import { SettingContainer } from '../../setting';
import { observer } from 'mobx-react';
import { BaseDialogProps } from '../index';

// 房间内设置dialog
export const SettingDialog: React.FC<BaseDialogProps> = observer(({ id }) => {
  return <SettingContainer id={id} />;
});
