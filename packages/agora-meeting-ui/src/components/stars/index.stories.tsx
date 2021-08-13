import React from 'react';
import { Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Stars, StarsProps } from './index';

const meta: Meta = {
  title: 'Components/Stars',
  component: Stars,
};

export const Docs = (props: StarsProps) => (
  <>
    <Stars {...props}></Stars>
  </>
);

Docs.args = {
  max: 5,
  defaultNum: 0,
  onChange: action('onChange'),
};

export default meta;
