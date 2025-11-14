import React from 'react';
import './ReviewBanner.css';
import { QuotesSVG, ReviewStarsSVG } from '@shared/ui';

const ReviewBanner: React.FC = () => {
    const reviews = [
        {
            id: 1,
            photo: '../../../../../public/images/png/user.png',
            name: 'Alexander R.',
            timeWithUs: '01 Year With Us ',
            text: 'Online invoice payment helps companies save time, are faster and save maximum effort for the clients and save maximum effort. Online invoice payment helps companies save time.',
            rating: '5'
        },
        // Добавьте остальные 5 отзывов по аналогии
        {
            id: 2,
            photo: '../../../../../public/images/png/user.png',
            name: 'Alexander R.',
            timeWithUs: '01 Year With Us ',
            text: 'Online invoice payment helps companies save time, are faster and save maximum effort for the clients and save maximum effort. Online invoice payment helps companies save time.',
            rating: '4'
        },
        {
            id: 3,
            photo: '../../../../../public/images/png/user.png',
            name: 'Alexander R.',
            timeWithUs: '01 Year With Us ',
            text: 'Online invoice payment helps companies save time, are faster and save maximum effort for the clients and save maximum effort. Online invoice payment helps companies save time.',
            rating: '3'
        },
        {
            id: 4,
            photo: '../../../../../public/images/png/user.png',
            name: 'Alexander R.',
            timeWithUs: '01 Year With Us ',
            text: 'Online invoice payment helps companies save time, are faster and save maximum effort for the clients and save maximum effort. Online invoice payment helps companies save time.',
            rating: '5'
        },
        {
            id: 5,
            photo: '../../../../../public/images/png/user.png',
            name: 'Alexander R.',
            timeWithUs: '01 Year With Us ',
            text: 'Online invoice payment helps companies save time, are faster and save maximum effort for the clients and save maximum effort. Online invoice payment helps companies save time.',
            rating: '5'
        },
        {
            id: 6,
            photo: '../../../../../public/images/png/user.png',
            name: 'Alexander R.',
            timeWithUs: '01 Year With Us ',
            text: 'Online invoice payment helps companies save time, are faster and save maximum effort for the clients and save maximum effort. Online invoice payment helps companies save time.',
            rating: '4'
        },
        {
            id: 7,
            photo: '../../../../../public/images/png/user.png',
            name: 'Alexander R.',
            timeWithUs: '01 Year With Us ',
            text: 'Online invoice payment helps companies save time, are faster and save maximum effort for the clients and save maximum effort. Online invoice payment helps companies save time.',
            rating: '4'
        },
        {
            id: 8,
            photo: '../../../../../public/images/png/user.png',
            name: 'Alexander R.',
            timeWithUs: '01 Year With Us ',
            text: 'Online invoice payment helps companies save time, are faster and save maximum effort for the clients and save maximum effort. Online invoice payment helps companies save time.',
            rating: '4'
        },
        {
            id: 9,
            photo: '../../../../../public/images/png/user.png',
            name: 'Alexander R.',
            timeWithUs: '01 Year With Us ',
            text: 'Online invoice payment helps companies save time, are faster and save maximum effort for the clients and save maximum effort. Online invoice payment helps companies save time.',
            rating: '4'
        },
        {
            id: 10,
            photo: '../../../../../public/images/png/user.png',
            name: 'Alexander R.',
            timeWithUs: '01 Year With Us ',
            text: 'Online invoice payment helps companies save time, are faster and save maximum effort for the clients and save maximum effort. Online invoice payment helps companies save time.',
            rating: '4'
        }
    ];

    return (
        <div className="review-banner">
            <h2 className="review-title">Наши <span style={{color: "#E6C49C", fontWeight: "bold"}}>Отзывы</span></h2>

            <div className="reviews-container">
                <div className="reviews-scroll-wrapper">
                    {reviews.map(review => (
                        <div key={review.id} className="review-card">
                            <div className="quote-icon">
                                <QuotesSVG />
                            </div>
                            <div className="review-header">
                                <img src={review.photo} alt={review.name} className="user-photo" />
                                <div className="user-info">
                                    <h3 className="user-name">{review.name}</h3>
                                    <p className="user-time">{review.timeWithUs}</p>
                                </div>
                            </div>
                            <p className="review-text">{review.text}</p>
                            <div className="review-rating">
                                <ReviewStarsSVG rating={review.rating}/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button className="all-reviews-button">
                <span>Все отзывы</span>
                <img src={'../../../../../public/images/svg/arrow-right.svg'} alt="" className="arrow-icon" />
            </button>
        </div>
    );
};

export default ReviewBanner;