import React, { FC, useEffect, useState } from 'react';
import { BaseProps } from '~components/interface/base-props';
import classnames from 'classnames';
import './index.css';
import { Popover } from '~components/popover';
import { MettingMenu } from '../../menu/index';
import { UserDetailInfo, RoleTypeEnum } from 'agora-meeting-core';
import md5 from 'js-md5';
import { transI18n,getAvatarUrl } from '~ui-kit';

export interface MemberItemProps extends BaseProps, UserDetailInfo {
  
}

export const MemberItem: FC<MemberItemProps> = ({ ...props }) => {
  const {
    hasAudio,
    hasVideo,
    userName,
    isMe,
    userRole,
    options = [],
    userId,
    isSharing,
  } = props;

  const curIsHost = userRole === RoleTypeEnum.host;

  const [hover, setHover] = useState(false);

  const HandleEnter = () => {
    setHover(true);
  };

  const HandleLeave = () => {
    setHover(false);
  };

  const micCls = classnames('icon', 'icon-mic', {
    active: hasAudio,
  });

  const cameraCls = classnames('icon', 'icon-camera', {
    active: hasVideo,
  });

  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    setAvatar(getAvatarUrl(userName));
  }, [userName]);

  return (
    <div
      className="member-item"
      onMouseEnter={HandleEnter}
      onMouseLeave={HandleLeave}>
      <img className="avatar" src={avatar} alt="" />
      <span className="text">
        {userName}
        {isMe ? <span className="is-me">({transI18n('me')})</span> : null}
        {curIsHost ? (
          <span className="is-host">({transI18n('host')})</span>
        ) : null}
      </span>
      <span className="item__right">
        {curIsHost ? <i className="icon icon-host"></i> : null}
        {isSharing ? <i className="icon icon-screen-share"></i> : null}
        <i className={cameraCls}></i>
        <i className={micCls}></i>
      </span>
      {hover && options?.length ? (
        <Popover
          trigger="hover"
          overlayClassName="raw-popover"
          placement="bottom"
          content={
            <MettingMenu
              options={options}
              userId={userId}
              theme="white"></MettingMenu>
          }>
          <span className="btn-more">{transI18n('main.more')}</span>
        </Popover>
      ) : null}
    </div>
  );
};
