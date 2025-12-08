import { Routes, Route, Navigate } from 'react-router-dom';
import { MainPage } from '@pages/main-page';
import { AboutUsPage } from '@pages/about-us';
import { Encyclopedia } from '@pages/Encyclopedia';
import { MushroomPage } from '@pages/Encyclopedia/components/MushroomPage';
import PrivateRoute from '@modules/PrivateRoute.tsx';
import Registration from '@pages/registration/RegistrationPage.tsx';
import LoginPage from '@pages/login/LoginPage.tsx';
import ProfilePage from '@pages/profile-page/ProfilePage.tsx';
import { PublicationsPage } from '@pages/Publications/components/publications-page/PublicationsPage.tsx';
import { PublicationPage } from '@pages/Publications/components/publication-page/PublicationPage.tsx';
import AdminPage from '@pages/admin-page/AdminPage.tsx';

export const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/mainpage" />} />
            <Route path="/mainpage" element={<MainPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path={'/register'} element={
                <Registration/>}
            />
            <Route path={'/login'} element={
                <LoginPage/>}
            />
            <Route element={<PrivateRoute IsAdmin={false}/>}>
                <Route path="/profile" element={
                    <ProfilePage/>}
                />
            </Route>
            <Route element={<PrivateRoute IsAdmin={true}/>}>
                <Route path={'/admin'} element={
                    <AdminPage/>}
                />
            </Route>
            <Route path="/publications" element={<PublicationsPage />} />
            <Route path="/publications/:id" element={<PublicationPage />} />
            <Route path="/encyclopedia/:mushroomId" element={<MushroomPage />} />
            <Route path="/encyclopedia" element={<Encyclopedia />} />
            <Route path="*" element={<Navigate to="/mainpage" />} />
        </Routes>
    );
};