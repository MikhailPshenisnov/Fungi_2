import React from "react";
import "./index.css";
import { TPublicationsCard} from "../types.ts";

interface IPublicationsCard {
    card: TPublicationsCard
};

const PublicationsSecCard: React.FC<IPublicationsCard> = ({card}) => {

    return (
            <div className="publication-sec-card">
                <img className="publication-sec-card__image" src="./images/alt-card-image.png" alt="image1" />
                <div className="publication-info">
                    <h3>{card.title}</h3>
                    <p>читать продолжение в источнике</p>
                </div>
            </div>

            
    );
}

export default PublicationsSecCard;