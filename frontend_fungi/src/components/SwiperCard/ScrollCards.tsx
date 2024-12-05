
import { Swiper, SwiperSlide } from 'swiper/react';
import React, {useState} from "react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const slides = [
    {
        id: 1,
        src: "./public/images/svg/slider-icon-1.svg",
        text: "Офлайн доступ к 100 видам грибов в твоём телефоне.С полезной информацией, чтобы точно отличить мухомор от съедобного гриба.",
    },
    {
        id: 2,
        src: "./public/images/svg/slider-icon-2.svg",
        text: "На сегодняшней день на платформе опубликовано более 30 статей, вдохновленных научными открытиями в мире грибов, бытовым использованием, а также тем, о чем вы не думали раннее..",
    },
    {
        id: 3,
        src: "./public/images/svg/slider-icon-3.svg",
        text: "на сайте есть коллекция анекдотов на грибную тематику, шоу-кулинария и интервью с медицинским экспертом, который даст советы по приготовлению и использованию грибов без вреда для здоровья.",
    },
    {
        id: 4,
        src: "./public/images/svg/slider-icon-1.svg",
        text: "Офлайн доступ к 100 видам грибов в твоём телефоне.С полезной информацией, чтобы точно отличить мухомор от съедобного гриба.",
    },
    {
        id: 5,
        src: "./public/images/svg/slider-icon-2.svg",
        text: "На сегодняшней день на платформе опубликовано более 30 статей, вдохновленных научными открытиями в мире грибов, бытовым использованием, а также тем, о чем вы не думали раннее..",
    },
    {
        id: 6,
        src: "./public/images/svg/slider-icon-3.svg",
        text: "на сайте есть коллекция анекдотов на грибную тематику, шоу-кулинария и интервью с медицинским экспертом, который даст советы по приготовлению и использованию грибов без вреда для здоровья.",
    },
    {
        id: 7,
        src: "./public/images/svg/slider-icon-1.svg",
        text: "Офлайн доступ к 100 видам грибов в твоём телефоне.С полезной информацией, чтобы точно отличить мухомор от съедобного гриба.",
    },
    {
        id: 8,
        src: "./public/images/svg/slider-icon-2.svg",
        text: "На сегодняшней день на платформе опубликовано более 30 статей, вдохновленных научными открытиями в мире грибов, бытовым использованием, а также тем, о чем вы не думали раннее..",
    },
    {
        id: 9,
        src: "./public/images/svg/slider-icon-3.svg",
        text: "на сайте есть коллекция анекдотов на грибную тематику, шоу-кулинария и интервью с медицинским экспертом, который даст советы по приготовлению и использованию грибов без вреда для здоровья.",
    },

];

const SwiperCard = () => {
    const [activeIndex, setActiveIndex] = useState(1); // Отслеживание активного слайда

    return (
        <Swiper
            modules={[]}
            spaceBetween={50}
            slidesPerView={3}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex + 1)} // Обновление активного индекса
            onSwiper={(swiper) => console.log(swiper)}
            pagination={{ clickable: true }}
        >
            {slides.map((slide, index) => (
                <SwiperSlide key={slide.id}>
                    <div
                        className={`card ${
                            index === activeIndex ? "active-card" : ""
                        }`} // Условное добавление класса для активного слайда
                    >
                        <div className="card-icon-container">
                            <img
                                src={slide.src}
                                alt="icon"
                                className={`icon ${
                                        index === activeIndex ? "" : "active-icon"
                                }`}
                            />
                        </div>
                        {index === activeIndex && ( // Если слайд активный, показать текст
                            <p className="active-text">{slide.text}</p>
                        )}
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default SwiperCard;