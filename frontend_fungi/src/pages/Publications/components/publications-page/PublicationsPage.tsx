import './PublicationsPage.css';
import { CardPublicationsView } from '../card-publications-view';
import { FullSizePublicationView } from '../full-size-publication-view';
import { usePublicationsData } from '../../model/hooks';
import { useState } from 'react';
import { FilterButtons, SortDropdown } from '@shared/ui/index.ts';

export const PublicationsPage = () => {
    const { data: publications } = usePublicationsData();
    const [cardView, setCardView] = useState(false);
    return (
        <div className="publications">
            <div className="publications__wrapper">
                <FilterButtons
                    onClick={() => setCardView(!cardView)}
                    buttonComponent={<SortDropdown />}
                />
                {
                    cardView ?
                        <CardPublicationsView publications={publications} />
                        :
                        <FullSizePublicationView publications={publications} />
                }
            </div>
        </div>
    );
};