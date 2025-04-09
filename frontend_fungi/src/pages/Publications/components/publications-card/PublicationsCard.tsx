import React, { FC } from 'react';
import { Card } from '@shared/ui/Card';
import { IPublicationsCardProps } from '../../model/types.ts';
import './PublicationsCard.css';

export const PublicationsCard: FC<IPublicationsCardProps> = ({
    card,
    onClick,
}) => {
    const handleImageError = (
        e: React.SyntheticEvent<HTMLImageElement, Event>
    ) => {
        e.currentTarget.src = '/images/png/alt-card-image.png';
    };

    return (
        <Card className="publication-sec-card" onClick={onClick}>
            <img
                className="publication-sec-card__image"
                src={card.headerPhotoLink}
                alt={card.title}
                onError={handleImageError}
            />
            <div className="publication-info">
                <h3 className="publications-sec-card__title">{card.title}</h3>
                <p>читать продолжение в источнике...</p>
            </div>
        </Card>
    );
};
