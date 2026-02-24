import { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

export interface ButtonProps
  extends PropsWithChildren,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: ButtonVariant;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  iconOnly?: boolean;
}

export function Button({
  variant = 'primary',
  type = 'button',
  children,
  leftIcon,
  rightIcon,
  iconOnly = false,
  ...props
}: ButtonProps) {
  const hasLeftIcon = Boolean(leftIcon) && !iconOnly;
  const hasRightIcon = Boolean(rightIcon) && !iconOnly;

  return (
    <button
      {...props}
      type={type}
      className={clsx(
        styles.button,
        styles[variant],
        iconOnly && styles.iconOnly,
        hasLeftIcon && styles.withLeftIcon,
        hasRightIcon && styles.withRightIcon
      )}
    >
      <span className={styles.content}>
        {leftIcon ? <span className={styles.icon} aria-hidden="true">{leftIcon}</span> : null}
        {children ? <span className={styles.label}>{children}</span> : null}
        {rightIcon ? <span className={styles.icon} aria-hidden="true">{rightIcon}</span> : null}
      </span>
    </button>
  );
}
