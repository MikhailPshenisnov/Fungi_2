import "./StatsBanner.css";
import React from 'react';

const StatsBanner: React.FC = () => {
    return (
        <div className="stats-banner">
            <div className="stats-banner-content">
                <div className="stats-text-block">
                    <h2 className="stats-heading">1K+</h2>
                    <p className="stats-description">Грибов в нашей базе</p>
                </div>

                <div className="stats-text-block">
                    <h2 className="stats-heading">100+</h2>
                    <p className="stats-description">Статей уже есть на сайте</p>
                </div>

                <div className="stats-text-block">
                    <h2 className="stats-heading">8 из 10</h2>
                    <p className="stats-description">Грибников выбирают нас</p>
                </div>
            </div>
        </div>
    );
};

export default StatsBanner;
