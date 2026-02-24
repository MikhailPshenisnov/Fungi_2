import { HTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Container.module.css';

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full-width';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
}

export function Container({ size = 'lg', className, children, ...props }: ContainerProps) {
  return (
    <div className={clsx(styles.container, styles[size], className)} {...props}>
      {children}
    </div>
  );
}
