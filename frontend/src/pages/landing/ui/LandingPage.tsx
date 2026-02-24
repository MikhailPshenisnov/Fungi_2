import { LandingAuthorCta } from '@widgets/landing-author-cta';
import { LandingHero } from '@widgets/landing-hero';
import { LandingMushrooms } from '@widgets/landing-mushrooms';
import { LandingPublications } from '@widgets/landing-publications';
import { LandingReviews } from '@widgets/landing-reviews';
import { LandingStats } from '@widgets/landing-stats';
import { LandingSurvey } from '@widgets/landing-survey';
import { PageLayout } from '@widgets/layout';
import styles from './LandingPage.module.css';

export function LandingPage() {
  return (
    <PageLayout>
      <main className={styles.page}>
        <LandingHero />
        <LandingStats />
        <LandingSurvey />
        <LandingPublications />
        <LandingMushrooms />
        <LandingReviews />
        <LandingAuthorCta />
      </main>
    </PageLayout>
  );
}
