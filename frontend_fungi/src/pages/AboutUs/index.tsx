import React from 'react';
import './index.css';
import SwiperCard from "./components/SwiperCard/ScrollCards.tsx";

const AboutUs: React.FC = () => {
  return (
    <div className="about">      
      <section className="intro">
        <div className="intro-text-container">
          <h1>Fungi - твой помощник в мире грибов.</h1>
          <p className="intro-p">
            Команда разработчиков случайно пришла к идее создания простого и эффективного сервиса, помогающего
            любителям собирать грибы, не напрягаясь.
          </p>
          <p className="intro-p">
            Из этой идеи родилось приложение Fungi – электронная энциклопедия о грибах, которая предоставляет
            пользователям информацию о залежах грибов, их приготовлениях, интересных фактах и многом другом.
          </p>
          <p className="intro-p-strong"><strong>Цель проекта - облегчить жизнь любителям грибов</strong></p>
        </div>
        <img src="/images/svg/mushroom.svg" alt="mushroom" className="intro-image" />

      </section>

      <section className="features">
        <h2 className='features-title'>Всё о грибах в одном месте!</h2>
        <div className="feature-cards">
            <SwiperCard/>
        </div>

      </section>
      
      <section className="join">
        <h2 className='features-title'>Стань частью грибного сообщества!</h2>
      </section>
    </div>
  );
};

export default AboutUs;
