import React from 'react';
import './MushroomBanner.css';
import {EatableSVG, FavouriteSVG, RedbookedSVG} from '@shared/ui';

const MushroomBanner: React.FC = () => {
    const mushrooms = [
        {
            image: '../../../../../public/images/png/mushroom1.png',
            family: 'Болетовые',
            name: 'Подосиновик желто-бурый',
            latin: 'Léccinum versipélle',
            type: 'eatable',
            redBookStatus: 'not-in'
        },
        {
            image: '../../../../../public/images/png/mushroom2.png',
            family: 'Вёшенковые',
            name: 'Вёшенка устричная',
            latin: 'Pleurotus ostreatus',
            type: 'eatable',
            redBookStatus: 'not-in'
        },
        {
            image: '../../../../../public/images/png/mushroom3.png',
            family: 'Аманитовые',
            name: 'Мухомор красный',
            latin: 'Amanita muscaria',
            type: 'not_eatable',
            redBookStatus: 'not-in'
        },
        {
            image: '../../../../../public/images/png/mushroom4.png',
            family: 'Масленковые',
            name: 'Маслёнок желто-бурый',
            latin: 'Suillus variegatus',
            type: 'eatable',
            redBookStatus: 'not-in'
        },
        {
            image: '../../../../../public/images/png/mushroom4.png',
            family: 'Масленковые',
            name: 'Маслёнок желто-бурый',
            latin: 'Suillus variegatus',
            type: 'eatable',
            redBookStatus: 'not-in'
        }
    ];

    return (
        <div className="mushroom-banner">
            <h2 className="mushroom-title">Наши <span style={{color: "#E6C49C", fontWeight: "bold"}}>Грибы</span></h2>

            <div className="mushroom-grid">
                {mushrooms.map((mushroom, index) => (
                    <div key={index} className="mushroom-card">
                        <div
                            className="mushroom-image"
                            style={{ backgroundImage: `url(${mushroom.image})` }}
                        >
                            <button className="favourite-button">
                                <FavouriteSVG />
                            </button>
                        </div>
                        <div className="mushroom-content">
                            <div className="mushroom-family">{mushroom.family}</div>
                            <h3 className="mushroom-name">{mushroom.name}</h3>
                            <p className="mushroom-latin">{mushroom.latin}</p>
                            <div className="mushroom-icons">
                                <RedbookedSVG redBookStatus={mushroom.redBookStatus} />
                                <EatableSVG type={mushroom.type} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="all-mushrooms-button">
                <span>Все грибы</span>
                <img src={'../../../../../public/images/svg/arrow-right.svg'} alt="" className="arrow-icon" />
            </button>
        </div>
    );
};

export default MushroomBanner;