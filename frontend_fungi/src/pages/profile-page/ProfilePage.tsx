import { FormEvent, useState } from "react";
import { UpdateUser } from "../../api/AppApi.ts";
import './ProfilePage.css';
import { useAppDispatch, useAppSelector } from "../../redux/Hooks.tsx";
import { fetchCurrentUser } from "../../redux/UserSlice.tsx";

export function ProfilePage() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);
    const [name, setName] = useState("");

    const [errorMessage, setErrorMessage] = useState<string>("");


    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        (async () => {
            try {
                if (user.email === "") {
                    setErrorMessage("Не удалось определить текущего пользователя. Обновите страницу.");
                    return;
                }

                const formData = new FormData();
                formData.append('UserEmail', user.email);
                if (name.trim() !== ""){
                    formData.append('NewName', name.trim());
                }

                const response = await UpdateUser(formData, user.token);
                if (!response.ok) {
                    const errorData = await response.json();
                    const error = new Error(errorData.message || `HTTP error! Status: ${response.status}`);
                    error.name = response.status.toString();
                    throw error;
                }

                setErrorMessage('');
                setName("");
                await dispatch(fetchCurrentUser());
                alert("Данные обновлены");
            } catch (error: any) {
                if (error.name === "400") {
                    setErrorMessage(`Ошибка при обновлении профиля. Имя должно быть от 5 символов или пустым чтобы не обновлять.`);
                } else {
                    setErrorMessage(`Произошла ошибка: ${error.message}`);
                }
            }
        })();
    };


    return (
        <div className="profile-page">
            <div className="profile-info">
                <div className="profile-header">
                    <h1>Профиль</h1>
                    <h3>{user.email}</h3>
                    <br/>
                    <h3>{user.name}</h3>
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
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <button type="submit" className="update-button">
                    Обновить данные
                </button>
            </form>
            <br/>
            <div className="err-message">
                {errorMessage !== "" && (
                    <b>{errorMessage}</b>
                )}
            </div>
        </div>
    );

}
export default ProfilePage;
