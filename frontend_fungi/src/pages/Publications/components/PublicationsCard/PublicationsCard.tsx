import React from "react";
import "./index.css";
import { IPublications } from "../../types.ts";

interface IPublicationsCard {
    card: IPublications
};

const PublicationsCard: React.FC<IPublicationsCard> = ({card}) => {

    return (
            <div className="publications-card">
                <img className="publications-card__image" src={card.headerPhotoLink}  />
                <div className="publications-card__info">
                    <h3 className="publications-card__title">{card.title}</h3>
                    <p className="publications-card__text">{card.paragraphs[0]?.paragraphText || "читать статью......"}</p>
                    <p className="publications-card__author">Автор статьи: {card.authorString}</p>
                </div>
            </div>
    );
}

export default PublicationsCard;