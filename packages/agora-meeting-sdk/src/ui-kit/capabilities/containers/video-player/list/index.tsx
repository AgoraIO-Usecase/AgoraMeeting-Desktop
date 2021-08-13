import React, { FC, useState, useRef, useCallback, ReactElement } from 'react';
import classNames from 'classnames';
import { BaseProps } from '~components/interface/base-props';
import './index.css';

export type Direction = 'left' | 'right';

export interface MettingVideoPlayerListProps extends BaseProps {
  children: ReactElement[];
}

export const MettingVideoPlayerList: FC<MettingVideoPlayerListProps> = ({
  children = [],
}) => {
  const videoContainerRef = useRef<HTMLDivElement | null>(null);

  const scroll = useCallback(
    (direction: Direction) => {
      const videoContainer = videoContainerRef.current;
      if (!videoContainer) return;
      const videoDOM = videoContainer.querySelector(
        '.video-item',
      ) as HTMLDivElement;
      if (!videoDOM) return;
      const offsetWidth = videoDOM.offsetWidth;
      if (direction === 'left') {
        videoContainer.scrollLeft -= offsetWidth;
      }
      if (direction === 'right') {
        videoContainer.scrollLeft += offsetWidth;
      }
    },
    [videoContainerRef],
  );

  return (
    <div className="metting-video-player-list">
      <section className="left" onClick={(e) => scroll('left')}>
        <i className="icon icon-left"></i>
      </section>
      <section className="center" ref={videoContainerRef}>
        {children.map((item) => (
          <div className="video-item" key={item.props.id}>
            {item}
          </div>
        ))}
      </section>
      <section className="right" onClick={(e) => scroll('right')}>
        <i className="icon icon-right"></i>
      </section>
    </div>
  );
};
