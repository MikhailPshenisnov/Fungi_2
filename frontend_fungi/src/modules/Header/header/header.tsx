import './Header.css';
import { SearchBar } from '@modules/Header/search-bar/SearchBar.tsx';
import { Navbar } from '@modules/Header/navbar/Navbar.tsx';
import { useAppDispatch, useAppSelector } from '../../../redux/Hooks';
import { Link, useNavigate } from 'react-router-dom';
import { logoutCurrentUser } from '../../../redux/UserSlice.tsx';
import { HeaderNavLink } from '@modules/Header/header-nav-link/HeaderNavLink.tsx';

export function Header() {
    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isLogged = user.isLoggedIn;
    const isAdminMode = user.accessLvl === 2;

    const handleLogout = async () => {
        await dispatch(logoutCurrentUser());
        navigate("/mainpage");
    };

    return (
        <header className="header">
            <div className="header__container">
                <Link to="/mainpage" className="site-brand">
                    <img src="/images/svg/logo.svg"
                         alt="logo"
                         className="site-logo" />
                    <h1 className="site-title">Fungi</h1>
                </Link>
                <SearchBar />
                <Navbar />
                {/*<button className="btn inactive">Вход</button>*/}
                {/*<button className="btn active">Регистрация</button>*/}
                {!isLogged ? (
                    <ul className="nav2">
                        <HeaderNavLink link={'/login'} linkName={'Авторизация'}/>
                        <HeaderNavLink link={'/register'} linkName={'Регистрация'}/>
                    </ul>
                ) : (
                    <ul className="nav2">
                        <HeaderNavLink link={'/profile'} linkName={user.email}/>
                        <button className="btn"
                            onClick={handleLogout}
                            >Выйти
                        </button>
                        {isAdminMode && (
                            <HeaderNavLink link={'/admin'} linkName={'Панель администратора'}/>
                        )}
                    </ul>
                )}
            </div>
        </header>
    );
}
