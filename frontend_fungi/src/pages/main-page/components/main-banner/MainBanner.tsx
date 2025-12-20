import "./MainBanner.css";
import { LineMainBannerSignSVG } from '@pages/Components';
import { useNavigate } from "react-router-dom";

const MainBanner: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="main-banner">
            <div className="banner-content">
                <div className="banner-text">
                    <p className="banner-top-sign">
                        <LineMainBannerSignSVG />
                        БОЛЕЕ 1000 ПОЛЬЗОВАТЕЛЕЙ
                    </p>
                    <h1 className="banner-title">
                        ИССЛЕДУЙ МИР ГРИБОВ С{' '}
                        <span style={{ color: '#E6C49C' }}>FUNGI</span>
                    </h1>
                    <p className="banner-description">
                        <span style={{ color: '#2C2C2C', fontWeight: 'bold' }}>
                            FUNGI
                        </span>{' '}
                        - электронная энциклопедия о грибах, которая
                        предоставляет пользователям информацию о залежах грибов,
                        их приготовлении, интересных фактах и многом другом
                    </p>
                    <div className="banner-buttons">
                        <button
                            className="explore-button"
                            onClick={() => navigate("/publications")}
                        >
                            ИССЛЕДОВАТЬ
                        </button>
                        <button
                            className="pro-button"
                            onClick={() => navigate("/publications")}
                        >К СТАТЬЯМ</button>
                    </div>
                </div>
                <div className="banner-image">
                    <img
                        src={'../../../../public/images/png/Hero.png'}
                        alt="FUNGI Logo"
                    />
                </div>
            </div>
        </div>
    );
};

export default MainBanner;