import { Routes, Route, Navigate } from 'react-router-dom';
import { MainPage } from '@pages/main-page';
import { AboutUsPage } from '@pages/about-us';
import { Encyclopedia } from '@pages/encyclopedia';
import { MushroomPage } from '@pages/encyclopedia/components/MushroomPage';
import { PublicationsPage } from '@pages/publications';
import PublicationPage from '@pages/publications/components/PublicationPage/PublicationPage';

export const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/mainpage" />} />
            <Route path="/mainpage" element={<MainPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/publications" element={<PublicationsPage />} />
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
