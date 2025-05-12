import { Navbar } from '@modules/header/components/navbar';
import './Header.css';
import { SearchBar } from '@modules/header/components/search-bar';

export function Header() {
    return (
        <header className="header">
            <div className="header__container">
                <a href="/" className="site-brand">
                    <img src="/images/svg/logo.svg"
                         alt="logo"
                         className="site-logo" />
                    <h1 className="site-title">Fungi</h1>
                </a>
                <SearchBar/>
                <Navbar />
            </div>
            <div className="presentation" />
        </header>
    );
}
