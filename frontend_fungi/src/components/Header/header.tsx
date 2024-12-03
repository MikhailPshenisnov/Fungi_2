import {NavLink} from "react-router-dom";

export function Header(){
    return (
        <header>
            <div>
                <span className="logo">
                    <NavLink to={"/home"} style={{textDecoration: "none", color: "black"}}>
                        <img className="logo-img" src="/images/logo.png" />
                    </NavLink>
                </span>
                <ul className="nav">
                    <li>
                        <NavLink to={"/about"} style={{textDecoration: "none", color: "black"}}>О нас</NavLink>
                    </li>
                    <li>
                        <NavLink to={"/contacts"} style={{textDecoration: "none", color: "black"}}>Публикации</NavLink>
                    </li>
                    <li>
                        <NavLink to={"/about"} style={{textDecoration: "none", color: "black"}}>Энциклопедия</NavLink>
                    </li>
                    <li>
                        <NavLink to={"/login"} style={{textDecoration: "none", color: "black"}}>
                            <img className="lk-icon" src="/images/user-profile.png" />
                            {/* {!props.authState.isLoggedIn && (
                                <>Личный кабинет</>
                            )}
                            {props.authState.isLoggedIn && (
                                <>{props.authState.username}</>
                            )} */}

                        </NavLink>
                    </li>
                </ul>
            </div>            
        </header>
    )
}