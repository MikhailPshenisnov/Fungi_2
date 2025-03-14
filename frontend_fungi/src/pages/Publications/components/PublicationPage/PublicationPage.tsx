import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePublicationData } from "../../../../shared/api/usePublicationData";
import "./index.css";

const PublicationPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: publications } = usePublicationData();
  const [imageError, setImageError] = useState(false);

  const publication = publications?.find((p) => p.id === id);

  if (!publication) {
    return <div>Публикация не найдена</div>;
  }

  const handleBack = () => {
    navigate(-1);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="publication-page">
      <div className="publication-page__content">
        <button onClick={handleBack} className="publication-page__back-button">
          <img src="/images/svg/arrow.svg" alt="Назад" />
          <span>Назад</span>
        </button>
        <div className="publication-page_container">
          <h1 className="publication-page__title">{publication.title}</h1>
          <div className="publication-page__info">
            <p className="publication-page__author">
              Автор: {publication.authorString}
            </p>
            <p className="publication-page__date">
              {new Date(publication.publishDate).toLocaleDateString("ru-RU", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <img
          className="publication-page__image"
          src={
            imageError
              ? "/images/png/alt-card-image.png"
              : publication.headerPhotoLink
          }
          alt={publication.title}
          onError={handleImageError}
        />

        <div className="publication-page__text">
          {publication.paragraphs.map(
            (paragraph, index) =>
              paragraph.paragraphText && (
                <p key={index} className="publication-page__paragraph">
                  {paragraph.paragraphText}
                </p>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicationPage;
