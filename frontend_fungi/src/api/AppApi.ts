import axios from "axios";

const baseURL = 'http://localhost:5000';

export const appApiIns = axios.create({
    baseURL: 'http://localhost:5000',
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
export interface CurrentUserResponse {
    data: any;
    Token : string;
    Name : string;
    Email : string;
    AsseccLvl : number;
    UserId : string;
}

export interface LoginResponse {
    token: string;
}

export interface RegistrationResponse {
    token: string;
}


// Authorization
export function LoginUser(email: string, password: string){
    const payload = { email, password };
    return appApiIns.post<LoginResponse>('/Authorization/LoginUser', payload);
}

export function RegistrationUser(name: string, email: string, password: string){
    const payload = { name, email, password };
    return appApiIns.post<RegistrationResponse>('/Authorization/RegisterUser', payload);
}

export function GetCurrentUser(){
    return appApiIns.get<CurrentUserResponse>('/Authorization/GetCurrentDataUser', { withCredentials: true});
}

export function LogoutUser(){
    return  appApiIns.post('/Authorization/LogoutUser');
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
    return fetch(`${baseURL}/Roles/CreateRole`, requestOptions)
}

export function DeleteRole(roleId: string, token : string){
    const requestOptions = {
        method: "DELETE",
        headers: {"Content-Type" : "application/json",
            "Authorization" : `Bearer ${token}`}
    }
    return fetch(`${baseURL}/Roles/DeleteRole?RoleId=${roleId}`, requestOptions)
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

export function CreateUser(name: string, email: string, password: string, role: string, token : string){
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type" : "application/json",
            "Authorization" : `Bearer ${token}`},
        body: JSON.stringify({
            "name": name,
            "email": email,
            "password": password,
            "role": role
        })
    };
    return fetch(`${baseURL}/Users/CreateUser`, requestOptions)
}

export function UpdateUser(data: FormData, token : string){
    const requestOptions = {
        method: "POST",
        headers: {"Authorization" : `Bearer ${token}`},
        body: data
    }
    return fetch(`${baseURL}/Users/UpdateUserSmallParam`, requestOptions)
}

export function DeleteUser(userId: string, token : string){
    const requestOptions = {
        method: "DELETE",
        headers: {"Content-Type" : "application/json",
            "Authorization" : `Bearer ${token}`}
    }
    return fetch(`${baseURL}/Users/DeleteUser?UserId=${userId}`, requestOptions)
}

