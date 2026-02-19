import axios from "axios";

const apiBaseUrl = (import.meta.env.VITE_API_URL ?? "").trim().replace(/\/+$/, "");
const toApiUrl = (path: string) => `${apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;

export const appApiIns = axios.create({
    baseURL: apiBaseUrl || undefined,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
})

// Models
export interface User{
    userId : string;
    email: string;
    name: string;
    role: string;
}
export interface Role{
    id: string;
    name: string;
    accessLevel: number;
}

//Publication
export interface IParagraphPublication {
    articleId: string;
    id: string;
    paragraphText: string;
    isSubtitle: boolean;
    serialNumber: number;
}

export interface IPublications {
    id: string;
    title: string;
    publishDate: string; // ISO строка даты
    authorString: string;
    headerPhotoLink: string;
    paragraphs: IParagraphPublication[];
}

export interface IPublicationsCardProps {
    card: IPublications;
    onClick?: () => void;
}

//Mushrooms
export interface IMushroom {
    id: string;
    name: string;
    synonymousName: string;
    latinName: string | null;
    family: string;
    redBook: boolean;
    eatable: 'Съедобный' | 'Полусъедобный' | 'Несъедобный';
    hasStem: boolean;
    stemSizeFrom: number | null;
    stemSizeTo: number | null;
    stemType: string | null;
    stemColor: string | null;
    capType: 'Выпуклая' | 'Плоская' | 'Вдавленная';
    capColor: string;
    capUndersideType: string;
    description: string;
    headerPhotoLink: string;
    doppelgangers: IDoppelganger[];
    [key: string]: unknown;
}

export interface IDoppelganger {
    id: string;
    mushroomId: string;
    doppelgangerName: string;
    isContainedInDatabase: boolean;
}

export interface FilterState {
    edibility: string[];
    capType: string[];
    [key: string]: string[];
}

export interface MushroomFilterProps {
    mushrooms: IMushroom[];
    filters: FilterState;
    searchQuery: string;
}

// Responses
export interface ApiResponse<T> {
    data: T | null;
    errorMessage?: ApiErrorDto | null;
}

export interface ApiErrorDto {
    errorGroup?: string;
    errorMessage?: string;
}

export interface CurrentUserData {
    token: string;
    name: string;
    email: string;
    asseccLvl: number;
    userId: string;
}

export type CurrentUserResponse = ApiResponse<CurrentUserData>;

export interface LoginResponse {
    token: string;
}

export interface RegistrationResponse {
    token: string;
}

export type LoginApiResponse = ApiResponse<LoginResponse>;
export type RegistrationApiResponse = ApiResponse<RegistrationResponse>;


// Authorization
export function LoginUser(email: string, password: string){
    const payload = { email, password };
    return appApiIns.post<LoginApiResponse>('/Authorization/LoginUser', payload);
}

export function RegistrationUser(name: string, email: string, password: string){
    const payload = { name, email, password };
    return appApiIns.post<RegistrationApiResponse>('/Authorization/RegisterUser', payload);
}

export function GetCurrentUser(){
    return appApiIns.get<CurrentUserResponse>('/Authorization/GetCurrentDataUser', { withCredentials: true});
}

export function LogoutUser(){
    return  appApiIns.post('/Authorization/LogoutUser');
}

export function extractApiErrorMessage(payload: unknown): string | null {
    if (!payload || typeof payload !== 'object') {
        return null;
    }

    const candidate = payload as {
        errorMessage?: { errorMessage?: string } | string | null;
        message?: string;
    };

    if (typeof candidate.errorMessage === 'string') {
        return candidate.errorMessage;
    }

    if (candidate.errorMessage && typeof candidate.errorMessage === 'object') {
        const nestedError = candidate.errorMessage.errorMessage;
        if (typeof nestedError === 'string') {
            return nestedError;
        }
    }

    if (typeof candidate.message === 'string') {
        return candidate.message;
    }

    return null;
}

export function extractAxiosErrorMessage(error: unknown): string | null {
    if (!error || typeof error !== 'object') {
        return null;
    }

    const candidate = error as {
        response?: { data?: unknown; status?: number };
        message?: string;
    };

    return (
        extractApiErrorMessage(candidate.response?.data) ??
        (typeof candidate.message === 'string' ? candidate.message : null)
    );
}

//Publications
export const getPublications = async () => {
    try {
        const response = await appApiIns.get<IPublications[]>('/Articles/GetFilteredArticles');
        return response.data.data.articles;
    } catch (error: any) {
        throw error;
    }
};

//Mushrooms
export const getMushrooms = async () => {
    try {
        const response = await appApiIns.get<IMushroom[]>('/Mushrooms/GetFilteredMushrooms');
        return response.data.data.mushrooms;
    } catch (error: any) {
        throw error;
    }
};


// Roles
export const getRoles = async () => {
    try {
        const response = await appApiIns.get<Role[]>('/Roles/TestGetRoles');
        return response.data;
    } catch (error: any) {
        return error;
    }
};

export function CreateRole(name: string, accessLevel: number, token : string){
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type" : "application/json",
            "Authorization" : `Bearer ${token}`},
        body: JSON.stringify({
            "Name": name,
            "AccessLevel": accessLevel
        })
    };
    return fetch(toApiUrl('/Roles/CreateRole'), requestOptions)
}

export function DeleteRole(roleId: string, token : string){
    const requestOptions = {
        method: "DELETE",
        headers: {"Content-Type" : "application/json",
            "Authorization" : `Bearer ${token}`}
    }
    return fetch(toApiUrl(`/Roles/DeleteRole?RoleId=${encodeURIComponent(roleId)}`), requestOptions)
}


// Users
export const getUsers = async () => {
    try {
        const response = await appApiIns.get<User[]>('/Users/TestGetUsers');
        return response.data;
    } catch (error: any) {
        return error;
    }
};

export function CreateUser(username: string, email: string, password: string, roleId: string, token : string){
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type" : "application/json",
            "Authorization" : `Bearer ${token}`},
        body: JSON.stringify({
            "username": username,
            "email": email,
            "password": password,
            "roleId": roleId
        })
    };
    return fetch(toApiUrl('/Users/CreateUser'), requestOptions)
}

export function UpdateUser(data: FormData, token : string){
    const requestOptions = {
        method: "POST",
        headers: {"Authorization" : `Bearer ${token}`},
        body: data
    }
    return fetch(toApiUrl('/Users/UpdateUserSmallParam'), requestOptions)
}

export function DeleteUser(userId: string, token : string){
    const requestOptions = {
        method: "DELETE",
        headers: {"Content-Type" : "application/json",
            "Authorization" : `Bearer ${token}`}
    }
    return fetch(toApiUrl(`/Users/DeleteUser?UserId=${encodeURIComponent(userId)}`), requestOptions)
}
