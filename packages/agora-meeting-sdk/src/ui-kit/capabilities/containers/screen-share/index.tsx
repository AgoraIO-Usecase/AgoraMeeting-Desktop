import { ScreenShare } from '~ui-kit';
import { observer } from 'mobx-react';
import * as React from 'react';
// import { useScreenShareContext } from 'agora-meeting-core';

export type ScreenShareContainerProps = {
  windowId: string;
  setWindowId: (newValue: string) => void;
};

export const ScreenShareContainer: React.FC<ScreenShareContainerProps> = observer(
  (props) => {
    // const {
    //     nativeAppWindowItems
    // } = useScreenShareContext()

    return (
      <div></div>
      // <ScreenShare
      //     onActiveItem={(id: any) => {
      //         props.setWindowId(id)
      //     }}
      //     currentActiveId={props.windowId}
      //     screenShareTitle={"screen share"}
      //     windowItems={nativeAppWindowItems}
      // ></ScreenShare>
    );
  },
);
