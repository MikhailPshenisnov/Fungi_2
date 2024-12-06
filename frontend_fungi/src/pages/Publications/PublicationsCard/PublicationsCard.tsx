import React from "react";
import "./index.css";
import { TPublicationsCard } from "../types.ts";

interface IPublicationsCard {
    card: TPublicationsCard
};

const PublicationsCard: React.FC<IPublicationsCard> = ({card}) => {

    return (
            <div className="publications-card">
                <img className="publications-card__image" src='./images/alt-card-image.png'  />
                <div className="publications-card__info">
                    <h3 className="publications-card__title">{card.title}</h3>
                    <p className="publications-card__text">{card.text}</p>
                    <p className="publications-card__author">Автор статьи: {card.author}</p>
                </div>
            </div>
    );
}

export default PublicationsCard;