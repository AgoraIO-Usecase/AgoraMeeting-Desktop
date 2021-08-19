export interface DeviceProps {
  deviceId: string;
  label: string;
}

export type SettingValue =
  | 'mediaSetting'
  | 'personSetting'
  | 'roomSetting'
  | 'aboutSetting'
  | 'logSetting';
