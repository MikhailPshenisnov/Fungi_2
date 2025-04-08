import './PublicationsPage.css';
import { usePublicationData } from '@shared/hooks/usePublicationData.ts';
import { FilterButtons, SortDropdown } from '@shared/ui/index.ts';
import { FullSizePublicationView } from '@pages/publications/components/full-size-publication-view';
import { useState } from 'react';
import { CardPublicationsView } from '@pages/publications/components/card-publications-view';

export const PublicationsPage = () => {
    const { data: publications } = usePublicationData();
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

