import { type CSSProperties, type FormEvent, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { profileIcon, searchIcon } from '@shared/assets/icons';
import { Button, Container, Typography } from '@shared/ui';
import {
  getAvailableProfileTabs,
  getProfileTabHref,
  useSession
} from '@entities/session';
import styles from './AppHeader.module.css';

const navItems = [
  { label: 'О нас', href: '/about' },
  { label: 'Статьи', href: '/articles' },
  { label: 'Грибы', href: '/mushrooms' }
];

interface AppHeaderProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  onProfileClick?: () => void;
  onSearchSubmit?: (query: string) => void;
}

export function AppHeader({ onLoginClick, onSignupClick, onProfileClick, onSearchSubmit }: AppHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, signOut } = useSession();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isProfileAvatarBroken, setIsProfileAvatarBroken] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const profileIconMaskStyle = {
    ['--color-profile-icon-url' as const]: `url("${profileIcon}")`
  } as CSSProperties;
  const profileMenuTabs = user ? getAvailableProfileTabs(user.permissions) : [];

  useEffect(() => {
    setIsProfileMenuOpen(false);
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    setIsProfileAvatarBroken(false);
  }, [user?.avatarUrl]);

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (!profileMenuRef.current) {
        return;
      }

      const target = event.target;
      if (target instanceof Node && !profileMenuRef.current.contains(target)) {
        setIsProfileMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isProfileMenuOpen]);

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = String(formData.get('query') ?? '').trim();

    if (onSearchSubmit) {
      onSearchSubmit(query);
      return;
    }

    const searchParams = new URLSearchParams();
    if (query.length > 0) {
      searchParams.set('q', query);
    }

    const serialized = searchParams.toString();
    navigate(serialized.length > 0 ? `/search?${serialized}` : '/search');
  }

  function handleLoginClick() {
    if (onLoginClick) {
      onLoginClick();
      return;
    }

    navigate('/login');
  }

  function handleSignupClick() {
    if (onSignupClick) {
      onSignupClick();
      return;
    }

    navigate('/register');
  }

  function handleProfileClick() {
    setIsProfileMenuOpen((current) => !current);
  }

  function handleProfileMenuItemClick() {
    if (onProfileClick) {
      onProfileClick();
    } else {
      navigate('/profile');
    }

    setIsProfileMenuOpen(false);
  }

  function handleMenuLinkClick() {
    setIsProfileMenuOpen(false);
  }

  function handleLogout() {
    signOut();
    setIsProfileMenuOpen(false);
    navigate('/');
  }

  const shouldRenderAvatarImage = Boolean(user?.avatarUrl) && !isProfileAvatarBroken;

  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.row}>
          <Link to="/#top" className={styles.brand}>
            <img
              src="/images/branding/fungi-logo.svg"
              width={38}
              height={38}
              alt=""
              aria-hidden="true"
              className={styles.logo}
            />
            <Typography variant="h4" as="span" className={styles.brandTitle}>
              Fungi
            </Typography>
          </Link>

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
              <Link key={item.href} to={item.href} className={styles.link}>
                <Typography variant="caption">{item.label}</Typography>
              </Link>
            ))}
          </nav>

          <div className={styles.actions}>
            {isAuthenticated ? (
              <div className={styles.profileMenu} ref={profileMenuRef}>
                <Button
                  onClick={handleProfileClick}
                  leftIcon={
                    shouldRenderAvatarImage ? (
                      <img
                        src={user?.avatarUrl ?? ''}
                        alt=""
                        className={styles.profileAvatarImage}
                        onError={() => setIsProfileAvatarBroken(true)}
                      />
                    ) : (
                      <span aria-hidden="true" className={styles.profileGlyph} style={profileIconMaskStyle} />
                    )
                  }
                  rightIcon={
                    <span
                      aria-hidden="true"
                      className={isProfileMenuOpen ? `${styles.menuChevron} ${styles.menuChevronOpen}` : styles.menuChevron}
                    />
                  }
                  aria-haspopup="menu"
                  aria-expanded={isProfileMenuOpen}
                  aria-label="Открыть меню профиля"
                >
                  {user?.name}
                </Button>

                <div
                  className={isProfileMenuOpen ? `${styles.dropdown} ${styles.dropdownOpen}` : styles.dropdown}
                  role="menu"
                  aria-label="Меню профиля"
                >
                  {profileMenuTabs.map((tab) =>
                    tab.key === 'profile' ? (
                      <button
                        key={tab.key}
                        type="button"
                        className={styles.dropdownItem}
                        onClick={handleProfileMenuItemClick}
                        role="menuitem"
                      >
                        {tab.label}
                      </button>
                    ) : (
                      <Link
                        key={tab.key}
                        to={getProfileTabHref(tab.key)}
                        className={styles.dropdownItem}
                        role="menuitem"
                        onClick={handleMenuLinkClick}
                      >
                        {tab.label}
                      </Link>
                    )
                  )}
                  <div className={styles.dropdownDivider} />
                  <button type="button" className={styles.dropdownDanger} onClick={handleLogout} role="menuitem">
                    Выйти
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Button variant="tertiary" onClick={handleLoginClick}>
                  Войти
                </Button>
                <Button onClick={handleSignupClick}>Регистрация</Button>
              </>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
}
