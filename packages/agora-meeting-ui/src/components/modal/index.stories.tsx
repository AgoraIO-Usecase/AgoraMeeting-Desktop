import { Meta } from '@storybook/react';
import React, { useState } from 'react';
import { Button } from '~components/button';
import { transI18n } from '~components/i18n';
import { Icon } from '~components/icon';
import { Modal } from '~components/modal';

const meta: Meta = {
  title: 'Components/Modal',
  component: Modal,
};

type DocsProps = {
  title: string;
};

function asyncOkFunction(e: any): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 3000);
  });
}

export const Docs = ({ title }: DocsProps) => (
  <>
    <div className="mt-4">
      <Modal
        title={title}
        footer={[
          <Button type="secondary">test</Button>,
          <Button>test</Button>,
        ]}>
        <p>你确定要下课吗？</p>
      </Modal>
    </div>
    <div className="mt-4">
      <Modal title={title} closable={false} footer={[<Button>test</Button>]}>
        <p>试用时间到，教室已解散！</p>
      </Modal>
    </div>
    <div className="mt-4">
      <Modal
        title={title}
        width={320}
        footer={[<Button type="ghost">test</Button>, <Button>test</Button>]}>
        <Icon type="redcaution" color="#F04C36" size={50} />
        <p>课件未能加载成功，您可以点击重新加载重试，或者从云盘中播放课件</p>
      </Modal>
    </div>
    <div className="mt-4">
      <Button
        onClick={() => {
          Modal.show({
            width: 280,
            title: '自己封装的show方法',
            closable: true,
            footer: [
              <Button type="secondary" action="cancel">
                cancel
              </Button>,
              <Button action="ok">ok</Button>,
            ],
            onOk: asyncOkFunction,
            onCancel: () => {
              console.log('cancel');
            },
            children: (
              <>
                <Icon type="redcaution" color="#F04C36" size={50} />
                <p>
                  课件未能加载成功，您可以点击重新加载重试，或者从云盘中播放课件
                </p>
              </>
            ),
          });
        }}>
        show modal
      </Button>
    </div>
  </>
);

Docs.args = {
  title: 'Modal Title',
};

export default meta;
