import React, { useState } from 'react';
import './AuthorBanner.css';
import { Notification } from '@pages/Components/Notification.tsx';

const AuthorBanner: React.FC = () => {
    const [showNotification, setShowNotification] = useState(false);

    const handleButtonClick = () => {
        setShowNotification(true);
    };

    const handleClose = () => {
        setShowNotification(false);
    };

    return (
        <div className="author-banner-container">
            <div className="author-banner">
                <div className="author-content">
                    <h2 className="author-title">СТАНЬ АВТОРОМ СТАТЕЙ</h2>
                    <div className="author-form">
                        <input
                            type="email"
                            placeholder="Email"
                            className="email-input"
                        />
                        <button type="submit" className="submit-button" onClick={handleButtonClick}>
                            ОТПРАВИТЬ
                        </button>
                    </div>
                </div>
                <div>
                    {showNotification && (
                        <Notification
                            message="Вы отправили запрос!"
                            onClose={handleClose}
                        />
                    )}
                </div>
            </div>
            <div className="plate-container">
                <img src={'../../../../public/images/png/mushroom-plate.png'} alt="Тарелка с грибами" className="plate-image" />
            </div>
        </div>
    );
};

export default AuthorBanner;