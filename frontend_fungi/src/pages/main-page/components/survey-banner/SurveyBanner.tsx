import "./SurveyBanner.css";
import { DecorationSVG } from '@pages/Components';
import { useState } from 'react';
import { Notification } from '../../../Components/Notification';


const SurveyBanner: React.FC = () => {
    const [showNotification, setShowNotification] = useState(false);

    const handleButtonClick = () => {
        setShowNotification(true);
    };

    const handleClose = () => {
        setShowNotification(false);
    };

    return (
        <div className="survey-banner">
            <div className="survey-banner-content">
                <div className="person-image-container">
                    <img src={'../../../../../public/images/png/Person.png'} alt="Phone" className="person-image" />
                </div>

                <div className="text-content">
                    <h2 className="survey-heading">Пройдите опрос чтобы <br />определить <span style={{color: "#E6C49C", fontWeight: "bold"}}>гриб</span></h2>

                    <ul className="survey-list">
                        <li className="survey-list-item">Наш интерактивный тест, который за 3–5 вопросов подскажет, какой гриб перед вами.</li>
                        <li className="survey-list-item">Идеально для походов в лес или обучения. Начните определять грибы как профессионал!</li>
                    </ul>

                    <div className="button-container">
                        <button className="survey-button" onClick={handleButtonClick}>
                            Пройти опрос
                        </button>
                        <div className="decoration">
                            <DecorationSVG/>
                        </div>
                    </div>
                    <div>
                        {showNotification && (
                            <Notification
                                message="Вы прошли опрос!"
                                onClose={handleClose}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SurveyBanner;