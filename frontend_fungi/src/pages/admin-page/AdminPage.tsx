import {FormEvent, useEffect, useState} from "react";
import {
    CreateRole,
    CreateUser,
    DeleteRole,
    DeleteUser,
    getRoles,
    getUsers,
    Role,
    User,
} from "../../api/AppApi.ts";
import UserCard from "../Components/UserCard.tsx";
import RoleCard from "../Components/RoleCard.tsx";
import {Button} from "react-bootstrap";
import "./AdminPage.css"
import { useAppSelector } from '../../redux/Hooks.tsx';

export function AdminPage() {
    const user = useAppSelector((state) => state.user);

    // Users
    const [showUsers, setShowUsers] = useState(false);
    const [showUsersRole, setShowUsersRole] = useState(false);
    const [showUsersId, setShowUsersId] = useState(false);
    const [showCreteUser, setShowCreteUser] = useState(false);
    const [showDeleteUser, setShowDeleteUser] = useState(false);

    // Roles
    const [showRoles, setShowRoles] = useState(false);
    const [showCreateRoles, setShowCreateRoles] = useState(false);
    const [showDeleteRoles, setShowDeleteRoles] = useState(false);

    // list models
    const [Users, setUsers] = useState<User[]>([]);
    const [Roles, setRoles] = useState<Role[]>([]);

    // Users
    const [username, setUsername] = useState('');
    const [email, setEmail_2] = useState('');
    const [password, setPassword] = useState('');
    const [RoleId, setRoleId] = useState('');
    const [UserIdDel, setUserIdDel] = useState('');

    // Roles
    const [RoleName, setRoleName] = useState('');
    const [AcceessLvl, setAccessLevelAd] = useState<number>(0);
    const [RoleIdDel, setRoleIdDel] = useState('');

    // Dop
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [UpdatePage, setUpdatePage] = useState(false);

    /*_____________________________________________________________*/

    const incrementRole = () => {
        if (AcceessLvl < 7) {
            setAccessLevelAd(AcceessLvl + 1);
        }
    };

    const decrementRole = () => {
        if (AcceessLvl > 0) {
            setAccessLevelAd(AcceessLvl - 1);
        }
    };


    useEffect(() => {
        (async () => {
            const data = await getUsers();
            setUsers(data.data);
            console.log(data.data)
        })();
    }, [showUsers, UpdatePage]);

    useEffect(() => {
        (async () => {
            const data_2 = await getRoles();
            setRoles(data_2.data);
            console.log(data_2.data);
        })();
    }, [showRoles, UpdatePage]);

    // Users
    const handleSubmit_CreateUser = (e: FormEvent) => {
        e.preventDefault();
        (async () => {
            try {
                const response = await CreateUser(username, email, password, RoleId, user.token);
                if (!response.ok) {
                    const errorData = await response.json();
                    const error = new Error(errorData.message || `HTTP error! Status: ${response.status}`);
                    error.name = response.status.toString();
                    throw error;
                }

                setErrorMessage('');
                setUpdatePage(!UpdatePage);
            } catch (error: any) {
                if (error.name === "401" || error.name === "400") {
                    setErrorMessage('Неверные данные');
                } else {
                    setErrorMessage(`Произошла ошибка: ${error.message}`);
                }
            }
        })();
    };

    const handleSubmit_deleteUser = (e: FormEvent) => {
        e.preventDefault();
        (async () => {
            try {
                const response = await DeleteUser(UserIdDel, user.token);
                if (!response.ok) {
                    const errorData = await response.json();
                    const error = new Error(errorData.message || `HTTP error! Status: ${response.status}`);
                    error.name = response.status.toString();
                    throw error;
                }

                setErrorMessage('');
                setUpdatePage(!UpdatePage);
            } catch (error: any) {
                if (error.name === "401") {
                    setErrorMessage('Неверный токен');
                } else {
                    setErrorMessage(`Произошла ошибка: ${error.message}`);
                }
            }
        })();
    };

    // Role
    const handleSubmit_createRole = (e: FormEvent) => {
        e.preventDefault();
        (async () => {
            try {
                const response = await CreateRole(RoleName, AcceessLvl, user.token);
                if (!response.ok) {
                    const errorData = await response.json();
                    const error = new Error(errorData.message || `HTTP error! Status: ${response.status}`);
                    error.name = response.status.toString();
                    throw error;
                }

                setErrorMessage('');
                setUpdatePage(!UpdatePage);
            } catch (error: any) {
                if (error.name === "401" || error.name === "400") {
                    setErrorMessage('Неверные данные');
                } else {
                    setErrorMessage(`Произошла ошибка: ${error.message}`);
                }
            }
        })();
    };

    const handleSubmit_deleteRole = (e: FormEvent) => {
        e.preventDefault();
        (async () => {
            try {
                const response = await DeleteRole(RoleIdDel, user.token);
                if (!response.ok) {
                    const errorData = await response.json();
                    const error = new Error(errorData.message || `HTTP error! Status: ${response.status}`);
                    error.name = response.status.toString();
                    throw error;
                }

                setErrorMessage('');
                setUpdatePage(!UpdatePage);
            } catch (error: any) {
                if (error.name === "401") {
                    setErrorMessage('Неверный токен');
                } else {
                    setErrorMessage(`Произошла ошибка: ${error.message}`);
                }
            }
        })();
    };

    /*_____________________________________________________________*/

    return (
        <div className="admin-page">
            <h1 style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'}}>Панель администратора</h1>
            <br/>
            <div className="err-message">
                {errorMessage !== "" && (
                    <b>{errorMessage}</b>
                )}
            </div>
            <div>
                <h1>Пользователи</h1>
                <div style={{display: 'flex', alignItems: 'left', justifyContent: 'left', gap: '20px'}}>
                    <label>
                        <input
                            type="checkbox"
                            checked={showUsers}
                            onChange={() => setShowUsers(!showUsers)}
                        />
                        Показывать пользователей
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={showUsersRole}
                            onChange={() => setShowUsersRole(!showUsersRole)}
                        />
                        Показывать Роли
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={showUsersId}
                            onChange={() => setShowUsersId(!showUsersId)}
                        />
                        Показывать ID пользователя
                    </label>
                </div>
                {showUsers &&
                    <div>
                        {Users.length > 0 ? (
                            <div>
                                {Users.map((user: User) => (
                                    <li key={user.userId}>
                                        <UserCard email={user.email} name={user.name} needRole={showUsersRole} role={user.role} needId={showUsersId} Id={user.userId} />
                                    </li>
                                ))}
                            </div>
                        ) : (
                            <div>
                                <p>Нет пользователей.</p>
                            </div>
                        )}
                    </div>
                }
                <br/>
                <label>
                    <input
                        type="checkbox"
                        checked={showCreteUser}
                        onChange={() => setShowCreteUser(!showCreteUser)}
                    />
                    Показывать создание пользователя
                </label>
                {showCreteUser &&
                    <div>
                        <br/>
                        <h4>Создание пользователя</h4>
                        <form className="form" onSubmit={handleSubmit_CreateUser}>
                            <div className="form-group">
                                <label>
                                    Имя
                                </label>
                                <input
                                    
                                    type="text"
                                    placeholder="Имя пользователся"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>
                                    Email
                                </label>
                                <input
                                    
                                    type="text"
                                    placeholder="Email пользователся"
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
                                    placeholder="Минимум 8 символов"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>
                                    Guid Роли
                                </label>
                                <input
                                    
                                    type="text"
                                    placeholder="Guid роли"
                                    value={RoleId}
                                    onChange={(e) => setRoleId(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="update-button">
                                Создать пользователя
                            </Button>
                        </form>
                    </div>
                }
                <br/>
                <br/>
                <label>
                    <input
                        type="checkbox"
                        checked={showDeleteUser}
                        onChange={() => setShowDeleteUser(!showDeleteUser)}
                    />
                    Показывать удаление пользователей
                </label>
                {showDeleteUser &&
                    <div>
                        <br/>
                        <h4>Удаление пользователя</h4>
                        <form className="form" onSubmit={handleSubmit_deleteUser}>
                            <div className="form-group">
                                <label>
                                    Guid пользователя
                                </label>
                                <input
                                    
                                    type="text"
                                    placeholder="Guid пользователся"
                                    value={UserIdDel}
                                    onChange={(e) => setUserIdDel(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="update-button">
                                Удалить пользователя
                            </Button>
                        </form>
                    </div>
                }
            </div>
            <br/>
            <div>
                <h1>Роли</h1>
                <label>
                    <input
                        type="checkbox"
                        checked={showRoles}
                        onChange={() => setShowRoles(!showRoles)}
                    />
                    Показывать роли
                </label>
                <br/>
                {showRoles &&
                    <div>
                        {Roles.length > 0 ? (
                            <div>
                                {Roles.map((role: Role) => (
                                    <li key={role.id}>
                                        <RoleCard role={role.id} name={role.name} accessLvl={role.accessLevel}/>
                                    </li>
                                ))}
                            </div>
                        ) : (
                            <div>
                                <p>Нет ролей.</p>
                            </div>
                        )}
                    </div>
                }
                <br/>
                <label>
                    <input
                        type="checkbox"
                        checked={showCreateRoles}
                        onChange={() => setShowCreateRoles(!showCreateRoles)}
                    />
                    Показывать создание роли
                </label>
                {showCreateRoles &&
                    <div>
                        <br/>
                        <h4>Создание роли</h4>
                        <form className="form" onSubmit={handleSubmit_createRole}>
                            <div className="form-group">
                                <label>
                                    Имя роли
                                </label>
                                <input
                                    
                                    type="text"
                                    placeholder="Имя роли"
                                    value={RoleName}
                                    onChange={(e) => setRoleName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>
                                    Уровень доступа (0 : superuser, 1-5 : admin, 6 : editor, 7 : commonuser)
                                </label>
                                <div style={{display: 'flex', alignItems: 'left', justifyContent: 'left', gap: '5px'}}>
                                    <Button variant="outline-secondary"
                                            onClick={decrementRole}
                                            style={{fontSize: '1.8rem',}}
                                    >-</Button>
                                    <span style={{
                                        fontSize: '1.5rem',
                                        padding: '10px 20px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        backgroundColor: '#f8f9fa',
                                    }}>{AcceessLvl}</span>
                                    <Button variant="outline-secondary"
                                            onClick={incrementRole}
                                            style={{fontSize: '1.8rem',}}
                                    >+</Button>
                                </div>
                            </div>
                            <Button type="submit" className="update-button">
                                Создать роль
                            </Button>
                        </form>
                    </div>
                }
                <br/>
                <br/>
                <label>
                    <input
                        type="checkbox"
                        checked={showDeleteRoles}
                        onChange={() => setShowDeleteRoles(!showDeleteRoles)}
                    />
                    Показывать удаление роли
                </label>
                {showDeleteRoles &&
                    <div>
                        <br/>
                        <h4>Удаление роли</h4>
                        <form className="form" onSubmit={handleSubmit_deleteRole}>
                            <div className="form-group">
                                <label>
                                    Guid роли
                                </label>
                                <input
                                    
                                    type="text"
                                    placeholder="Guid роли"
                                    value={RoleIdDel}
                                    onChange={(e) => setRoleIdDel(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="update-button">
                                Удалить роль
                            </Button>
                        </form>
                    </div>
                }
            </div>
        </div>
    );
};

export default AdminPage;