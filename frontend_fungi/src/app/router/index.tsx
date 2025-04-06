import { Routes, Route, Navigate } from 'react-router-dom';
import { MainPage } from '@pages/main-page';
import Publications from '@pages//publications';
import AboutUs from '@pages/about-us';
import { Encyclopedia } from '@pages/encyclopedia';
import PublicationsSec from '@pages/publications';
import PublicationPage from '@pages/publications';
import { MushroomPage } from '@pages/encyclopedia/components/MushroomPage';

export const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/mainpage" />} />
            <Route path="/mainpage" element={<MainPage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/publications" element={<Publications />} />
            <Route path="/publications-sec" element={<PublicationsSec />} />
            <Route path="/publications/:id" element={<PublicationPage />} />
            <Route
                path="/encyclopedia/:mushroomId"
                element={<MushroomPage />}
            />
            <Route path="/encyclopedia" element={<Encyclopedia />} />
            <Route path="*" element={<Navigate to="/mainpage" />} />
        </Routes>
    );
};
