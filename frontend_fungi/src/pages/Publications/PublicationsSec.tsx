import './PublicationsSec.css';
import PublicationsSecCard from './components/PublicationsSecCard/PublicationSecCard.tsx';
import { useNavigate } from 'react-router-dom';
import { usePublicationData } from '@shared/hooks/usePublicationData.ts';
import { FilterButtons, SortDropdown } from '@shared/ui/index.ts';
import { Pagination } from '@modules/Pagination';

const Publications = () => {
    const { data: publications } = usePublicationData();
    const navigate = useNavigate();

    const handleCardClick = (id: string) => {
        navigate(`/publications/${id}`);
    };


    return (
        <div className="conteiner-sec">
            <div className="publications-sec">
                <FilterButtons
                    targetPath="/publications"
                    buttonComponent={<SortDropdown />}
                />
                <Pagination
                    data={publications}
                    tittle={'Рекомендуем к прочтению'}
                    itemsPerPage={15}
                    card={(publication) => (
                        <PublicationsSecCard
                            key={publication.id}
                            card={publication}
                            onClick={() => handleCardClick(publication.id)}
                        />
                    )}
                />
            </div>
        </div>
    );
};

export default Publications;
