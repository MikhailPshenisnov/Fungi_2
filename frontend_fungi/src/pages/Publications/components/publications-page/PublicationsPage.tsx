// PublicationsPage.tsx
import './PublicationsPage.css';

import { useEffect, useState, useCallback } from 'react';
import { FilterButtons, SortDropdown } from '@pages/Components';
import { CardPublicationsView } from '@pages/Publications/components/card-publications-view/CardPublicationsView.tsx';
import { FullSizePublicationView } from '@pages/Publications/components/full-size-publication-view/FullSizePublicationView.tsx';
import {
    getPublications,
    IPublications,
} from '../../../../api/AppApi.ts';
import { mockPublications } from '../../../../const/mock/publications.ts';

export const PublicationsPage = () => {
    const publications2 = mockPublications;

    const [publications, setPublications] = useState<IPublications[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [cardView, setCardView] = useState<boolean>(false);

    const fetchData = useCallback(async (signal?: AbortSignal) => {
        setLoading(true);
        setError(null);
        try {
            const res = await getPublications();
            let items: IPublications[];

            if (Array.isArray(res)) {
                items = res;
            } else if (res && Array.isArray((res as any).data)) {
                items = (res as any).data;
            } else if (res && Array.isArray((res as any).items)) {
                items = (res as any).items;
            } else {
                items = [];
                console.warn('Unexpected publications response shape:', res);
            }

            if (signal?.aborted) return;
            setPublications(items);
            console.log('fetched publications:', items);
            console.log('mock publications:', publications2);
        } catch (e: any) {
            console.error('Error loading publications', e);
            setError(e?.message || 'Не удалось загрузить публикации');
            setPublications([]); // безопасный fallback
        } finally {
            if (!signal?.aborted) setLoading(false);
        }
    }, [publications2]);

    useEffect(() => {
        const controller = new AbortController();
        fetchData(controller.signal);

        return () => {
            controller.abort();
        };
    }, [fetchData]);

    const Loader = () => <div className="loader">Загрузка публикаций...</div>;

    const ErrorBlock = ({ message }: { message: string | null }) => (
        <div className="error">
            <p>{message || 'Произошла ошибка при загрузке публикаций.'}</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                <button
                    className="btn"
                    onClick={() => {
                        const controller = new AbortController();
                        fetchData(controller.signal);
                    }}
                >
                    Повторить
                </button>
                <button
                    className="btn"
                    onClick={() => {
                        // Для разработки — использовать mock
                        setPublications(publications2);
                        setError(null);
                    }}
                >
                    Загрузить mock
                </button>
            </div>
        </div>
    );

    const EmptyBlock = () => <div className="empty">Публикаций нет.</div>;

    return (
        <div className="publications">
            <div className="filter-buttons-container">
                <FilterButtons
                    onClick={() => setCardView(!cardView)}
                    buttonComponent={<SortDropdown />}
                />
            </div>

            <div className="publications__wrapper">
                <div className="publications__content">
                    {loading ? (
                        <Loader />
                    ) : error ? (
                        <ErrorBlock message={error} />
                    ) : publications.length === 0 ? (
                        <EmptyBlock />
                    ) : cardView ? (
                        <CardPublicationsView publications={publications} />
                    ) : (
                        <FullSizePublicationView publications={publications} />
                    )}
                </div>
            </div>
        </div>
    );
};
