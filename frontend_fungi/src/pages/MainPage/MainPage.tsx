import { Banner } from './Banner';
import { PublicationsSlider } from './PublicationsSlider';
import { SearchSection } from './SearchSection';
import { TeamSection } from './TeamSection';


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