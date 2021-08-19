import React, { FC, useState } from 'react';
import classnames from 'classnames';
import { BaseProps } from '~components/interface/base-props';
import { Select } from '~components/select';
import { Slider } from '~components/slider';
import './index.css';
import { transI18n } from '~components/i18n';
import { DeviceProps } from './declare';
import { usePretestContext } from 'agora-meeting-core';
import { observer } from 'mobx-react';

export interface MediaSettingProps extends BaseProps {}

export const MediaSetting: FC<MediaSettingProps> = observer(() => {
  const {
    cameraList,
    microphoneList,
    speakerList,
    cameraId,
    speakerId,
    microphoneId,
    changeDevice,
  } = usePretestContext();

  const cameraOptions = cameraList.map((item) => ({
    label: item.label,
    value: item.deviceId,
  }));
  const microphoneOptions = microphoneList.map((item) => ({
    label: item.label,
    value: item.deviceId,
  }));
  const speakerOptions = speakerList.map((item) => ({
    label: item.label,
    value: item.deviceId,
  }));

  return (
    <div className="media-setting">
      <div className="device-choose">
        {/* 摄像头 */}
        <div className="device-title">{transI18n('device.camera')}</div>
        <Select
          value={cameraId}
          onChange={async (value) => {
            await changeDevice('camera', value);
          }}
          options={cameraOptions}></Select>
      </div>
      <div className="device-choose">
        {/* 麦克风 */}
        <div className="device-title">{transI18n('device.microphone')}</div>
        <Select
          value={microphoneId}
          onChange={async (value) => {
            await changeDevice('microphone', value);
          }}
          options={microphoneOptions}></Select>
      </div>
      <div className="device-choose">
        {/* 扬声器 */}
        <div className="device-title">{transI18n('device.speaker')}</div>
        <Select
          value={speakerId}
          onChange={async (value) => {
            await changeDevice('speaker', value);
          }}
          options={speakerOptions}></Select>
      </div>
      {/* <div className="item">
        <input checked={false} type="checkbox" onChange={(e) => {}} />
        <span className="checkbox-text">{transI18n('setting.beauty')}</span>
      </div>
      <div className="item">
        <input checked={false} type="checkbox" onChange={(e) => {}} />
        <span className="checkbox-text">{transI18n('setting.ai_noise')}</span>
      </div> */}
    </div>
  );
});
