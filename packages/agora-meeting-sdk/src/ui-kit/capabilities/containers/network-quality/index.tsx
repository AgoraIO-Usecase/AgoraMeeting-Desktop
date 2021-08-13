import React, { FC } from 'react';
import { BaseProps } from '~components/interface/base-props';
import classnames from 'classnames';
import './index.css';
import { Popover } from '~components/popover';
import { TooltipPlacement } from '~components';
import { NetworkQualityLevel } from 'agora-meeting-core';

export interface NetworkQualityProps extends BaseProps {
  value?: NetworkQualityLevel;
  placement?: TooltipPlacement;
  popoverContent?: string;
  popoverVisible?: boolean;
}

export const NetworkQuality: FC<NetworkQualityProps> = ({
  value = NetworkQualityLevel.excellent,
  placement = 'right',
  popoverContent = '',
  popoverVisible = false,
}) => {
  const cls = classnames('icon', `icon-${value}`);
  return (
    <Popover
      overlayClassName="network-popover"
      placement={placement}
      content={popoverContent}
      visible={popoverVisible}>
      <span className="network-quality">
        <i className={cls}></i>
      </span>
    </Popover>
  );
};
