import { Navigate, useNavigate } from 'react-router-dom';
import { useSession } from '@entities/session';
import { PageLayout } from '@widgets/layout';
import { Button, Card, Container, Stack, Typography } from '@shared/ui';
import styles from './ProfilePage.module.css';

type ProfileSection = 'profile' | 'favorites' | 'history';

interface ProfilePageProps {
  section?: ProfileSection;
}

const sectionMeta: Record<ProfileSection, { title: string; subtitle: string }> = {
  profile: {
    title: 'Профиль пользователя',
    subtitle: 'Личный кабинет'
  },
  favorites: {
    title: 'Избранное',
    subtitle: 'Сохраненные грибы и статьи'
  },
  history: {
    title: 'История просмотров',
    subtitle: 'Недавно открытые материалы'
  }
};

export function ProfilePage({ section = 'profile' }: ProfilePageProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useSession();
  const { title, subtitle } = sectionMeta[section];

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  function handleLogout() {
    signOut();
    navigate('/');
  }

  return (
    <PageLayout>
      <Container size="md" className={styles.container}>
        <Card>
          <Stack gap={20}>
            <div>
              <Typography variant="meta">{subtitle}</Typography>
              <Typography variant="h2">{title}</Typography>
            </div>

            <Stack gap={8}>
              <Typography variant="bodyS" className={styles.label}>
                Имя
              </Typography>
              <Typography variant="body">{user.name}</Typography>
            </Stack>

            <Stack gap={8}>
              <Typography variant="bodyS" className={styles.label}>
                Email
              </Typography>
              <Typography variant="body">{user.email}</Typography>
            </Stack>

            {section === 'favorites' ? (
              <Typography variant="bodyS" className={styles.placeholder}>
                Здесь будут ваши сохраненные карточки грибов и статьи.
              </Typography>
            ) : null}

            {section === 'history' ? (
              <Typography variant="bodyS" className={styles.placeholder}>
                Здесь появится список недавно просмотренных материалов.
              </Typography>
            ) : null}

            <Stack direction="horizontal" gap={12}>
              <Button variant="secondary" onClick={() => navigate('/')}>
                На главную
              </Button>
              <Button variant="tertiary" onClick={handleLogout}>
                Выйти
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Container>
    </PageLayout>
  );
}
