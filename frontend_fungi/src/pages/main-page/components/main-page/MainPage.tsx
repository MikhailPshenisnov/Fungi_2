import "./MainPage.css";
import React from "react";
import MainBanner from "../main-banner/MainBanner.tsx";
import StatsBanner from "../stats-banner/StatsBanner.tsx"
import SurveyBanner from "../survey-banner/SurveyBanner.tsx";
import PublicationsBanner from "../publications-banner/PublicationsBanner.tsx";
import MushroomBanner from "../mushroom-banner/MushroomBanner.tsx";
import AuthorBanner from "../author-banner/AuthorBanner.tsx";

export const MainPage: React.FC = () => {

    return (
        <div className="mainpage">
            <div className="main-page__content">
                <MainBanner />
                <StatsBanner />
                <SurveyBanner />
                <hr className="main-page__hr_1" />
                <PublicationsBanner />
                <hr className="main-page__hr_2" />
                <MushroomBanner />
                <hr className="main-page__hr_3" />
                <AuthorBanner />
            </div>
        </div>
    );
}
