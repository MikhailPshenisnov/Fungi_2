import React from 'react';
import './MushroomBanner.css';

const MushroomBanner: React.FC = () => {
    const mushrooms = [
        {
            image: '../../../../../public/images/png/mushroom1.png',
            family: 'Болетовые (Boletaceae)',
            name: 'Подосиновик желто-бурый',
            latin: 'Léccinum versipélle',
            type: 'edible',
            redBookStatus: 'not-in'
        },
        {
            image: '../../../../../public/images/png/mushroom2.png',
            family: 'Вёшенковые',
            name: 'Вёшенка устричная',
            latin: 'Pleurotus ostreatus',
            type: 'edible',
            redBookStatus: 'not-in'
        },
        {
            image: '../../../../../public/images/png/mushroom3.png',
            family: 'Аманитовые',
            name: 'Мухомор красный',
            latin: 'Amanita muscaria',
            type: 'poisonous',
            redBookStatus: 'not-in'
        },
        {
            image: '../../../../../public/images/png/mushroom4.png',
            family: 'Масленковые',
            name: 'Маслёнок желто-бурый',
            latin: 'Suillus variegatus',
            type: 'edible',
            redBookStatus: 'not-in'
        }
    ];

    return (
        <div className="mushroom-banner">
            <h2 className="mushroom-title">Наши <span style={{color: "#B28550", fontWeight: "bold"}}>Грибы</span></h2>

            <div className="mushroom-grid">
                {mushrooms.map((mushroom, index) => (
                    <div key={index} className="mushroom-card">
                        <div
                            className="mushroom-image"
                            style={{ backgroundImage: `url(${mushroom.image})` }}
                        ></div>
                        <div className="mushroom-content">
                            <p className="mushroom-family">{mushroom.family}</p>
                            <h3 className="mushroom-name">{mushroom.name}</h3>
                            <p className="mushroom-latin">{mushroom.latin}</p>
                            <div className="mushroom-icons">
                                <img
                                    src={mushroom.type === 'edible' ? '../../../../../public/images/svg/eatable.svg' : '../../../../../public/images/svg/not_eatable.svg'}
                                    alt={mushroom.type === 'edible' ? 'Съедобный' : 'Ядовитый'}
                                    className="mushroom-icon"
                                />
                                <img
                                    src={mushroom.redBookStatus === 'in' ? '../../../../../public/images/svg/redbooked.svg' : '../../../../../public/images/svg/not_redbooked.svg'}
                                    alt={mushroom.redBookStatus === 'in' ? 'В Красной книге' : 'Не в Красной книге'}
                                    className="mushroom-icon"
                                    data-status={mushroom.redBookStatus}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="all-mushrooms-button">
                <span>Все грибы</span>
                <img src={'../../../../../public/images/svg/arrow-right.svg'} alt="" className="arrow-icon" />
            </div>
        </div>
    );
};

export default MushroomBanner;