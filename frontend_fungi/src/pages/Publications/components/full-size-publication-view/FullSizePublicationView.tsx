import PublicationsCard from '@pages/publications/components/PublicationsCard/PublicationsCard.tsx';
import { IPublications } from '@pages/publications/types.ts';
import { useNavigate } from 'react-router-dom';

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
                <PublicationsCard
                    key={publication.id}
                    card={publication}
                    onClick={() => handleCardClick(publication.id)}
                />
            ))}
        </div>
    );
}