import {FormEvent, useEffect, useState} from 'react';
import {Button} from "react-bootstrap";
import { extractApiErrorMessage, extractAxiosErrorMessage, RegistrationUser } from "../../api/AppApi.ts";
import {useAppDispatch, useAppSelector} from "../../redux/Hooks.tsx";
import { Link, useNavigate } from 'react-router-dom';
import { fetchCurrentUser } from '../../redux/UserSlice.tsx';
import "./RegistrationPage.css"

type RegistrationErrorField = 'username' | 'email' | 'password' | 'common';

const USERNAME_MIN_LENGTH = 8;
const USERNAME_MAX_LENGTH = 128;
const EMAIL_MAX_LENGTH = 128;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 32;

const mapRegistrationError = (rawMessage: string): { field: RegistrationErrorField; message: string } => {
    const message = rawMessage.replace(/^Incorrect data format:\s*/i, '').trim();
    const normalized = message.toLowerCase();

    if (normalized.includes("username can't be shorter than")) {
        return { field: 'username', message: `Никнейм должен быть не короче ${USERNAME_MIN_LENGTH} символов.` };
    }
    if (normalized.includes("username can't be longer than")) {
        return { field: 'username', message: `Никнейм должен быть от ${USERNAME_MIN_LENGTH} до ${USERNAME_MAX_LENGTH} символов.` };
    }
    if (normalized.includes("username can't be line only with whitespaces")) {
        return { field: 'username', message: 'Никнейм не может состоять только из пробелов.' };
    }
    if (normalized.includes('incorrect symbols in login')) {
        return { field: 'username', message: 'Никнейм может содержать только латиницу, цифры и символы _ . -' };
    }

    if (normalized.includes("email can't be longer than")) {
        return { field: 'email', message: `E-mail должен быть не длиннее ${EMAIL_MAX_LENGTH} символов.` };
    }

    if (normalized.includes("password can't be shorter than")) {
        return { field: 'password', message: `Пароль должен быть не короче ${PASSWORD_MIN_LENGTH} символов.` };
    }
    if (normalized.includes("password can't be longer than")) {
        return { field: 'password', message: `Пароль должен быть от ${PASSWORD_MIN_LENGTH} до ${PASSWORD_MAX_LENGTH} символов.` };
    }
    if (normalized.includes('password cannot be line only with whitespaces')) {
        return { field: 'password', message: 'Пароль не может состоять только из пробелов.' };
    }
    if (normalized.includes('must contain at least one number')) {
        return { field: 'password', message: 'Пароль должен содержать минимум одну цифру.' };
    }
    if (normalized.includes('must contain at least one capital letter')) {
        return { field: 'password', message: 'Пароль должен содержать минимум одну заглавную букву.' };
    }
    if (normalized.includes('must contain at least one lowercase letter')) {
        return { field: 'password', message: 'Пароль должен содержать минимум одну строчную букву.' };
    }
    if (normalized.includes('must contain at least one special character')) {
        return { field: 'password', message: 'Пароль должен содержать минимум один спецсимвол.' };
    }

    return { field: 'common', message: message || 'Произошла ошибка при регистрации.' };
};

const Registration = () => {

    const [email, setEmail_2] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [usernameError, setUsernameError] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);

    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState<string>("");

    const usernameRules = [
        {
            id: 'username-length',
            text: `От ${USERNAME_MIN_LENGTH} до ${USERNAME_MAX_LENGTH} символов`,
            isValid: username.length >= USERNAME_MIN_LENGTH && username.length <= USERNAME_MAX_LENGTH,
        },
        {
            id: 'username-characters',
            text: 'Только латиница, цифры и символы _ . -',
            isValid: /^[a-zA-Z0-9_.-]+$/.test(username),
        },
    ];

    const passwordRules = [
        {
            id: 'length',
            text: `От ${PASSWORD_MIN_LENGTH} до ${PASSWORD_MAX_LENGTH} символов`,
            isValid: password.length >= PASSWORD_MIN_LENGTH && password.length <= PASSWORD_MAX_LENGTH,
        },
        {
            id: 'digit',
            text: 'Минимум одна цифра',
            isValid: /\d/.test(password),
        },
        {
            id: 'upper',
            text: 'Минимум одна заглавная буква',
            isValid: /[A-Z]/.test(password),
        },
        {
            id: 'lower',
            text: 'Минимум одна строчная буква',
            isValid: /[a-z]/.test(password),
        },
        {
            id: 'special',
            text: 'Минимум один спецсимвол',
            isValid: /[!@#$%^&*(),.?\"{}|<>]/.test(password),
        },
    ];
    const isUsernameValid = usernameRules.every((rule) => rule.isValid);
    const isEmailValid = email.length > 0 && email.length <= EMAIL_MAX_LENGTH;
    const isPasswordValid = passwordRules.every((rule) => rule.isValid);
    const isPasswordMatch = password === confirmPassword;
    const isConfirmPasswordInvalid = confirmPassword.length > 0 && !isPasswordMatch;
    const isSubmitDisabled = isSubmitting || !isUsernameValid || !isEmailValid || !isPasswordValid || !isPasswordMatch;
    const showUsernameFeedback = username.length > 0;
    const fulfilledRulesCount = passwordRules.filter((rule) => rule.isValid).length;
    const showPasswordFeedback = password.length > 0;

    const passwordStrength = (() => {
        if (fulfilledRulesCount <= 2) {
            return { label: 'слабый', className: 'weak' as const };
        }
        if (fulfilledRulesCount <= 4) {
            return { label: 'средний', className: 'medium' as const };
        }

        return { label: 'сильный', className: 'strong' as const };
    })();

    useEffect(() => {
        if (user.isLoggedIn) {
            navigate("/mainpage");
        }
    }, [user.isLoggedIn, navigate])

    const applyValidationError = (field: RegistrationErrorField, message: string) => {
        if (field === 'username') {
            setUsernameError(message);
            return;
        }

        if (field === 'email') {
            setEmailError(message);
            return;
        }

        if (field === 'password') {
            setPasswordError(message);
            return;
        }

        setErrorMessage(message);
    };


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (isSubmitting) {
            return;
        }

        setUsernameError("");
        setEmailError("");
        setPasswordError("");
        setErrorMessage("");

        if (!isUsernameValid) {
            setUsernameError(`Никнейм должен быть от ${USERNAME_MIN_LENGTH} до ${USERNAME_MAX_LENGTH} символов и содержать только латиницу, цифры и символы _ . -`);
            return;
        }

        if (!isEmailValid) {
            setEmailError(`E-mail должен быть не длиннее ${EMAIL_MAX_LENGTH} символов.`);
            return;
        }

        if (!isPasswordValid) {
            setPasswordError('Пароль не соответствует требованиям');
            return;
        }

        if (!isPasswordMatch) {
            setPasswordError('Пароли не совпадают');
            return;
        }

        setIsSubmitting(true);

        try {
            const registrationResponse = await RegistrationUser(username, email, password);
            const registrationError = extractApiErrorMessage(registrationResponse.data);

            if (registrationError) {
                const mappedError = mapRegistrationError(registrationError);
                applyValidationError(mappedError.field, mappedError.message);
                return;
            }

            const authAction = await dispatch(fetchCurrentUser());
            if (fetchCurrentUser.fulfilled.match(authAction) && authAction.payload?.email) {
                return;
            }

            setErrorMessage('Не удалось завершить регистрацию. Попробуйте снова.');
        } catch (error: any) {
            const rawError = extractAxiosErrorMessage(error) ?? '';
            const mappedError = mapRegistrationError(rawError);
            applyValidationError(mappedError.field, mappedError.message);
        } finally {
            setIsSubmitting(false);
        }

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
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setUsernameError('');
                            setErrorMessage('');
                        }}
                        maxLength={USERNAME_MAX_LENGTH}
                        disabled={isSubmitting}
                        required
                    />
                </div>
                <div
                    className={`username-feedback ${showUsernameFeedback ? 'is-visible' : 'is-hidden'}`}
                    aria-live="polite"
                    aria-hidden={!showUsernameFeedback}
                >
                    <ul className="username-feedback__list">
                        {usernameRules.map((rule) => (
                            <li
                                key={rule.id}
                                className={`username-feedback__item ${rule.isValid ? 'valid' : 'invalid'}`}
                            >
                                <span className="username-feedback__icon" aria-hidden="true">
                                    {rule.isValid ? '✓' : '○'}
                                </span>
                                <span>{rule.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                {usernameError !== "" && (
                    <p className="field-error">{usernameError}</p>
                )}
                <div className="form-group">
                    <label htmlFor="email">E-mail</label>
                    <input
                        className="input"
                        type="email"
                        id="email"
                        placeholder="Ваш E-mail"
                        value={email}
                        onChange={(e) => {
                            setEmail_2(e.target.value);
                            setEmailError('');
                            setErrorMessage('');
                        }}
                        maxLength={EMAIL_MAX_LENGTH}
                        disabled={isSubmitting}
                        required
                    />
                </div>
                {emailError !== "" && (
                    <p className="field-error">{emailError}</p>
                )}
                <div className="form-group">
                    <label htmlFor="password">Пароль</label>
                    <div className="password-input-wrapper">
                        <input
                            className="input"
                            type={isPasswordVisible ? "text" : "password"}
                            id="password"
                            placeholder={`От ${PASSWORD_MIN_LENGTH} до ${PASSWORD_MAX_LENGTH} символов`}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setPasswordError('');
                                setErrorMessage('');
                            }}
                            maxLength={PASSWORD_MAX_LENGTH}
                            disabled={isSubmitting}
                            required
                        />
                        <button
                            type="button"
                            className="password-visibility-toggle"
                            onClick={() => setIsPasswordVisible((prev) => !prev)}
                            aria-label={isPasswordVisible ? "Скрыть пароль" : "Показать пароль"}
                            aria-pressed={isPasswordVisible}
                            disabled={isSubmitting}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path
                                    d="M2 12C3.73 8.39 7.52 6 12 6C16.48 6 20.27 8.39 22 12C20.27 15.61 16.48 18 12 18C7.52 18 3.73 15.61 2 12Z"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
                                {!isPasswordVisible && (
                                    <path
                                        d="M4 4L20 20"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
                <div
                    className={`password-feedback ${showPasswordFeedback ? 'is-visible' : 'is-hidden'}`}
                    aria-live="polite"
                    aria-hidden={!showPasswordFeedback}
                >
                    <p className="password-feedback__strength">
                        <span
                            className={`password-feedback__strength-indicator ${passwordStrength.className}`}
                            aria-hidden="true"
                        />
                        Надежность пароля:
                        <span className={`password-feedback__strength-value ${passwordStrength.className}`}>
                            {passwordStrength.label}
                        </span>
                    </p>
                    <ul className="password-feedback__list">
                        {passwordRules.map((rule) => (
                            <li
                                key={rule.id}
                                className={`password-feedback__item ${rule.isValid ? 'valid' : 'invalid'}`}
                            >
                                <span className="password-feedback__icon" aria-hidden="true">
                                    {rule.isValid ? '✓' : '○'}
                                </span>
                                <span>{rule.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="form-group">
                    <label htmlFor="confirm-password">Подтвердите пароль</label>
                    <div className="password-input-wrapper">
                        <input
                            className="input"
                            type={isConfirmPasswordVisible ? "text" : "password"}
                            id="confirm-password"
                            placeholder="Введите пароль ещё раз"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setPasswordError('');
                                setErrorMessage('');
                            }}
                            maxLength={PASSWORD_MAX_LENGTH}
                            disabled={isSubmitting}
                            required
                        />
                        <button
                            type="button"
                            className="password-visibility-toggle"
                            onClick={() => setIsConfirmPasswordVisible((prev) => !prev)}
                            aria-label={isConfirmPasswordVisible ? "Скрыть подтверждение пароля" : "Показать подтверждение пароля"}
                            aria-pressed={isConfirmPasswordVisible}
                            disabled={isSubmitting}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path
                                    d="M2 12C3.73 8.39 7.52 6 12 6C16.48 6 20.27 8.39 22 12C20.27 15.61 16.48 18 12 18C7.52 18 3.73 15.61 2 12Z"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
                                {!isConfirmPasswordVisible && (
                                    <path
                                        d="M4 4L20 20"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {(passwordError !== "" || isConfirmPasswordInvalid) && (
                    <p className="field-error">
                        {passwordError || 'Пароли не совпадают'}
                    </p>
                )}

                <Button type="submit" className="update-button" disabled={isSubmitDisabled}>
                    {isSubmitting ? 'Создаем аккаунт...' : 'Создать аккаунт'}
                </Button>
            </form>
            <br/>
            <p className="text">
                Уже есть аккаунт?{' '}
                <Link to="/login" className="btn-registration">
                    Войти
                </Link>
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
