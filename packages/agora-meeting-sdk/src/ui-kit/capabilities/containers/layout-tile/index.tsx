import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import './index.css';
import classNames from 'classnames';
import { RenderLayout } from '@/infra/api/declare';
import { useRenderContext } from 'agora-meeting-core';
import { MettingVideoPlayer } from '../video-player';
import { observer } from 'mobx-react';
import { useUIStore } from '@/infra/hooks';
import { Pagination } from '~components';

enum GridsLayout {
  ONE_CELL = 'one-cell',
  TWO_CELL = 'two-cell',
  FOUR_CELL = 'four-cell',
  NINE_CELL = 'nine-cell',
  SIXTEEN_CELL = 'sixteen-cell',
}

const DEFAULT_PAGE_SIZE = 16;

export interface LayoutTileProps {}

/** 平铺视图  */
export const LayoutTile: FC<LayoutTileProps> = observer(({}) => {
  const {
    renderLayout,
    finalRnderInfoList,
    setSelectedRender,
    setLayout,
  } = useUIStore();

  const [gridsLayout, row, col] = useMemo(() => {
    const count = finalRnderInfoList?.length;
    if (count === 2) return [GridsLayout.TWO_CELL, 1, 2];
    if (count > 2 && count <= 4) return [GridsLayout.FOUR_CELL, 2, 2];
    if (count >= 5 && count <= 9) return [GridsLayout.NINE_CELL, 3, 3];
    if (count > 9) return [GridsLayout.SIXTEEN_CELL, 4, 4];
    return [GridsLayout.ONE_CELL, 1, 1];
  }, [finalRnderInfoList]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = DEFAULT_PAGE_SIZE;
  const maxPage = useMemo(() => {
    return Math.ceil(finalRnderInfoList.length / pageSize);
  }, [finalRnderInfoList, pageSize]);

  const scroll = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      currentPage > 1 && setCurrentPage(currentPage - 1);
    } else {
      currentPage < maxPage && setCurrentPage(currentPage + 1);
    }
  };

  const showOperation = useMemo(() => {
    return (
      renderLayout === RenderLayout.tile &&
      (gridsLayout === GridsLayout.ONE_CELL ||
        gridsLayout === GridsLayout.TWO_CELL ||
        gridsLayout === GridsLayout.FOUR_CELL ||
        gridsLayout === GridsLayout.NINE_CELL ||
        gridsLayout === GridsLayout.SIXTEEN_CELL)
    );
  }, [renderLayout, gridsLayout]);

  const bodyCls = classNames('body', gridsLayout);

  const onVideoPlayerClick = (id: string) => {
    const renderInfo = finalRnderInfoList.find((item) => item.id === id);
    if (renderInfo?.hasVideo) {
      // 开启了摄像头才能切换
      setSelectedRender(id);
      setLayout(RenderLayout.lecturer);
    }
  };

  const tileRenderList = useMemo(() => {
    if (finalRnderInfoList.length > DEFAULT_PAGE_SIZE) {
      return finalRnderInfoList.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize,
      );
    } else {
      return finalRnderInfoList;
    }
  }, [finalRnderInfoList, currentPage, pageSize]);

  return (
    <section className="layout-tile">
      {/* 左边÷ */}
      <div className="left">
        {finalRnderInfoList.length > DEFAULT_PAGE_SIZE ? (
          <div className="icon-left__wrapper" onClick={(e) => scroll('left')}>
            <i className="icon icon-left"></i>
          </div>
        ) : null}
      </div>
      {/* 中间主体 */}
      <div
        className={bodyCls}
        style={{
          gridTemplateColumns: `repeat(${
            gridsLayout === GridsLayout.TWO_CELL ? row + 1 : row
          }, ${col}fr)`,
          gridTemplateRows: `repeat(${row}, ${col}fr)`,
        }}>
        {tileRenderList.map((item) => (
          <MettingVideoPlayer
            className="item"
            key={item.id}
            {...item}
            onClick={onVideoPlayerClick}
            showOperation={showOperation}></MettingVideoPlayer>
        ))}
        {/* 分页器 */}
        {finalRnderInfoList.length > DEFAULT_PAGE_SIZE ? (
          <div className="bottom">
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
