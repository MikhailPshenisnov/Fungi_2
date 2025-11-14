import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { slides } from '@pages/about-us/constants';

export const SwiperCard = () => {
    const [activeIndex, setActiveIndex] = useState(1); // Отслеживание активного слайда

    return (
        <Swiper
            modules={[]}
            spaceBetween={50}
            slidesPerView={3}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex + 1)} // Обновление активного индекса
            pagination={{ clickable: true }}
        >
            {slides.map((slide, index) => (
                <SwiperSlide key={slide.id}>
                    <div
                        className={`card ${
                            index === activeIndex ? 'active-card' : ''
                        }`} // Условное добавление класса для активного слайда
                    >
                        <div className="card-icon-container">
                            <img
                                src={slide.src}
                                alt="icon"
                                className={`icon ${
                                    index === activeIndex ? '' : 'active-icon'
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
