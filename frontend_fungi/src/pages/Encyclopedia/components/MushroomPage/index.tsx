import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './index.css';
import { getMushrooms, IMushroom } from '../../../../api/AppApi.ts';
import { mockMushrooms } from '../../../../const/mock/mushrooms.ts';
import { useImgurUrl } from '../../../../redux/hooks/useImgurUrl.ts';

export const MushroomPage: React.FC = () => {
    const navigate = useNavigate();
    const { mushroomId } = useParams();
    const [mushrooms, setMushrooms] = useState<IMushroom[]>([]);
    const mushrooms2 = mockMushrooms;

    useEffect(() => {
        (async () => {
            const data = await getMushrooms();
            setMushrooms(data);
        })();
    }, []);

    const handleImageError = (
        e: React.SyntheticEvent<HTMLImageElement, Event>
    ) => {
        e.currentTarget.src = '/images/png/alt-card-image.png';
    };


    // if (!mushrooms || !mushroomId) {
    //     return <div>Loading...</div>;
    // }

    let mushroom = mushrooms.find((m) => m.id === mushroomId);

    const mushroom2 = mushrooms2.find((m) => m.id === mushroomId);

    const imgurUrl = useImgurUrl(mushroom ? mushroom.headerPhotoLink : (mushroom2 ? mushroom2.headerPhotoLink : ''));

    const handleBack = () => {
        navigate('/encyclopedia');
    };

    if (!mushroom && !mushroom2) {
        return (
            <div className="publication-page-not-found">
                <h2 className="publication-not-found-text">Гриб не найден</h2>
                <button
                    onClick={handleBack}
                    className="publication-page__back-button"
                >
                    <img src="/images/svg/arrow.svg" alt="Назад" />
                    <span>Назад</span>
                </button>
            </div>
        );
    }
    else if (!mushroom && mushroom2) {
        mushroom = mushroom2;
    }

    return (
        <div className="mushroom-page">
            <div className="mushroom-page__content">
                <button
                    className="mushroom-page__back-button"
                    onClick={handleBack}
                >
                    <span>Назад</span>
                </button>

                <div className="mushroom-page_container">
                    <h1 className="mushroom-page__title">{mushroom.name}</h1>
                    {mushroom.latinName && (
                        <h2 className="mushroom-page__subtitle">
                            {mushroom.latinName}
                        </h2>
                    )}
                </div>

                <img
                    src={imgurUrl}
                    alt={mushroom.name}
                    onError={handleImageError}
                    className="mushroom-page__image"
                />

                <div className="mushroom-page__info">
                    <div className="mushroom-page__info-item">
                        <span className="mushroom-page__info-label">
                            Семейство:
                        </span>
                        <span className="mushroom-page__info-value">
                            {mushroom.family}
                        </span>
                    </div>
                    <div className="mushroom-page__info-item">
                        <span className="mushroom-page__info-label">
                            Съедобность:
                        </span>
                        <span className="mushroom-page__info-value">
                            {mushroom.eatable}
                        </span>
                    </div>
                    {mushroom.redBook && (
                        <div className="mushroom-page__info-item">
                            <span className="mushroom-page__info-label">
                                Красная книга:
                            </span>
                            <span className="mushroom-page__info-value">
                                Да
                            </span>
                        </div>
                    )}
                </div>

                <div className="mushroom-page__text">
                    <div className="mushroom-page__section">
                        <h3 className="mushroom-page__section-title">
                            Описание
                        </h3>
                        <p className="mushroom-page__paragraph">
                            {mushroom.description}
                        </p>
                    </div>

                    <div className="mushroom-page__section">
                        <h3 className="mushroom-page__section-title">
                            Характеристики
                        </h3>
                        <div className="mushroom-page__characteristics">
                            {mushroom.hasStem && (
                                <div className="mushroom-page__characteristic-group">
                                    <h3>Ножка</h3>
                                    {mushroom.stemSizeFrom &&
                                        mushroom.stemSizeTo && (
                                            <p>
                                                Размер: {mushroom.stemSizeFrom}-
                                                {mushroom.stemSizeTo} см
                                            </p>
                                        )}
                                    {mushroom.stemType && (
                                        <p>Тип: {mushroom.stemType}</p>
                                    )}
                                    {mushroom.stemColor && (
                                        <p>Цвет: {mushroom.stemColor}</p>
                                    )}
                                </div>
                            )}
                            <div className="mushroom-page__characteristic-group">
                                <h3>Шляпка</h3>
                                <p>Тип: {mushroom.capType}</p>
                                <p>Цвет: {mushroom.capColor}</p>
                                <p>Нижняя часть: {mushroom.capUndersideType}</p>
                            </div>
                        </div>
                    </div>

                    {mushroom.doppelgangers &&
                        mushroom.doppelgangers.length > 0 && (
                            <div className="mushroom-page__section">
                                <h3 className="mushroom-page__section-title">
                                    Грибы-двойники
                                </h3>
                                <ul className="mushroom-page__doppelgangers">
                                    {mushroom.doppelgangers.map(
                                        (doppelganger, index) => (
                                            <li key={index}>
                                                {doppelganger.doppelgangerName}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
};
