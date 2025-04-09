import { IPublications } from '../../model/types.ts';
import { PublicationsCard } from '../publications-card';
import { Pagination } from '@modules/Pagination';
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
                <PublicationsCard
                    key={publication.id}
                    card={publication}
                    onClick={() => handleCardClick(publication.id)}
                />
            )}
        />
    );
};
