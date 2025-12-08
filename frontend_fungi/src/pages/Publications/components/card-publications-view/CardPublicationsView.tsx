import { useNavigate } from 'react-router-dom';
import { PublicationsCard } from '@pages/Publications/components/publications-card/PublicationsCard.tsx';
import './CardPublicationsView.css';
import { IPublications } from '../../../../api/AppApi.ts';

interface Props {
    publications: IPublications[] | undefined;
}

export const CardPublicationsView: React.FC<Props> = ({ publications }) => {
    const navigate = useNavigate();

    const handleCardClick = (id: string) => {
        navigate(`/publications/${id}`);
    };

    return (
        <div className="publications__container2">
            {publications?.map((publication) => (
                <PublicationsCard
                    key={publication.id}
                    card={publication}
                    onClick={() => handleCardClick(publication.id)}
                />
            ))}
        </div>
    );
};
