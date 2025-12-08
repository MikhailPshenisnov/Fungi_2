import {FormEvent, useEffect, useState} from 'react';
import {Button} from "react-bootstrap";
import {GetCurrentUser, LoginUser} from "../../api/AppApi.ts";
import {useAppDispatch, useAppSelector} from "../../redux/Hooks.tsx";
import { useNavigate } from 'react-router-dom';
import { setIsLoggedIn, setUpdate } from '../../redux/UserSlice.tsx';
import "./LoginPage.css"

const LoginPage = () => {
    const [email, setEmail_2] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);

    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
       if (user.isLoggedIn) {
            navigate("/");
       }
    }, [user.isLoggedIn, navigate])


    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        (async () => {
            try {
                await LoginUser(email, password);
                const res = await GetCurrentUser();

                if (res.data.data.email !== "") {
                    dispatch(setIsLoggedIn(true));
                    dispatch(setUpdate());
                }

                setErrorMessage('');
            } catch (error: any) {
                if (error.response?.status === 401) {
                    setErrorMessage('Неверный email или пароль');
                } else {
                    setErrorMessage(`Произошла ошибка: ${error.message}`);
                }
            }
        })();
    };

    return (
        <div className="login-page">
            <h1>{'Вход'}</h1>
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>
                        E-mail
                    </label>
                    <input
                        type="text"
                        id="email"
                        placeholder="Ваш E-mail"
                        value={email}
                        onChange={(e) => setEmail_2(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>
                        Пароль
                    </label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Минимум 8 символов"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <Button type="submit" className="update-button">
                    Войти
                </Button>
            </form>
            <br/>
            <p className="text">
                Нет аккаунта?{' '}
                <a href="/register" className="btn-registration">
                    Зарегистрируйся
                </a>
            </p>
            <br/>
            <div className="err-message">
                {errorMessage !== "" && (
                    <b>{errorMessage}</b>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
