import PublicationsCard from './components/PublicationsCard/PublicationsCard.tsx';
import './index.css';
import { useNavigate } from 'react-router-dom';
import { usePublicationData } from '@shared/hooks/usePublicationData.ts';
import { FilterButtons, SortDropdown } from '@shared/ui/index.ts';

const Publications = () => {
    const { data: publications } = usePublicationData();
    const navigate = useNavigate();

    const handleCardClick = (id: string) => {
        navigate(`/publications/${id}`);
    };

    return (
        <div className="publications">
            <div className="publications__wrapper">
                <FilterButtons
                    targetPath="/publications-sec"
                    buttonComponent={<SortDropdown />}
                />
                <div className="publications__container">
                    {publications?.map((publication) => (
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
};

export default Publications;
