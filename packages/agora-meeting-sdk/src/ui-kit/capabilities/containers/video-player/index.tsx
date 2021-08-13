import React, { FC, useMemo, useState } from 'react';
import { Popover } from '~components/popover';
import { MettingMenu, MettingMenuTheme } from '../menu/index';
import { RendererPlayer } from '../renderer-player';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import './index.css';
import {
  RenderInfo,
  RenderInfoType,
  RoleTypeEnum,
  VideoPlayerConfig,
} from 'agora-meeting-core';
import { getAvatarUrl } from '~ui-kit';
import { useUIStore } from '@/infra/hooks';

export { MettingVideoPlayerList } from './list';
export type TopStatus = 'none' | 'enable' | 'disable';

export interface MettingVideoPlayerProps extends RenderInfo {
  showOperation?: boolean;
  showInfo?: boolean;
  className?: string;
  isTop?: boolean;
  videoPlayerConfig?: VideoPlayerConfig;
  onClick?: (id: string) => void;
}

export const MettingVideoPlayer: FC<MettingVideoPlayerProps> = observer(
  ({
    type,
    hasVideo = false,
    hasAudio = false,
    userInfo,
    id,
    streamId,
    options = [],
    renderer,
    isSharing = false,
    showOperation = false,
    showInfo = true,
    isTop = false,
    videoPlayerConfig,
    onClick,
  }) => {
    const { setTileTop } = useUIStore();
    const isCurHost = useMemo(() => {
      return userInfo?.userRole === RoleTypeEnum.host;
    }, [userInfo]);

    // const screenShareCls = classnames('icon', {
    //   'icon-camera-enable': type === RenderInfoType.screenSharing,
    //   'icon-camera-disable': type !== RenderInfoType.screenSharing,
    // });

    const iconTopCls = classnames('icon', {
      'icon-top-enable': isTop,
      'icon-top-disable': !isTop,
    });

    const micCls = classnames('icon', {
      'icon-mic-enable': hasAudio,
      'icon-mic-disable': !hasAudio,
    });

    const playerCls = classnames('metting-video-player', {
      highlight: false,
    });

    // const [hover, setHover] = useState(false);
    // const handleMouseOver = () => {
    //   setHover(true);
    // };
    // const handleMouseOut = () => {
    //   setHover(false);
    // };
    // onMouseOver={handleMouseOver}
    // onMouseLeave={handleMouseOut}

    const style = {
      width: '100%',
      height: '100%',
      background: type === RenderInfoType.board ? '#ffffff' : '#3A3B3C',
    };

    const handlerTop = () => {
      setTileTop(id, !isTop);
    };

    return (
      <div
        style={style}
        className={playerCls}
        onClick={(e) => onClick && onClick(id)}>
        {hasVideo && renderer ? (
          <RendererPlayer
            style={style}
            track={renderer}
            videoPlayerConfig={videoPlayerConfig}
            key={
              renderer && renderer.videoTrack
                ? renderer.videoTrack.getTrackId()
                : ''
            }
            id={streamId}></RendererPlayer>
        ) : type === RenderInfoType.media ? (
          <img
            className="avatar"
            src={getAvatarUrl(userInfo.userName)}
            alt=""></img>
        ) : null}
        {/* 左下角 */}
        {showInfo ? (
          <span className="left__bottom" onClick={(e) => e.stopPropagation()}>
            {isCurHost ? <i className="icon icon-host"></i> : null}
            {isSharing ? <i className="icon icon-screen-share"></i> : null}
            <i className={micCls}></i>
            <span className="username">{userInfo.userName}</span>
          </span>
        ) : null}
        {/* 右上角 */}
        {showOperation ? (
          <span className="top__right" onClick={(e) => e.stopPropagation()}>
            <i className={iconTopCls} onClick={(e) => handlerTop()}></i>
            <Popover
              trigger="hover"
              overlayClassName="raw-popover"
              placement="bottomRight"
              content={
                <MettingMenu
                  userId={userInfo.userId}
                  options={options}
                  theme={'black'}></MettingMenu>
              }>
              {options?.length ? <i className="icon icon-menu"></i> : null}
            </Popover>
          </span>
        ) : null}
      </div>
    );
  },
);
