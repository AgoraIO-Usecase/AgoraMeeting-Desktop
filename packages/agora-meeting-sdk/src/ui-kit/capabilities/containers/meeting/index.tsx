import {
  useRenderContext,
  useMessagesContext,
  useScreenContext,
  useBoardContext,
  useMediaContext,
  useRoomContext,
} from 'agora-meeting-core';
import { RenderLayout } from '@/infra/api/declare';
import { observer } from 'mobx-react';
import { useCallback, useEffect, useState, useLayoutEffect } from 'react';
import { MettingHeader } from '../header';
import { LayoutLecturer } from '../layout-lecturer';
import { LayoutTile } from '../layout-tile';
import { MettingFooter } from '../footer';
import { LayoutAudio } from '../layout-audio';
import classnames from 'classnames';
import { MettingMemberList } from '../member-list';
import { MettingChat } from '../chat';
import { MettingNotification } from '../notification';
import { sleep } from '@/ui-kit/utils';
import './index.css';
import { useUIStore } from '@/infra/hooks';
import { useWatch } from '@/ui-kit/hooks';

let preLayout: RenderLayout = RenderLayout.tile;

export const MeetingContainer = observer(() => {
  const { renderLayout, setLayout, memberVisible } = useUIStore();
  const { chatVisible } = useMessagesContext();
  const { renderInfoList } = useRenderContext();
  const { isScreenSharing } = useScreenContext();
  const { isWhiteBoardOpening } = useBoardContext();
  // const { privateChatMessage } = useMessagesContext();


  const drawerCls = classnames('drawer', {
    'drawer-show': chatVisible || memberVisible,
  });

  const [height, setHeight] = useState('100%');
  const { genRenderMap, setSelectedRender } = useUIStore();

  // useWatch(privateChatMessage, () => {
  //   console.log('privateChatMessage', privateChatMessage);
  // });

  useEffect(() => {
    if (chatVisible && memberVisible) {
      setHeight('50%');
    } else {
      setHeight('100%');
    }
  }, [chatVisible, memberVisible]);

  // 计算renderMap
  useLayoutEffect(() => {
    genRenderMap(renderInfoList);
  }, [renderInfoList, genRenderMap]);

  // 自动切换布局
  useEffect(() => {
    if (renderInfoList.length) {
      const hasNoVideo = renderInfoList.every((item) => !item.hasVideo);
      if (hasNoVideo) {
        // 所有人没有视频
        sleep(8000).then(() => {
          const hasNoVideo2 = renderInfoList.every((item) => !item.hasVideo);
          if (hasNoVideo2 && renderLayout !== RenderLayout.audio) {
            preLayout = renderLayout;
            setLayout(RenderLayout.audio);
          }
        });
      }

      if (renderLayout === RenderLayout.audio) {
        // 有人打开了摄像头
        const hasVideo = renderInfoList.some((item) => item.hasVideo);
        if (hasVideo && preLayout) {
          setLayout(preLayout);
        }
      }
    }
  }, [renderInfoList, setLayout, renderLayout]);

  // 白板 屏幕共享自动切演讲者模式
  useEffect(() => {
    if (isScreenSharing || isWhiteBoardOpening) {
      if (renderInfoList.length) {
        setSelectedRender(renderInfoList[0].id);
      }
      if (renderLayout !== RenderLayout.lecturer) {
        setLayout(RenderLayout.lecturer);
      }
    }
  }, [
    isScreenSharing,
    isWhiteBoardOpening,
    renderLayout,
    setLayout,
    setSelectedRender,
    renderInfoList,
  ]);

  return (
    <div className="metting">
      {/* 页面 */}
      <section className="page">
        <MettingHeader></MettingHeader>
        <section className="body">
          {renderLayout === RenderLayout.tile ? (
            <LayoutTile></LayoutTile>
          ) : null}
          {renderLayout === RenderLayout.lecturer ? (
            <LayoutLecturer></LayoutLecturer>
          ) : null}
          {renderLayout === RenderLayout.audio ? (
            <LayoutAudio></LayoutAudio>
          ) : null}
        </section>
        <section className="notification-wrapper">
          <MettingNotification></MettingNotification>
        </section>
        <MettingFooter></MettingFooter>
      </section>
      {/* 抽屉 */}
      <section className={drawerCls}>
        {memberVisible ? (
          <div className="drawer-item" style={{ height: height }}>
            <MettingMemberList></MettingMemberList>
          </div>
        ) : null}
        {chatVisible ? (
          <div className="drawer-item" style={{ height: height }}>
            <MettingChat></MettingChat>
          </div>
        ) : null}
      </section>
    </div>
  );
});
