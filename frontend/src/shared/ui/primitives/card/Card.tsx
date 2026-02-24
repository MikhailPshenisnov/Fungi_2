import { HTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Card.module.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ hoverable = false, className, children, ...props }: CardProps) {
  return (
    <div className={clsx(styles.card, hoverable && styles.hoverable, className)} {...props}>
      {children}
    </div>
  );
}
