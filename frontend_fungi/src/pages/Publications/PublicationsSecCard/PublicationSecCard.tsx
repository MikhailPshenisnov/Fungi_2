import React from "react";
import "./index.css";
import { TPublicationsCard} from "../types.ts";

interface IPublicationsCard {
    card: TPublicationsCard
};

const PublicationsSecCard: React.FC<IPublicationsCard> = (card : TPublicationsCard) => {

    return (
            <div className="publication-sec-card">
                <img src="./images/card.png" alt="image1" />
                <div className="publication-info">
                    <h3>{card.title}</h3>
                    <p>Автор статьи:{card.author}</p>
                </div>
            </div>

            
    );
}

export default PublicationsSecCard;