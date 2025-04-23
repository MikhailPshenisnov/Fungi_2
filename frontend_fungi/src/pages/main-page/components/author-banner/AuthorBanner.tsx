import React from 'react';
import './AuthorBanner.css';

const AuthorBanner: React.FC = () => {
    return (
        <div className="author-banner-container">
            <div className="author-banner">
                <div className="author-content">
                    <h2 className="author-title">Стань автором статей</h2>
                    <div className="author-form">
                        <input
                            type="email"
                            placeholder="Email"
                            className="email-input"
                        />
                        <button type="submit" className="submit-button">
                            Отправить
                        </button>
                    </div>
                </div>
            </div>
            <div className="plate-container">
                <img src={'../../../../public/images/png/mushroom-plate.png'} alt="Тарелка с грибами" className="plate-image" />
            </div>
        </div>
    );
};

export default AuthorBanner;