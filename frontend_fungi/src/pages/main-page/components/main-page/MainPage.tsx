import "./MainPage.css";
import React from "react";
import MainBanner from "../main-banner/MainBanner.tsx";

export const MainPage: React.FC = () => {

    return (
        <div className="mainpage">
            <div className="main-page__content">
                <MainBanner />
            </div>
        </div>
    );
}
