import { FormEvent, useEffect, useState } from "react";
import { extractApiErrorMessage, UpdateUser } from "../../api/AppApi.ts";
import './ProfilePage.css';
import { useAppSelector } from "../../redux/Hooks.tsx";

const USERNAME_MIN_LENGTH = 8;
const USERNAME_MAX_LENGTH = 128;
const USERNAME_ALLOWED_PATTERN = /^[a-zA-Z0-9_.-]+$/;

type ProfileNotification = {
    type: "success" | "error";
    text: string;
};

const mapProfileUpdateError = (rawMessage: string): string => {
    const message = rawMessage.replace(/^Incorrect data format:\s*/i, "").trim();
    const normalized = message.toLowerCase();

    if (normalized.includes("new username must differ from current username")) {
        return "Введите другое имя. Текущее имя уже установлено.";
    }
    if (normalized.includes("failed to fetch") || normalized.includes("network error")) {
        return "Не удалось связаться с сервером. Проверьте подключение и попробуйте снова.";
    }
    if (normalized.includes("must be unique") || normalized.includes("already exists")) {
        return "Это имя уже занято. Выберите другое.";
    }
    if (normalized.includes("username can't be shorter than")) {
        return `Имя слишком короткое. Нужно минимум ${USERNAME_MIN_LENGTH} символов.`;
    }
    if (normalized.includes("username can't be longer than")) {
        return `Имя слишком длинное. Допустимо не более ${USERNAME_MAX_LENGTH} символов.`;
    }
    if (normalized.includes("username can't be line only with whitespaces")) {
        return "Имя не может состоять только из пробелов.";
    }
    if (normalized.includes("incorrect symbols in login")) {
        return "Имя может содержать только латиницу, цифры и символы _ . -";
    }
    if (normalized.includes("the field name must be")) {
        return `Имя должно быть от ${USERNAME_MIN_LENGTH} до ${USERNAME_MAX_LENGTH} символов.`;
    }
    if (normalized.includes("the field name must match the regular expression")) {
        return "Имя может содержать только латиницу, цифры и символы _ . -";
    }
    if (normalized.includes("http error")) {
        return "Не удалось обновить профиль. Попробуйте еще раз.";
    }
    if (normalized.includes("unauthorized")) {
        return "Сессия истекла. Войдите в аккаунт заново.";
    }

    return "Не удалось обновить профиль. Попробуйте еще раз.";
};

export function ProfilePage() {
    const user = useAppSelector((state) => state.user);
    const [name, setName] = useState("");
    const [displayName, setDisplayName] = useState(user.name);
    const [notification, setNotification] = useState<ProfileNotification | null>(null);
    const [isNotificationHiding, setIsNotificationHiding] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const trimmedName = name.trim();
    const showNameValidation = trimmedName.length > 0;
    const nameRules = [
        {
            id: "length",
            text: `От ${USERNAME_MIN_LENGTH} до ${USERNAME_MAX_LENGTH} символов`,
            isValid: trimmedName.length >= USERNAME_MIN_LENGTH && trimmedName.length <= USERNAME_MAX_LENGTH,
        },
        {
            id: "characters",
            text: "Только латиница, цифры и символы _ . -",
            isValid: USERNAME_ALLOWED_PATTERN.test(trimmedName),
        },
    ];
    const isNameValid = !showNameValidation || nameRules.every((rule) => rule.isValid);
    const isSameName = trimmedName.length > 0 && trimmedName === displayName.trim();
    const isSubmitDisabled = isSubmitting || !isNameValid || trimmedName.length === 0 || isSameName;

    useEffect(() => {
        setDisplayName(user.name);
    }, [user.name]);

    useEffect(() => {
        if (!notification) {
            setIsNotificationHiding(false);
            return;
        }

        setIsNotificationHiding(false);

        const hideTimerId = window.setTimeout(() => {
            setIsNotificationHiding(true);
        }, 5400);

        const removeTimerId = window.setTimeout(() => {
            setNotification(null);
        }, 6000);

        return () => {
            window.clearTimeout(hideTimerId);
            window.clearTimeout(removeTimerId);
        };
    }, [notification]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (isSubmitting) {
            return;
        }

        setNotification(null);

        if (user.email === "") {
            setNotification({
                type: "error",
                text: "Не удалось определить текущего пользователя. Обновите страницу и попробуйте снова.",
            });
            return;
        }

        if (!isNameValid) {
            setNotification({
                type: "error",
                text: `Имя должно быть от ${USERNAME_MIN_LENGTH} до ${USERNAME_MAX_LENGTH} символов и содержать только латиницу, цифры и символы _ . -.`,
            });
            return;
        }
        if (trimmedName.length === 0) {
            setNotification({
                type: "error",
                text: "Введите новое имя, чтобы сохранить изменения.",
            });
            return;
        }
        if (isSameName) {
            setNotification({
                type: "error",
                text: "Введите другое имя. Текущее имя уже установлено.",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("UserEmail", user.email);

            if (trimmedName !== "") {
                formData.append("NewName", trimmedName);
            }

            const response = await UpdateUser(formData, user.token);
            const payload = await response.json().catch(() => null);
            const apiErrorMessage = extractApiErrorMessage(payload);

            if (!response.ok || apiErrorMessage) {
                throw new Error(apiErrorMessage || `HTTP error! Status: ${response.status}`);
            }

            setDisplayName(trimmedName);
            setName("");
            setNotification({
                type: "success",
                text: "Новое имя сохранено и применяется в профиле.",
            });
        } catch (error: unknown) {
            const rawMessage = error instanceof Error ? error.message : "Произошла ошибка при обновлении профиля.";
            setNotification({
                type: "error",
                text: mapProfileUpdateError(rawMessage),
            });
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="profile-page">
            <div className="profile-info">
                <div className="profile-header">
                    <h1>Профиль</h1>
                    <h3>{user.email}</h3>
                    <br/>
                    <h3>{displayName}</h3>
                </div>
            </div>
            <br />
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Имя:</label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Ваше новое имя"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setNotification(null);
                        }}
                        disabled={isSubmitting}
                    />
                    <div className="profile-hint">Введите новое имя и нажмите «Обновить данные».</div>
                    {showNameValidation && (
                        <div className="profile-rules">
                            <div className="profile-rules-title">Требования к имени:</div>
                            <ul>
                                {nameRules.map((rule) => (
                                    <li key={rule.id} className={rule.isValid ? "is-valid" : "is-invalid"}>
                                        {rule.isValid ? "✓" : "•"} {rule.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <button type="submit" className="update-button" disabled={isSubmitDisabled}>
                    {isSubmitting ? "Обновляем..." : "Обновить данные"}
                </button>
            </form>
            {notification && (
                <div
                    className={`profile-result-banner profile-result-banner--outside ${notification.type}${isNotificationHiding ? " is-hiding" : ""}`}
                    role={notification.type === "error" ? "alert" : "status"}
                    aria-live="polite"
                >
                    <div className="profile-result-banner-title">
                        {notification.type === "success"
                            ? "Обновление имени прошло успешно"
                            : "Не удалось обновить имя"}
                    </div>
                    <div className="profile-result-banner-text">
                        {notification.text}
                    </div>
                </div>
            )}
        </div>
    );

}
export default ProfilePage;
