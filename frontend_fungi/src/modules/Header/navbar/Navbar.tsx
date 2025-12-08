import './Navbar.css';
import { HeaderNavLink } from '@modules/Header/header-nav-link/HeaderNavLink.tsx';


export const Navbar = () => {
    return (
        <ul className="nav">
            <HeaderNavLink link={'/about'} linkName={'О нас'}/>
            <HeaderNavLink link={'/publications'} linkName={'Публикации'}/>
            <HeaderNavLink link={'/encyclopedia'} linkName={'Энциклопедия'}/>
        </ul>
    );
}