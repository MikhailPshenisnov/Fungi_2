import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'ghost';

export interface ButtonProps
  extends PropsWithChildren,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: ButtonVariant;
}

export function Button({ variant = 'primary', type = 'button', children, ...props }: ButtonProps) {
  return (
    <button {...props} type={type} className={clsx(styles.button, styles[variant])}>
      {children}
    </button>
  );
}
