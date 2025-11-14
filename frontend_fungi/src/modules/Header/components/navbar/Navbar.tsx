import './Navbar.css';
import { HeaderNavLink } from '@modules/header/components/header-nav-link';

export const Navbar = () => {
    return (
        <ul className="nav">
            <HeaderNavLink link={'/about'} linkName={'О нас'}/>
            <HeaderNavLink link={'/publications'} linkName={'Публикации'}/>
            <HeaderNavLink link={'/encyclopedia'} linkName={'Энциклопедия'}/>
        </ul>
    );
}