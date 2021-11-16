import {
  useGlobalContext,
  usePretestContext,
  useRoomContext,
  VideoPlayerConfig,
} from 'agora-meeting-core';
import { observer } from 'mobx-react';
import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Button, Modal, Pretest, t } from '~ui-kit';
import { RendererPlayer } from '@/ui-kit/capabilities/containers/renderer-player';

export const PretestContainer = observer(() => {
  const {
    cameraList,
    microphoneList,
    speakerList,
    cameraError,
    microphoneError,
    cameraId,
    microphoneId,
    pretestCameraRenderer,
    isMirror,
    setMirror,
    microphoneLevel,
    changeTestSpeakerVolume,
    changeTestMicrophoneVolume,
    installPretest,
    changeTestCamera,
    changeTestMicrophone,
    closeTestCamera,
    closeTestMicrophone,
  } = usePretestContext();

  const { leaveRoom } = useRoomContext();
  const global = useGlobalContext();
  const history = useHistory();

  const VideoPreviewPlayer = useCallback(() => {
    const videoPlayerConfig: VideoPlayerConfig = {
      mirror: isMirror,
    };

    return (
      <RendererPlayer
        className="camera-placeholder camera-muted-placeholder"
        style={{ width: 320, height: 180 }}
        key={cameraId}
        id="stream-player"
        track={pretestCameraRenderer}
        preview={true}
        videoPlayerConfig={videoPlayerConfig}
      />
    );
  }, [pretestCameraRenderer, cameraId, isMirror]);

  useEffect(() => installPretest(), []);
  

  const onChangeDevice = async (type: string, value: any) => {
    switch (type) {
      case 'camera': {
        await changeTestCamera(value);
        break;
      }
      case 'microphone': {
        await changeTestMicrophone(value);
        break;
      }
    }
  };

  const onChangeAudioVolume = async (type: string, value: any) => {
    switch (type) {
      case 'speaker': {
        await changeTestSpeakerVolume(value);
        break;
      }
      case 'microphone': {
        await changeTestMicrophoneVolume(value);
        break;
      }
    }
  };

  const handleOk = () => {
    closeTestCamera();
    closeTestMicrophone();
    history.push(global?.params?.roomPath ?? '/metting');
  };

  const onCancel = () => {
    leaveRoom();
  };

  return (
    <div className="fixed-container">
      <Modal
        title={t('pretest.settingTitle')}
        width={720}
        footer={[<Button action="ok">{t('pretest.finishTest')}</Button>]}
        onOk={handleOk}
        onCancel={onCancel}>
        <Pretest
          speakerTestUrl={'https://webdemo.agora.io/pretest_audio.mp3'}
          microphoneLevel={microphoneLevel}
          isMirror={isMirror}
          onChangeDevice={onChangeDevice}
          onChangeAudioVolume={onChangeAudioVolume}
          onSelectMirror={() => {
            setMirror(!isMirror);
          }}
          cameraList={cameraList}
          cameraId={cameraId}
          microphoneList={microphoneList}
          microphoneId={microphoneId}
          speakerList={speakerList}
          speakerId={speakerList[0].deviceId}
          isNative={false}
          cameraError={!!cameraError}
          microphoneError={!!microphoneError}
          videoComponent={<VideoPreviewPlayer />}
        />
      </Modal>
    </div>
  );
});
