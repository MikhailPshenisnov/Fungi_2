import SortDropdown from "../../components/SortDropdown/SortDropdown.tsx";
import "./index.css";
import PublicationsCard from "./PublicationsCard/PublicationsCard.tsx";
import {TPuplicationsCard} from "./types.ts";




const Publications = () => {
    const publications: TPuplicationsCard[] = [
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
        <div className="conteiner">
            
            <div className="publications">
                <div className="bottonsConteiner">
                    <img src="" alt="" />
                    <SortDropdown/>
                </div>
                <div className="publicationsConteiner">
                    {publications.map(publication => (
                        <PublicationsCard card={publication} />
                    ))}
                </div>
                <div className="publicationsConteiner">
                    {publications.map(publication => (
                        <PublicationsCard card={publication} />
                    ))}
                </div>
                
            </div>
        </div>
            
    );
}

export default Publications;