import React from "react";
import "./MushroomCard.css";
import { Card } from "../../../../components/shared/ui/base/Card/Card";
import { TMushroomCard } from "../../types";

interface MushroomCardProps {
    mushroom: TMushroomCard;
    onClick?: () => void;
}

export const MushroomCard: React.FC<MushroomCardProps> = ({ 
    mushroom,
    onClick 
}) => {
    const { imageUrl, russianName, latinName, family, isEdible, isRedBook } = mushroom;

    return (
        <Card className="mushroom-card" onClick={onClick}>
            <img 
                className="mushroom-card__image" 
                src="/images/png/mushrom-card.png" 
                alt={russianName} 
            />
            <div className="mushroom-card__content">
                <div className="mushroom-card__header">
                    <h3 className="mushroom-card__title">{russianName}</h3>
                    <div className="mushroom-card__icons">
                        {isEdible && (
                            <img 
                                src="/images/svg/edible-icon.svg" 
                                alt="Съедобный гриб"
                                title="Съедобный гриб"
                            />
                        )}
                        {isRedBook && (
                            <img 
                                src="/images/svg/red-book-icon.svg" 
                                alt="Занесён в красную книгу"
                                title="Занесён в красную книгу"
                            />
                        )}
                    </div>
                </div>
                <p className="mushroom-card__latin">{latinName}</p>
                <p className="mushroom-card__family">Семейство: {family}</p>
            </div>
        </Card>
    );
};
