import { IPublications } from '@pages/publications/model/types.ts';
import { useNavigate } from 'react-router-dom';
import { PublicationsWideCard } from '../publications-wide-card';

interface Props {
    publications: IPublications[] | undefined;
}
export const FullSizePublicationView: React.FC<Props> = ({publications}) => {
    const navigate = useNavigate();

    const handleCardClick = (id: string) => {
        navigate(`/publications/${id}`);
    };

    return (
        <div className="publications__container">
            {publications?.map((publication) => (
                <PublicationsWideCard
                    key={publication.id}
                    card={publication}
                    onClick={() => handleCardClick(publication.id)}
                />
            ))}
        </div>
    );
}