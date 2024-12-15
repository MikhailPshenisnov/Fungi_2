import FilterButtons from "../../components/shared/ui/FilterButtons/FilterButtons.tsx";
import { usePublicationData } from "../../hooks/api/usePublicationData.ts";
import PublicationsCard from "./components/PublicationsCard/PublicationsCard.tsx";
import "./index.css";

import {TPublicationsCard} from "./types.ts";




const Publications = () => {
    const {data: publications, isLoading, error} = usePublicationData();
    
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