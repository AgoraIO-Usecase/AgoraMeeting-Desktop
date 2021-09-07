import { observer } from 'mobx-react';
import classnames from 'classnames';
import { FC, useEffect } from 'react';
import { BaseProps } from '~components/interface/base-props';
import { ISettingTab } from '../../setting';
import { transI18n } from '~ui-kit';
import { Modal } from '~ui-kit';
import { PersonSetting } from '@/ui-kit/capabilities/containers/setting/person-setting';
import { AboutSetting } from './about-setting';
import { useState } from 'react';
import AgoraMeetingSDK from '@/infra/api/index';
import { useMemo } from 'react';
import '@/ui-kit/capabilities/containers/setting/index.css';
import { GlobalStorage } from '@/infra/storage';



export interface HomeSettingDialogProps extends BaseProps {
  visible: boolean;
  onVisibleChange?: (val: boolean) => void;
}

export const HomeSettingDialog: FC<HomeSettingDialogProps> = ({
  className,
  visible = false,
  onVisibleChange,
}) => {


  const cls = classnames({
    [`meeting-setting`]: 1,
    [`${className}`]: !!className,
  });
  const onClickDisclaimer = () => {
    setDisclaimerVisible(true);
  };
  const onDisclaimerCancel = () => {
    setDisclaimerVisible(false);
  };

  let tabs: ISettingTab[] = [
    {
      text: transI18n('setting.person'),
      value: 'personSetting',
      component: (
        <PersonSetting></PersonSetting>
      ),
    },
    {
      text: transI18n('setting.about'),
      value: 'aboutSetting',
      component: (
        <AboutSetting
          {...AgoraMeetingSDK.perform}
          onClickDisclaimer={onClickDisclaimer}></AboutSetting>
      ),
    },
  ];

  const [disclaimerVisible, setDisclaimerVisible] = useState(false);
  const [highlight, setHighlight] = useState<string>(tabs[0].value);

  const getItemCls = (value: string) => {
    return classnames('tab-item', {
      active: value === highlight,
    });
  };

  const highlightComponent = useMemo(() => {
    const item = tabs.find((item) => item.value === highlight);
    return item?.component;
  }, [highlight]);

  return visible ? (
    <div className="fixed-container">
      {/* 设置 */}
      <Modal
        onCancel={() => {
          onVisibleChange && onVisibleChange(false);
        }}
        contentClassName="setting-content"
        title={transI18n('setting.setting')}
        width={612}>
        <div className={cls}>
          <div className="setting__left">
            {tabs.map((item) => (
              <div
                key={item.value}
                className={getItemCls(item.value)}
                onClick={() => {
                  setHighlight(item.value);
                }}>
                {item.text}
              </div>
            ))}
          </div>
          <div className="setting__right">{highlightComponent}</div>
        </div>
      </Modal>
      {/* 免责声明 */}
      {disclaimerVisible ? (
        <div className="fixed-container">
          <Modal
            width={612}
            onCancel={onDisclaimerCancel}
            title={transI18n('disclaimer.title')}>
            <div
              style={{
                whiteSpace: 'pre-wrap',
              }}>
              {transI18n('disclaimer.content')}
            </div>
          </Modal>
        </div>
      ) : null}
    </div>
  ) : null;
};
