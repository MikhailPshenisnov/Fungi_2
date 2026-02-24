import { HTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Tag.module.css';

type TagTone = 'neutral' | 'info' | 'success' | 'warning' | 'error';
type TagSize = 's' | 'm' | 'l';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: TagTone;
  size?: TagSize;
}

export function Tag({ tone = 'neutral', size = 'm', className, children, ...props }: TagProps) {
  return (
    <span {...props} className={clsx(styles.tag, styles[tone], styles[size], className)}>
      {children}
    </span>
  );
}
