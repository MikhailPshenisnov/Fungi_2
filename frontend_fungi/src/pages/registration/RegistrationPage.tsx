import {FormEvent, useEffect, useState} from 'react';
import {Button} from "react-bootstrap";
import {GetCurrentUser, RegistrationUser} from "../../api/AppApi.ts";
import {useAppDispatch, useAppSelector} from "../../redux/Hooks.tsx";
import { useNavigate } from 'react-router-dom';
import { setIsLoggedIn, setUpdate } from '../../redux/UserSlice.tsx';
import "./RegistrationPage.css"

const Registration = () => {

    const [email, setEmail_2] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>("");

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

        if (password !== confirmPassword) {
            setPasswordError('Пароли не совпадают');
            return;
        }
        setPasswordError("");

        (async () => {
            try {
                await RegistrationUser(username, email, password);
                const res = await GetCurrentUser();

                if (res.data.data.email !== "") {
                    dispatch(setIsLoggedIn(true));
                    dispatch(setUpdate());
                }

                setErrorMessage('');
            } catch (error: any) {
                if (error.response?.status === 400) {
                    setErrorMessage('Неправильный формат данных: минимальная длина имени и почты 8, пароля 8, \nтакже пароль должен содержать цифры, заглавную и строчную букву');
                } else {
                    setErrorMessage(`Произошла ошибка: ${error.message}`);
                }
            }
        })();


    };


    return (
        <div className="register-page">
            <h1>{'Регистрация'}</h1>
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Никнейм</label>
                    <input
                        className="input"
                        type="text"
                        id="username"
                        placeholder="Ваш никнейм"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">E-mail</label>
                    <input
                        className="input"
                        type="text"
                        id="email"
                        placeholder="Ваш E-mail"
                        value={email}
                        onChange={(e) => setEmail_2(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Пароль</label>
                    <input
                        className="input"
                        type="password"
                        id="password"
                        placeholder="Минимум 8 символов"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirm-password">Подтвердите пароль</label>
                    <input
                        className="input"
                        type="password"
                        id="confirm-password"
                        placeholder="Введите пароль ещё раз"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                {passwordError != "" && <p style={{color: 'red'}}>{passwordError}</p>}

                <Button type="submit" className="update-button">
                    Создать аккаунт
                </Button>
            </form>
            <br/>
            <p className="text">
                Уже есть аккаунт?{' '}
                <a href="/login" className="btn-registration">
                    Войти
                </a>
            </p>
            <p className="policy">
                Регистрируясь, вы соглашаетесь с <span className="policy_colored">политикой конфиденциальности</span>,
                пользовательским соглашением и даёте согласие на{' '}
                <span className="policy_colored">обработку персональных данных</span>
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

export default Registration;
