import { NavLink } from 'react-router-dom';

export function Footer() {
    return (
        <footer>
            <span>
                <img className="logo-img-footer" src="/images/png/logo.png" />
                <h2
                    style={{
                        color: '#8D8989',
                        fontFamily: 'Raleway',
                        paddingLeft: '142px',
                        paddingTop: '60px',
                    }}
                >
                    2024, Fungi ©
                </h2>
            </span>
            <ul className="nav-footer">
                <li>
                    <ul className="ul-block1">
                        <li>
                            <NavLink
                                to={'/about'}
                                style={{
                                    textDecoration: 'none',
                                    color: 'black',
                                }}
                            >
                                О нас
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to={'/publications'}
                                style={{
                                    textDecoration: 'none',
                                    color: 'black',
                                }}
                            >
                                Публикации
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to={'/encyclopedia'}
                                style={{
                                    textDecoration: 'none',
                                    color: 'black',
                                }}
                            >
                                Энциклопедия
                            </NavLink>
                        </li>
                    </ul>
                </li>

                <li>
                    <ul className="ul-block2">
                        <li>
                            <NavLink
                                to={'/login'}
                                style={{
                                    textDecoration: 'none',
                                    color: 'black',
                                }}
                            >
                                Авторизация
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to={'/register'}
                                style={{
                                    textDecoration: 'none',
                                    color: 'black',
                                }}
                            >
                                Регистрация
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to={'/about'}
                                style={{
                                    textDecoration: 'none',
                                    color: 'black',
                                }}
                            >
                                Обратная связь
                            </NavLink>
                        </li>
                    </ul>
                </li>

                <li>
                    <img
                        className="qr-code-footer"
                        src="/images/svg/qr-code.svg"
                    />
                </li>
            </ul>
        </footer>
    );
}
