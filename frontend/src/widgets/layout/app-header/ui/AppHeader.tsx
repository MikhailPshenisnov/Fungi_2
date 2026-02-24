import type { CSSProperties, FormEvent } from 'react';
import { profileIcon, searchIcon } from '@shared/assets/icons';
import { Button, Container, Typography } from '@shared/ui';
import { useSession } from '@entities/session';
import styles from './AppHeader.module.css';

const navItems = [
  { label: 'О нас', href: '#about' },
  { label: 'Статьи', href: '#articles' },
  { label: 'Грибы', href: '#mushrooms' },
  { label: 'Отзывы', href: '#reviews' }
];

interface AppHeaderProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  onProfileClick?: () => void;
  onSearchSubmit?: (query: string) => void;
}

export function AppHeader({ onLoginClick, onSignupClick, onProfileClick, onSearchSubmit }: AppHeaderProps) {
  const { isAuthenticated, user } = useSession();
  const profileIconMaskStyle = {
    ['--profile-icon-url' as const]: `url("${profileIcon}")`
  } as CSSProperties;

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = String(formData.get('query') ?? '').trim();
    onSearchSubmit?.(query);
  }

  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.row}>
          <a href="#top" className={styles.brand}>
            <img
              src="/images/branding/fungi-logo.svg"
              width={38}
              height={38}
              alt=""
              aria-hidden="true"
              className={styles.logo}
            />
            <Typography variant="h4" className={styles.brandTitle}>
              Fungi
            </Typography>
          </a>

          <form className={styles.search} role="search" onSubmit={handleSearchSubmit}>
            <div className={styles.searchField}>
              <img src={searchIcon} width={18} height={18} alt="" aria-hidden="true" className={styles.searchIcon} />
              <input
                name="query"
                type="search"
                className={styles.searchInput}
                placeholder="Поиск"
                aria-label="Поиск"
              />
            </div>
            <Button variant="secondary" type="submit">
              Найти
            </Button>
          </form>

          <nav aria-label="Основная навигация" className={styles.nav}>
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className={styles.link}>
                <Typography variant="caption">{item.label}</Typography>
              </a>
            ))}
          </nav>

          <div className={styles.actions}>
            {isAuthenticated ? (
              <Button
                onClick={onProfileClick}
                leftIcon={<span aria-hidden="true" className={styles.profileGlyph} style={profileIconMaskStyle} />}
              >
                {user?.name}
              </Button>
            ) : (
              <>
                <Button variant="tertiary" onClick={onLoginClick}>
                  Войти
                </Button>
                <Button onClick={onSignupClick}>Регистрация</Button>
              </>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
}
