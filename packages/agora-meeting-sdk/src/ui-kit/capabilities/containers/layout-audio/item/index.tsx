import React, { FC, useState, ReactNode } from 'react';
import { BaseProps } from '~components/interface/base-props';
import { Popover } from '~components/popover';
import { MettingMenu } from '../../menu/index';
import classnames from 'classnames';
import './index.css';
import { RenderInfo } from 'agora-meeting-core';
import { getAvatarUrl } from '~ui-kit';

export interface AudioItemProps extends RenderInfo {}

export const AudioItem: FC<AudioItemProps> = ({ hasAudio, userInfo }) => {
  const iconCls = classnames('icon', {
    'icon-speaker-on': hasAudio,
    'icon-speaker-off': !hasAudio,
  });

  const cls = classnames('audio-item', {
    // 是否高亮
    'mic-enabled': false,
  });

  /* <MettingMenu theme={'black'}></MettingMenu> */

  return (
    <div className={cls}>
      <img className="avatar" src={getAvatarUrl(userInfo.userName)} alt="" />
      <div className="item__bottom">
        <i className={iconCls}></i>
        <span className="text">{userInfo.userName}</span>
      </div>
    </div>

    /*     
    <Popover
      trigger="hover"
      overlayClassName="raw-popover"
      placement="rightTop"
      content={''}>

    </Popover> */
  );
};
