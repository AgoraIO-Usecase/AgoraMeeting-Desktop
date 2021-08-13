import React, { FC, useState, useMemo } from 'react';
import classnames from 'classnames';
import { BaseProps } from '~components/interface/base-props';
import { Select } from '~components/select';
import './index.css';
import { t, transI18n } from '~components/i18n';
import { observer } from 'mobx-react';
import { useRoomContext } from 'agora-meeting-core';
import { useUIStore } from '@/infra/hooks';
import { UpoladLogState } from '@/infra/api/declare';

export interface LogSettingProps extends BaseProps {}

export const LogSetting: FC<LogSettingProps> = observer(() => {
  const { uploadRoomLog } = useRoomContext();
  const { uploadLogState, setUploadLogState } = useUIStore();
  const { addToast } = useUIStore();

  const btnCls = classnames('btn', {
    'btn-success': uploadLogState === UpoladLogState.success,
    'btn-fail': uploadLogState === UpoladLogState.fail,
    'btn-uploading': uploadLogState === UpoladLogState.uploading,
  });
  const text = useMemo(() => {
    switch (uploadLogState) {
      case UpoladLogState.init:
        return transI18n('log.title');
      case UpoladLogState.fail:
        return transI18n('log.fail');
      case UpoladLogState.success:
        return transI18n('log.success');
      case UpoladLogState.uploading:
        return transI18n('log.uploading');
      default:
        return transI18n('log.title');
    }
  }, [uploadLogState]);

  const onClickUploadLog = async () => {
    if (uploadLogState === UpoladLogState.uploading) {
      addToast(transI18n('log.repeat'), 'warning');
      return;
    }
    try {
      setUploadLogState(UpoladLogState.uploading);
      await uploadRoomLog();
      setUploadLogState(UpoladLogState.success);
    } catch (err) {
      setUploadLogState(UpoladLogState.fail);
      throw err;
    }
  };

  return (
    <div className="log-setting">
      <div>遇到问题上传日志</div>
      <div>
        <span className={btnCls} onClick={(e) => onClickUploadLog()}>
          <span className='text'>{text}</span>
          {uploadLogState === UpoladLogState.uploading ? (
            <span className="icon icon-loading rotate"></span>
          ) : null}
        </span>
      </div>
    </div>
  );
});
