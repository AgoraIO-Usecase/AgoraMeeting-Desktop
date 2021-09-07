import { get, isEmpty } from 'lodash';
import { config } from './translate/config';
import md5 from 'js-md5';

import avatar_0 from '../assets/avatar/avatar_1.png';
import avatar_1 from '../assets/avatar/avatar_1.png';
import avatar_2 from '../assets/avatar/avatar_2.png';
import avatar_3 from '../assets/avatar/avatar_3.png';
import avatar_4 from '../assets/avatar/avatar_4.png';
import avatar_5 from '../assets/avatar/avatar_5.png';
import avatar_6 from '../assets/avatar/avatar_6.png';
import avatar_7 from '../assets/avatar/avatar_7.png';
import avatar_8 from '../assets/avatar/avatar_8.png';
import avatar_9 from '../assets/avatar/avatar_9.png';
import avatar_10 from '../assets/avatar/avatar_10.png';
import avatar_11 from '../assets/avatar/avatar_11.png';
import avatar_12 from '../assets/avatar/avatar_12.png';
import avatar_13 from '../assets/avatar/avatar_13.png';
import avatar_14 from '../assets/avatar/avatar_14.png';
import avatar_15 from '../assets/avatar/avatar_15.png';
import avatar_16 from '../assets/avatar/avatar_16.png';
import avatar_17 from '../assets/avatar/avatar_17.png';
import avatar_18 from '../assets/avatar/avatar_18.png';
import avatar_19 from '../assets/avatar/avatar_19.png';
import avatar_20 from '../assets/avatar/avatar_20.png';
import avatar_21 from '../assets/avatar/avatar_21.png';
import avatar_22 from '../assets/avatar/avatar_22.png';
import avatar_23 from '../assets/avatar/avatar_23.png';
import avatar_24 from '../assets/avatar/avatar_24.png';
import avatar_25 from '../assets/avatar/avatar_25.png';
import avatar_26 from '../assets/avatar/avatar_26.png';
import avatar_27 from '../assets/avatar/avatar_27.png';
import avatar_28 from '../assets/avatar/avatar_28.png';
import avatar_29 from '../assets/avatar/avatar_29.png';
import avatar_30 from '../assets/avatar/avatar_30.png';
import avatar_31 from '../assets/avatar/avatar_31.png';
import avatar_32 from '../assets/avatar/avatar_32.png';
import avatar_33 from '../assets/avatar/avatar_33.png';
import avatar_34 from '../assets/avatar/avatar_34.png';
import avatar_35 from '../assets/avatar/avatar_35.png';
import avatar_36 from '../assets/avatar/avatar_36.png';

export type BaseElementProps = {
  id: string;
};

export const formatFileSize = (fileByteSize: number, decimalPoint?: number) => {
  const bytes = +fileByteSize;
  if (bytes === 0) return '0 Bytes';
  const k = 1000;
  const dm = decimalPoint || 2;
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + units[i];
};



export const list = (num: number) => Array.from({ length: num }, (_, i) => i);

const avatarObj = {
  avatar_0,
  avatar_1,
  avatar_2,
  avatar_3,
  avatar_4,
  avatar_5,
  avatar_6,
  avatar_7,
  avatar_8,
  avatar_9,
  avatar_10,
  avatar_11,
  avatar_12,
  avatar_13,
  avatar_14,
  avatar_15,
  avatar_16,
  avatar_17,
  avatar_18,
  avatar_19,
  avatar_20,
  avatar_21,
  avatar_22,
  avatar_23,
  avatar_24,
  avatar_25,
  avatar_26,
  avatar_27,
  avatar_28,
  avatar_29,
  avatar_30,
  avatar_31,
  avatar_32,
  avatar_33,
  avatar_34,
  avatar_35,
  avatar_36,
};

/**
 * 根据userName 返回头像
 * @param userName
 */
export function getAvatarUrl(userName: string): any {
  const id = md5(userName);
  let index = 0;
  if (id.length > 2) {
    index = parseInt(id.substr(-2).toUpperCase(), 16) % 36;
  }
  return avatarObj[`avatar_${index}`];
}
