import React, { FC } from 'react';
import { BaseProps } from '~components/interface/base-props';
import classnames from 'classnames';
import './index.css';
import { UserOperation, useUsersContext } from 'agora-meeting-core';
import { observer } from 'mobx-react';
import { t } from '~ui-kit';
import { async } from 'rxjs';
import { useUIStore } from '@/infra/hooks';

export type MettingMenuTheme = 'black' | 'white';

export interface MettingMenuProps extends BaseProps {
  userId: string;
  options: UserOperation[];
  theme?: MettingMenuTheme;
}
export const MettingMenu: FC<MettingMenuProps> = observer(
  ({ theme = 'black', options = [], userId }) => {
    const cls = classnames('metting-menu', theme);

    const transformOperationText = (item: UserOperation): string => {
      switch (item) {
        case UserOperation.abandonHost:
          return t('more.renounce_admin');
        case UserOperation.beHost:
          return t('more.become_admin');
        case UserOperation.setAsHost:
          return t('more.set_host');
        case UserOperation.closeCamera:
          return t('more.close_video');
        case UserOperation.closeMic:
          return t('more.mute_audio');
        case UserOperation.kickOut:
          return t('more.move_out');
        default:
          return '';
      }
    };

    const { dealUserOperation } = useUsersContext();

    const onMenuItemClick = async (item: UserOperation) => {
      await dealUserOperation(userId, item);
    };

    return (
      <div className={cls}>
        {options?.map((item, index) => (
          <div
            key={item}
            className="metting-menu-item"
            onClick={(e) => onMenuItemClick(item)}>
            <span className="text">{transformOperationText(item)}</span>
          </div>
        ))}
      </div>
    );
  },
);
