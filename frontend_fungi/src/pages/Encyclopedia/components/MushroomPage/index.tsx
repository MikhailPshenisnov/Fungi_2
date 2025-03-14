import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMushroomData } from "../../../../shared/api/useMushroomData";
import "./index.css";
// import arrowIcon from '../../../../assets/icons/arrow-right.svg';

export const MushroomPage: React.FC = () => {
  const navigate = useNavigate();
  const { mushroomId } = useParams<{ mushroomId: string }>();
  const { data: mushrooms } = useMushroomData();

  if (!mushrooms || !mushroomId) {
    return <div>Loading...</div>;
  }

  const mushroom = mushrooms.find((m) => m.id === parseInt(mushroomId));

  if (!mushroom) {
    return <div>Гриб не найден</div>;
  }

  const handleBack = () => {
    navigate("/encyclopedia");
  };

  return (
    <div className="mushroom-page">
      <div className="mushroom-page__content">
        <button className="mushroom-page__back-button" onClick={handleBack}>
          <span>Назад</span>
        </button>

        <div className="mushroom-page_container">
          <h1 className="mushroom-page__title">{mushroom.name}</h1>
          {mushroom.latinName && (
            <h2 className="mushroom-page__subtitle">{mushroom.latinName}</h2>
          )}
        </div>

        <img
          src={mushroom.headerPhotoLink}
          alt={mushroom.name}
          className="mushroom-page__image"
        />

        <div className="mushroom-page__info">
          <div className="mushroom-page__info-item">
            <span className="mushroom-page__info-label">Семейство:</span>
            <span className="mushroom-page__info-value">{mushroom.family}</span>
          </div>
          <div className="mushroom-page__info-item">
            <span className="mushroom-page__info-label">Съедобность:</span>
            <span className="mushroom-page__info-value">
              {mushroom.eatable}
            </span>
          </div>
          {mushroom.redBook && (
            <div className="mushroom-page__info-item">
              <span className="mushroom-page__info-label">Красная книга:</span>
              <span className="mushroom-page__info-value">Да</span>
            </div>
          )}
        </div>

        <div className="mushroom-page__text">
          <div className="mushroom-page__section">
            <h3 className="mushroom-page__section-title">Описание</h3>
            <p className="mushroom-page__paragraph">{mushroom.description}</p>
          </div>

          <div className="mushroom-page__section">
            <h3 className="mushroom-page__section-title">Характеристики</h3>
            <div className="mushroom-page__characteristics">
              {mushroom.hasStem && (
                <div className="mushroom-page__characteristic-group">
                  <h3>Ножка</h3>
                  {mushroom.stemSizeFrom && mushroom.stemSizeTo && (
                    <p>
                      Размер: {mushroom.stemSizeFrom}-{mushroom.stemSizeTo} см
                    </p>
                  )}
                  {mushroom.stemType && <p>Тип: {mushroom.stemType}</p>}
                  {mushroom.stemColor && <p>Цвет: {mushroom.stemColor}</p>}
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

          {mushroom.doppelgangers && mushroom.doppelgangers.length > 0 && (
            <div className="mushroom-page__section">
              <h3 className="mushroom-page__section-title">Грибы-двойники</h3>
              <ul className="mushroom-page__doppelgangers">
                {mushroom.doppelgangers.map((doppelganger, index) => (
                  <li key={index}>{doppelganger.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
