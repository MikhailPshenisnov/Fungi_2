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
                    <p className="mushroom-card__family">{family}</p>
                    <h3 className="mushroom-card__title">{russianName}</h3>
                    <p className="mushroom-card__latin">{latinName}</p>
                </div>
                <div className="mushroom-card__icons">
                        {isEdible ? (
                            <img 
                                src="/images/svg/mushroom-tags-icons/eatable.svg" 
                                alt="Съедобный гриб"
                            />
                        ) : (
                            <img 
                                src="/images/svg/mushroom-tags-icons/not_eatable.svg" 
                                alt="Несъедобный гриб"
                            />
                        )}
                        {isRedBook ? (
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
