import { CSSProperties, HTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Stack.module.css';

type Direction = 'vertical' | 'horizontal';
type Align = 'start' | 'center' | 'end';
type Justify = 'start' | 'center' | 'end' | 'between';

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: Direction;
  gap?: number;
  align?: Align;
  justify?: Justify;
}

const justifyMap: Record<Justify, CSSProperties['justifyContent']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between'
};

export function Stack({
  direction = 'vertical',
  gap = 12,
  align = 'start',
  justify = 'start',
  style,
  className,
  children,
  ...props
}: StackProps) {
  return (
    <div
      className={clsx(styles.stack, styles[direction], styles[align], justify === 'between' && styles.between, className)}
      style={{ ...style, gap, justifyContent: justifyMap[justify] }}
      {...props}
    >
      {children}
    </div>
  );
}
