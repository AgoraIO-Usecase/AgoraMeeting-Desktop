import React, { FC, useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import './index.css';
import classNames from 'classnames';
import { RenderInfoType, useMediaContext } from 'agora-meeting-core';
import { MettingVideoPlayerList, MettingVideoPlayer } from '../video-player';
import { NetworkQuality } from '../network-quality';
import { WhiteboardContainer } from '../board/index';
import { NetworkQualityLevel } from 'agora-meeting-core';
import { useUIStore } from '@/infra/hooks';
import { transI18n } from '~ui-kit';

export interface LayoutLecturerProps {}

/** 演讲者视图  */
export const LayoutLecturer: FC<LayoutLecturerProps> = observer(({}) => {
  const { finalRnderInfoList, setSelectedRender } = useUIStore();
  const { networkQuality } = useMediaContext();
  const { fullScreen } = useUIStore();

  const [main, ...others] = finalRnderInfoList;

  const showNetWork = useMemo(() => {
    return main?.type === RenderInfoType.media;
  }, [main]);

  const onVideoPlayerClick = (id: string) => {
    setSelectedRender(id);
  };

  return (
    <section className="layout-lecturer">
      {others?.length && !fullScreen ? (
        <div className="list__wrapper">
          <MettingVideoPlayerList>
            {others.map((item) => (
              <MettingVideoPlayer
                onClick={onVideoPlayerClick}
                key={item.id}
                {...item}
                showOperation={false}></MettingVideoPlayer>
            ))}
          </MettingVideoPlayerList>
        </div>
      ) : null}
      <div className="main__wrapper">
        {/* 音视频 */}
        {main?.type === RenderInfoType.media ? (
          <MettingVideoPlayer
            showOperation={false}
            {...main}></MettingVideoPlayer>
        ) : null}
        {/* 屏幕共享 */}
        {main?.type === RenderInfoType.screenSharing ? (
          <MettingVideoPlayer
            showOperation={false}
            showInfo={false}
            {...main}></MettingVideoPlayer>
        ) : null}
        {/* 白板 */}
        {main?.type === RenderInfoType.board ? (
          <WhiteboardContainer></WhiteboardContainer>
        ) : null}
        {showNetWork ? (
          <div className="network__wrapper">
            <NetworkQuality
              popoverContent={transI18n('net.quality_poor')}
              popoverVisible={networkQuality === NetworkQualityLevel.bad}
              value={networkQuality}></NetworkQuality>
          </div>
        ) : null}
      </div>
    </section>
  );
});
