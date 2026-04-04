import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Card, Stack, Typography } from '@shared/ui/primitives';
import styles from './ContentState.module.css';

export type ContentStateTone = 'loading' | 'empty' | 'error' | 'info';

export interface ContentStateProps {
  title: string;
  description?: string;
  tone?: ContentStateTone;
  action?: ReactNode;
  className?: string;
}

export function ContentState({ title, description, tone = 'info', action, className }: ContentStateProps) {
  return (
    <Card className={clsx(styles.root, styles[tone], className)}>
      <Stack gap={10}>
        <Typography variant="h5" as="h2">
          {title}
        </Typography>
        {description ? (
          <Typography variant="bodyS" className={styles.description}>
            {description}
          </Typography>
        ) : null}
        {action ? <div className={styles.action}>{action}</div> : null}
      </Stack>
    </Card>
  );
}
