import React from "react";
import "./index.css";
import { TPuplicationsCard} from "../types.ts";

interface IPublicationsCard {
    card: TPuplicationsCard
};

const PublicationsSecCard: React.FC<IPublicationsCard> = (card : TPuplicationsCard) => {

    return (
            <div className="publication-card">
                <img src={card.src} alt="image1" />
                <div className="publication-info">
                    <h3>{card.title}</h3>
                    <p>Автор статьи:{card.author}</p>
                </div>
            </div>
    );
}

export default PublicationsSecCard;