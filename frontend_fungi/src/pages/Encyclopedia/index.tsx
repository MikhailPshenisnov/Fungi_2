import React, { useState } from 'react';
import './index.css';
import { MushroomCard } from './components/MushroomCard/MushroomCard';
import { SearchBar } from './components/SearchBar/SearchBar';
import { useMushroomData } from '../../shared/hooks/useMushroomData';
import { MushroomFilter } from './components/MushroomFilter/MushroomFilter';
import OpenMushroomFilterMenuButton from './components/Filter';
import { FilterButtons } from '@shared/ui';
import { Pagination } from '@modules/Pagination';

interface FilterState {
    edibility: string[];
    capType: string[];
}

export const Encyclopedia: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<FilterState>({
        edibility: [],
        capType: [],
    });

    const { data: mushrooms, isLoading, error } = useMushroomData();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!mushrooms || !Array.isArray(mushrooms))
        return <div>No mushrooms data available</div>;

    const { filteredMushrooms, isFiltersActive, isSearchActive } =
        MushroomFilter({
            mushrooms,
            filters,
            searchQuery,
        });

    // Если нет ни фильтров, ни поиска, разделяем по категориям
    const PopularMushrooms =
        !isFiltersActive && !isSearchActive
            ? mushrooms.sort(() => Math.random() - 0.5).slice(0, 5)
            : [];
    const AllMushrooms = !isFiltersActive && !isSearchActive ? mushrooms : [];

    return (
        <div className="encyclopedia">
            <div className="encyclopedia__header">
                <FilterButtons
                    targetPath="/encyclopedia"
                    buttonComponent={
                        <OpenMushroomFilterMenuButton
                            filters={filters}
                            setFilters={setFilters}
                        />
                    }
                />
            </div>

            <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            {isFiltersActive || isSearchActive ? (
                <section className="encyclopedia__section">
                    <h2 className="encyclopedia__section-title">
                        {filteredMushrooms.length > 0
                            ? `Найдено грибов: ${filteredMushrooms.length}`
                            : 'Грибы не найдены'}
                    </h2>
                    <div className="encyclopedia__cards-row">
                        {filteredMushrooms.map((mushroom) => (
                            <MushroomCard
                                key={mushroom.id}
                                mushroom={mushroom}
                            />
                        ))}
                    </div>
                </section>
            ) : (
                <>
                    <section className="encyclopedia__section">
                        <h2 className="encyclopedia__section-title">
                            Популярные Грибы
                        </h2>
                        <div className="encyclopedia__cards-row">
                            {PopularMushrooms.map((mushroom) => (
                                <MushroomCard
                                    key={mushroom.id}
                                    mushroom={mushroom}
                                />
                            ))}
                        </div>
                    </section>

                    <Pagination
                        data={AllMushrooms}
                        tittle={'Все грибы'}
                        itemsPerPage={10}
                        card={(mushroom) => (
                            <MushroomCard
                                key={mushroom.id}
                                mushroom={mushroom}
                            />
                        )}
                    />
                </>
            )}
        </div>
    );
};

export default Encyclopedia;
