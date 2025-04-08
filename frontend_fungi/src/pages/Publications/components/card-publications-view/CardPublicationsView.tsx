import { Pagination } from "@modules/Pagination";
import { useNavigate } from 'react-router-dom';
import { IPublications } from '@pages/publications/types.ts';
import PublicationsSecCard from '@pages/publications/components/PublicationsSecCard/PublicationSecCard.tsx';

interface Props {
    publications: IPublications[] | undefined;
}

export const CardPublicationsView: React.FC<Props> = ({ publications }) => {
    const navigate = useNavigate();

    const handleCardClick = (id: string) => {
        navigate(`/publications/${id}`);
    };

    return (
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
    );
}