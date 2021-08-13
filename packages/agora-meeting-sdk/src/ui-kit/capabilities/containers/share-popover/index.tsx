import React, { FC, useState } from 'react';
import classnames from 'classnames';
import { BaseProps } from '~components/interface/base-props';
import { observer } from 'mobx-react';
import './index.css';
import {
  useGlobalContext,
  useRoomContext,
  useUsersContext,
} from 'agora-meeting-core';
import { transI18n, Popover, Button } from '~ui-kit';
import { copyText } from '@/ui-kit/utils';
import { useUIStore } from '@/infra/hooks';

// Change it your own
const PUBLISH_URL =
  'https://webdemo.agora.io/flexible-classroom/test/dev_apaas_meeting_1.0.0/20210712_1793/#/';
export interface SharePopoverProps extends BaseProps {}

export const SharePopover: FC<SharePopoverProps> = observer(({ children }) => {
  const { roomInfo } = useRoomContext();
  const { localUserInfo } = useUsersContext();
  const { fireToast } = useGlobalContext();

  const text =
    `${transI18n('invite.meeting_name')}${roomInfo?.roomName}\n` +
    `${transI18n('invite.invited_by')}${localUserInfo?.userName}\n` +
    `${transI18n('invite.meeting_pwd')}${roomInfo?.roomPassword}\n` +
    `${transI18n('invite.web_link')}${PUBLISH_URL}`;

  const onClickCopy = () => {
    copyText(text);
    fireToast('invite.meeting_info_copy_success');
  };

  const content = (
    <div>
      <div className="item">
        <span className="left">{transI18n('invite.meeting_name')}</span>
        <span className="right">{roomInfo?.roomName}</span>
      </div>
      <div className="item">
        <span className="left">{transI18n('invite.invited_by')}</span>
        <span className="right">{localUserInfo?.userName}</span>
      </div>
      <div className="item">
        <span className="left">{transI18n('invite.meeting_pwd')}</span>
        <span className="right">{roomInfo?.roomPassword}</span>
      </div>
      <div className="item">
        <span className="left">{transI18n('invite.web_link')}</span>
        <span className="right">{PUBLISH_URL}</span>
      </div>
      <div className="btn-wrapper">
        <Button className="copy-btn" onClick={(e) => onClickCopy()}>
          {transI18n('invite.copy_meeting_info')}
        </Button>
      </div>
    </div>
  );

  return (
    <Popover
      trigger="click"
      placement="bottom"
      overlayClassName="share-popover"
      content={content}>
      {children}
    </Popover>
  );
});
