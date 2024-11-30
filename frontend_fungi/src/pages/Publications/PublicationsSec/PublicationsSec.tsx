import FilterButtons from "../../../components/FilterButtons/FilterButtons.tsx";
// import SortDropdown from "../../components/SortDropdown/SortDropdown.tsx";
import "./PublicationsSec.css";
import PublicationsSecCard from "../PublicationsSecCard/PublicationSecCard.tsx";

import {TPuplicationsCard} from "../types.ts";




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
    ];


    return (
        <div className="conteinerSec">
            
            <div className="publicationsSec">
                <FilterButtons targetPath="/publications"/>
                <div className="publicationsSecConteiner">
                    {publications.map(publication => (
                        <PublicationsSecCard card={publication} />
                    ))}
                </div>
                <div className="publicationsSecConteiner">
                    {publications.map(publication => (
                        <PublicationsSecCard card={publication} />
                    ))}
                </div>
                
            </div>
        </div>
            
    );
}

export default Publications;