import "./MainPage.css";
import React from "react";
import MainBanner from "../main-banner/MainBanner.tsx";
import StatsBanner from "../stats-banner/StatsBanner.tsx"
import SurveyBanner from "../survey-banner/SurveyBanner.tsx";
import PublicationsBanner from "../publications-banner/PublicationsBanner.tsx";

export const MainPage: React.FC = () => {

    return (
        <div className="mainpage">
            <div className="main-page__content">
                <MainBanner />
                <StatsBanner />
                <SurveyBanner />
                <PublicationsBanner />
            </div>
        </div>
    );
}
