import React, { FC, MouseEvent } from 'react';
import { BaseProps } from '~components/interface/base-props';
import classnames from 'classnames';
import './index.css';
import { observer } from 'mobx-react';
import {
  useBoardContext,
  useGlobalContext,
  useScreenContext,
} from 'agora-meeting-core';

import { useUIStore } from '@/infra/hooks';
import { transI18n } from '~ui-kit';

import iconWhiteBoardOpen from '@/ui-kit/assets/icon_board_open@2x.png';
import iconWhiteBoardClose from '@/ui-kit/assets/icon_board_close@2x.png';
import iconScreenShareOpen from '@/ui-kit/assets/icon_screen_share_open@2x.png';
import iconScreenShareClose from '@/ui-kit/assets/icon_screen_share_close@2x.png';

export interface PopoverScreenProps extends BaseProps {}

export const PopoverScreen: FC<PopoverScreenProps> = observer(() => {
  const {
    isScreenSharing,
    openScreenSharing,
    closeScreenSharing,
    isScreenSharingByMyself,
  } = useScreenContext();
  const {
    isWhiteBoardOpening,
    openBoardSharing,
    closeBoardSharing,
  } = useBoardContext();
  const { fireToast } = useGlobalContext();

  const handleScreenShare = async () => {
    if (!isScreenSharing) {
      if (isWhiteBoardOpening) {
        // 打开了白板
        fireToast('toast.board_ongoing');
        return;
      }
      await openScreenSharing();
    } else {
      if (isScreenSharingByMyself) {
        // 自己才能关闭
        await closeScreenSharing();
      } else {
        fireToast('toast.screen_ongoing');
      }
    }
  };

  const handleBoardShare = async () => {
    if (!isWhiteBoardOpening) {
      if (isScreenSharing) {
        fireToast('toast.screen_ongoing');
        return;
      }
      await openBoardSharing();
    } else {
      fireToast('toast.board_ongoing');
    }
  };

  const screenShareSrc = isScreenSharing
    ? iconScreenShareOpen
    : iconScreenShareClose;

  const whiteBoardSrc = isWhiteBoardOpening
    ? iconWhiteBoardOpen
    : iconWhiteBoardClose;

  const screenShareTextCls = classnames('item-text', {
    active: isScreenSharing,
  });
  const whiteBoardTextCls = classnames('item-text', {
    active: isWhiteBoardOpening,
  });

  return (
    <section className="popover-screen">
      <div className="item" onClick={(e) => handleScreenShare()}>
        <img className="item-img" src={screenShareSrc} alt=""></img>
        <span className={screenShareTextCls}>
          {transI18n('main.screen_share')}
        </span>
      </div>
      <div className="item" onClick={(e) => handleBoardShare()}>
        <img className="item-img" src={whiteBoardSrc} alt=""></img>
        <span className={whiteBoardTextCls}>
          {transI18n('main.whiteboard')}
        </span>
      </div>
    </section>
  );
});
