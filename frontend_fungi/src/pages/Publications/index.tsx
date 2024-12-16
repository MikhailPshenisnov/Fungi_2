import FilterButtons from "../../components/shared/ui/FilterButtons/FilterButtons.tsx";
import SortDropdown from "../../components/shared/ui/SortDropdown/SortDropdown.tsx";
import { usePublicationData } from "../../hooks/api/usePublicationData.ts";
import PublicationsCard from "./components/PublicationsCard/PublicationsCard.tsx";
import "./index.css";
import { useNavigate } from "react-router-dom";

const Publications = () => {
    const {data: publications, isLoading, error} = usePublicationData();
    const navigate = useNavigate();

    const handleCardClick = (id: string) => {
        navigate(`/publications/${id}`);
    };
    
    return (
        <div className="publications">
            <div className="publications__wrapper">
                <FilterButtons targetPath="/publications-sec" buttonComponent={<SortDropdown />}/>
                <div className="publications__container">
                    {publications?.map(publication => (
                        <PublicationsCard 
                            key={publication.id}
                            card={publication} 
                            onClick={() => handleCardClick(publication.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Publications;