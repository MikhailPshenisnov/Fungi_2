import { PropsWithChildren, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '@shared/ui';
import styles from './AuthLayout.module.css';

interface AuthLayoutProps extends PropsWithChildren {
  sideTitle: string;
  sideDescription: string;
  sideFooter?: ReactNode;
  contentFooter?: ReactNode;
}

export function AuthLayout({ sideTitle, sideDescription, sideFooter, contentFooter, children }: AuthLayoutProps) {
  return (
    <main className={styles.root}>
      <section className={styles.content}>
        <div className={styles.contentInner}>
          <header className={styles.contentHeader}>
            <Link to="/" className={styles.brandLink}>
              <img
                src="/images/branding/fungi-logo.svg"
                width={24}
                height={24}
                alt=""
                aria-hidden="true"
                className={styles.brandLogo}
              />
              <Typography variant="h5" as="span" className={styles.brandTitle}>
                Fungi
              </Typography>
            </Link>
          </header>

          <div className={styles.contentBody}>{children}</div>

          {contentFooter ? <footer className={styles.contentFooter}>{contentFooter}</footer> : null}
        </div>
      </section>

      <section className={styles.side}>
        <div className={styles.sideInner}>
          <Typography variant="h1" as="h1" className={styles.sideTitle}>
            {sideTitle}
          </Typography>
          <Typography variant="bodyL" className={styles.sideDescription}>
            {sideDescription}
          </Typography>
          {sideFooter ? <div className={styles.sideFooter}>{sideFooter}</div> : null}
        </div>
      </section>
    </main>
  );
}
