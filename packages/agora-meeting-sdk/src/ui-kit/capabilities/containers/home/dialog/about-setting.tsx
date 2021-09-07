import React, { FC, useState } from 'react';
import classnames from 'classnames';
import { BaseProps } from '~components/interface/base-props';
import { Modal } from '~components';
import { t, transI18n, language } from '~components/i18n';
import { useGlobalContext } from 'agora-meeting-core';
import { observer } from 'mobx-react';
import { useMemo } from 'react';

import logoSrc from '@/ui-kit/assets/logo@2x.png';
import '../../../containers/setting/index.css';

export interface AboutSettingProps extends BaseProps {
  whiteBoardVersion: string;
  rtcVersion: string;
  rtmVersion: string;
  version: string;
  onClickDisclaimer?: () => void;
}

export const AboutSetting: FC<AboutSettingProps> = ({
  whiteBoardVersion = '',
  rtcVersion = '',
  rtmVersion = '',
  version = '',
  onClickDisclaimer,
}) => {
  const thislanguage = language;
  const policyHref = useMemo(() => {
    if (thislanguage === 'zh') {
      return 'https://www.agora.io/cn/privacy-policy/';
    } else {
      return 'https://www.agora.io/en/privacy-policy/';
    }
  }, [thislanguage]);

  return (
    <div className="about-setting">
      <div className="logo__wrapper">
        <img className="logo" src={logoSrc} alt="" />
      </div>
      <div className="title">Agora Meeting</div>
      <div className="body">
        <div
          style={{
            whiteSpace: 'pre-line',
          }}>
          {transI18n('about.version_tips_all', {
            version: version,
            rtcVersion: rtcVersion,
            rtmVersion: rtmVersion,
            whiteBoardVersion: whiteBoardVersion,
          })}
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        <a
          className="about-btn register"
          href="https://sso.agora.io/cn/v4/signup">
          {transI18n('about.register_account')}
        </a>
      </div>
      <div style={{ marginTop: '20px' }}>
        <a
          className="about-btn look"
          href="https://www.agora.io/cn/enterprise-collaboration">
          {transI18n('about.view_document')}
        </a>
      </div>
      <div className="footer">
        <div className="footer-content">
          <span
            className="item"
            onClick={(e) => onClickDisclaimer && onClickDisclaimer()}>
            {transI18n('about.product_disclaimer')}
          </span>
          <a className="item" href={policyHref}>
            {transI18n('about.policy')}
          </a>
        </div>
        <div className="net">www.agora.io</div>
      </div>
    </div>
  );
};
