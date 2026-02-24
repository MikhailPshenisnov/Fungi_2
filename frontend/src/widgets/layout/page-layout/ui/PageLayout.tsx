import { ReactNode } from 'react';
import { AppFooter } from '@widgets/layout/app-footer';
import { AppHeader } from '@widgets/layout/app-header';
import styles from './PageLayout.module.css';

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div id="top" className={styles.root}>
      <AppHeader />
      <main className={styles.main}>{children}</main>
      <AppFooter />
    </div>
  );
}
