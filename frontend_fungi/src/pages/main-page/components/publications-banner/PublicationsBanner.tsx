import React from 'react';
import './PublicationsBanner.css';
import { FavouriteSVG } from '@shared/ui';
import { StarSVG } from '@shared/ui';

const PublicationsBanner: React.FC = () => {
    const publications = [
        {
            image: '../../../../../public/images/png/publication1.png',
            title: 'Мухомор ядовитый гриб ...',
            readTime: '24min •',
            rating: '4.8'
        },
        {
            image: '../../../../../public/images/png/publication2.png',
            title: 'Грибы как источник пищи ...',
            readTime: '32min •',
            rating: '4.9'
        },
        {
            image: '../../../../../public/images/png/publication3.png',
            title: 'Психоактивные грибы...',
            readTime: '15min •',
            rating: '4.5'
        }
    ];

    return (
        <div className="publications-banner">
            <h2 className="publications-title"><span style={{color: "#E6C49C", fontWeight: "bold"}}>Наши</span> Статьи</h2>

            <div className="publications-grid">
                {publications.map((pub, index) => (
                    <div key={index} className="publication-card">
                        <div className="card-image" style={{ backgroundImage: `url(${pub.image})` }}></div>
                        <div className="card-content">
                            <div className="trend-badge">Новое</div>
                            <h3 className="card-title">{pub.title}</h3>
                            <div className="card-footer">
                                <span className="read-time">{pub.readTime}</span>
                                <div className="star-icon">
                                    <StarSVG />
                                </div>
                                <span className="rating">{pub.rating}</span>
                                <button className="favorite-button">
                                    <FavouriteSVG />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="all-articles-button">
                <span>Все статьи</span>
                <img src={'../../../../../public/images/svg/arrow-right.svg'} alt="" className="arrow-icon" />
            </div>
        </div>
    );
};

export default PublicationsBanner;