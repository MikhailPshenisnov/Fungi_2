import FilterButtons from "../../../components/FilterButtons/FilterButtons.tsx";
// import SortDropdown from "../../components/SortDropdown/SortDropdown.tsx";
import "./PublicationsSec.css";
import PublicationsSecCard from "../PublicationsSecCard/PublicationSecCard.tsx";
import { TPublicationsCard } from "../types.ts"




const Publications = () => {
    const publications: TPublicationsCard[] = [
        {
            title: "Интригующий заголовок",
            src: "https://example.com/images/tech.jpg",
            author: "Иван Иванов",
        },
        {
            title: "Интригующий заголовок",
            src: "https://example.com/images/eco.jpg",
            author: "Мария Петрова",
        },
        {
            title: "Интригующий заголовок",
            src: "https://example.com/images/crypto.jpg",
            author: "Алексей Смирнов",
        },
        {
            title: "Интригующий заголовок",
            src: "https://example.com/images/travel.jpg",
            author: "Ольга Кузнецова",
        },
    ];


    return (
        <div className="conteiner-sec">
            
            <div className="publications-sec">
                <FilterButtons targetPath="/publications"/>
                <div className="special-publications-conteiner">
                    <h1>Собрали специально для вас!</h1>
                    <div className="publications-sec-conteiner">
                        {publications.map(publication => (
                            <PublicationsSecCard card={publication} />
                        ))}
                        <button className="next-button">
                            <h2>Больше статей</h2>
                            <img src="./images/arrow.svg" alt="" />
                        </button>
                    </div>
                </div>
                <div className="section-publication-conteiner">
                    <h1>Заголовок раздела</h1>
                    <div className="publications-sec-conteiner">
                        {publications.map(publication => (
                            <PublicationsSecCard card={publication} />
                        ))}
                        <button className="next-button">
                            <h2>Больше статей</h2>
                            <img src="./images/arrow.svg" alt="" />
                        </button>
                    </div>
                </div>
                
                
            </div>
        </div>
            
    );
}

export default Publications;