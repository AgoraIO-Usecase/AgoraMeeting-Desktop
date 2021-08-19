import React from 'react';
import { Meta } from '@storybook/react';
import { CheckBox } from './index';
import { action } from '@storybook/addon-actions';

const meta: Meta = {
  title: 'Components/CheckBox',
  component: CheckBox,
};

type DocsProps = {};

export const Docs = ({}: DocsProps) => (
  <>
    <div>
      <CheckBox onChange={action('onChange')} />
    </div>
  </>
);

Docs.args = {};

export default meta;
