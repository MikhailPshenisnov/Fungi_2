import "./MainBanner.css";

const MainBanner: React.FC = () => {
    return (
        <div className="main-banner">
            <div className="banner-content">
                <div className="banner-text">
                    <p className="banner-top-sign">
                        БОЛЕЕ 1000 ПОЛЬЗОВАТЕЛЕЙ
                    </p>
                    <h1 className="banner-title">ИССЛЕДУЙ МИР ГРИБОВ С <span style={{color: "#B28550"}}>FUNGI</span></h1>
                    <p className="banner-description">
                        <span style={{color: "#2C2C2C", fontWeight: "bold"}}>FUNGI</span> - электронная энциклопедия о грибах, которая предоставляет пользователям информацию о залежах грибов, их приготовлении, интересных фактах и многом другом
                    </p>
                    <div className="banner-buttons">
                        <button className="explore-button">Исследовать</button>
                        <button className="pro-button">Go Pro</button>
                    </div>
                </div>
                <div className="banner-image">
                    <img src={"../../../../public/images/png/Hero.png"} alt="FUNGI Logo" />
                </div>
            </div>
        </div>
    );
};

export default MainBanner;