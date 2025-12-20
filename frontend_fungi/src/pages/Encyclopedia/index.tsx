// Encyclopedia.tsx
import React, { useEffect, useState, useCallback } from 'react';
import './index.css';
import { MushroomCard } from './components/MushroomCard/MushroomCard';
import { SearchBar } from './components/SearchBar/SearchBar';
import { useMushroomFilter } from './components/MushroomFilter/MushroomFilter';
import OpenMushroomFilterMenuButton from './components/Filter';
import { mockMushrooms } from '../../const/mock/mushrooms';
import { getMushrooms, IMushroom } from '../../api/AppApi.ts';

interface FilterState {
    edibility: string[];
    capType: string[];
    [key: string]: string[];
}

export const Encyclopedia: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<FilterState>({
        edibility: [],
        capType: [],
    });

    const [mushrooms, setMushrooms] = useState<IMushroom[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const mushrooms2 = mockMushrooms; // mock для fallback

    const fetchData = useCallback(async (signal?: AbortSignal) => {
        setLoading(true);
        setError(null);

        try {
            const data = await getMushrooms();

            if (signal?.aborted) return; // если запрос отменен
            if (!Array.isArray(data)) throw new Error('Неверный формат данных');
            setMushrooms(data);
        } catch (e: any) {
            if (signal?.aborted) return;
            console.error('Ошибка загрузки грибов:', e);
            setError(e?.message || 'Не удалось загрузить грибы');
            setMushrooms([]);
        } finally {
            if (!signal?.aborted) setLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetchData(controller.signal);

        return () => controller.abort();
    }, [fetchData]);


    const { filteredMushrooms, isFiltersActive, isSearchActive } = useMushroomFilter({
        mushrooms: Array.isArray(mushrooms) ? mushrooms : [],
        filters,
        searchQuery,
    });

    const Loader = () => <div className="loader">Загрузка грибов...</div>;

    const ErrorBlock = ({ message }: { message: string | null }) => (
        <div className="error">
            <p>{message || 'Произошла ошибка при загрузке грибов.'}</p>
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
                <button className="btn" onClick={() => { setMushrooms(mushrooms2); setError(null); }}>Загрузить mock</button>
            </div>
        </div>
    );

    const EmptyBlock = () => <div className="empty">Грибов не найдено.</div>;

    const displayMushrooms = isFiltersActive || isSearchActive ? filteredMushrooms : mushrooms;

    return (
        <div className="encyclopedia">
            <div className="encyclopedia__header">
                <OpenMushroomFilterMenuButton filters={filters} setFilters={setFilters} />
            </div>

            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <section className="encyclopedia__section">
                {loading ? (
                    <Loader />
                ) : error ? (
                    <ErrorBlock message={error} />
                ) : displayMushrooms.length === 0 ? (
                    <EmptyBlock />
                ) : (
                    <>
                        <h2 className="encyclopedia__section-title">
                            {isFiltersActive || isSearchActive
                                ? `Найдено грибов: ${displayMushrooms.length}`
                                : 'Все грибы'}
                        </h2>
                        <div className="encyclopedia__cards-row">
                            {displayMushrooms.map((mushroom) => (
                                <MushroomCard key={mushroom.id} mushroom={mushroom} />
                            ))}
                        </div>
                    </>
                )}
            </section>
        </div>
    );
};

export default Encyclopedia;
