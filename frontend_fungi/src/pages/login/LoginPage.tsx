import {FormEvent, useEffect, useState} from 'react';
import {Button} from "react-bootstrap";
import { extractApiErrorMessage, extractAxiosErrorMessage, LoginUser } from "../../api/AppApi.ts";
import {useAppDispatch, useAppSelector} from "../../redux/Hooks.tsx";
import { Link, useNavigate } from 'react-router-dom';
import { fetchCurrentUser } from '../../redux/UserSlice.tsx';
import "./LoginPage.css"

const LoginPage = () => {
    const [email, setEmail_2] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);

    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
       if (user.isLoggedIn) {
            navigate("/mainpage");
       }
    }, [user.isLoggedIn, navigate])


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');

        try {
            const loginResponse = await LoginUser(email, password);
            const loginError = extractApiErrorMessage(loginResponse.data);

            if (loginError) {
                setErrorMessage(loginError);
                return;
            }

            const authAction = await dispatch(fetchCurrentUser());
            if (fetchCurrentUser.fulfilled.match(authAction) && authAction.payload?.email) {
                return;
            }

            setErrorMessage('Не удалось выполнить вход. Попробуйте снова.');
        } catch (error: any) {
            if (error.response?.status === 401) {
                setErrorMessage('Неверный email или пароль');
            } else {
                setErrorMessage(extractAxiosErrorMessage(error) ?? 'Произошла ошибка при входе');
            }
        } finally {
            setIsSubmitting(false);
        }
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
                        onChange={(e) => {
                            setEmail_2(e.target.value);
                            setErrorMessage('');
                        }}
                        disabled={isSubmitting}
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
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setErrorMessage('');
                        }}
                        disabled={isSubmitting}
                        required
                    />
                </div>
                <Button type="submit" className="update-button" disabled={isSubmitting}>
                    {isSubmitting ? 'Входим...' : 'Войти'}
                </Button>
            </form>
            <br/>
            <p className="text">
                Нет аккаунта?{' '}
                <Link to="/register" className="btn-registration">
                    Зарегистрируйся
                </Link>
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
