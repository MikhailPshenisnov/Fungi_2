import React, { useState } from 'react';
import './FungiInfo.css';

interface FungiInfoProps {
    hasData?: boolean;
}

export const FungiInfo: React.FC<FungiInfoProps> = ({ hasData = false }) => {
    const [showMore, setShowMore] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);

    const images = [
        '/images/png/mushroom1.png',
        '/images/png/mushroom2.png',
        '/images/png/mushroom3.png',
    ];

    const fungiData = {
        name: 'Лисичка обыкновенная',
        latinName: 'Cantharēllus cibārius',
        basicInfo: [
            {
                label: 'Синонимичные наименования',
                value: 'Лисичка настоящая, Лисичка жёлтая, Петушок',
            },
            { label: 'Семейство', value: 'Лисичковые' },
            { label: 'Двойники', value: 'Лисичка ложная, Ежовик желтый' },
            {
                label: 'Описание гриба',
                value: 'Это распространённый гриб, растёт с начала лета до поздней осени в смешанных, лиственных и хвойных лесах. Особенно часто встречается во мхах и хвойных лесах. Съедобный и вкусный гриб.',
            },
        ],
        additionalInfo: [
            { label: 'Красная книга', value: 'Нет' },
            { label: 'Есть ли ножка', value: 'Да' },
            { label: 'Размер ножки (мм)', value: '10–30' },
            { label: 'Тип ножки', value: 'Утолщенная вверху' },
            {
                label: 'Цвет ножки',
                value: 'Яично-жёлтый, оранжево-жёлтый, беловатый',
            },
            { label: 'Тип шляпки', value: 'Вогнутая' },
            {
                label: 'Цвет шляпки',
                value: 'Яично-жёлтый, оранжево-жёлтый, беловатый',
            },
            { label: 'Под шляпкой', value: 'Пластинчатая' },
        ],
    };

    const toggleShowMore = () => setShowMore(!showMore);
    const nextImage = () =>
        setCurrentImage((prev) => (prev + 1) % images.length);
    const prevImage = () =>
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

    if (!hasData) {
        return (
            <div className="fungi-info">
                <div className="block_header">
                    <div className="header_icon"></div>
                    <h3>КАРТОЧКА ГРИБА</h3>
                </div>

                <div className="fungi-info__area">
                    <div className="fungi-info__empty">
                        Выполните классификацию
                        <br />
                        для отображения результатов
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fungi-info">
            <div className="block_header">
                <div className="header_icon"></div>
                <h3>КАРТОЧКА ГРИБА</h3>
            </div>

            <div className="fungi-info__area">
                <div className="fungi-info__slider">
                    <button
                        className="slider__arrow slider__arrow--left"
                        onClick={prevImage}
                    >
                        ‹
                    </button>

                    <img
                        src={images[currentImage]}
                        alt="Гриб"
                        onError={(e) =>
                            (e.currentTarget.src = '/images/placeholder.jpg')
                        }
                        className="fungi-info__image"
                    />

                    <button
                        className="slider__arrow slider__arrow--right"
                        onClick={nextImage}
                    >
                        ›
                    </button>
                </div>

                <div className="fungi-info__title">
                    <strong>{fungiData.name}</strong> (лат.{' '}
                    {fungiData.latinName})
                </div>

                <div className="fungi-info__content">
                    {fungiData.basicInfo.map((item, index) => (
                        <div key={index} className="fungi-info__item">
                            <span className="fungi-info__label">
                                {item.label}:
                            </span>
                            <span className="fungi-info__value">
                                {item.value}
                            </span>
                        </div>
                    ))}

                    {showMore &&
                        fungiData.additionalInfo.map((item, index) => (
                            <div
                                key={`add-${index}`}
                                className="fungi-info__item"
                            >
                                <span className="fungi-info__label">
                                    {item.label}:
                                </span>
                                <span className="fungi-info__value">
                                    {item.value}
                                </span>
                            </div>
                        ))}
                </div>

                <div className="fungi-info__more">
                    <button
                        className="fungi-info__more-btn"
                        onClick={toggleShowMore}
                    >
                        <span>
                            {showMore ? 'Показать меньше' : 'Показать больше'}
                        </span>
                        <img
                            src="/images/svg/arrow-down.svg"
                            alt="Arrow"
                            className={`fungi-info__arrow ${
                                showMore
                                    ? 'fungi-info__arrow--up'
                                    : 'fungi-info__arrow--down'
                            }`}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};
