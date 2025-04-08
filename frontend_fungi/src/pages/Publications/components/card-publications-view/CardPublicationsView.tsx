import { IPublications } from '../../model/types.ts';
import { PublicationsWideCard } from '../publications-wide-card';
import { Pagination } from "@modules/Pagination";
import { useNavigate } from 'react-router-dom';

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
                <PublicationsWideCard
                    key={publication.id}
                    card={publication}
                    onClick={() => handleCardClick(publication.id)}
                />
            )}
        />
    );
}