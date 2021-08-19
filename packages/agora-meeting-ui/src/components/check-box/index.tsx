import classnames from 'classnames';
import { BaseProps } from '~components/interface/base-props';


export interface CheckBoxProps extends BaseProps {
  checked?: boolean;
  onClick?: (evt: any) => any;
  onChange?: (evt: any) => any;
  indeterminate?: boolean;
  className?: string;
}

export const CheckBox: React.FC<CheckBoxProps> = ({
  indeterminate,
  children,
  className,
  onChange,
  ...restProps
}) => {
  const cls = classnames({
    'form-checkbox h-5 w-5 text-red-600': 1,
    [`indeterminate`]: indeterminate,
    [`${className}`]: !!className,
  });

  const mountDom = (dom: HTMLInputElement | null) => {
    dom && (dom.indeterminate = indeterminate!);
  };

  const handleChange = (evt: React.SyntheticEvent<HTMLInputElement>) => {
    indeterminate &&
      (evt.currentTarget.indeterminate = !evt.currentTarget.checked);
    onChange && onChange(evt);
  };

  return (
    <input
      ref={mountDom}
      onChange={handleChange}
      type="checkbox"
      className={cls}
      {...restProps}
    />
  );
};
