import { Routes, Route, Navigate } from "react-router-dom";
import { MainPage } from "../../../../pages/MainPage";
import AboutUs from "../../../../pages/AboutUs";
import Publications from "../../../../pages/Publications";
import PublicationsSec from "../../../../pages/Publications/PublicationsSec";


export const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/mainpage"/>}/>
            <Route path="/mainpage" element={<MainPage />} />
            <Route path="/about" element={<AboutUs/>}/>
            <Route path="/publications" element={<Publications />} />
            <Route path="/publications-sec" element={<PublicationsSec />} />
            <Route path="*" element={<Navigate to="/mainpage"/>}/>
        </Routes>
    );
}
