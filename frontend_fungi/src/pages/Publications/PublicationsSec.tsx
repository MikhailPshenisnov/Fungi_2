import FilterButtons from "../../components/shared/ui/FilterButtons/FilterButtons.tsx";
import SortDropdown from "../../components/shared/ui/SortDropdown/SortDropdown.tsx";
import { usePublicationData } from "../../hooks/api/usePublicationData.ts";
import "./PublicationsSec.css";
import PublicationsSecCard from "./components/PublicationsSecCard/PublicationSecCard.tsx";
import { useNavigate } from "react-router-dom";

const Publications = () => {
    const {data: publications, isLoading, error} = usePublicationData();
    const navigate = useNavigate();

    const handleCardClick = (id: string) => {
        navigate(`/publications/${id}`);
    };

    // Получаем последние 4 статьи для второго раздела
    const recentPublications = publications?.slice(-4).reverse();

    return (
        <div className="conteiner-sec">
            <div className="publications-sec">
                <FilterButtons targetPath="/publications" buttonComponent={<SortDropdown />}/>
                <div className="special-publications-conteiner">
                    <h1 className="publications-sec__title" >Собрали специально для вас!</h1>
                    <div className="publications-sec-conteiner">
                        {publications?.slice(0, 4).map((publication) => (
                            <PublicationsSecCard 
                                key={publication.id}
                                card={publication} 
                                onClick={() => handleCardClick(publication.id)}
                            />
                        ))}
                        <button className="next-button">
                            <h2>Больше статей</h2>
                            <img src="/images/svg/arrow.svg" alt="" />
                        </button>
                    </div>
                </div>
                <div className="section-publication-conteiner">
                    <h1 className="publications-sec__title" >Недавние публикации</h1>
                    <div className="publications-sec-conteiner">
                        {recentPublications?.map((publication) => (
                            <PublicationsSecCard 
                                key={publication.id}
                                card={publication} 
                                onClick={() => handleCardClick(publication.id)}
                            />
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