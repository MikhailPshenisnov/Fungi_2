import React from 'react';
import { useParams } from 'react-router-dom';
import { usePublicationData } from '../../../../hooks/api/usePublicationData';
import './index.css';

const PublicationPage: React.FC = () => {
    const { id } = useParams();
    const { data: publications } = usePublicationData();
    
    const publication = publications?.find(p => p.id === id);

    if (!publication) {
        return <div>Публикация не найдена</div>;
    }

    return (
        <div className="publication-page">
            <div className="publication-page__content">
                <div className='publication-page_container'>
                    <h1 className="publication-page__title">{publication.title}</h1>
                    <div className="publication-page__info">
                    <p className="publication-page__author">Автор: {publication.authorString}</p>
                    <p className="publication-page__date">
                        {new Date(publication.publishDate).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>
                </div>
                <img 
                    className="publication-page__image" 
                    src={publication.headerPhotoLink} 
                    alt={publication.title}
                />

                <div className="publication-page__text">
                    {publication.paragraphs.map((paragraph, index) => (
                        paragraph.paragraphText && (
                            <p key={index} className="publication-page__paragraph">
                                {paragraph.paragraphText}
                            </p>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PublicationPage;
