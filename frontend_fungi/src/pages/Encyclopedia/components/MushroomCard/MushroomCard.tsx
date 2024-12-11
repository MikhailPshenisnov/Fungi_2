import React from "react";
import "./MushroomCard.css";
import { Card } from "../../../../components/shared/ui/base/Card/Card";
import { TMushroomCard } from "../../types";
import { useImgurUrl } from "../../../../hooks/common/useImgurUrl";

interface MushroomCardProps {
    mushroom: TMushroomCard;
    onClick?: () => void;
}

export const MushroomCard: React.FC<MushroomCardProps> = ({ 
    mushroom,
    onClick 
}) => {
    const { headerPhotoLink, name, latinName, family, eatable, redBook } = mushroom;
    const imageUrl = useImgurUrl(headerPhotoLink);

    return (
        <Card className="mushroom-card" onClick={onClick}>
            <img 
                className="mushroom-card__image"
                src={imageUrl}
                alt={name} 
            />
            <div className="mushroom-card__content">
                <div className="mushroom-card__header">
                    <p className="mushroom-card__family">{family}</p>
                    <h3 className="mushroom-card__title">{name}</h3>
                    <p className="mushroom-card__latin">{latinName}</p>
                </div>
                <div className="mushroom-card__icons">
                        {eatable === "Да" ? (
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
