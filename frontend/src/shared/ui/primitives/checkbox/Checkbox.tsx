import { InputHTMLAttributes, ReactNode, useId } from 'react';
import clsx from 'clsx';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  helperText?: string;
  errorText?: string;
}

export function Checkbox({ label, helperText, errorText, id, ...props }: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? props.name ?? generatedId;
  return (
    <div className={styles.wrapper}>
      <label htmlFor={inputId} className={styles.control}>
        <input id={inputId} type="checkbox" className={styles.input} {...props} />
        <span className={styles.label}>{label}</span>
      </label>
      {errorText ? (
        <span className={clsx(styles.helper, styles.error)}>{errorText}</span>
      ) : helperText ? (
        <span className={styles.helper}>{helperText}</span>
      ) : null}
    </div>
  );
}
