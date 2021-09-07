import React, { FC, useState } from 'react';
import classnames from 'classnames';
import { BaseProps } from '~components/interface/base-props';
import { useMemo } from 'react';

import icon_star_gray from '../../assets/icon_star_gray@2x.png';
import icon_star_yellow from '../../assets/icon_star_yellow@2x.png';

import { transI18n } from '../i18n';
import './index.css';

export interface StarsProps extends BaseProps {
  max?: number;
  defaultNum?: number;
  onChange: (value: number) => void;
}

export const Stars: FC<StarsProps> = ({
  max = 5,
  defaultNum = 0,
  onChange,
}) => {
  const [star, setStar] = useState(defaultNum);

  const handleClick = (index: number) => {
    setStar(index);
    onChange(index);
  };

  const stars = useMemo(() => {
    var res = [];
    for (let i = 1; i <= max; i++) {
      const src = i <= star ? icon_star_yellow : icon_star_gray;
      res.push(
        <span key={i} onClick={(e) => handleClick(i)} className="star">
          <img src={src} alt=""></img>
        </span>,
      );
    }
    return res;
  }, [max, star]);

  return (
    <span className="star-wrapper">
      {stars}
      <span className="text">
        {transI18n('rating.star', { num: star + ' ' })}
      </span>
    </span>
  );
};
