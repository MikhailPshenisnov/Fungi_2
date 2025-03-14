import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MushroomCard.css';
import { TMushroomCard } from '../../types';

import { Card } from '@shared/ui/Card';
import { useImgurUrl } from '@shared/hooks';

interface MushroomCardProps {
    mushroom: TMushroomCard;
}

export const MushroomCard: React.FC<MushroomCardProps> = ({ mushroom }) => {
    const navigate = useNavigate();
    const { headerPhotoLink, name, latinName, family, eatable, redBook } =
        mushroom;
    const imageUrl = useImgurUrl(headerPhotoLink);

    const getEdibilityIcon = (eatable: string) => {
        switch (eatable) {
            case 'Да':
                return '/images/svg/mushroom-tags-icons/eatable.svg';
            case 'Нет':
                return '/images/svg/mushroom-tags-icons/not_eatable.svg';
            case 'Полусъедобен':
                return '/images/svg/mushroom-tags-icons/eatable.svg';
            default:
                return '/images/svg/mushroom-tags-icons/eatable.svg';
        }
    };

    const getEdibilityTitle = (eatable: string) => {
        switch (eatable) {
            case 'Да':
                return 'Съедобный гриб';
            case 'Нет':
                return 'Ядовитый гриб';
            case 'Полусъедобен':
                return 'Условно-съедобный гриб';
            default:
                return 'Неизвестно';
        }
    };

    const handleClick = () => {
        navigate(`/encyclopedia/${mushroom.id}`);
    };

    return (
        <Card className="mushroom-card" onClick={handleClick}>
            <img className="mushroom-card__image" src={imageUrl} alt={name} />
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
