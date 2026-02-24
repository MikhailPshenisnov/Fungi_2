import { InputHTMLAttributes, useId } from 'react';
import clsx from 'clsx';
import styles from './Input.module.css';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  errorText?: string;
}

export function Input({ label, helperText, errorText, id, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? props.name ?? generatedId;
  return (
    <div className={styles.wrapper}>
      {label ? (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      ) : null}
      <input id={inputId} className={clsx(styles.input, errorText && styles.inputError)} {...props} />
      {errorText ? (
        <span className={clsx(styles.helper, styles.error)}>{errorText}</span>
      ) : helperText ? (
        <span className={styles.helper}>{helperText}</span>
      ) : null}
    </div>
  );
}
