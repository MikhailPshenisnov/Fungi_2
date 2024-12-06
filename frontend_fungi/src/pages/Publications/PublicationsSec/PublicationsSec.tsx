import FilterButtons from "../../../components/FilterButtons/FilterButtons.tsx";
// import SortDropdown from "../../components/SortDropdown/SortDropdown.tsx";
import "./PublicationsSec.css";
import PublicationsSecCard from "../PublicationsSecCard/PublicationSecCard.tsx";
import { TPublicationsCard } from "../types.ts"




const Publications = () => {
    const publications: TPublicationsCard[] = [
        {
            title: "Инновации в мире технологий",
            src: "https://example.com/images/tech.jpg",
            text: "В современном мире технологии развиваются с невероятной скоростью. Искусственный интеллект, квантовые компьютеры и роботизация становятся неотъемлемой частью нашей жизни. В этой статье мы рассмотрим последние достижения в области технологий и их влияние на различные сферы нашей жизни, от медицины до повседневного быта.",
            author: "Иван Иванов"
        },
        {
            title: "Экоустойчивость: будущее планеты",
            src: "https://example.com/images/eco.jpg",
            text: "Климатические изменения становятся все более очевидными, и мировое сообщество активно ищет пути решения экологических проблем. От возобновляемых источников энергии до zero-waste движения - каждый может внести свой вклад в сохранение окружающей среды. Узнайте о последних инновациях в области экологической устойчивости.",
            author: "Мария Петрова"
        },
        {
            title: "Путешествия по Европе на поезде",
            src: "https://example.com/images/travel.jpg",
            text: "Путешествие по Европе на поезде - это уникальный опыт, позволяющий увидеть множество стран и культур. От живописных альпийских маршрутов до скоростных экспрессов между столицами - каждое путешествие становится незабываемым приключением. Делимся практическими советами и лучшими маршрутами для железнодорожного путешествия.",
            author: "Ольга Кузнецова"
        },
        {
            title: "Искусственный интеллект и его применение",
            src: "https://example.com/images/ai.jpg",
            text: "Искусственный интеллект находит все новые применения в различных областях: от медицинской диагностики до автоматизации производства. Рассмотрим последние достижения в области ИИ, этические вопросы его использования и перспективы развития этой технологии в ближайшем будущем.",
            author: "Дмитрий Соколов"
        }
    ];


    return (
        <div className="conteiner-sec">
            
            <div className="publications-sec">
                <FilterButtons targetPath="/publications"/>
                <div className="special-publications-conteiner">
                    <h1 className="publications-sec__title" >Собрали специально для вас!</h1>
                    <div className="publications-sec-conteiner">
                        {publications.map(publication => (
                            <PublicationsSecCard card={publication} />
                        ))}
                        <button className="next-button">
                            <h2>Больше статей</h2>
                            <img src="/images/svg/arrow.svg" alt="" />
                        </button>
                    </div>
                </div>
                <div className="section-publication-conteiner">
                    <h1 className="publications-sec__title" >Заголовок раздела</h1>
                    <div className="publications-sec-conteiner">
                        {publications.map(publication => (
                            <PublicationsSecCard card={publication} />
                        ))}
                        <button className="next-button">
                            <h2>Больше статей</h2>
                            <img src="/images/svg/arrow.svg" alt="" />
                        </button>
                    </div>
                </div>
                
                
            </div>
        </div>
            
    );
}

export default Publications;