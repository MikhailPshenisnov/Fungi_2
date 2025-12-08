import { useNavigate } from 'react-router-dom';
import { PublicationsWideCard } from '@pages/Publications/components/publications-wide-card/PublicationsWideCard.tsx';
import './FullSizePublicationView.css';
import { IPublications } from '../../../../api/AppApi.ts';


interface Props {
    publications: IPublications[] | undefined;
}
export const FullSizePublicationView: React.FC<Props> = ({ publications }) => {
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
};
