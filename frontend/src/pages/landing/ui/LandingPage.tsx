import { LandingAuthorCta } from '@widgets/landing-author-cta';
import { LandingHero } from '@widgets/landing-hero';
import { LandingMushrooms } from '@widgets/landing-mushrooms';
import { LandingPublications } from '@widgets/landing-publications';
import { LandingStats } from '@widgets/landing-stats';
import { PageLayout } from '@widgets/layout';
import styles from './LandingPage.module.css';

export function LandingPage() {
  return (
    <PageLayout>
      <div className={styles.page}>
        <LandingHero />
        <LandingStats />
        <LandingPublications />
        <LandingMushrooms />
        <LandingAuthorCta />
      </div>
    </PageLayout>
  );
}
