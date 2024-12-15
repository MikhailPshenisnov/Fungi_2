import React from "react";
import "./index.css";
import { IPublications } from "../../types";
import { Card } from "../../../../components/shared/ui/base/Card/Card";

interface IPublicationsCard {
    card: IPublications;
    onClick?: () => void;
}

const PublicationsSecCard: React.FC<IPublicationsCard> = ({ card, onClick }) => {
    return (
        <Card className="publication-sec-card" onClick={onClick}>
            <img 
                className="publication-sec-card__image" 
                src="/images/png/alt-card-image.png" 
                alt="image1" 
            />
            <div className="publication-info">
                <h3 className="publications-sec-card__title">{card.title}</h3>
                <p>читать продолжение в источнике...</p>
            </div>
        </Card>
    );
}

export default PublicationsSecCard;