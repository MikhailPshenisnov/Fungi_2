import './PublicationPage.css';
import { usePublication } from '../../model/hooks';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PublicationsCard } from '../publications-card';
import { mockPublications } from '@shared/const/mock/publications';


export const PublicationPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: publication } = usePublication(id);
    const [imageError, setImageError] = useState(false);

    if (!publication) {
        return <div>Публикация не найдена</div>;
    }

    const recommendedPublications = mockPublications.slice(0, 2);

    const handleBack = () => {
        navigate(-1);
    };

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <div className="publication-page">
            <div className="publication-page__content">
                <div className='publication-page__info-container'>
                    <div className="publication-page_container">
                        <button
                            onClick={handleBack}
                            className="publication-page__back-button"
                        >
                            <img src="/images/svg/arrow.svg" alt="Назад" />
                            <span>Назад</span>
                        </button>
                    
                        <h1 className="publication-page__title">
                            {publication.title}
                        </h1>
                        
                        <p className="publication-page__author">
                            Автор: {publication.author}
                        </p>
                    </div>
                    <div className='publication-page__like-button'>
                        <button className='publication-page__like-button-img'>
                            <img src="/images/svg/bookmark.svg" alt="Сохранить" />
                        </button>
                        
                    </div>
                    
                    
                </div>
                <img
                        className="publication-page__image"
                        src={
                            imageError
                                ? '/images/png/alt-card-image.png'
                                : publication.headerPhotoLink
                        }
                        alt={publication.title}
                        onError={handleImageError}
                    />

                <div className='publication-page__main-info'>
                    <div className='publication-page__main-text'>
                        <div className="publication-page__text">
                            {publication.paragraphs.map(
                                (paragraph, index) =>
                                    paragraph && (
                                        <p
                                            key={index}
                                            className="publication-page__paragraph"
                                        >
                                            {paragraph}
                                        </p>
                                    )
                            )}
                        </div>
                    </div>
                    <div className='publication-text__recommendation'>
                        <h3>Рекомендуемые статьи</h3>
                        <div className="publication-text__recommendations-container">
                        {recommendedPublications.map((publication) => (
                            <PublicationsCard
                            key={publication.id}
                            card={publication}
                            onClick={() => navigate(`/publications/${publication.id}`)}
                            />
                        ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
