import React from 'react';
import { Banner } from './Banner';
import { SearchSection } from './SearchSection';


export function MainPage() {
    return(
        <div className="mainpage">
            <Banner
                image="/images/banner-mushroom.png"
                title='Исследуй мир грибов с Fungi!'
            />
            <SearchSection />
        </div>
    )
}