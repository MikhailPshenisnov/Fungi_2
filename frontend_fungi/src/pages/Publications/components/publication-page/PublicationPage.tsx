import './PublicationPage.css';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


import { getPublications, IPublications } from '../../../../api/AppApi.ts';
import { mockPublications } from '../../../../const/mock/publications.ts';

export const PublicationPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [publications, setPublications] = useState<IPublications[]>([]);
    const publications2 = mockPublications;

    useEffect(() => {
        (async () => {
            const data = await getPublications();
            setPublications(data);
        })();
    }, []);

    const handleBack = () => {
        navigate("/publications");
    };

    const handleImageError = (
        e: React.SyntheticEvent<HTMLImageElement, Event>
    ) => {
        e.currentTarget.src = '/images/png/alt-card-image.png';
    };

    let publication = publications.find(p => p.id === id);
    //const imgurUrl = useImgurUrl(publication ? publication.headerPhotoLink : '');

    const publication2 = publications2.find(p => p.id === id);

    if (!publication && !publication2) {
        return (
            <div className="publication-page-not-found">
                <h2 className="publication-not-found-text">Публикация не найдена</h2>
                <button
                    onClick={handleBack}
                    className="publication-page__back-button"
                >
                    <img src="/images/svg/arrow.svg" alt="Назад" />
                    <span>Назад</span>
                </button>
            </div>
        );
    }
    else if (!publication && publication2) {
        publication = publication2;
    }


    return (
        <div className="publication-page">
            <div className="publication-page__content">
                <div className="publication-page__info-container">
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
                            Автор: {publication.authorString}
                        </p>
                    </div>
                    <div className="publication-page__like-button">
                        <button className="publication-page__like-button-img">
                            <img
                                src="/images/svg/bookmark.svg"
                                alt="Сохранить"
                            />
                        </button>
                    </div>
                </div>
                <img
                    className="publication-page__image"
                    src={publication.headerPhotoLink}
                    alt={publication.title}
                    onError={handleImageError}
                />

                <div className="publication-page__main-info">
                    <div className="publication-page__main-text">
                        <div className="publication-page__text">
                            {publication.paragraphs.map((paragraph, index) => (
                                <p key={index} className="publication-page__paragraph">
                                    {paragraph.paragraphText}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
