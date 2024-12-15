import { Routes, Route, Navigate } from "react-router-dom";
import { MainPage } from "../../../../pages/MainPage";
import Publications from "../../../../pages/Publications";
import AboutUs from "../../../../pages/AboutUs";
import { Encyclopedia } from "../../../../pages/Encyclopedia";
import PublicationsSec from "../../../../pages/Publications/PublicationsSec";
import PublicationPage from "../../../../pages/Publications/components/PublicationPage/PublicationPage";

export const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/mainpage"/>}/>
            <Route path="/mainpage" element={<MainPage />} />
            <Route path="/about" element={<AboutUs/>}/>
            <Route path="/publications" element={<Publications />} />
            <Route path="/publications-sec" element={<PublicationsSec />} />
            <Route path="/publications/:id" element={<PublicationPage />} />
            <Route path="/encyclopedia" element={<Encyclopedia />} />
            <Route path="*" element={<Navigate to="/mainpage"/>}/>
        </Routes>
    );
}
