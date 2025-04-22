import "./SurveyBanner.css";

const SurveyBanner: React.FC = () => {
    return (
        <div className="survey-banner">
            <div className="survey-banner-content">
                <div className="phone-image-container">
                    <img src={'../../../../../public/images/png/mobile-screen.png'} alt="Phone" className="phone-image" />
                </div>

                <div className="text-content">
                    <h2 className="survey-heading">Пройдите <span style={{color: "#2C2C2C", fontWeight: "bold"}}>опрос</span> <br /> чтобы определить <span style={{color: "#B28550", fontWeight: "bold"}}>гриб</span></h2>

                    <ul className="survey-list">
                        <li className="survey-list-item">Наш интерактивный тест, который за 3–5 вопросов подскажет, какой гриб перед вами.</li>
                        <li className="survey-list-item">Идеально для походов в лес или обучения. Начните определять грибы как профессионал!</li>
                    </ul>

                    <div className="button-container">
                        <button className="survey-button">Пройти опрос</button>
                        <img src={'../../../../../public/images/svg/decoration-banner.svg'} alt="Decoration" className="decoration" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SurveyBanner;