import React, { FC, useState, useMemo } from 'react';
import { BaseProps } from '~components/interface/base-props';
import { AudioItem } from './item/index';
import './index.css';
import { observer } from 'mobx-react';
import { useRenderContext } from 'agora-meeting-core';
import { useUIStore } from '@/infra/hooks';
import { Pagination } from '~components';

const DEFAULT_PAGE_SIZE = 20;

export interface AudioMettingProps extends BaseProps {}

// 语音会议
export const LayoutAudio: FC<AudioMettingProps> = observer(() => {
  const { finalRnderInfoList } = useUIStore();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = DEFAULT_PAGE_SIZE;
  const maxPage = useMemo(() => {
    return Math.ceil(finalRnderInfoList.length / pageSize);
  }, [finalRnderInfoList, pageSize]);

  const audioRenderList = useMemo(() => {
    if (finalRnderInfoList.length > DEFAULT_PAGE_SIZE) {
      return finalRnderInfoList.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize,
      );
    } else {
      return finalRnderInfoList;
    }
  }, [finalRnderInfoList, currentPage, pageSize]);

  const scroll = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      currentPage > 1 && setCurrentPage(currentPage - 1);
    } else {
      currentPage < maxPage && setCurrentPage(currentPage + 1);
    }
  };

  return (
    <section className="audio-metting">
      {/* 左边 */}
      <div className="left">
        {finalRnderInfoList.length > DEFAULT_PAGE_SIZE ? (
          <div className="icon-left__wrapper" onClick={(e) => scroll('left')}>
            <i className="icon icon-left"></i>
          </div>
        ) : null}
      </div>
      {/* 中间 */}
      <div className="body">
        <div className="render-list">
          {audioRenderList.map((item) => (
            <div className="item-wrapper" key={item.id}>
              <AudioItem {...item}></AudioItem>
            </div>
          ))}
        </div>
        {finalRnderInfoList.length > DEFAULT_PAGE_SIZE ? (
          <div className="bottom">
            {/* 分页器 */}
            <div className="pagination-wrapper">
              <Pagination
                onChange={(page) => setCurrentPage(page)}
                current={currentPage}
                total={finalRnderInfoList.length}
                pageSize={pageSize}></Pagination>
            </div>
          </div>
        ) : null}
      </div>
      {/* 右边 */}
      <div className="right">
        {finalRnderInfoList.length > DEFAULT_PAGE_SIZE ? (
          <div className="icon-right__wrapper" onClick={(e) => scroll('right')}>
            <i className="icon icon-right"></i>
          </div>
        ) : null}
      </div>
    </section>
  );
});
