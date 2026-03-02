import { SelectHTMLAttributes, useId } from 'react';
import clsx from 'clsx';
import styles from './Select.module.css';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  helperText?: string;
  errorText?: string;
  options: SelectOption[];
}

export function Select({ label, helperText, errorText, options, id, ...props }: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? props.name ?? generatedId;
  return (
    <div className={styles.wrapper}>
      {label ? (
        <label htmlFor={selectId} className={styles.label}>
          {label}
        </label>
      ) : null}
      <select id={selectId} className={clsx(styles.select, errorText && styles.selectError)} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errorText ? (
        <span className={clsx(styles.helper, styles.error)}>{errorText}</span>
      ) : helperText ? (
        <span className={styles.helper}>{helperText}</span>
      ) : null}
    </div>
  );
}
