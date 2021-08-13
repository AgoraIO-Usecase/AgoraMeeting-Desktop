import {
  useBoardContext,
  useGlobalContext,
  useRoomContext,
  BoardPermission,
} from 'agora-meeting-core';
import { ZoomItemType } from '~ui-kit';
import { observer } from 'mobx-react';
import { useMemo, useState } from 'react';
import { ColorsContainer } from './colors';
import { PensContainer } from './pens';

import {
  Icon,
  TabPane,
  Tabs,
  Toolbar,
  ToolItem,
  transI18n,
  ZoomController,
} from '~ui-kit';
import { useEffect } from 'react';
import './index.css';
import { useUIStore } from '@/infra/hooks';

export const allTools: ToolItem[] = [
  {
    value: 'selection',
    label: 'scaffold.selector',
    icon: 'select',
  },
  {
    value: 'pen',
    label: 'scaffold.pencil',
    icon: 'pen',
    component: (props: any) => {
      return <PensContainer {...props} />;
    },
  },
  {
    value: 'text',
    label: 'scaffold.text',
    icon: 'text1',
  },
  {
    value: 'eraser',
    label: 'scaffold.eraser',
    icon: 'eraser',
  },
  {
    value: 'color',
    label: 'scaffold.color',
    icon: 'circle',
    component: (props: any) => {
      return <ColorsContainer {...props} />;
    },
  },
  {
    value: 'hand',
    label: 'scaffold.move',
    icon: 'hand',
  },
  {
    value: 'delete',
    label: 'scaffold.delete',
    icon: 'delete1',
  },
];

// export type WhiteBoardState = {
//   zoomValue: number;
//   currentPage: number;
//   totalPage: number;
//   items: ToolItem[];
//   handleToolBarChange: (evt: any) => Promise<any> | any;
//   handleZoomControllerChange: (e: any) => Promise<any> | any;
// };

export const WhiteboardContainer = observer(() => {
  const { fullScreen, setFullScreen } = useUIStore();
  const { fireToast } = useGlobalContext();
  const {
    zoomValue,
    currentPage,
    totalPage,
    ready,
    currentSelector,
    activeMap,
    tools,
    mountToDOM,
    setZoomScale,
    setAppliance,
    installTools,
    boardPermission,
    applyBoardInteract,
    cancelBoardInteract,
    closeBoardSharing,
  } = useBoardContext();

  const handleToolClick = (type: string) => {
    console.log('handleToolClick tool click', type);
    setAppliance(type);
  };

  useEffect(() => {
    installTools(allTools);
  }, [installTools]);

  const [showToolBar, showZoomControl] = useMemo(() => {
    if (
      boardPermission === BoardPermission.admin ||
      boardPermission === BoardPermission.interact
    ) {
      return [true, true];
    }
    return [false, false];
  }, [boardPermission]);

  const handleZoomControllerChange = async (type: ZoomItemType) => {
    const toolbarMap: Record<ZoomItemType, CallableFunction> = {
      max: () => {
        setFullScreen(true);
      },
      min: () => {
        setFullScreen(false);
      },
      'zoom-out': () => {
        setZoomScale('out');
      },
      'zoom-in': () => {
        setZoomScale('in');
      },
      forward: () => {
        // TODO:qinzhen:next_page
      },
      backward: () => {
        // TODO:qinzhen:prev_page
      },
    };
    toolbarMap[type] && toolbarMap[type]();
  };

  const onClickApply = async () => {
    try {
      await applyBoardInteract();
    } catch (err) {
      if (err.toast) {
        fireToast(err.toast);
      }
      throw err;
    }
  };

  return (
    <div className="whiteboard">
      {ready ? <div id="netless" ref={mountToDOM}></div> : null}
      {boardPermission === BoardPermission.admin ? (
        <div
          className="btn btn-end"
          onClick={(e) => {
            closeBoardSharing();
          }}>
          <i className="icon icon-board-end"></i>
          {transI18n('whiteboard.end')}
        </div>
      ) : boardPermission === BoardPermission.interact ? (
        <div
          className="btn btn-abandon"
          onClick={(e) => {
            cancelBoardInteract();
          }}>
          {transI18n('whiteboard.quit')}
        </div>
      ) : (
        <div className="btn btn-apply" onClick={(e) => onClickApply()}>
          {transI18n('whiteboard.join')}
        </div>
      )}
      {/* 工具栏 */}
      {showToolBar ? (
        <Toolbar
          active={currentSelector}
          activeMap={activeMap}
          tools={tools}
          onClick={handleToolClick}
          className="toolbar-biz"
          defaultOpened={
            boardPermission === BoardPermission.admin ||
            boardPermission === BoardPermission.interact
          }
        />
      ) : null}
      {showZoomControl ? (
        <ZoomController
          className="zoom-position"
          zoomValue={zoomValue}
          currentPage={currentPage}
          totalPage={totalPage}
          maximum={!fullScreen}
          clickHandler={handleZoomControllerChange}
        />
      ) : null}
    </div>
  );
});
