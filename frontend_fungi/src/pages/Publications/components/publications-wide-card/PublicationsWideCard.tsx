import React from 'react';
import { FC } from 'react';
import './PublicationsWideCard.css';
import { IPublicationsCardProps } from '@pages/publications/model/types.ts';

export const PublicationsWideCard: FC<IPublicationsCardProps> = ({
    card,
    onClick,
}) => {
    const handleImageError = (
        e: React.SyntheticEvent<HTMLImageElement, Event>
    ) => {
        e.currentTarget.src = '/images/png/alt-card-image.png';
    };

    return (
        <div className="publications-card" onClick={onClick}>
            <img
                className="publications-card__image"
                src={card.headerPhotoLink}
                alt={card.title}
                onError={handleImageError}
            />
            <div className="publications-card__info">
                <h2 className="publications-card__title">{card.title}</h2>
                <p className="publications-card__text">
                    {card.paragraphs || 'читать статью......'}
                </p>
                <p className="publications-card__author">
                    Автор статьи: {card.author}
                </p>
            </div>
        </div>
    );
};
