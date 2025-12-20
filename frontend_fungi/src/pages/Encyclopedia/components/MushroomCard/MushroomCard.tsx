import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MushroomCard.css';


import { Card } from '@pages/Components/Card';
import { IMushroom } from '../../../../api/AppApi.ts';
import { useImgurUrl } from '../../../../redux/hooks/useImgurUrl.ts';


interface MushroomCardProps {
    mushroom: IMushroom;
}

export const MushroomCard: React.FC<MushroomCardProps> = ({ mushroom }) => {
    const navigate = useNavigate();
    const { name, latinName, family, eatable, redBook } =
        mushroom;

    const imgurUrl = useImgurUrl(mushroom ? mushroom.headerPhotoLink : '');

    const handleImageError = (
        e: React.SyntheticEvent<HTMLImageElement, Event>
    ) => {
        e.currentTarget.src = '/images/png/alt-card-image.png';
    };

    const getEdibilityIcon = (eatable: string) => {
        switch (eatable) {
            case 'Съедобный':
                return '/images/svg/mushroom-tags-icons/eatable.svg';
            case 'Несъедобный':
                return '/images/svg/mushroom-tags-icons/not_eatable.svg';
            case 'Полусъедобный':
                return '/images/svg/mushroom-tags-icons/eatable.svg';
            default:
                return '/images/svg/mushroom-tags-icons/eatable.svg';
        }
    };

    const getEdibilityTitle = (eatable: string) => {
        switch (eatable) {
            case 'Съедобный':
                return 'Съедобный гриб';
            case 'Несъедобный':
                return 'Ядовитый гриб';
            case 'Полусъедобный':
                return 'Условно-съедобный гриб';
            default:
                return 'Неизвестно';
        }
    };

    const handleClick = () => {
        navigate(`/encyclopedia/${mushroom.id}`);
    };

    return (
        <Card className="mushroom-card2" onClick={handleClick}>

            <img className="mushroom-card__image" src={imgurUrl} alt={name} onError={handleImageError} />
            <div className="mushroom-card__content">
                <div className="mushroom-card__header">
                    <p className="mushroom-card__family">{family}</p>
                    <h3 className="mushroom-card__title">{name}</h3>
                    <p className="mushroom-card__latin">{latinName}</p>
                </div>
                <div className="mushroom-card__icons">
                    <img
                        src={getEdibilityIcon(eatable)}
                        alt={getEdibilityTitle(eatable)}
                        title={getEdibilityTitle(eatable)}
                        className="mushroom-card__edibility-icon"
                    />
                    {redBook ? (
                        <img
                            src="/images/svg/mushroom-tags-icons/redbooked.svg"
                            alt="Занесён в красную книгу"
                        />
                    ) : (
                        <img
                            src="/images/svg/mushroom-tags-icons/not_redbooked.svg"
                            alt="Не занесён в красную книгу"
                        />
                    )}
                </div>
            </div>
        </Card>
    );
};
