import { Banner } from './Banner';
import { SearchSection } from './SearchSection';
import { TeamSection } from './TeamSection';


export function MainPage() {
    return(
        <div className="mainpage">
            <Banner
                image="/images/banner-mushroom.png"
                title='Исследуй мир грибов с Fungi!'
            />
            <SearchSection />
            <TeamSection />
        </div>
    )
}