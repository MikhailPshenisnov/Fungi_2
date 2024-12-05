import FilterButtons from "../../components/FilterButtons/FilterButtons.tsx";
import "./index.css";
import PublicationsCard from "./PublicationsCard/PublicationsCard.tsx";
import {TPublicationsCard} from "./types.ts";




const Publications = () => {
    const publications: TPublicationsCard[] = [
        {
            title: "Инновации в мире технологий",
            src: "https://example.com/images/tech.jpg",
            author: "Иван Иванов",
        },
        {
            title: "Экоустойчивость: будущее планеты",
            src: "https://example.com/images/eco.jpg",
            author: "Мария Петрова",
        },
        {
            title: "Криптовалюты и блокчейн: новый тренд",
            src: "https://example.com/images/crypto.jpg",
            author: "Алексей Смирнов",
        },
        {
            title: "Путешествия по Европе на поезде",
            src: "https://example.com/images/travel.jpg",
            author: "Ольга Кузнецова",
        },
        {
            title: "Искусственный интеллект и его применение",
            src: "https://example.com/images/ai.jpg",
            author: "Дмитрий Соколов",
        },
    ];


    return (
        <div className="publications">
            <div className="publications__wrapper">
                <FilterButtons targetPath="/publications-sec"/>
                <div className="publications__container">
                    {publications.map(publication => (
                        <PublicationsCard card={publication} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Publications;