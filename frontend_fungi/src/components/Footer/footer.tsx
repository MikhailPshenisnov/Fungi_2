import {NavLink} from "react-router-dom";

export function Footer(){
    return (
        <footer>
            <span>
                <img className="logo-img-footer" src="./public/images/png/logo.png" />
                <h2 style={{color: "#8D8989", fontFamily: "Raleway", marginLeft: "142px", marginTop: "60px"}}>2024, Fungi ©</h2>
            </span>
            <ul className="nav-footer">
                <li>
                    <ul className="ul-block1">
                        <li>
                            <NavLink to={"/about"} style={{textDecoration: "none", color: "black"}}>О нас</NavLink>
                        </li>
                        <li>
                        <NavLink to={"/about"} style={{textDecoration: "none", color: "black"}}>Публикации</NavLink>
                        </li>
                        <li>
                        <NavLink to={"/about"} style={{textDecoration: "none", color: "black"}}>Энциклопедия</NavLink>
                        </li>
                    </ul>
                </li>

                <li>
                    <ul className="ul-block2">
                        <li>
                            <NavLink to={"/about"} style={{textDecoration: "none", color: "black"}}>Вход</NavLink>
                        </li>
                        <li>
                        <NavLink to={"/about"} style={{textDecoration: "none", color: "black"}}>Регистрация</NavLink>
                        </li>
                        <li>
                        <NavLink to={"/about"} style={{textDecoration: "none", color: "black"}}>Обратная связь</NavLink>
                        </li>
                    </ul>
                </li>

                <li>
                    <img className="qr-code-footer" src="./public/images/svg/qr-code.svg" />
                </li>
            </ul>           
        </footer>
    )
}