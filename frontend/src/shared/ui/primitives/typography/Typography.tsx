import { createElement, HTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Typography.module.css';

type Variant = 'h0' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'bodyL' | 'body' | 'bodyS' | 'caption' | 'meta';

const defaultTag: Record<Variant, keyof HTMLElementTagNameMap> = {
  h0: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  bodyL: 'p',
  body: 'p',
  bodyS: 'p',
  caption: 'span',
  meta: 'span'
};

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: Variant;
  as?: keyof HTMLElementTagNameMap;
}

export function Typography({ variant = 'body', as, children, ...props }: TypographyProps) {
  return createElement(
    as ?? defaultTag[variant],
    { ...props, className: clsx(styles.root, styles[variant], props.className) },
    children
  );
}
