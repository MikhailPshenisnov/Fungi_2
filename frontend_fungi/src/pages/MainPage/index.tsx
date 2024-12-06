import { Banner } from './components/Banner';
import { PublicationsSlider } from './components/PublicationsSlider';
import { SearchSection } from './components/SearchSection';
import { TeamSection } from './components/TeamSection';


export function MainPage() {
    return(
        <div className="mainpage">
            <Banner
                image="/images/png/banner-mushroom.png"
                title='Исследуй мир грибов с Fungi!'
            />
            <SearchSection />
            <TeamSection />
            <PublicationsSlider />
        </div>
    )
}